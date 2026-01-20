'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { CreditCard, LayoutGrid, Package, Puzzle, Settings, X } from 'lucide-react';
import { PlanCard } from '@/components/dashboard/PlanCard';
import { getUsage } from '@/lib/storage';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/shipments', label: 'Mis Envíos', icon: Package },
  { href: '/integrations', label: 'Integraciones', icon: Puzzle },
  { href: '/pricing', label: 'Planes', icon: CreditCard },
  { href: '/settings', label: 'Configuración', icon: Settings },
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const [usage, setUsage] = useState({ active: 0, limit: 3, plan: 'FREE' });

  useEffect(() => {
    setUsage(getUsage());
  }, []);

  const renderNav = () => (
    <nav className="mt-8 flex flex-1 flex-col gap-1">
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
              active
                ? 'bg-sky-500/15 text-sky-500 shadow-[0_0_0_1px_rgba(56,189,248,0.35)] dark:text-sky-300'
                : 'text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))] dark:hover:bg-white/5 dark:hover:text-white'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-[rgb(var(--border))] lg:bg-[rgb(var(--card))] lg:px-6 lg:py-8 lg:text-[rgb(var(--foreground))] dark:lg:bg-[rgba(9,12,18,0.95)]">
        <div className="flex items-center gap-3 text-lg font-semibold text-[rgb(var(--foreground))]">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/30">
            <LayoutGrid className="h-5 w-5 text-white" />
          </div>
          TrackHub AR
        </div>
        {renderNav()}
        <div className="mt-6">
          <PlanCard plan={usage.plan} active={usage.active} limit={usage.limit} />
        </div>
      </aside>

      <div
        className={clsx(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[rgb(var(--card))] px-6 py-6 text-[rgb(var(--foreground))] shadow-2xl transition-transform lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-lg font-semibold">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/30">
              <LayoutGrid className="h-5 w-5 text-white" />
            </div>
            TrackHub AR
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--border))]"
            aria-label="Cerrar menú"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {renderNav()}
        <div className="mt-6">
          <PlanCard plan={usage.plan} active={usage.active} limit={usage.limit} />
        </div>
      </aside>
    </>
  );
};
