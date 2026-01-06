'use client';

import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { StatusBadge } from '@/components/StatusBadge';
import { Timeline } from '@/components/Timeline';
import { useAuthGuard } from '@/lib/hooks';
import { detectCourier } from '@/lib/detection';
import { applyPrefilledShipment, getShipments, simulateProgress } from '@/lib/storage';
import { Courier, Shipment } from '@/lib/types';
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ShipmentDetailPage({ params }: { params: { id: string } }) {
  const ready = useAuthGuard();
  const router = useRouter();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [autoSynced, setAutoSynced] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const data = getShipments().find((s) => s.id === params.id) || null;
    setShipment(data);
  }, [params.id, ready]);

  const fetchAndreani = async (shipmentCode: string) => {
    const response = await fetch('/api/track/andreani', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code: shipmentCode }),
    });
    if (response.status === 404) {
      throw new Error('NOT_FOUND');
    }
    if (!response.ok) {
      throw new Error('FETCH_FAILED');
    }
    return response.json();
  };

  const handleSimulate = () => {
    if (!shipment) return;
    simulateProgress(shipment.id);
    const updated = getShipments().find((s) => s.id === shipment.id) || null;
    setShipment(updated);
  };

  const handleSyncAndreani = async () => {
    if (!shipment) return;
    setSyncError('');
    setSyncing(true);
    try {
      const tracking = await fetchAndreani(shipment.code);
      const updated = applyPrefilledShipment(shipment.id, {
        courier: Courier.ANDREANI,
        status: tracking.status,
        events: tracking.events,
        origin: tracking.origin,
        destination: tracking.destination,
        eta: tracking.eta,
        lastUpdated: tracking.lastUpdated,
      });
      if (updated) {
        setShipment(updated);
      }
    } catch (err) {
      const reason = (err as Error).message;
      if (reason === 'NOT_FOUND') {
        setSyncError('No encontramos este envío en Andreani.');
      } else {
        setSyncError('No pudimos actualizar desde Andreani. Probá más tarde.');
      }
    } finally {
      setSyncing(false);
    }
  };

  const canSyncAndreani =
    shipment &&
    (shipment.courier === Courier.ANDREANI || detectCourier(shipment.code) === Courier.ANDREANI);

  useEffect(() => {
    if (!canSyncAndreani || autoSynced) return;
    // Auto-intentar sincronizar apenas se detecte Andreani y no haya sincronizado aún.
    handleSyncAndreani().finally(() => setAutoSynced(true));
  }, [canSyncAndreani, autoSynced]);

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
              {canSyncAndreani ? (
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <button onClick={handleSyncAndreani} className="btn-primary rounded-xl px-4 py-2" disabled={syncing}>
                      <ArrowPathIcon className="mr-1 inline h-4 w-4" />{' '}
                      {syncing ? 'Actualizando...' : 'Actualizar desde Andreani'}
                    </button>
                    <p className="text-sm text-slate-600">Trae el estado real de Andreani para este envío.</p>
                  </div>
                  {syncError && <p className="text-sm text-amber-700">{syncError}</p>}
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-3">
                  <button onClick={handleSimulate} className="btn-primary rounded-xl px-4 py-2">
                    <ArrowPathIcon className="mr-1 inline h-4 w-4" /> Simular actualización
                  </button>
                  <p className="text-sm text-slate-600">Cada click avanza el estado y agrega un evento.</p>
                </div>
              )}
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
