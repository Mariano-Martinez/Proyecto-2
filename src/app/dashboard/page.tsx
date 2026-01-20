'use client';

import { useEffect, useMemo, useState } from 'react';
import { AddShipmentModal } from '@/components/AddShipmentModal';
import { useAuthGuard } from '@/lib/hooks';
import { deleteShipment, getShipments } from '@/lib/storage';
import { Shipment, ShipmentStatus } from '@/lib/types';
import { AppShell } from '@/components/layout/AppShell';
import { Toast, useToast } from '@/components/Toast';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { ShipmentsActivityChart } from '@/components/dashboard/ShipmentsActivityChart';
import { RecentShipmentsList } from '@/components/dashboard/RecentShipmentsList';
import { ShipmentsTable } from '@/components/dashboard/ShipmentsTable';
import { ShipmentCard } from '@/components/ShipmentCard';
import { AlertTriangle, CheckCircle2, Clock, Layers, Truck } from 'lucide-react';

const metricOrder: { key: ShipmentStatus; label: string }[] = [
  { key: ShipmentStatus.IN_TRANSIT, label: 'En Tránsito' },
  { key: ShipmentStatus.DELIVERED, label: 'Entregados' },
  { key: ShipmentStatus.CUSTOMS, label: 'En Aduana' },
  { key: ShipmentStatus.ISSUE, label: 'Problemas' },
];

export default function DashboardPage() {
  const ready = useAuthGuard();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [open, setOpen] = useState(false);
  const { toast, showToast, clearToast } = useToast();

  useEffect(() => {
    if (!ready) return;
    setShipments(getShipments());
  }, [ready]);

  const refresh = () => {
    setShipments(getShipments());
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('¿Eliminar este envío?')) return;
    deleteShipment(id);
    refresh();
    showToast('Envío eliminado');
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => null);
    showToast('Código copiado');
  };

  const metrics = useMemo(() => {
    const counts: Record<string, number> = {};
    shipments.forEach((shipment) => {
      counts[shipment.status] = (counts[shipment.status] || 0) + 1;
    });
    return counts;
  }, [shipments]);

  if (!ready) return null;

  const kpiConfigs = [
    {
      title: metricOrder[0].label,
      value: metrics[ShipmentStatus.IN_TRANSIT] || 0,
      trend: '↗ +12% vs última semana',
      icon: Truck,
      accentClass: 'bg-sky-500/15 text-sky-500 dark:text-sky-300',
    },
    {
      title: metricOrder[1].label,
      value: metrics[ShipmentStatus.DELIVERED] || 0,
      trend: '↗ +12% vs última semana',
      icon: CheckCircle2,
      accentClass: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-300',
    },
    {
      title: metricOrder[2].label,
      value: metrics[ShipmentStatus.CUSTOMS] || 0,
      trend: '↗ +12% vs última semana',
      icon: Layers,
      accentClass: 'bg-amber-500/15 text-amber-500 dark:text-amber-300',
    },
    {
      title: metricOrder[3].label,
      value: metrics[ShipmentStatus.ISSUE] || 0,
      trend: '↗ +12% vs última semana',
      icon: AlertTriangle,
      accentClass: 'bg-rose-500/15 text-rose-500 dark:text-rose-300',
    },
  ];

  return (
    <AppShell onPrimaryAction={() => setOpen(true)} primaryActionLabel="Agregar Tracking">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[30px] font-bold leading-[36px] tracking-[-0.75px] text-[rgb(var(--foreground))]">
              Panel Operativo
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[rgb(var(--panel-border))] bg-[rgb(var(--panel-bg))] px-4 py-2 text-xs font-semibold text-[rgb(var(--muted-foreground))] transition hover:border-[rgb(var(--panel-hover-border))]">
            <Clock className="h-4 w-4" />
            Actualizado hace 5 minutos
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpiConfigs.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <ShipmentsActivityChart />
          <RecentShipmentsList />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[rgb(var(--foreground))]">Mis envíos</h2>
            <p className="text-sm text-[rgb(var(--muted-foreground))]">Gestiona y rastrea tus paquetes activos</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-[rgb(var(--panel-border))] bg-[rgb(var(--panel-bg))] px-4 py-2 text-xs font-semibold text-[rgb(var(--foreground))] transition hover:border-[rgb(var(--panel-hover-border))] hover:text-sky-400 active:scale-95">
              Exportar CSV
            </button>
            <button className="rounded-full border border-[rgb(var(--panel-border))] bg-[rgb(var(--panel-bg))] px-4 py-2 text-xs font-semibold text-[rgb(var(--foreground))] transition hover:border-[rgb(var(--panel-hover-border))] hover:text-sky-400 active:scale-95">
              Filtrar
            </button>
          </div>
        </div>

        <div className="hidden lg:block">
          <ShipmentsTable shipments={shipments} onDelete={handleDelete} onCopy={handleCopy} />
        </div>
        <div className="space-y-4 lg:hidden">
          {shipments.map((shipment) => (
            <ShipmentCard key={shipment.id} shipment={shipment} onDelete={handleDelete} onCopy={() => handleCopy(shipment.code)} />
          ))}
          {shipments.length === 0 && (
            <div className="panel p-6 text-center text-sm text-[rgb(var(--muted-foreground))]">
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
