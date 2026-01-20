'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { CreditCard, LayoutGrid, Package, PlugZap, Settings, X } from 'lucide-react';
import { PlanCard } from '@/components/dashboard/PlanCard';
import { getUsage } from '@/lib/storage';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/shipments', label: 'Mis Envíos', icon: Package },
  { href: '/integrations', label: 'Integraciones', icon: PlugZap },
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
              'group ui-transition ui-focus-ring flex items-center gap-3 rounded-[10px] px-4 py-3 text-sm font-semibold',
              active
                ? 'bg-sky-500/15 text-sky-400 shadow-[0_0_0_1px_rgba(56,189,248,0.3)]'
                : 'text-[rgb(var(--muted-foreground))] hover:bg-slate-100 dark:hover:bg-white/5 hover:text-[rgb(var(--foreground))]'
            )}
          >
            <item.icon
              className={clsx(
                'ui-transition h-5 w-5',
                active ? 'text-sky-400' : 'text-[rgb(var(--muted-foreground))] group-hover:text-sky-400'
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-[rgb(var(--panel-border))] lg:bg-[rgb(var(--background))] lg:px-6 lg:py-8 lg:text-[rgb(var(--foreground))] lg:shadow-[0_0_30px_rgba(0,0,0,0.15)] lg:overflow-y-auto">
        <div className="flex items-center gap-3 text-lg font-semibold text-[rgb(var(--foreground))]">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gradient-to-br from-sky-500 to-blue-600 shadow-sm shadow-sky-500/30">
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
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[rgb(var(--background))] px-6 py-6 text-[rgb(var(--foreground))] shadow-2xl transition-transform lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-lg font-semibold">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gradient-to-br from-sky-500 to-blue-600 shadow-sm shadow-sky-500/30">
              <LayoutGrid className="h-5 w-5 text-white" />
            </div>
            TrackHub AR
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ui-transition ui-icon-press ui-focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--panel-border))] hover:border-[rgb(var(--panel-hover-border))] hover:text-sky-400"
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
