'use client';

import { useEffect } from 'react';
import { getTheme } from '@/lib/storage';

export const ThemeManager = () => {
  useEffect(() => {
    const stored = getTheme();
    if (stored) {
      document.documentElement.dataset.theme = stored;
    }
  }, []);

  return null;
};
