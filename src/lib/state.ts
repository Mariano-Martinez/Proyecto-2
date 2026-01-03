import { ShipmentStatus } from './types';

export const statusLabels: Record<ShipmentStatus, string> = {
  [ShipmentStatus.CREATED]: 'Creado',
  [ShipmentStatus.DISPATCHED]: 'Despachado',
  [ShipmentStatus.IN_TRANSIT]: 'En tránsito',
  [ShipmentStatus.OUT_FOR_DELIVERY]: 'En reparto',
  [ShipmentStatus.DELIVERED]: 'Entregado',
  [ShipmentStatus.CUSTOMS]: 'En aduana',
  [ShipmentStatus.ISSUE]: 'Problema',
};

export const statusColors: Record<ShipmentStatus, string> = {
  [ShipmentStatus.CREATED]: 'bg-slate-100 text-slate-700',
  [ShipmentStatus.DISPATCHED]: 'bg-indigo-100 text-indigo-700',
  [ShipmentStatus.IN_TRANSIT]: 'bg-sky-100 text-sky-700',
  [ShipmentStatus.OUT_FOR_DELIVERY]: 'bg-amber-100 text-amber-700',
  [ShipmentStatus.DELIVERED]: 'bg-emerald-100 text-emerald-700',
  [ShipmentStatus.CUSTOMS]: 'bg-purple-100 text-purple-700',
  [ShipmentStatus.ISSUE]: 'bg-rose-100 text-rose-700',
};

export const statusFlow: ShipmentStatus[] = [
  ShipmentStatus.CREATED,
  ShipmentStatus.DISPATCHED,
  ShipmentStatus.IN_TRANSIT,
  ShipmentStatus.OUT_FOR_DELIVERY,
  ShipmentStatus.DELIVERED,
];

export const getNextStatus = (status: ShipmentStatus): ShipmentStatus => {
  const idx = statusFlow.indexOf(status);
  if (idx === -1 || idx === statusFlow.length - 1) return ShipmentStatus.DELIVERED;
  return statusFlow[idx + 1];
};

export const isActiveStatus = (status: ShipmentStatus) => status !== ShipmentStatus.DELIVERED;
