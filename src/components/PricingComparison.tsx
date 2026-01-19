import { planFeatures, pricingTiers, isFeatureAvailable } from '@/lib/plans';
import { Plan } from '@/lib/types';
import { CheckIcon, MinusIcon } from '@heroicons/react/24/outline';

export const PricingComparison = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-subtle bg-layer-1 shadow-depth-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[hsl(var(--bg-1))] text-xs uppercase text-muted shadow-inset">
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
        <tbody className="divide-y divide-[hsl(var(--border))]">
          <tr>
            <td className="px-4 py-3 font-semibold text-strong">Límite de envíos</td>
            {pricingTiers.map((tier) => (
              <td
                key={tier.id}
                className={`px-4 py-3 text-center ${tier.id === Plan.PRO ? 'bg-[hsl(var(--primary)/0.1)] font-semibold text-strong' : 'text-muted'}`}
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
                  className={`px-4 py-3 text-center ${tier.id === Plan.PRO ? 'bg-[hsl(var(--primary)/0.1)]' : ''}`}
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
