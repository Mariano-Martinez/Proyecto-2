'use client';

import { Shipment } from '@/lib/types';
import { Copy, MoreHorizontal, Trash2 } from 'lucide-react';
import { Panel } from '@/components/ui/Panel';
import { StatusBadge } from '@/components/ui/StatusBadge';

type ShipmentsTableProps = {
  shipments: Shipment[];
  onDelete: (id: string) => void;
  onCopy: (code: string) => void;
};

export const ShipmentsTable = ({ shipments, onDelete, onCopy }: ShipmentsTableProps) => {
  return (
    <Panel className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[rgb(var(--panel-border))] text-xs uppercase tracking-wide text-[rgb(var(--muted-foreground))]">
            <tr>
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
                <td className="px-4 py-4 text-[rgb(var(--muted-foreground))]">{shipment.updatedAt}</td>
                <td className="px-4 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onCopy(shipment.code)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--panel-border))] text-[rgb(var(--muted-foreground))] transition hover:border-[rgb(var(--panel-hover-border))] hover:text-sky-400 active:scale-95"
                      aria-label="Copiar código"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(shipment.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--panel-border))] text-[rgb(var(--muted-foreground))] transition hover:border-[rgb(var(--panel-hover-border))] hover:text-rose-400 active:scale-95"
                      aria-label="Eliminar envío"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--panel-border))] text-[rgb(var(--muted-foreground))] transition hover:border-[rgb(var(--panel-hover-border))] hover:text-sky-400 active:scale-95"
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
        <div className="border-t border-[rgb(var(--panel-border))] px-6 py-6 text-center text-sm text-[rgb(var(--muted-foreground))]">
          No tenés envíos todavía. Cargá tu primer tracking.
        </div>
      )}
    </Panel>
  );
};
