'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { ShipmentTable } from '@/components/ShipmentTable';
import { ShipmentCard } from '@/components/ShipmentCard';
import { AddShipmentModal } from '@/components/AddShipmentModal';
import { useAuthGuard } from '@/lib/hooks';
import { deleteShipment, getShipments, getUsage } from '@/lib/storage';
import { Shipment, ShipmentStatus } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import { TopBar } from '@/components/TopBar';
import Link from 'next/link';

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
    deleteShipment(id);
    refresh();
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
    <div className="min-h-screen bg-slate-50">
      <div className="lg:flex lg:min-h-screen">
        <Sidebar />
        <main className="flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-12 lg:pt-8">
          <TopBar />
          <div className="mt-6 flex flex-col gap-8">
            <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-sky-50 p-4">
                <p className="text-sm font-semibold text-slate-600">Plan actual</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{usage.plan}</p>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-sky-500"
                    style={{ width: `${Math.min((usage.active / usage.limit) * 100, 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {usage.active} / {usage.limit === Infinity ? '∞' : usage.limit} envíos activos
                </p>
                <Link href="/pricing" className="mt-3 inline-flex text-sm font-semibold text-sky-700">
                  Upgrade
                </Link>
              </div>
              {metricOrder.map((metric) => (
                <div key={metric.key} className="rounded-2xl border border-slate-100 bg-white p-4">
                  <p className="text-sm text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{metrics[metric.key] || 0}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Mis envíos</h2>
                <p className="text-sm text-slate-600">Vista tabla en desktop y cards en mobile.</p>
              </div>
              <button onClick={() => setOpen(true)} className="btn-primary hidden rounded-xl px-4 py-2 lg:inline-flex">
                Agregar tracking
              </button>
            </div>

            <div className="hidden lg:block">
              <ShipmentTable shipments={shipments} onDelete={handleDelete} />
            </div>
            <div className="space-y-3 lg:hidden">
              {shipments.map((shipment) => (
                <ShipmentCard key={shipment.id} shipment={shipment} onDelete={handleDelete} />
              ))}
              {shipments.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
                  No tenés envíos todavía. Cargá tu primer tracking.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
      <AddShipmentModal open={open} onClose={() => setOpen(false)} onCreated={refresh} />
    </div>
  );
}
