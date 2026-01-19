'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useThemeMode } from '@/lib/useThemeMode';

export const ThemeToggle = () => {
  const { theme, setTheme } = useThemeMode();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-surface-1 text-muted shadow-depth-sm transition hover:-translate-y-0.5 hover:text-primary hover:shadow-depth-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring)/0.35)]"
      aria-label="Cambiar tema"
      title={isDark ? 'Cambiar a claro' : 'Cambiar a oscuro'}
    >
      {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
};
