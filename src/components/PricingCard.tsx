'use client';

import { CheckIcon, MinusIcon } from '@heroicons/react/24/outline';
import { planFeatures, pricingTiers } from '@/lib/plans';
import { Plan } from '@/lib/types';
import { getAuth, setPlan, setRedirectPath } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import { isFeatureAvailable } from '@/lib/plans';

export const PricingCard = ({ annual }: { annual: boolean }) => {
  const router = useRouter();
  const handleChoose = (plan: Plan) => {
    const authed = getAuth();
    setPlan(plan);
    if (!authed) {
      setRedirectPath('/pricing');
      router.push('/login');
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {pricingTiers.map((tier) => (
        <div
          key={tier.id}
          className={`card ui-hover-lift flex h-full flex-col gap-4 p-5 ${
            tier.id === Plan.PRO
              ? 'ring-1 ring-sky-500/20 shadow-md shadow-slate-900/10 bg-gradient-to-br from-sky-500/10 via-transparent to-transparent'
              : ''
          } ${[Plan.FREE, Plan.BASIC, Plan.PRO].includes(tier.id) ? 'md:min-h-[420px]' : ''}`}
        >
          <div className="flex min-h-[48px] items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-[rgb(var(--muted-foreground))]">{tier.name}</p>
              <p className="mt-1 text-lg text-[rgb(var(--foreground))]">{tier.description}</p>
            </div>
            {tier.id === Plan.PRO && (
              <span className="badge bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20">Popular</span>
            )}
          </div>
          <div className="text-3xl font-bold text-[rgb(var(--foreground))]">
            {tier.id === Plan.ENTERPRISE ? 'Contactar' : `ARS ${annual ? tier.priceYearly : tier.priceMonthly}`}
            <span className="text-base font-medium text-[rgb(var(--muted-foreground))]">/ {annual ? 'año' : 'mes'}</span>
          </div>
          <p className="text-sm text-[rgb(var(--muted-foreground))]">
            Hasta {tier.limit === Infinity ? 'ilimitado' : `${tier.limit} envíos activos`}.
          </p>
          <div className="mt-auto space-y-3">
            <button
              onClick={() => handleChoose(tier.id)}
              className="btn-primary w-full justify-center rounded-xl px-4 py-2"
            >
              Elegir plan
            </button>
            <div className="space-y-2 text-sm text-[rgb(var(--foreground))]">
              {planFeatures.map((feature) => {
                const available = isFeatureAvailable(tier.id, feature.availableFrom);
                return (
                  <div key={feature.label} className="flex items-center gap-2">
                    {available ? (
                      <CheckIcon className="h-4 w-4 text-sky-600" />
                    ) : (
                      <MinusIcon className="h-4 w-4 text-[rgb(var(--muted-foreground))]" />
                    )}
                    <span className={available ? '' : 'text-[rgb(var(--muted-foreground))]'}>
                      {feature.label}{' '}
                      {feature.note && <span className="text-xs text-[rgb(var(--muted-foreground))]">({feature.note})</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
