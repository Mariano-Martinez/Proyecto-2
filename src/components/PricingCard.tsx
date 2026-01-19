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
          className={`card flex h-full flex-col gap-4 p-5 transition ${
            tier.id === Plan.PRO
              ? 'border-[hsl(var(--primary)/0.4)] bg-[hsl(var(--surface-1))] shadow-depth-md'
              : 'bg-layer-0'
          } ${[Plan.FREE, Plan.BASIC, Plan.PRO].includes(tier.id) ? 'md:min-h-[420px]' : ''}`}
        >
          <div className="flex min-h-[48px] items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-muted">{tier.name}</p>
              <p className="mt-1 text-lg text-muted">{tier.description}</p>
            </div>
            {tier.id === Plan.PRO && <span className="badge badge-info">Popular</span>}
          </div>
          <div className="text-3xl font-bold text-strong">
            {tier.id === Plan.ENTERPRISE ? 'Contactar' : `ARS ${annual ? tier.priceYearly : tier.priceMonthly}`}
            <span className="text-base font-medium text-muted">/ {annual ? 'año' : 'mes'}</span>
          </div>
          <p className="text-sm text-muted">Hasta {tier.limit === Infinity ? 'ilimitado' : `${tier.limit} envíos activos`}.</p>
          <div className="mt-auto space-y-3">
            <button
              onClick={() => handleChoose(tier.id)}
              className="btn-primary w-full justify-center rounded-xl px-4 py-2"
            >
              Elegir plan
            </button>
            <div className="space-y-2 text-sm text-muted">
              {planFeatures.map((feature) => {
                const available = isFeatureAvailable(tier.id, feature.availableFrom);
                return (
                  <div key={feature.label} className="flex items-center gap-2">
                    {available ? (
                      <CheckIcon className="h-4 w-4 text-primary" />
                    ) : (
                      <MinusIcon className="h-4 w-4 text-muted" />
                    )}
                    <span className={available ? 'text-strong' : 'text-muted'}>
                      {feature.label} {feature.note && <span className="text-xs text-muted">({feature.note})</span>}
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
