'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDownIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { clearAuth, clearUser, getUser, setRedirectPath } from '@/lib/storage';

const deriveDisplayName = (name?: string, email?: string) => {
  if (name) {
    const [first] = name.trim().split(' ');
    return first || name;
  }
  if (email) {
    return email.split('@')[0];
  }
  return 'Usuario';
};

export const AccountMenu = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState('Usuario');

  useEffect(() => {
    const user = getUser();
    setDisplayName(deriveDisplayName(user?.name, user?.email));
  }, []);

  const logout = () => {
    clearAuth();
    clearUser();
    setRedirectPath('');
    router.replace('/');
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
      >
        Hola, {displayName}
        <ChevronDownIcon className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 text-red-600" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}
    </div>
  );
};
