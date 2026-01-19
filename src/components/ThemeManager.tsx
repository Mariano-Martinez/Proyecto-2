'use client';

import { useEffect } from 'react';
import { getTheme } from '@/lib/storage';

export const ThemeManager = () => {
  useEffect(() => {
    const stored = getTheme();
    const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const next = stored ?? (systemDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = next;
  }, []);

  return null;
};
