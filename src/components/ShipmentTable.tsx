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
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <table className="min-w-full bg-white">
        <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs uppercase text-slate-500 shadow-sm">
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
        <tbody className="divide-y divide-slate-100">
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="transition hover:bg-slate-50">
              {selectable && (
                <td className="table-cell align-middle">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-sky-600"
                    checked={selectedIds?.has(shipment.id)}
                    onChange={() => onToggleSelect?.(shipment.id)}
                  />
                </td>
              )}
              <td className="table-cell font-semibold text-slate-900">{shipment.alias}</td>
              <td className="table-cell text-slate-700">{shipment.courier}</td>
              <td className="table-cell">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-slate-50 px-2 py-1 font-mono text-xs font-semibold text-slate-800 ring-1 ring-slate-200">
                    {shipment.code}
                  </span>
                  <button
                    onClick={() => copy(shipment.code)}
                    className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
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
              <td className="table-cell text-sm text-slate-600">
                {format(new Date(shipment.lastUpdated), 'dd MMM, HH:mm', { locale: es })}
              </td>
              <td className="table-cell text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/shipments/${shipment.id}`}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-50 hover:text-sky-800"
                    title="Ver detalle"
                  >
                    Ver
                  </Link>
                  <button
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(shipment.id)}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
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
        <div className="p-6 text-center text-sm text-slate-600">No tenés envíos todavía.</div>
      )}
    </div>
  );
};
