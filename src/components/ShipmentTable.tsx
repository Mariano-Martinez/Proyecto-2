import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { StatusBadge } from './StatusBadge';
import { Shipment } from '@/lib/types';
import Link from 'next/link';
import { ClipboardDocumentIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

type Props = {
  shipments: Shipment[];
  onDelete: (id: string) => void;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onCopy?: (code: string) => void;
};

export const ShipmentTable = ({ shipments, onDelete, selectable, selectedIds, onToggleSelect, onCopy }: Props) => {
  const copy = (code: string) => {
    navigator.clipboard?.writeText(code);
    onCopy?.(code);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-subtle bg-[rgba(0,0,0,0.35)] shadow-depth-sm">
      <table className="min-w-full text-left">
        <thead className="sticky top-0 z-10 bg-[rgba(0,0,0,0.6)] text-xs uppercase text-muted">
          <tr>
            {selectable && <th className="table-cell w-12">Sel.</th>}
            <th className="table-cell w-44">Alias</th>
            <th className="table-cell w-32">Courier</th>
            <th className="table-cell w-44">Código</th>
            <th className="table-cell w-32">Estado</th>
            <th className="table-cell w-40">Actualizado</th>
            <th className="table-cell text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(255,255,255,0.08)]">
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="transition hover:bg-[rgba(255,255,255,0.04)]">
              {selectable && (
                <td className="table-cell align-middle">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-subtle bg-transparent text-[rgb(0,115,255)] focus-visible:focus-ring"
                    checked={selectedIds?.has(shipment.id)}
                    onChange={() => onToggleSelect?.(shipment.id)}
                  />
                </td>
              )}
              <td className="table-cell font-semibold text-strong">{shipment.alias}</td>
              <td className="table-cell text-muted">{shipment.courier}</td>
              <td className="table-cell">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg border border-subtle bg-[rgba(0,0,0,0.45)] px-2 py-1 font-mono text-xs font-semibold text-strong">
                    {shipment.code}
                  </span>
                  <button
                    onClick={() => copy(shipment.code)}
                    className="rounded-lg p-1 text-muted transition hover:bg-[rgba(255,255,255,0.08)] hover:text-strong focus-visible:focus-ring"
                    aria-label="Copiar código"
                    title="Copiar código"
                  >
                    <ClipboardDocumentIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
              <td className="table-cell">
                <StatusBadge status={shipment.status} />
              </td>
              <td className="table-cell text-sm text-muted">
                {format(new Date(shipment.lastUpdated), 'dd MMM, HH:mm', { locale: es })}
              </td>
              <td className="table-cell text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/shipments/${shipment.id}`}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-primary transition hover:bg-[rgba(0,115,255,0.12)] focus-visible:focus-ring"
                    title="Ver detalle"
                  >
                    Ver
                  </Link>
                  <button
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-muted transition hover:bg-[rgba(255,255,255,0.08)] hover:text-strong focus-visible:focus-ring"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(shipment.id)}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-[rgba(255,76,76,0.95)] transition hover:bg-[rgba(255,76,76,0.12)] focus-visible:focus-ring"
                    title="Eliminar"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {shipments.length === 0 && <div className="p-6 text-center text-sm text-muted">No tenés envíos todavía.</div>}
    </div>
  );
};
