'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { AccountMenu } from './AccountMenu';
import { ThemeToggle } from './ThemeToggle';

export const TopBar = () => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <button
        onClick={() => router.push('/notifications')}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-surface-1 text-muted shadow-depth-sm transition hover:-translate-y-0.5 hover:text-primary hover:shadow-depth-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring)/0.35)]"
        aria-label="Notificaciones"
      >
        <BellIcon className="h-5 w-5" />
      </button>
      <AccountMenu />
    </div>
  );
};
