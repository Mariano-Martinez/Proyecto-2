'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CurrencyDollarIcon, HomeIcon, TruckIcon, Cog6ToothIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

const nav = [
  { href: '/dashboard', label: 'Inicio', icon: HomeIcon },
  { href: '/shipments', label: 'Envíos', icon: TruckIcon },
  { href: '/pricing', label: 'Planes', icon: CurrencyDollarIcon },
  { href: '/settings', label: 'Perfil', icon: Cog6ToothIcon },
];

export const MobileNav = () => {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-subtle bg-[rgba(0,0,0,0.85)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-4xl items-center justify-around px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2 text-base font-bold text-strong">
          <Squares2X2Icon className="h-6 w-6 text-primary" />
          TrackHub
        </Link>
        {nav.map((item) => {
          const activePath = item.href.split('#')[0];
          const active = pathname.startsWith(activePath);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                active ? 'text-primary' : 'text-muted'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
