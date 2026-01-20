'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[rgb(var(--panel-border))] bg-[rgb(var(--panel-bg))] text-[rgb(var(--foreground))] transition hover:border-[rgb(var(--panel-hover-border))] hover:text-sky-400 active:scale-95"
      aria-label="Cambiar tema"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};
