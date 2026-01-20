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
    <div className="panel overflow-hidden rounded-2xl">
      <table className="min-w-full bg-[rgb(var(--panel-bg))]">
        <thead className="sticky top-0 z-10 bg-[rgb(var(--muted))] text-left text-xs uppercase text-[rgb(var(--muted-foreground))] shadow-sm">
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
        <tbody className="divide-y divide-[rgb(var(--border))]">
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="ui-row-hover hover:bg-[rgb(var(--muted))]">
              {selectable && (
                <td className="table-cell align-middle">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[rgb(var(--border))] bg-[rgb(var(--panel-bg))] text-sky-500"
                    checked={selectedIds?.has(shipment.id)}
                    onChange={() => onToggleSelect?.(shipment.id)}
                  />
                </td>
              )}
              <td className="table-cell font-semibold text-[rgb(var(--foreground))]">{shipment.alias}</td>
              <td className="table-cell text-[rgb(var(--muted-foreground))]">{shipment.courier}</td>
              <td className="table-cell">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-[rgb(var(--muted))] px-2 py-1 font-mono text-xs font-semibold text-[rgb(var(--foreground))] ring-1 ring-[rgb(var(--border))]">
                    {shipment.code}
                  </span>
                  <button
                    onClick={() => copy(shipment.code)}
                    className="ui-transition ui-icon-press ui-focus-ring rounded-lg p-1 text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
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
              <td className="table-cell text-sm text-[rgb(var(--muted-foreground))]">
                {format(new Date(shipment.lastUpdated), 'dd MMM, HH:mm', { locale: es })}
              </td>
              <td className="table-cell text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/shipments/${shipment.id}`}
                    className="ui-transition ui-focus-ring rounded-lg px-2 py-1 text-xs font-semibold text-sky-600 hover:bg-sky-500/10 hover:text-sky-400"
                    title="Ver detalle"
                  >
                    Ver
                  </Link>
                  <button
                    className="ui-transition ui-icon-press ui-focus-ring rounded-lg px-2 py-1 text-xs font-semibold text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(shipment.id)}
                    className="ui-transition ui-icon-press ui-focus-ring rounded-lg px-2 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 hover:text-rose-400"
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
        <div className="p-6 text-center text-sm text-[rgb(var(--muted-foreground))]">No tenés envíos todavía.</div>
      )}
    </div>
  );
};
