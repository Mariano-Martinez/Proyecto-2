'use client';

import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { StatusBadge } from '@/components/StatusBadge';
import { Timeline } from '@/components/Timeline';
import { useAuthGuard } from '@/lib/hooks';
import { detectCourier } from '@/lib/detection';
import { applyPrefilledShipment, getShipments, simulateProgress } from '@/lib/storage';
import { Courier, Shipment, ShipmentStatus } from '@/lib/types';
import {
  getTrackingLastUpdated,
  mapTimelineEventsToTrackingEvents,
  mapTrackingEventsToTimelineEvents,
  mapTrackingStatusToShipmentStatus,
} from '@/lib/tracking/mapper';
import { formatDateTimeEsAR } from '@/lib/tracking/dates';
import { CarrierId, TrackingNormalized } from '@/lib/tracking/types';
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

class TrackingLookupError extends Error {
  constructor(
    message: string,
    public kind: 'NOT_FOUND' | 'FETCH_FAILED',
    public details?: string,
    public status?: number,
    public debugInfo?: any
  ) {
    super(message);
    this.name = 'TrackingLookupError';
  }
}

const carrierConfig: Record<Courier, { id: CarrierId; label: string } | null> = {
  [Courier.ANDREANI]: { id: 'andreani', label: 'Andreani' },
  [Courier.VIA_CARGO]: { id: 'viacargo', label: 'Via Cargo' },
  [Courier.URBANO]: { id: 'urbano', label: 'Urbano' },
  [Courier.OCA]: null,
  [Courier.CORREO_ARGENTINO]: { id: 'correoargentino', label: 'Correo Argentino' },
  [Courier.DHL]: null,
  [Courier.FEDEX]: null,
  [Courier.UPS]: null,
  [Courier.UNKNOWN]: null,
};

const enableMockTracking =
  process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ENABLE_MOCK_TRACKING === 'true';

export default function ShipmentDetailPage({ params }: { params: { id: string } }) {
  const ready = useAuthGuard();
  const router = useRouter();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [trackingData, setTrackingData] = useState<TrackingNormalized | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [syncWarning, setSyncWarning] = useState('');
  const [autoSynced, setAutoSynced] = useState(false);
  const lastUpdatedValue = trackingData ? getTrackingLastUpdated(trackingData) : shipment?.lastUpdated ?? '';
  const formattedLastUpdated =
    (lastUpdatedValue && formatDateTimeEsAR(lastUpdatedValue, 'full')) ||
    (lastUpdatedValue ? new Date(lastUpdatedValue).toLocaleString() : '');

  useEffect(() => {
    if (!ready) return;
    const data = getShipments().find((s) => s.id === params.id) || null;
    setShipment(data);
  }, [params.id, ready]);

  const fetchTracking = async (carrierId: CarrierId, shipmentCode: string): Promise<TrackingNormalized> => {
    const response = await fetch(
      `/api/tracking/refresh?carrier=${carrierId}&trackingNumber=${encodeURIComponent(shipmentCode)}`
    );
    const payload = await response.json().catch(() => ({}));
    if (response.status === 400) {
      const message = payload?.error ?? 'Número inválido';
      throw new TrackingLookupError(message, 'NOT_FOUND', undefined, response.status);
    }
    if (!response.ok || payload?.ok === false) {
      const message = payload?.error || 'No pudimos consultar el tracking';
      throw new TrackingLookupError(message, 'FETCH_FAILED', undefined, response.status);
    }
    return payload?.data as TrackingNormalized;
  };

  const handleSimulate = () => {
    if (!shipment) return;
    simulateProgress(shipment.id);
    const updated = getShipments().find((s) => s.id === shipment.id) || null;
    setShipment(updated);
  };

  const handleSync = async () => {
    if (!shipment) return;
    const detectedCourier = detectCourier(shipment.code);
    const resolvedCourier = carrierConfig[shipment.courier] ? shipment.courier : detectedCourier;
    const carrierInfo = carrierConfig[resolvedCourier];
    if (!carrierInfo) return;
    setSyncError('');
    setSyncWarning('');
    setSyncing(true);
    try {
      const tracking = await fetchTracking(carrierInfo.id, shipment.code);
      setTrackingData(tracking);
      const hasRealEvents = tracking.events.length > 0;
      if (!hasRealEvents) {
        setSyncWarning(
          `No encontramos eventos en la respuesta de ${carrierInfo.label}. Revisá que el tracking muestre eventos en la web.`
        );
      }
      const events = mapTrackingEventsToTimelineEvents(tracking.events, shipment.code);
      const updated = applyPrefilledShipment(shipment.id, {
        courier: resolvedCourier,
        status: mapTrackingStatusToShipmentStatus(tracking.status),
        eta: resolvedCourier === Courier.ANDREANI ? tracking.eta ?? undefined : undefined,
        events: hasRealEvents ? events : undefined,
        lastUpdated: getTrackingLastUpdated(tracking),
      });
      if (updated) {
        setShipment(updated);
      }
    } catch (err) {
      if (err instanceof TrackingLookupError) {
        const friendly =
          err.kind === 'NOT_FOUND'
            ? err.message || 'No encontramos este envío en el courier.'
            : err.message || 'No pudimos actualizar el tracking. Probá más tarde.';
        setSyncError(friendly);
        console.error('Tracking sync failed', { message: err.message, status: err.status });
      } else {
        setSyncError('No pudimos actualizar el tracking. Probá más tarde.');
        console.error('Tracking sync failed', err);
      }
    } finally {
      setSyncing(false);
    }
  };

  const detectedCourier = shipment ? detectCourier(shipment.code) : Courier.UNKNOWN;
  const resolvedCourier = shipment && carrierConfig[shipment.courier] ? shipment.courier : detectedCourier;
  const carrierInfo = shipment ? carrierConfig[resolvedCourier] : null;
  const canSyncCarrier = Boolean(shipment && carrierInfo);
  const isAndreani = shipment?.courier === Courier.ANDREANI;
  const etaFromTracking = trackingData?.eta ?? shipment?.eta;
  const etaDisplay = isAndreani
    ? shipment?.status === ShipmentStatus.DELIVERED || !etaFromTracking || etaFromTracking === 'Próximamente'
      ? '-'
      : etaFromTracking
    : shipment?.eta ?? '';
  const trackingDetails = trackingData?.details;
  const detailItems = trackingDetails
    ? [
        { label: 'Servicio', value: trackingDetails.service },
        { label: 'Piezas', value: trackingDetails.pieces?.toString() },
        {
          label: 'Peso (kg)',
          value: trackingDetails.weightKg !== undefined && trackingDetails.weightKg !== null ? trackingDetails.weightKg.toString() : undefined,
        },
        { label: 'Origen (tracking)', value: trackingDetails.origin },
        { label: 'Destino (tracking)', value: trackingDetails.destination },
        { label: 'Firmado por', value: trackingDetails.signedByMasked ?? undefined },
      ].filter((item) => item.value)
    : [];

  useEffect(() => {
    if (!canSyncCarrier || autoSynced) return;
    // Auto-intentar sincronizar apenas se detecte un courier con tracking real.
    handleSync().finally(() => setAutoSynced(true));
  }, [canSyncCarrier, autoSynced]);

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
                  {trackingData && carrierInfo && (
                    <p className="text-sm text-slate-600">
                      Estado {carrierInfo.label}: {trackingData.statusLabel}
                    </p>
                  )}
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
                  <p className="font-semibold">{etaDisplay}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500">Última actualización</p>
                  <p className="font-semibold">{formattedLastUpdated}</p>
                </div>
              </div>
              {detailItems.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-700 sm:grid-cols-3">
                  {detailItems.map((item) => (
                    <div key={item.label}>
                      <p className="text-xs uppercase text-slate-500">{item.label}</p>
                      <p className="font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
              {canSyncCarrier && carrierInfo ? (
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <button onClick={handleSync} className="btn-primary rounded-xl px-4 py-2" disabled={syncing}>
                      <ArrowPathIcon className={`mr-1 inline h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />{' '}
                      {syncing ? 'Actualizando...' : `Actualizar desde ${carrierInfo.label}`}
                    </button>
                    <p className="text-sm text-slate-600">Trae el estado real de {carrierInfo.label} para este envío.</p>
                  </div>
                  {syncError && (
                    <div className="text-sm text-amber-700">
                      <p>{syncError}</p>
                    </div>
                  )}
                  {syncWarning && (
                    <div className="text-sm text-sky-700">
                      <p>{syncWarning}</p>
                      <p className="text-xs text-slate-600">
                        Si la web del courier muestra eventos y acá no, abrí la consola (F12) y copiá el HTML/XHR que trae los datos para ajustar el parser.
                      </p>
                    </div>
                  )}
                </div>
              ) : enableMockTracking ? (
                <div className="mt-4 flex items-center gap-3">
                  <button onClick={handleSimulate} className="btn-primary rounded-xl px-4 py-2">
                    <ArrowPathIcon className="mr-1 inline h-4 w-4" /> Simular actualización
                  </button>
                  <p className="text-sm text-slate-600">Cada click avanza el estado y agrega un evento.</p>
                </div>
              ) : (
                <div className="mt-4 text-sm text-slate-600">
                  La actualización en línea no está disponible para este courier.
                </div>
              )}
            </div>

            <div className="card p-5">
              <h3 className="text-lg font-bold text-slate-900">Timeline</h3>
              <Timeline events={trackingData?.events ?? mapTimelineEventsToTrackingEvents(shipment.events)} />
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
