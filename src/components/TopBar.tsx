'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { AccountMenu } from './AccountMenu';

export const TopBar = () => {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-20 flex items-center justify-end gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:border-b-0 lg:bg-transparent lg:px-0 lg:py-0">
      <button
        onClick={() => router.push('/notifications')}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:text-sky-600"
        aria-label="Notificaciones"
      >
        <BellIcon className="h-5 w-5" />
      </button>
      <AccountMenu />
    </header>
  );
};
