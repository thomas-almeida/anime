import express from 'express';
import cors from 'cors';
import animeScraper from './services/animeScraper.js';
import * as jikanApi from './services/jikanApi.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Anime backend running' });
});

app.post('/api/scrape', async (req, res) => {
  try {
    const { url, provider } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const result = await animeScraper.scrapeVideo(url, provider);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/anime/search', async (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }

    const results = await jikanApi.searchAnime(query, parseInt(limit));
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/anime/:mal_id/episodes', async (req, res) => {
  try {
    const { mal_id } = req.params;
    const { page = 1 } = req.query;

    const result = await jikanApi.getAnimeEpisodes(parseInt(mal_id));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/anime/top', async (req, res) => {
  try {
    const { filter = 'airing', limit = 5 } = req.query;

    const results = await jikanApi.getTopAnime(filter, parseInt(limit));
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/anime/:mal_id', async (req, res) => {
  try {
    const { mal_id } = req.params;

    const result = await jikanApi.getAnimeDetails(parseInt(mal_id));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/anime/season/now', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const results = await jikanApi.getSeasonNow(parseInt(limit));
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/anime/schedule', async (req, res) => {
  try {
    const { day } = req.query;

    const results = await jikanApi.getSchedule(day);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/provider/episodes', async (req, res) => {
  try {
    const { url, provider } = req.body;

    if (!url || !provider) {
      return res.status(400).json({ error: 'URL and provider are required' });
    }

    const episodes = await animeScraper.scrapeEpisodeList(url, provider);
    res.json({ episodes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/provider/search', async (req, res) => {
  try {
    const { title, provider } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' });
    }

    const results = await animeScraper.searchAnimeOnProvider(title, provider);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
