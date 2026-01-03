import { planFeatures, pricingTiers, isFeatureAvailable } from '@/lib/plans';
import { Plan } from '@/lib/types';

export const PricingComparison = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="min-w-full bg-white text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Feature</th>
            {pricingTiers.map((tier) => (
              <th key={tier.id} className="px-4 py-3 text-center font-semibold text-slate-700">
                {tier.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-100">
            <td className="px-4 py-3 font-semibold text-slate-900">Límite de envíos</td>
            {pricingTiers.map((tier) => (
              <td key={tier.id} className="px-4 py-3 text-center">
                {tier.limit === Infinity ? 'Ilimitado' : tier.limit}
              </td>
            ))}
          </tr>
          {planFeatures.map((feature) => (
            <tr key={feature.label} className="border-t border-slate-100">
              <td className="px-4 py-3 text-slate-800">{feature.label}</td>
              {pricingTiers.map((tier) => (
                <td key={tier.id} className="px-4 py-3 text-center">
                  {isFeatureAvailable(tier.id as Plan, feature.availableFrom) ? '✔️' : '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
