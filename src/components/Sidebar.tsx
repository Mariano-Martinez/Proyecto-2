'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CurrencyDollarIcon, HomeIcon, Squares2X2Icon, Cog6ToothIcon, TruckIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/shipments', label: 'Envíos', icon: TruckIcon },
  { href: '/integrations', label: 'Integraciones', icon: PuzzlePieceIcon },
  { href: '/pricing', label: 'Planes', icon: CurrencyDollarIcon },
  { href: '/settings', label: 'Configuración', icon: Cog6ToothIcon },
];

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex lg:w-72 lg:min-h-screen lg:flex-col lg:border-r lg:border-subtle lg:bg-layer-1 lg:p-6">
      <div className="flex items-center gap-3 rounded-2xl border border-subtle bg-layer-0 px-4 py-3 shadow-depth-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-white shadow-depth-sm">
          <Squares2X2Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-strong">TrackHub AR</p>
          <p className="text-xs text-muted">Logística inteligente</p>
        </div>
      </div>
      <nav className="mt-8 flex-1 space-y-2">
        {nav.map((item) => {
          const activePath = item.href.split('#')[0];
          const active = pathname.startsWith(activePath);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition hover-lift ${
                active ? 'bg-layer-0 text-strong shadow-depth-sm' : 'text-muted'
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl border border-subtle transition ${
                  active ? 'bg-[hsl(var(--surface-1))] text-primary shadow-depth-sm' : 'bg-transparent text-muted'
                }`}
              >
                <item.icon className="h-5 w-5" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="rounded-2xl border border-subtle bg-layer-0 p-4 text-sm text-muted shadow-depth-sm">
        <p className="font-semibold text-strong">Panel</p>
        <p className="mt-1">Accedé con tu cuenta para gestionar envíos y planes.</p>
      </div>
    </aside>
  );
};
