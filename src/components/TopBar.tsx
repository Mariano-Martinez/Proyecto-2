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
        className="flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-[rgba(0,0,0,0.4)] text-muted transition hover:bg-[rgba(255,255,255,0.08)] focus-visible:focus-ring"
        aria-label="Notificaciones"
      >
        <BellIcon className="h-5 w-5" />
      </button>
      <AccountMenu />
    </div>
  );
};
