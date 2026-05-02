'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { AnimeListItem } from '../../types/anime-list-item';

interface AnimeContextType {
  selectedAnime: AnimeListItem | null;
  setSelectedAnime: (anime: AnimeListItem) => void;
}

const AnimeContext = createContext<AnimeContextType | undefined>(undefined);

export function AnimeProvider({ children }: { children: ReactNode }) {
  const [selectedAnime, setSelectedAnime] = useState<AnimeListItem | null>(null);

  return (
    <AnimeContext.Provider value={{ selectedAnime, setSelectedAnime }}>
      {children}
    </AnimeContext.Provider>
  );
}

export function useAnime() {
  const context = useContext(AnimeContext);
  if (context === undefined) {
    throw new Error('useAnime must be used within an AnimeProvider');
  }
  return context;
}
