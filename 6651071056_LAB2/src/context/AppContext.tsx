/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Booking } from '../types';

type Theme = 'light' | 'dark';

type AppState = {
  theme: Theme;
  toggleTheme: () => void;
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  bookings: Booking[];
  createBooking: (details: Omit<Booking, 'id' | 'purchasedAt'>) => Booking;
};

const AppContext = createContext<AppState | null>(null);

function useStoredState<T>(key: string, initial: T): [T, (value: T | ((old: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved === null ? initial : JSON.parse(saved) as T;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage can be unavailable. */ }
  }, [key, value]);

  return [value, setValue];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useStoredState<Theme>('hen_theme', 'light');
  const [favoriteIds, setFavoriteIds] = useStoredState<string[]>('hen_favorites', []);
  const [bookings, setBookings] = useStoredState<Booking[]>('hen_bookings', []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const state = useMemo<AppState>(() => ({
    theme,
    toggleTheme: () => setTheme((current) => current === 'light' ? 'dark' : 'light'),
    favoriteIds,
    toggleFavorite: (id: string) => setFavoriteIds((ids) =>
      ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id],
    ),
    isFavorite: (id: string) => favoriteIds.includes(id),
    bookings,
    createBooking: (details) => {
      const saved: Booking = {
        ...details,
        id: `HEN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        purchasedAt: new Date().toISOString(),
      };
      setBookings((previous) => [saved, ...previous]);
      return saved;
    },
  }), [theme, setTheme, favoriteIds, setFavoriteIds, bookings, setBookings]);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppState {
  const context = useContext(AppContext);
  if (context === null) throw new Error('useAppContext must be used inside AppProvider');
  return context;
}
