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
      router.push('/auth');
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {pricingTiers.map((tier) => (
        <div key={tier.id} className="card flex flex-col gap-4 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-slate-500">{tier.name}</p>
              <p className="mt-1 text-lg text-slate-700">{tier.description}</p>
            </div>
            {tier.id === Plan.PRO && <span className="badge bg-amber-100 text-amber-700">Popular</span>}
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {tier.id === Plan.ENTERPRISE ? 'Contactar' : `ARS ${annual ? tier.priceYearly : tier.priceMonthly}`}
            <span className="text-base font-medium text-slate-500">/ {annual ? 'año' : 'mes'}</span>
          </div>
          <p className="text-sm text-slate-600">Hasta {tier.limit === Infinity ? 'ilimitado' : `${tier.limit} envíos activos`}.</p>
          <button
            onClick={() => handleChoose(tier.id)}
            className="btn-primary w-full justify-center rounded-xl px-4 py-2"
          >
            Elegir plan
          </button>
          <div className="mt-2 space-y-2 text-sm text-slate-700">
            {planFeatures.map((feature) => {
              const available = isFeatureAvailable(tier.id, feature.availableFrom);
              return (
                <div key={feature.label} className="flex items-center gap-2">
                  {available ? (
                    <CheckIcon className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <MinusIcon className="h-4 w-4 text-slate-400" />
                  )}
                  <span className={available ? '' : 'text-slate-400'}>
                    {feature.label} {feature.note && <span className="text-xs text-slate-400">({feature.note})</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
