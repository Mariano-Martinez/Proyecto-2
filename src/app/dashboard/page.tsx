'use client';

import { useEffect, useMemo, useState } from 'react';
import { ShipmentTable } from '@/components/ShipmentTable';
import { ShipmentCard } from '@/components/ShipmentCard';
import { AddShipmentModal } from '@/components/AddShipmentModal';
import { useAuthGuard } from '@/lib/hooks';
import { deleteShipment, getShipments, getUsage } from '@/lib/storage';
import { Shipment, ShipmentStatus } from '@/lib/types';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { Toast, useToast } from '@/components/Toast';

const metricOrder: { key: ShipmentStatus; label: string }[] = [
  { key: ShipmentStatus.IN_TRANSIT, label: 'En tránsito' },
  { key: ShipmentStatus.DELIVERED, label: 'Entregado' },
  { key: ShipmentStatus.CUSTOMS, label: 'En aduana' },
  { key: ShipmentStatus.ISSUE, label: 'Problemas' },
];

export default function DashboardPage() {
  const ready = useAuthGuard();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [open, setOpen] = useState(false);
  const [usage, setUsage] = useState<{ active: number; limit: number; plan: string }>({ active: 0, limit: 3, plan: 'FREE' });
  const { toast, showToast, clearToast } = useToast();

  useEffect(() => {
    if (!ready) return;
    setShipments(getShipments());
    setUsage(getUsage());
  }, [ready]);

  const refresh = () => {
    setShipments(getShipments());
    setUsage(getUsage());
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('¿Eliminar este envío?')) return;
    deleteShipment(id);
    refresh();
    showToast('Envío eliminado');
  };

  const metrics = useMemo(() => {
    const counts: Record<string, number> = {};
    shipments.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return counts;
  }, [shipments]);

  if (!ready) return null;

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-primary">Resumen</p>
          <h1 className="text-3xl font-black text-default">Dashboard</h1>
          <p className="text-sm text-muted">Seguimiento rápido de tu operación y próximos pasos.</p>
        </div>

        <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3 rounded-xl border border-[hsl(var(--primary)/0.25)] bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.18),_transparent_55%)] p-4 shadow-depth-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted">Plan actual</p>
              <span className="rounded-full bg-surface-0 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-[hsl(var(--primary)/0.2)]">
                Uso
              </span>
            </div>
            <p className="text-xl font-bold text-default">{usage.plan}</p>
            <div className="h-2 w-full rounded-full bg-[hsl(var(--border))] shadow-inset">
              <div
                className="h-2 rounded-full bg-[hsl(var(--primary))] transition-all"
                style={{ width: `${Math.min((usage.active / usage.limit) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted">
              {usage.active} / {usage.limit === Infinity ? '∞' : usage.limit} envíos activos
            </p>
            <Link href="/pricing" className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary">
              Ver planes
            </Link>
          </div>
          {metricOrder.map((metric) => (
            <div key={metric.key} className="flex flex-col justify-between rounded-xl border border-subtle bg-surface-0 p-4 shadow-depth-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">{metric.label}</p>
                <p className="mt-2 text-3xl font-bold text-default">{metrics[metric.key] || 0}</p>
              </div>
              <p className="text-xs font-medium text-muted">Últimos 7 días</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-default">Mis envíos</h2>
            <p className="text-sm text-muted">Vista tabla en desktop y cards en mobile.</p>
          </div>
          <button onClick={() => setOpen(true)} className="btn-primary rounded-xl px-4 py-2">
            Agregar tracking
          </button>
        </div>

        <div className="hidden lg:block">
          <ShipmentTable shipments={shipments} onDelete={handleDelete} onCopy={() => showToast('Código copiado')} />
        </div>
        <div className="space-y-3 lg:hidden">
          {shipments.map((shipment) => (
            <ShipmentCard key={shipment.id} shipment={shipment} onDelete={handleDelete} onCopy={() => showToast('Código copiado')} />
          ))}
          {shipments.length === 0 && (
            <div className="rounded-2xl border border-dashed border-subtle bg-surface-0 p-6 text-center text-sm text-muted">
              No tenés envíos todavía. Cargá tu primer tracking.
            </div>
          )}
        </div>
      </div>
      <AddShipmentModal open={open} onClose={() => setOpen(false)} onCreated={refresh} />
      <Toast toast={toast} onClose={clearToast} />
    </AppShell>
  );
}
