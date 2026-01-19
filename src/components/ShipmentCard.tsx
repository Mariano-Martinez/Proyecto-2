import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { StatusBadge } from './StatusBadge';
import { Shipment } from '@/lib/types';
import { ClipboardDocumentIcon, TrashIcon } from '@heroicons/react/24/outline';

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
    <div className="card space-y-3 hover-lift">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-strong">{shipment.alias}</p>
          <p className="text-xs text-muted">{shipment.courier}</p>
        </div>
        <StatusBadge status={shipment.status} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted">Código</p>
          <p className="rounded-lg border border-subtle bg-layer-0 px-2 py-1 font-mono text-sm text-strong shadow-inset">
            {shipment.code}
          </p>
        </div>
        <button
          onClick={() => copy(shipment.code)}
          className="rounded-lg p-2 text-muted transition hover:bg-[hsl(var(--surface-2))] hover:text-strong focus-visible:focus-ring"
          title="Copiar código"
        >
          <ClipboardDocumentIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>Actualizado: {format(new Date(shipment.lastUpdated), 'dd MMM, HH:mm', { locale: es })}</span>
        <span>ETA: {shipment.eta}</span>
      </div>
      <div className="flex items-center justify-between">
        <Link href={`/shipments/${shipment.id}`} className="text-sm font-semibold text-primary">
          Ver detalle
        </Link>
        <button
          onClick={() => onDelete(shipment.id)}
          className="text-sm font-semibold text-[hsl(var(--danger))] transition hover:text-[hsl(var(--danger)/0.9)]"
          title="Eliminar"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
