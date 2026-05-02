'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { animeApi } from '../services/animeApi';
import { ProviderSearchResult } from '../services/animeApi';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<ProviderSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;

    const search = async () => {
      setLoading(true);
      try {
        const data = await animeApi.searchOnProvider(query, 'Animes Online');
        setResults(data.results || []);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Resultados da pesquisa para: "{query}"
      </h1>

      {loading && <p className="text-center">Pesquisando no AnimeFire...</p>}

      {!loading && results.length === 0 && query && (
        <p className="text-gray-500 text-center">Nenhum anime encontrado.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {results.map((anime, idx) => (
          <Link
            href={`/anime/${idx}?url=${encodeURIComponent(anime.url)}&title=${encodeURIComponent(anime.title)}`}
            key={idx}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {anime.image && (
              <img
                src={anime.image}
                alt={anime.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-3">
              <h3 className="font-semibold truncate">{anime.title}</h3>
              {anime.episodes && (
                <p className="text-sm text-gray-600">
                  {anime.episodes.length} episódios
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
