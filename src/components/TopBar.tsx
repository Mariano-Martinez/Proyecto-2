'use client';

import { MagnifyingGlassIcon, BellIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export const TopBar = ({ onAdd }: { onAdd?: () => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:border-b-0 lg:bg-transparent lg:px-0 lg:py-0">
      <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
        <input className="w-full text-sm focus:outline-none" placeholder="Buscar envíos o códigos" />
      </div>
      {onAdd && (
        <button onClick={onAdd} className="hidden rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 lg:inline-flex lg:items-center lg:gap-2">
          <PlusIcon className="h-4 w-4" />
          Agregar
        </button>
      )}
      <button
        onClick={() => router.push('/notifications')}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:text-sky-600"
        aria-label="Notificaciones"
      >
        <BellIcon className="h-5 w-5" />
      </button>
      <Link href="/settings" className={`hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold lg:inline-flex ${pathname.startsWith('/settings') ? 'text-sky-600' : 'text-slate-700'}`}>
        Perfil
      </Link>
    </header>
  );
};
