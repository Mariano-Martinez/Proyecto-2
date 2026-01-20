'use client';

import { LucideIcon } from 'lucide-react';
import { Panel } from '@/components/ui/Panel';
import { IconBadge } from '@/components/ui/IconBadge';

type KpiCardProps = {
  title: string;
  value: number;
  trend: string;
  icon: LucideIcon;
  accentClass: string;
};

export const KpiCard = ({ title, value, trend, icon: Icon, accentClass }: KpiCardProps) => {
  return (
    <Panel interactive className="relative overflow-hidden p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[rgb(var(--muted-foreground))]">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-[rgb(var(--foreground))]">{value}</p>
        </div>
        <IconBadge icon={Icon} className={accentClass} />
      </div>
      <p className="mt-4 text-xs font-semibold text-emerald-500 dark:text-emerald-400">{trend}</p>
    </Panel>
  );
};
