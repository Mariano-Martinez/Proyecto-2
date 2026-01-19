'use client';

import { useEffect, useRef, useState } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = getUser();
    setDisplayName(deriveDisplayName(user?.name, user?.email));
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const logout = () => {
    clearAuth();
    clearUser();
    setRedirectPath('');
    router.replace('/');
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl border border-subtle bg-surface-1 px-3 py-2 text-sm font-semibold text-default shadow-depth-sm transition hover:shadow-depth-md"
      >
        Hola, {displayName}
        <ChevronDownIcon className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-subtle bg-surface-0 py-1 shadow-depth-lg">
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surface-1 hover:text-default"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 text-[hsl(var(--danger))]" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}
    </div>
  );
};
