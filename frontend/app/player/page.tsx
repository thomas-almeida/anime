'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { animeApi } from '../services/animeApi';

export default function PlayerPage() {
  const searchParams = useSearchParams();
  const episodeUrl = searchParams.get('episodeUrl') || '';
  const provider = searchParams.get('provider') || 'Animes Online';
  const epNumber = searchParams.get('epNumber') || '';

  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!episodeUrl) {
      setLoading(false);
      return;
    }

    const loadVideo = async () => {
      try {
        const result = await animeApi.scrapeVideo(episodeUrl, provider);
        if (result.success && result.videoUrl) {
          setVideoUrl(result.videoUrl);
        } else {
          alert('Falha ao capturar vídeo');
        }
      } catch (error) {
        console.error('Scrape failed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [episodeUrl, provider]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Carregando player...</p>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Não foi possível carregar o vídeo.</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            ← Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl aspect-video">
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            frameBorder="0"
            title="Anime Player"
          />
        </div>
      </div>

      <div className="p-4 bg-gray-900 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Episódio {epNumber}</p>
          <p className="text-xs text-gray-500">Provider: {provider}</p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
}
