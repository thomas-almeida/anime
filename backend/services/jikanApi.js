const BASE_URL = 'https://api.jikan.moe/v4';
const DELAY_MS = 400;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRateLimit(url, retries = 3) {
  await delay(DELAY_MS);

  for (let i = 0; i < retries; i++) {
    const response = await fetch(url);

    if (response.status === 429) {
      await delay(1000 * (i + 1));
      continue;
    }

    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  throw new Error('Rate limit exceeded after retries');
}

export async function searchAnime(query, limit = 10) {
  const url = `${BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=${limit}`;
  const data = await fetchWithRateLimit(url);

  return data.data.map(anime => ({
    mal_id: anime.mal_id,
    title: anime.title,
    title_english: anime.title_english,
    images: anime.images,
    synopsis: anime.synopsis,
    episodes: anime.episodes,
    status: anime.status,
    score: anime.score,
    year: anime.year,
    genres: anime.genres?.map(g => g.name) || []
  }));
}

export async function getAnimeDetails(mal_id) {
  const url = `${BASE_URL}/anime/${mal_id}`;
  const data = await fetchWithRateLimit(url);

  const anime = data.data;
  return {
    mal_id: anime.mal_id,
    title: anime.title,
    title_english: anime.title_english,
    title_japanese: anime.title_japanese,
    images: anime.images,
    synopsis: anime.synopsis,
    episodes: anime.episodes,
    status: anime.status,
    score: anime.score,
    year: anime.year,
    genres: anime.genres?.map(g => g.name) || [],
    studios: anime.studios?.map(s => s.name) || []
  };
}

export async function getAnimeEpisodes(mal_id) {
  const url = `${BASE_URL}/anime/${mal_id}/episodes`;
  const data = await fetchWithRateLimit(url);

  console.log(data)

  return {
    episodes: data.data.map(ep => ({
      mal_id: ep.mal_id,
      episode: ep.mal_id,
      title: ep.title,
      title_japanese: ep.title_japanese,
      aired: ep.aired,
      filler: ep.filler,
      recap: ep.recap
    })),
    pagination: data.pagination
  };
}

export async function getTopAnime(filter = 'bypopularity', limit = 10) {
  const validFilters = ['airing', 'upcoming', 'bypopularity', 'favorite'];
  const selectedFilter = validFilters.includes(filter) ? filter : 'bypopularity';

  const url = `${BASE_URL}/top/anime?filter=${selectedFilter}&limit=${limit}`;
  const data = await fetchWithRateLimit(url);

  return data.data.map(anime => ({
    mal_id: anime.mal_id,
    title: anime.title,
    title_english: anime.title_english,
    images: anime.images,
    score: anime.score,
    rank: anime.rank,
    episodes: anime.episodes,
    year: anime.year,
    genres: anime.genres?.map(g => g.name) || []
  }));
}

export async function getSeasonNow(limit = 10) {
  const url = `${BASE_URL}/seasons/now?limit=${limit}`;
  const data = await fetchWithRateLimit(url);

  return data.data.map(anime => ({
    mal_id: anime.mal_id,
    title: anime.title,
    title_english: anime.title_english,
    images: anime.images,
    score: anime.score,
    episodes: anime.episodes,
    year: anime.year,
    genres: anime.genres?.map(g => g.name) || []
  }));
}

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export async function getSchedule(day) {
  if (!day) {
    const today = new Date().getDay();
    day = DAYS[today];
  }

  const url = `${BASE_URL}/schedules?filter=${day}`;
  const data = await fetchWithRateLimit(url);

  return data.data.map(anime => ({
    mal_id: anime.mal_id,
    title: anime.title,
    title_english: anime.title_english,
    images: anime.images,
    score: anime.score,
    episodes: anime.episodes,
    genres: anime.genres?.map(g => g.name) || []
  }));
}

export default { searchAnime, getAnimeDetails, getAnimeEpisodes, getTopAnime, getSeasonNow, getSchedule };
