'use client';

import { ShipmentStatus } from '@/lib/types';
import clsx from 'clsx';

const statusStyles: Record<ShipmentStatus, { label: string; className: string }> = {
  [ShipmentStatus.CREATED]: {
    label: 'Creado',
    className: 'border-slate-400/40 bg-slate-400/10 text-slate-400 dark:text-slate-300',
  },
  [ShipmentStatus.DISPATCHED]: {
    label: 'Despachado',
    className: 'border-indigo-400/40 bg-indigo-400/10 text-indigo-500 dark:text-indigo-300',
  },
  [ShipmentStatus.IN_TRANSIT]: {
    label: 'En Tránsito',
    className: 'border-sky-400/40 bg-sky-400/10 text-sky-500 dark:text-sky-300',
  },
  [ShipmentStatus.OUT_FOR_DELIVERY]: {
    label: 'En reparto',
    className: 'border-amber-400/40 bg-amber-400/10 text-amber-500 dark:text-amber-300',
  },
  [ShipmentStatus.DELIVERED]: {
    label: 'Entregado',
    className: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-500 dark:text-emerald-300',
  },
  [ShipmentStatus.CUSTOMS]: {
    label: 'En Aduana',
    className: 'border-violet-400/40 bg-violet-400/10 text-violet-500 dark:text-violet-300',
  },
  [ShipmentStatus.ISSUE]: {
    label: 'Problema',
    className: 'border-rose-400/40 bg-rose-400/10 text-rose-500 dark:text-rose-300',
  },
};

export const StatusBadge = ({ status, className }: { status: ShipmentStatus; className?: string }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
        statusStyles[status].className,
        className
      )}
    >
      {statusStyles[status].label}
    </span>
  );
};
