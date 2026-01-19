'use client';

import { useEffect, useState } from 'react';
import { getTheme, setTheme, ThemeMode } from '@/lib/storage';

export const useThemeMode = () => {
  const [theme, setThemeState] = useState<ThemeMode>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = getTheme();
    const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const next = stored ?? (systemDark ? 'dark' : 'light');
    setThemeState(next);
    document.documentElement.dataset.theme = next;
  }, []);

  const updateTheme = (next: ThemeMode) => {
    setThemeState(next);
    setTheme(next);
    document.documentElement.dataset.theme = next;
  };

  return { theme, setTheme: updateTheme };
};
