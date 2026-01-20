import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { StatusBadge } from './StatusBadge';
import { Shipment } from '@/lib/types';
import { Copy, Trash2 } from 'lucide-react';

export const ShipmentCard = ({
  shipment,
  onDelete,
  onCopy,
}: {
  shipment: Shipment;
  onDelete: (id: string) => void;
  onCopy?: (code: string) => void;
}) => {
  const copy = (code: string) => {
    navigator.clipboard?.writeText(code);
    onCopy?.(code);
  };
  return (
    <div className="card panel-hover space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[rgb(var(--foreground))]">{shipment.alias}</p>
          <p className="text-xs text-[rgb(var(--muted-foreground))]">{shipment.courier}</p>
        </div>
        <StatusBadge status={shipment.status} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[rgb(var(--muted-foreground))]">Código</p>
          <p className="font-mono text-sm text-[rgb(var(--foreground))]">{shipment.code}</p>
        </div>
        <button
          onClick={() => copy(shipment.code)}
          className="rounded-lg p-2 text-[rgb(var(--muted-foreground))] transition hover:bg-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
          title="Copiar código"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center justify-between text-xs text-[rgb(var(--muted-foreground))]">
        <span>Actualizado: {format(new Date(shipment.lastUpdated), 'dd MMM, HH:mm', { locale: es })}</span>
        <span>ETA: {shipment.eta}</span>
      </div>
      <div className="flex items-center justify-between">
        <Link href={`/shipments/${shipment.id}`} className="text-sm font-semibold text-sky-600">
          Ver detalle
        </Link>
        <button
          onClick={() => onDelete(shipment.id)}
          className="text-sm font-semibold text-rose-600 transition hover:text-rose-700"
          title="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
