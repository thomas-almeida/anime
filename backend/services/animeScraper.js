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

  async searchAnimeOnProvider(title, providerName) {
    let browser;
    try {
      const provider = providers.find(p => p.name === providerName);
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }

      const searchUrl = provider.getSearchUrl(title);

      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      const results = await page.evaluate((selector) => {
        const items = [];
        const links = Array.from(document.querySelectorAll(selector));

        for (const link of links) {
          const title = link.textContent.trim();
          const url = link.href;
          const image = link.querySelector('img')?.src || null;

          if (title && url && url.includes('http')) {
            items.push({ title, url, image });
          }
        }

        return items;
      }, provider.resultSelector);

      return results.slice(0, 10);
    } catch (error) {
      throw new Error(`Provider search failed: ${error.message}`);
    } finally {
      if (browser) await browser.close();
    }
  }

  async scrapeEpisodeList(animePageUrl, provider) {
    let browser;
    try {
      const providerObj = typeof provider === 'string'
        ? providers.find(p => p.name === provider)
        : provider;

      if (!providerObj?.episodeSelector) return [];

      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      await page.goto(animePageUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      const episodes = await page.evaluate((selector) => {
        const items = [];
        const links = Array.from(document.querySelectorAll(selector));

        for (const link of links) {
          const episodeText = link.textContent.trim();
          const url = link.href;

          const match = episodeText.match(/(\d+)/);
          const episodeNumber = match ? parseInt(match[1]) : items.length + 1;

          if (url && url.includes('http')) {
            items.push({ episodeNumber, url, title: episodeText });
          }
        }

        return items;
      }, providerObj.episodeSelector);

      return episodes;
    } catch (error) {
      return [];
    } finally {
      if (browser) await browser.close();
    }
  }
}

export default new AnimeScraper();
