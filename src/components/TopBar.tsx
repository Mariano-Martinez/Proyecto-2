'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { AccountMenu } from './AccountMenu';

export const TopBar = () => {
  const router = useRouter();
  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-3 lg:right-8 lg:top-6">
      <button
        onClick={() => router.push('/notifications')}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:text-sky-600"
        aria-label="Notificaciones"
      >
        <BellIcon className="h-5 w-5" />
      </button>
      <AccountMenu />
    </div>
  );
};
