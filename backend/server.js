import express from 'express';
import cors from 'cors';
import animeScraper from './services/animeScraper.js';

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

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
