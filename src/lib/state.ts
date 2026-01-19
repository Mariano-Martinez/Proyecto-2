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
  [ShipmentStatus.CREATED]: 'bg-surface-1 text-default ring-1 ring-[hsl(var(--border))]',
  [ShipmentStatus.DISPATCHED]: 'bg-[hsl(226_100%_95%/0.6)] text-[hsl(226_60%_42%)] ring-1 ring-[hsl(226_60%_55%/0.2)]',
  [ShipmentStatus.IN_TRANSIT]: 'bg-[hsl(var(--primary)/0.12)] text-primary ring-1 ring-[hsl(var(--primary)/0.25)]',
  [ShipmentStatus.OUT_FOR_DELIVERY]: 'bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning))] ring-1 ring-[hsl(var(--warning)/0.25)]',
  [ShipmentStatus.DELIVERED]: 'bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))] ring-1 ring-[hsl(var(--success)/0.25)]',
  [ShipmentStatus.CUSTOMS]: 'bg-[hsl(264_85%_95%/0.6)] text-[hsl(264_60%_45%)] ring-1 ring-[hsl(264_60%_55%/0.2)]',
  [ShipmentStatus.ISSUE]: 'bg-[hsl(var(--danger)/0.12)] text-[hsl(var(--danger))] ring-1 ring-[hsl(var(--danger)/0.25)]',
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
