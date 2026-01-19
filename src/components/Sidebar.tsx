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
    <aside className="hidden lg:flex lg:w-64 lg:min-h-screen lg:flex-col lg:border-r lg:border-subtle lg:bg-surface-0 lg:p-6 lg:shadow-depth-sm">
      <div className="flex items-center gap-2 text-xl font-bold text-default">
        <Squares2X2Icon className="h-6 w-6 text-primary" />
        TrackHub AR
      </div>
      <nav className="mt-8 flex-1 space-y-1">
        {nav.map((item) => {
          const activePath = item.href.split('#')[0];
          const active = pathname.startsWith(activePath);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                active ? 'bg-surface-1 text-primary shadow-depth-sm' : 'text-muted hover:bg-surface-1 hover:text-default'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="rounded-xl border border-subtle bg-surface-1 p-4 text-sm text-muted shadow-inset">
        <p className="font-semibold text-default">Panel</p>
        <p className="mt-1">Accedé con tu cuenta para gestionar envíos y planes.</p>
      </div>
    </aside>
  );
};
