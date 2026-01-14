import { planFeatures, pricingTiers, isFeatureAvailable } from '@/lib/plans';
import { Plan } from '@/lib/types';
import { CheckIcon, MinusIcon } from '@heroicons/react/24/outline';

export const PricingComparison = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="min-w-full bg-white text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Feature</th>
            {pricingTiers.map((tier) => (
              <th
                key={tier.id}
                className={`px-4 py-3 text-center font-semibold ${tier.id === Plan.PRO ? 'text-sky-700' : 'text-slate-700'}`}
              >
                {tier.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-100">
            <td className="px-4 py-3 font-semibold text-slate-900">Límite de envíos</td>
            {pricingTiers.map((tier) => (
              <td
                key={tier.id}
                className={`px-4 py-3 text-center ${tier.id === Plan.PRO ? 'bg-sky-50/70 font-semibold text-slate-900' : ''}`}
              >
                {tier.limit === Infinity ? 'Ilimitado' : tier.limit}
              </td>
            ))}
          </tr>
          {planFeatures.map((feature) => (
            <tr key={feature.label} className="border-t border-slate-100">
              <td className="px-4 py-3 text-slate-800">{feature.label}</td>
              {pricingTiers.map((tier) => (
                <td
                  key={tier.id}
                  className={`px-4 py-3 text-center ${tier.id === Plan.PRO ? 'bg-sky-50/70' : ''}`}
                >
                  {isFeatureAvailable(tier.id as Plan, feature.availableFrom) ? (
                    <CheckIcon className="mx-auto h-4 w-4 text-sky-600" />
                  ) : (
                    <MinusIcon className="mx-auto h-4 w-4 text-slate-300" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
