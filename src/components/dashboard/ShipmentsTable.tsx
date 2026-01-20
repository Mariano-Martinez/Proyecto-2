'use client';

import { Shipment, ShipmentStatus } from '@/lib/types';
import { Copy, MoreHorizontal, Trash2 } from 'lucide-react';

const statusStyles: Record<ShipmentStatus, { label: string; className: string }> = {
  [ShipmentStatus.DELIVERED]: {
    label: 'Entregado',
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  [ShipmentStatus.IN_TRANSIT]: {
    label: 'En Tránsito',
    className: 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  [ShipmentStatus.CUSTOMS]: {
    label: 'En Aduana',
    className: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  [ShipmentStatus.ISSUE]: {
    label: 'Problema',
    className: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400',
  },
};

type ShipmentsTableProps = {
  shipments: Shipment[];
  onDelete: (id: string) => void;
  onCopy: (code: string) => void;
};

export const ShipmentsTable = ({ shipments, onDelete, onCopy }: ShipmentsTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[rgb(var(--border))] text-xs uppercase tracking-wide text-[rgb(var(--muted-foreground))]">
            <tr>
              <th className="px-4 py-4">Alias</th>
              <th className="px-4 py-4">Courier</th>
              <th className="px-4 py-4">Código</th>
              <th className="px-4 py-4">Estado</th>
              <th className="px-4 py-4">Actualizado</th>
              <th className="px-4 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgb(var(--border))]">
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="text-[rgb(var(--foreground))]">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-400" />
                    <span className="font-semibold">{shipment.alias}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-[rgb(var(--muted-foreground))]">{shipment.courier}</td>
                <td className="px-4 py-4 text-[rgb(var(--muted-foreground))]">{shipment.code}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                      statusStyles[shipment.status].className
                    }`}
                  >
                    {statusStyles[shipment.status].label}
                  </span>
                </td>
                <td className="px-4 py-4 text-[rgb(var(--muted-foreground))]">{shipment.updatedAt}</td>
                <td className="px-4 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onCopy(shipment.code)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--border))] text-[rgb(var(--muted-foreground))] transition hover:text-sky-400"
                      aria-label="Copiar código"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(shipment.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--border))] text-[rgb(var(--muted-foreground))] transition hover:text-rose-400"
                      aria-label="Eliminar envío"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--border))] text-[rgb(var(--muted-foreground))] transition hover:text-sky-400"
                      aria-label="Más opciones"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {shipments.length === 0 && (
        <div className="border-t border-[rgb(var(--border))] px-6 py-6 text-center text-sm text-[rgb(var(--muted-foreground))]">
          No tenés envíos todavía. Cargá tu primer tracking.
        </div>
      )}
    </div>
  );
};
