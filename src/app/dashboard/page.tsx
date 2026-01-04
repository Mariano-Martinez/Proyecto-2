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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-600">Resumen</p>
            <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-600">Seguimiento rápido de tu operación y próximos pasos.</p>
          </div>
          <button onClick={() => setOpen(true)} className="btn-primary rounded-xl px-4 py-2">
            Agregar tracking
          </button>
        </div>

        <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3 rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50/80 via-white to-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Plan actual</p>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                Uso
              </span>
            </div>
            <p className="text-xl font-bold text-slate-900">{usage.plan}</p>
            <div className="h-2 w-full rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-sky-500 transition-all"
                style={{ width: `${Math.min((usage.active / usage.limit) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-600">
              {usage.active} / {usage.limit === Infinity ? '∞' : usage.limit} envíos activos
            </p>
            <Link href="/pricing" className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-sky-700 hover:text-sky-800">
              Ver planes
            </Link>
          </div>
          {metricOrder.map((metric) => (
            <div key={metric.key} className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{metric.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{metrics[metric.key] || 0}</p>
              </div>
              <p className="text-xs font-medium text-slate-500">Últimos 7 días</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Mis envíos</h2>
            <p className="text-sm text-slate-600">Vista tabla en desktop y cards en mobile.</p>
          </div>
          <button onClick={() => setOpen(true)} className="btn-secondary rounded-xl px-4 py-2">
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
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
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
