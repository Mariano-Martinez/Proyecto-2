'use client';

import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { StatusBadge } from '@/components/StatusBadge';
import { Timeline } from '@/components/Timeline';
import { useAuthGuard, useAuthStatus } from '@/lib/hooks';
import { getShipments, simulateProgress, setRedirectPath } from '@/lib/storage';
import { Shipment } from '@/lib/types';
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ShipmentDetailPage({ params }: { params: { id: string } }) {
  const ready = useAuthGuard({ allowGuest: true });
  const isAuthed = useAuthStatus();
  const router = useRouter();
  const [shipment, setShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    if (!ready) return;
    const data = getShipments().find((s) => s.id === params.id) || null;
    setShipment(data);
  }, [params.id, ready]);

  const handleSimulate = () => {
    if (!shipment) return;
    if (!isAuthed) {
      setRedirectPath(`/shipments/${params.id}`);
      router.push(`/login?reason=save&next=${encodeURIComponent(`/shipments/${params.id}`)}`);
      return;
    }
    simulateProgress(shipment.id);
    const updated = getShipments().find((s) => s.id === shipment.id) || null;
    setShipment(updated);
  };

  if (!ready) return null;

  if (!shipment) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="lg:flex lg:min-h-screen">
          <Sidebar />
          <main className="flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-12">
            <button onClick={() => router.back()} className="btn-secondary mb-4 rounded-xl px-4 py-2">
              <ArrowLeftIcon className="mr-1 inline h-4 w-4" /> Volver
            </button>
            <div className="card p-6 text-sm text-slate-700">Envío no encontrado.</div>
          </main>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="lg:flex lg:min-h-screen">
        <Sidebar />
        <main className="flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-12">
          <button onClick={() => router.back()} className="btn-secondary mb-4 rounded-xl px-4 py-2">
            <ArrowLeftIcon className="mr-1 inline h-4 w-4" /> Volver
          </button>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="card space-y-3 p-5 lg:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-600">{shipment.courier}</p>
                  <h1 className="text-2xl font-bold text-slate-900">{shipment.alias}</h1>
                  <p className="font-mono text-sm text-slate-700">{shipment.code}</p>
                </div>
                <StatusBadge status={shipment.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-700 sm:grid-cols-4">
                <div>
                  <p className="text-xs uppercase text-slate-500">Origen</p>
                  <p className="font-semibold">{shipment.origin}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500">Destino</p>
                  <p className="font-semibold">{shipment.destination}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500">ETA</p>
                  <p className="font-semibold">{shipment.eta}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500">Última actualización</p>
                  <p className="font-semibold">{new Date(shipment.lastUpdated).toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button onClick={handleSimulate} className="btn-primary rounded-xl px-4 py-2">
                  <ArrowPathIcon className="mr-1 inline h-4 w-4" /> Simular actualización
                </button>
                <p className="text-sm text-slate-600">Cada click avanza el estado y agrega un evento.</p>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-lg font-bold text-slate-900">Timeline</h3>
              <Timeline events={shipment.events} />
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
