'use client';

import Link from 'next/link';
import { Bell, Menu, Plus, Search } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

type TopHeaderProps = {
  onMenu: () => void;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
  primaryActionHref?: string;
};

export const TopHeader = ({ onMenu, onPrimaryAction, primaryActionLabel, primaryActionHref }: TopHeaderProps) => {
  const actionLabel = primaryActionLabel ?? 'Agregar Tracking';

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[rgb(var(--panel-border))] bg-[rgb(var(--background))]/90 backdrop-blur">
      <div className="flex flex-wrap items-center gap-4 px-4 py-4 lg:px-10">
        <button
          type="button"
          onClick={onMenu}
          className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[rgb(var(--panel-border))] bg-[rgb(var(--panel-bg))] text-[rgb(var(--foreground))] transition hover:border-[rgb(var(--panel-hover-border))] hover:text-sky-400 active:scale-95 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-1 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[rgb(var(--panel-border))] bg-[rgb(var(--panel-bg))] text-sky-400">
            <div className="h-5 w-5 rounded-md border border-sky-400/40" />
          </div>
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--muted-foreground))]" />
            <input
              type="search"
              placeholder="Buscar envíos por alias o tracking…"
              className="w-full rounded-[10px] border border-[rgb(var(--input-border))] bg-[rgb(var(--input-bg))] py-2 pl-10 pr-4 text-sm text-[rgb(var(--foreground))] outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--panel-border))] bg-[rgb(var(--panel-bg))] text-[rgb(var(--foreground))] transition hover:border-[rgb(var(--panel-hover-border))] hover:text-sky-400 active:scale-95"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
          </button>
          <ThemeToggle />
          {primaryActionHref ? (
            <Link
              href={primaryActionHref}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(56,189,248,0.35)] transition hover:translate-y-[-1px] hover:shadow-[0_12px_24px_rgba(56,189,248,0.45)] active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{actionLabel}</span>
            </Link>
          ) : onPrimaryAction ? (
            <button
              type="button"
              onClick={onPrimaryAction}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(56,189,248,0.35)] transition hover:translate-y-[-1px] hover:shadow-[0_12px_24px_rgba(56,189,248,0.45)] active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{actionLabel}</span>
            </button>
          ) : null}
          <p className="hidden text-sm font-semibold text-[rgb(var(--foreground))] md:block">Hola, Maria</p>
        </div>
      </div>
    </header>
  );
};
