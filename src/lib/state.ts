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
  [ShipmentStatus.CREATED]: 'badge-info',
  [ShipmentStatus.DISPATCHED]: 'badge-info',
  [ShipmentStatus.IN_TRANSIT]: 'badge-info',
  [ShipmentStatus.OUT_FOR_DELIVERY]: 'badge-warning',
  [ShipmentStatus.DELIVERED]: 'badge-success',
  [ShipmentStatus.CUSTOMS]: 'badge-info',
  [ShipmentStatus.ISSUE]: 'badge-danger',
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
