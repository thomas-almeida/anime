import puppeteer from 'puppeteer';
import providers from '../providers.js';

class AnimeScraper {
  async scrapeVideo(url, providerName) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      const provider = providerName
        ? providers.find(p => p.name === providerName)
        : providers.find(p => url.includes(p.url));

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      const videoData = await page.evaluate((selectors) => {
        const result = { videoUrl: null, type: null };

        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element) {
            const src = element.src || element.getAttribute('data-src');
            if (src) {
              result.videoUrl = src;
              result.type = element.tagName.toLowerCase();
              break;
            }
          }
        }

        return result;
      }, this.getSelectors(provider));

      if (!videoData.videoUrl) {
        const clickSelectors = provider?.clickSelectors || ['.ppVepb', '.play-button', 'button[aria-label*="play"]'];

        for (const selector of clickSelectors) {
          try {
            await page.click(selector, { timeout: 2000 });
            await page.waitForTimeout(2000);
            break;
          } catch (e) {
            continue;
          }
        }

        videoData.videoUrl = await page.evaluate(() => {
          const iframes = Array.from(document.querySelectorAll('iframe'));
          const videos = Array.from(document.querySelectorAll('video'));

          for (const iframe of iframes) {
            if (iframe.src && !iframe.src.includes('ads')) return iframe.src;
          }
          for (const video of videos) {
            if (video.src) return video.src;
          }
          return null;
        });
      }

      return {
        success: !!videoData.videoUrl,
        videoUrl: videoData.videoUrl,
        provider: provider?.name || 'unknown'
      };
    } catch (error) {
      throw new Error(`Scraping failed: ${error.message}`);
    } finally {
      if (browser) await browser.close();
    }
  }

  getSelectors(provider) {
    const defaultSelectors = [
      'iframe[src*="player"]',
      'iframe[src*="video"]',
      'video source',
      'video',
      '.video-player iframe',
      '.player iframe'
    ];

    return provider?.selectors || defaultSelectors;
  }
}

export default new AnimeScraper();
