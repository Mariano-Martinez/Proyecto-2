import { statusColors, statusLabels } from '@/lib/state';
import { ShipmentStatus } from '@/lib/types';

export const StatusBadge = ({ status }: { status: ShipmentStatus }) => {
  return <span className={`badge ${statusColors[status]}`}>{statusLabels[status]}</span>;
};
