'use client';

import { LucideIcon } from 'lucide-react';

type KpiCardProps = {
  title: string;
  value: number;
  trend: string;
  icon: LucideIcon;
  accentClass: string;
};

export const KpiCard = ({ title, value, trend, icon: Icon, accentClass }: KpiCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-sm dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[rgb(var(--muted-foreground))]">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-[rgb(var(--foreground))]">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentClass}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <p className="mt-4 text-xs font-semibold text-emerald-500 dark:text-emerald-400">{trend}</p>
    </div>
  );
};
