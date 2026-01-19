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
    <div className="overflow-hidden rounded-2xl border border-subtle bg-[hsl(var(--surface-0)/0.95)] shadow-depth-sm">
      <table className="min-w-full">
        <thead className="sticky top-0 z-10 bg-[hsl(var(--bg-1)/0.9)] text-left text-xs uppercase text-muted shadow-inset backdrop-blur">
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
        <tbody className="divide-y divide-[hsl(var(--border))]">
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="transition hover:bg-[hsl(var(--surface-1)/0.7)]">
              {selectable && (
                <td className="table-cell align-middle">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-subtle text-[hsl(var(--primary))] focus-visible:ring-[hsl(var(--ring)/0.35)]"
                    checked={selectedIds?.has(shipment.id)}
                    onChange={() => onToggleSelect?.(shipment.id)}
                  />
                </td>
              )}
              <td className="table-cell font-semibold text-default">{shipment.alias}</td>
              <td className="table-cell text-muted">{shipment.courier}</td>
              <td className="table-cell">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-surface-1 px-2 py-1 font-mono text-xs font-semibold text-default ring-1 ring-[hsl(var(--border))]">
                    {shipment.code}
                  </span>
                  <button
                    onClick={() => copy(shipment.code)}
                    className="rounded-lg p-1 text-muted transition hover:bg-surface-1 hover:text-default"
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
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-primary transition hover:bg-[hsl(var(--primary)/0.12)]"
                    title="Ver detalle"
                  >
                    Ver
                  </Link>
                  <button
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-muted transition hover:bg-surface-1 hover:text-default"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(shipment.id)}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-[hsl(var(--danger))] transition hover:bg-[hsl(var(--danger)/0.12)]"
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
      {shipments.length === 0 && (
        <div className="p-6 text-center text-sm text-muted">No tenés envíos todavía.</div>
      )}
    </div>
  );
};
