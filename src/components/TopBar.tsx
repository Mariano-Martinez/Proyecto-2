'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { AccountMenu } from './AccountMenu';

export const TopBar = () => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3">
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
