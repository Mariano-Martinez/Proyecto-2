import { planFeatures, pricingTiers, isFeatureAvailable } from '@/lib/plans';
import { Plan } from '@/lib/types';
import { CheckIcon, MinusIcon } from '@heroicons/react/24/outline';

export const PricingComparison = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-subtle bg-[rgba(0,0,0,0.35)] shadow-depth-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[rgba(0,0,0,0.6)] text-xs uppercase text-muted">
          <tr>
            <th className="px-4 py-3">Feature</th>
            {pricingTiers.map((tier) => (
              <th
                key={tier.id}
                className={`px-4 py-3 text-center font-semibold ${tier.id === Plan.PRO ? 'text-primary' : 'text-muted'}`}
              >
                {tier.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(255,255,255,0.08)]">
          <tr>
            <td className="px-4 py-3 font-semibold text-strong">Límite de envíos</td>
            {pricingTiers.map((tier) => (
              <td
                key={tier.id}
                className={`px-4 py-3 text-center ${tier.id === Plan.PRO ? 'bg-[rgba(0,115,255,0.12)] font-semibold text-strong' : 'text-muted'}`}
              >
                {tier.limit === Infinity ? 'Ilimitado' : tier.limit}
              </td>
            ))}
          </tr>
          {planFeatures.map((feature) => (
            <tr key={feature.label}>
              <td className="px-4 py-3 text-strong">{feature.label}</td>
              {pricingTiers.map((tier) => (
                <td
                  key={tier.id}
                  className={`px-4 py-3 text-center ${tier.id === Plan.PRO ? 'bg-[rgba(0,115,255,0.12)]' : ''}`}
                >
                  {isFeatureAvailable(tier.id as Plan, feature.availableFrom) ? (
                    <CheckIcon className="mx-auto h-4 w-4 text-primary" />
                  ) : (
                    <MinusIcon className="mx-auto h-4 w-4 text-muted" />
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
