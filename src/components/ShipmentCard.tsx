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
    <div className="card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">{shipment.alias}</p>
          <p className="text-xs text-slate-500">{shipment.courier}</p>
        </div>
        <StatusBadge status={shipment.status} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Código</p>
          <p className="font-mono text-sm text-slate-800">{shipment.code}</p>
        </div>
        <button
          onClick={() => copy(shipment.code)}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          title="Copiar código"
        >
          <ClipboardDocumentIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-600">
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
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
