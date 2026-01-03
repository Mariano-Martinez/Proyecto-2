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
};

export const ShipmentTable = ({ shipments, onDelete, selectable, selectedIds, onToggleSelect }: Props) => {
  const copy = (code: string) => navigator.clipboard?.writeText(code);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="min-w-full bg-white">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
          <tr>
            {selectable && <th className="table-cell">Sel.</th>}
            <th className="table-cell">Alias</th>
            <th className="table-cell">Courier</th>
            <th className="table-cell">Código</th>
            <th className="table-cell">Estado</th>
            <th className="table-cell">Actualizado</th>
            <th className="table-cell text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="border-t border-slate-100">
              {selectable && (
                <td className="table-cell">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-sky-600"
                    checked={selectedIds?.has(shipment.id)}
                    onChange={() => onToggleSelect?.(shipment.id)}
                  />
                </td>
              )}
              <td className="table-cell font-semibold text-slate-900">{shipment.alias}</td>
              <td className="table-cell">{shipment.courier}</td>
              <td className="table-cell">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-700">{shipment.code}</span>
                  <button
                    onClick={() => copy(shipment.code)}
                    className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
                    aria-label="Copiar código"
                  >
                    <ClipboardDocumentIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
              <td className="table-cell"><StatusBadge status={shipment.status} /></td>
              <td className="table-cell text-sm text-slate-600">
                {format(new Date(shipment.lastUpdated), 'dd MMM, HH:mm', { locale: es })}
              </td>
              <td className="table-cell text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/shipments/${shipment.id}`}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                  >
                    Ver
                  </Link>
                  <button className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(shipment.id)}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
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
        <div className="p-6 text-center text-sm text-slate-600">No tenés envíos todavía.</div>
      )}
    </div>
  );
};
