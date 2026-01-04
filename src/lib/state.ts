import { ShipmentStatus } from './types';

export const statusLabels: Record<ShipmentStatus, string> = {
  [ShipmentStatus.CREATED]: 'Creado',
  [ShipmentStatus.DISPATCHED]: 'Despachado',
  [ShipmentStatus.IN_TRANSIT]: 'En tránsito',
  [ShipmentStatus.OUT_FOR_DELIVERY]: 'En reparto',
  [ShipmentStatus.DELIVERED]: 'Entregado',
  [ShipmentStatus.CUSTOMS]: 'En aduana',
  [ShipmentStatus.ISSUE]: 'Problemas',
};

export const statusColors: Record<ShipmentStatus, string> = {
  [ShipmentStatus.CREATED]: 'bg-slate-50 text-slate-700 ring-1 ring-slate-200',
  [ShipmentStatus.DISPATCHED]: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
  [ShipmentStatus.IN_TRANSIT]: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  [ShipmentStatus.OUT_FOR_DELIVERY]: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  [ShipmentStatus.DELIVERED]: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  [ShipmentStatus.CUSTOMS]: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  [ShipmentStatus.ISSUE]: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
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
