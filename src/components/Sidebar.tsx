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
    <aside className="hidden lg:flex lg:w-72 lg:min-h-screen lg:flex-col lg:border-r lg:border-subtle lg:bg-[hsl(var(--surface-0)/0.96)] lg:p-6 lg:shadow-depth-md lg:backdrop-blur">
      <div className="flex items-center gap-3 rounded-2xl border border-subtle bg-surface-1 px-4 py-3 text-xl font-bold text-default shadow-depth-sm">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.12)] text-primary shadow-inset">
          <Squares2X2Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase text-muted">TrackHub AR</p>
          <p className="text-base font-bold text-default">Logística inteligente</p>
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
              className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? 'bg-[hsl(var(--primary)/0.12)] text-primary shadow-depth-sm ring-1 ring-[hsl(var(--primary)/0.2)]'
                  : 'text-muted hover:bg-surface-1 hover:text-default'
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                  active
                    ? 'border-[hsl(var(--primary)/0.25)] bg-[hsl(var(--primary)/0.16)] text-primary shadow-inset'
                    : 'border-transparent bg-[hsl(var(--surface-1)/0.6)] text-muted group-hover:text-default'
                }`}
              >
                <item.icon className="h-5 w-5" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="rounded-2xl border border-subtle bg-[hsl(var(--surface-1)/0.8)] p-4 text-sm text-muted shadow-inset">
        <p className="font-semibold text-default">Panel</p>
        <p className="mt-1">Accedé con tu cuenta para gestionar envíos y planes.</p>
      </div>
    </aside>
  );
};
