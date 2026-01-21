import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { StatusBadge } from './StatusBadge';
import { Shipment } from '@/lib/types';
import Link from 'next/link';
import { ArrowUpRightIcon, ClipboardDocumentIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Panel } from '@/components/ui/Panel';

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
    <Panel className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[rgb(var(--panel-border))] text-xs uppercase tracking-wide text-[rgb(var(--muted-foreground))]">
            <tr>
              {selectable && <th className="px-4 py-4">Sel.</th>}
              <th className="px-4 py-4">Alias</th>
              <th className="px-4 py-4">Courier</th>
              <th className="px-4 py-4">Código</th>
              <th className="px-4 py-4">Estado</th>
              <th className="px-4 py-4">Actualizado</th>
              <th className="px-4 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgb(var(--panel-border))]">
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="text-[rgb(var(--foreground))] transition hover:bg-slate-50 dark:hover:bg-white/5">
                {selectable && (
                  <td className="px-4 py-4 align-middle">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-[rgb(var(--border))] bg-[rgb(var(--panel-bg))] text-sky-500"
                      checked={selectedIds?.has(shipment.id)}
                      onChange={() => onToggleSelect?.(shipment.id)}
                    />
                  </td>
                )}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-400" />
                    <span className="font-semibold">{shipment.alias}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-[rgb(var(--muted-foreground))]">{shipment.courier}</td>
                <td className="px-4 py-4 text-[rgb(var(--muted-foreground))]">{shipment.code}</td>
                <td className="px-4 py-4">
                  <StatusBadge status={shipment.status} />
                </td>
                <td className="px-4 py-4 text-[rgb(var(--muted-foreground))]">
                  {format(new Date(shipment.lastUpdated), 'dd MMM, HH:mm', { locale: es })}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      href={`/shipments/${shipment.id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgb(var(--panel-border))] text-[rgb(var(--muted-foreground))] transition hover:border-[rgb(var(--panel-hover-border))] hover:text-sky-400 active:scale-95"
                      aria-label="Ver envío"
                    >
                      <ArrowUpRightIcon className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => copy(shipment.code)}
                      className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgb(var(--panel-border))] text-[rgb(var(--muted-foreground))] transition hover:border-[rgb(var(--panel-hover-border))] hover:text-sky-400 active:scale-95"
                      aria-label="Copiar código"
                    >
                      <ClipboardDocumentIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(shipment.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgb(var(--panel-border))] text-[rgb(var(--muted-foreground))] transition hover:border-[rgb(var(--panel-hover-border))] hover:text-rose-400 active:scale-95"
                      aria-label="Eliminar envío"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
        </table>
      </div>
      {shipments.length === 0 && (
        <div className="border-t border-[rgb(var(--panel-border))] px-6 py-6 text-center text-sm text-[rgb(var(--muted-foreground))]">
          No tenés envíos todavía.
        </div>
      )}
    </Panel>
  );
};
