const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface AnimeSearchResult {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
      small_image_url: string;
    };
    webp: {
      image_url: string;
      large_image_url: string;
      small_image_url: string;
    };
  };
  synopsis?: string;
  episodes?: number;
  score?: number;
  rank?: number;
  year?: number;
  genres: string[];
}

interface EpisodeResult {
  mal_id: number;
  episode: number;
  title: string;
  title_japanese: string;
  aired?: string;
  filler: boolean;
  recap: boolean;
}

export interface ProviderSearchResult {
  title: string;
  url: string;
  image?: string;
  episodes: EpisodeResult[];
}

class AnimeApiService {
  private baseUrl: string;

  constructor(baseUrl: string = BACKEND_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetchApi(endpoint: string, options: FetchOptions = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config: FetchOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchAnime(query: string, limit = 10): Promise<{ results: AnimeSearchResult[] }> {
    return this.fetchApi(`/api/anime/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async getTopAnime(filter = 'bypopularity', limit = 10): Promise<{ results: AnimeSearchResult[] }> {
    return this.fetchApi(`/api/anime?endpoint=top&filter=${filter}&limit=${limit}`);
  }

  async getSeasonNow(limit = 10): Promise<{ results: AnimeSearchResult[] }> {
    return this.fetchApi(`/api/anime?endpoint=season/now&limit=${limit}`);
  }

  async getAnimeDetails(mal_id: number): Promise<AnimeSearchResult> {
    return this.fetchApi(`/api/anime/${mal_id}`);
  }

  async getAnimeEpisodes(mal_id: number): Promise<{ episodes: EpisodeResult[] }> {
    return this.fetchApi(`/api/anime/${mal_id}/episodes`);
  }

  async searchOnProvider(title: string, provider: string): Promise<{ results: ProviderSearchResult[] }> {
    return this.fetchApi('/api/provider/search', {
      method: 'POST',
      body: JSON.stringify({ title, provider }),
    });
  }

  async scrapeVideo(url: string, provider?: string): Promise<{ success: boolean; videoUrl?: string; provider?: string }> {
    return this.fetchApi('/api/scrape', {
      method: 'POST',
      body: JSON.stringify({ url, provider }),
    });
  }

  async getSchedule(day?: string): Promise<{ results: AnimeSearchResult[] }> {
    const params = day ? `?day=${day}` : '';
    return this.fetchApi(`/api/anime?endpoint=schedule${params}`);
  }

  async getProviderEpisodes(url: string, provider: string): Promise<{ episodes: EpisodeResult[] }> {
    return this.fetchApi('/api/provider/episodes', {
      method: 'POST',
      body: JSON.stringify({ url, provider }),
    });
  }
}

export const animeApi = new AnimeApiService();
