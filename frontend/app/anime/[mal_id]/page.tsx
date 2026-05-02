'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { animeApi } from '../../services/animeApi';
import { ProviderSearchResult } from '../../services/animeApi';

export default function AnimePage() {
  const { mal_id } = useParams();
  const searchParams = useSearchParams();
  const animeUrl = searchParams.get('url') || '';
  const animeTitle = searchParams.get('title') || '';

  const [animeData, setAnimeData] = useState<ProviderSearchResult | null>(null);
  const [episodes, setEpisodes] = useState<{ episodeNumber: number; url: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do anime ao entrar
  useEffect(() => {
    if (!animeUrl) {
      setLoading(false);
      return;
    }

    const fetchAnime = async () => {
      try {
        // Buscar episódios diretamente da URL do anime no provider
        const result = await animeApi.getProviderEpisodes(animeUrl, 'Animes Online');
        if (result.episodes && result.episodes.length > 0) {
          setEpisodes(result.episodes);
          setAnimeData({
            title: animeTitle,
            url: animeUrl,
            image: '',
            episodes: result.episodes
          });
        }
      } catch (error) {
        console.error('Failed to fetch anime:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [animeUrl, animeTitle]);

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!animeUrl) return <div className="p-8 text-center">URL do anime não fornecida.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Dados do Anime */}
      <div className="flex flex-col md:flex-row gap-6">
        {animeData?.image && (
          <img
            src={animeData.image}
            alt={animeData.title}
            className="w-full md:w-64 rounded-lg shadow-lg"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{animeData?.title || animeTitle}</h1>
          <p className="text-md mt-2">Episódios: {episodes.length}</p>
        </div>
      </div>

      {/* Episódios */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Episódios</h2>
        {episodes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {episodes.map((ep) => (
              <div
                key={ep.episodeNumber}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  window.location.href = `/player?episodeUrl=${encodeURIComponent(ep.url)}&provider=Animes Online&epNumber=${ep.episodeNumber}`;
                }}
              >
                <p className="font-semibold">Episódio {ep.episodeNumber}</p>
                <p className="text-sm text-gray-600">{ep.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhum episódio encontrado.</p>
        )}
      </div>
    </div>
  );
}
