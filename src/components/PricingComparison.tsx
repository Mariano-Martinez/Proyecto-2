import { planFeatures, pricingTiers, isFeatureAvailable } from '@/lib/plans';
import { Plan } from '@/lib/types';
import { CheckIcon, MinusIcon } from '@heroicons/react/24/outline';

export const PricingComparison = () => {
  return (
    <div className="panel overflow-hidden rounded-2xl">
      <table className="min-w-full bg-[rgb(var(--panel-bg))] text-left text-sm">
        <thead className="bg-[rgb(var(--muted))] text-xs uppercase text-[rgb(var(--muted-foreground))]">
          <tr>
            <th className="px-4 py-3">Feature</th>
            {pricingTiers.map((tier) => (
              <th
                key={tier.id}
                className={`px-4 py-3 text-center font-semibold ${
                  tier.id === Plan.PRO ? 'text-sky-400' : 'text-[rgb(var(--foreground))]'
                }`}
              >
                {tier.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-[rgb(var(--border))]">
            <td className="px-4 py-3 font-semibold text-[rgb(var(--foreground))]">Límite de envíos</td>
            {pricingTiers.map((tier) => (
              <td
                key={tier.id}
                className={`px-4 py-3 text-center ${
                  tier.id === Plan.PRO ? 'bg-sky-500/10 font-semibold text-[rgb(var(--foreground))]' : ''
                }`}
              >
                {tier.limit === Infinity ? 'Ilimitado' : tier.limit}
              </td>
            ))}
          </tr>
          {planFeatures.map((feature) => (
            <tr key={feature.label} className="border-t border-[rgb(var(--border))]">
              <td className="px-4 py-3 text-[rgb(var(--foreground))]">{feature.label}</td>
              {pricingTiers.map((tier) => (
                <td
                  key={tier.id}
                  className={`px-4 py-3 text-center ${tier.id === Plan.PRO ? 'bg-sky-500/10' : ''}`}
                >
                  {isFeatureAvailable(tier.id as Plan, feature.availableFrom) ? (
                    <CheckIcon className="mx-auto h-4 w-4 text-sky-600" />
                  ) : (
                    <MinusIcon className="mx-auto h-4 w-4 text-[rgb(var(--muted-foreground))]" />
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
