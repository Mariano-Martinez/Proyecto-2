import { planFeatures, pricingTiers, isFeatureAvailable } from '@/lib/plans';
import { Plan } from '@/lib/types';
import { CheckIcon, MinusIcon } from '@heroicons/react/24/outline';

export const PricingComparison = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-subtle bg-[hsl(var(--surface-0)/0.96)] shadow-depth-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[hsl(var(--bg-1)/0.9)] text-xs uppercase text-muted shadow-inset backdrop-blur">
          <tr>
            <th className="px-4 py-3">Feature</th>
            {pricingTiers.map((tier) => (
              <th
                key={tier.id}
                className={`px-4 py-3 text-center font-semibold ${tier.id === Plan.PRO ? 'text-primary' : 'text-default'}`}
              >
                {tier.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-subtle transition hover:bg-[hsl(var(--surface-1)/0.6)]">
            <td className="px-4 py-3 font-semibold text-default">Límite de envíos</td>
            {pricingTiers.map((tier) => (
              <td
                key={tier.id}
                className={`px-4 py-3 text-center ${tier.id === Plan.PRO ? 'bg-[hsl(var(--primary)/0.08)] font-semibold text-default' : 'text-muted'}`}
              >
                {tier.limit === Infinity ? 'Ilimitado' : tier.limit}
              </td>
            ))}
          </tr>
          {planFeatures.map((feature) => (
            <tr key={feature.label} className="border-t border-subtle transition hover:bg-[hsl(var(--surface-1)/0.6)]">
              <td className="px-4 py-3 text-default">{feature.label}</td>
              {pricingTiers.map((tier) => (
                <td
                  key={tier.id}
                  className={`px-4 py-3 text-center ${tier.id === Plan.PRO ? 'bg-[hsl(var(--primary)/0.08)]' : ''}`}
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
