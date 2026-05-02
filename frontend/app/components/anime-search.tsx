'use client';

import { useState } from 'react';
import { animeApi } from '../services/animeApi';

export default function AnimeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await animeApi.searchAnime(query);
      setResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar anime..."
          style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: loading ? '#ccc' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'default' : 'pointer'
          }}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {results.map((anime) => (
          <div key={anime.mal_id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
            {anime.images?.jpg?.image_url && (
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.5rem' }}
              />
            )}
            <h3 style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{anime.title}</h3>
            {anime.title_english && (
              <p style={{ fontSize: '0.875rem', color: '#666', margin: '0 0 0.25rem 0' }}>{anime.title_english}</p>
            )}
            {anime.score && (
              <p style={{ fontSize: '0.875rem', margin: 0 }}>Score: {anime.score}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
