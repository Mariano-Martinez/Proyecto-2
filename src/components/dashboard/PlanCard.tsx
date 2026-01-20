'use client';

import Link from 'next/link';
import { Panel } from '@/components/ui/Panel';

type PlanCardProps = {
  plan: string;
  active: number;
  limit: number;
};

export const PlanCard = ({ plan, active, limit }: PlanCardProps) => {
  const progress = limit === 0 ? 0 : Math.min((active / limit) * 100, 100);

  return (
    <Panel className="p-4 text-sm text-[rgb(var(--foreground))]">
      <p className="text-sm font-semibold text-[rgb(var(--foreground))]">Plan {plan === 'FREE' ? 'Free' : plan}</p>
      <p className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
        {active}/{limit === Infinity ? '∞' : limit} envíos activos
      </p>
      <div className="mt-3 h-2 w-full rounded-full bg-[rgb(var(--muted))]">
        <div className="h-2 rounded-full bg-sky-400 transition-all" style={{ width: `${progress}%` }} />
      </div>
      <Link
        href="/pricing"
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-sky-500 to-blue-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:shadow-[0_8px_20px_rgba(56,189,248,0.35)] active:scale-95"
      >
        Actualizar
      </Link>
    </Panel>
  );
};
