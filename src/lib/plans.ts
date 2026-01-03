import { Plan } from './types';

export const planLimits: Record<Plan, number> = {
  [Plan.FREE]: 3,
  [Plan.BASIC]: 15,
  [Plan.PRO]: 50,
  [Plan.BUSINESS]: 200,
  [Plan.ENTERPRISE]: Number.POSITIVE_INFINITY,
};

export type PlanFeature = {
  label: string;
  availableFrom: Plan;
  note?: string;
};

export const pricingTiers = [
  {
    id: Plan.FREE,
    name: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    limit: planLimits[Plan.FREE],
    description: 'Para probar el producto con tus primeros envíos.',
  },
  {
    id: Plan.BASIC,
    name: 'Basic',
    priceMonthly: 4500,
    priceYearly: 45000,
    limit: planLimits[Plan.BASIC],
    description: 'Notificaciones y seguimiento simple para vendedores ocasionales.',
  },
  {
    id: Plan.PRO,
    name: 'Pro',
    priceMonthly: 11500,
    priceYearly: 115000,
    limit: planLimits[Plan.PRO],
    description: 'Historial extendido y filtros avanzados para tiendas online.',
  },
  {
    id: Plan.BUSINESS,
    name: 'Business',
    priceMonthly: 32000,
    priceYearly: 320000,
    limit: planLimits[Plan.BUSINESS],
    description: 'Multiusuario e integraciones para equipos de logística.',
  },
  {
    id: Plan.ENTERPRISE,
    name: 'Enterprise',
    priceMonthly: 0,
    priceYearly: 0,
    limit: 1000,
    description: 'Uso masivo con soporte dedicado. Hablá con ventas.',
  },
];

export const planFeatures: PlanFeature[] = [
  { label: 'Notificaciones (email/push)', availableFrom: Plan.BASIC },
  { label: 'Historial extendido', availableFrom: Plan.PRO },
  { label: 'Etiquetas y filtros avanzados', availableFrom: Plan.PRO },
  { label: 'Multiusuario', availableFrom: Plan.BUSINESS },
  { label: 'Integraciones (ML/Gmail/Shopify)', availableFrom: Plan.BUSINESS, note: 'Próximamente' },
];

export const isFeatureAvailable = (plan: Plan, availableFrom: Plan) => {
  const order = [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.BUSINESS, Plan.ENTERPRISE];
  return order.indexOf(plan) >= order.indexOf(availableFrom);
};
