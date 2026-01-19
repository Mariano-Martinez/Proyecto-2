'use client';

import { detectCourier } from '@/lib/detection';
import { addShipment, applyPrefilledShipment, setRedirectPath, getAuth } from '@/lib/storage';
import { Courier, Shipment } from '@/lib/types';
import { getTrackingLastUpdated, mapTrackingEventsToTimelineEvents, mapTrackingStatusToShipmentStatus } from '@/lib/tracking/mapper';
import { CarrierId, TrackingNormalized } from '@/lib/tracking/types';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const courierOptions = Object.values(Courier);

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

export const AddShipmentModal = ({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [alias, setAlias] = useState('');
  const [courier, setCourier] = useState<Courier | 'auto'>('auto');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingShipmentId, setPendingShipmentId] = useState<string | null>(null);
  const [pendingCourier, setPendingCourier] = useState<Courier | null>(null);

  const detected = useMemo(() => detectCourier(code), [code]);

  if (!open) return null;

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

  const applyTrackingToShipment = (shipmentId: string, tracking: TrackingNormalized, carrierValue: Courier) => {
    const events = mapTrackingEventsToTimelineEvents(tracking.events, code.trim());
    return applyPrefilledShipment(shipmentId, {
      courier: carrierValue,
      status: mapTrackingStatusToShipmentStatus(tracking.status),
      events,
      lastUpdated: getTrackingLastUpdated(tracking),
    });
  };

  const finalizeShipmentWithTracking = (tracking: TrackingNormalized, carrierValue: Courier) => {
    const events = mapTrackingEventsToTimelineEvents(tracking.events, code.trim());
    if (events.length === 0) {
      setWarning('No encontramos eventos en la respuesta del courier. Revisá que el tracking tenga movimientos en la web.');
    }
    const prefilled: Partial<Shipment> = {
      courier: carrierValue,
      status: mapTrackingStatusToShipmentStatus(tracking.status),
      events,
      lastUpdated: getTrackingLastUpdated(tracking),
    };
    addShipment({ code, alias, courier: carrierValue, prefilled });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setWarning('');
    if (!getAuth()) {
      if (typeof window !== 'undefined') {
        setRedirectPath(window.location.pathname);
      }
      router.push('/login?reason=save');
      return;
    }
    setLoading(true);
    try {
      const selectedCourier = courier === 'auto' ? detected : courier;
      const resolvedCourier = selectedCourier === 'auto' ? Courier.UNKNOWN : selectedCourier;
      const carrierInfo = carrierConfig[resolvedCourier];

      if (!carrierInfo) {
        addShipment({ code, alias, courier: selectedCourier === 'auto' ? undefined : selectedCourier });
        onCreated();
        setCode('');
        setAlias('');
        setCourier('auto');
        onClose();
        return;
      }

      try {
        const tracking = await fetchTracking(carrierInfo.id, code.trim());
        finalizeShipmentWithTracking(tracking, resolvedCourier);
        onCreated();
        setPendingShipmentId(null);
        setPendingCourier(null);
        setCode('');
        setAlias('');
        setCourier('auto');
        onClose();
      } catch (err) {
        if (!pendingShipmentId) {
          const created = addShipment({ code, alias, courier: resolvedCourier });
          setPendingShipmentId(created.id);
          setPendingCourier(resolvedCourier);
        }
        if (err instanceof TrackingLookupError) {
          const friendly =
            err.kind === 'NOT_FOUND'
              ? err.message || `No encontramos este envío en ${carrierInfo.label}. Verificá el código.`
              : err.message || 'No pudimos consultar el courier en este momento. Probá más tarde.';
          setError(friendly);
          console.error('Tracking lookup failed', { message: err.message, status: err.status });
        } else {
          setError('No pudimos consultar el courier en este momento. Probá más tarde.');
          console.error('Tracking lookup failed', err);
        }
        setWarning(
          'No pudimos traer el estado ahora. El envío se creó igual. Podés intentar actualizarlo desde la pantalla del envío.'
        );
        setLoading(false);
        return;
      }
    } catch (err) {
      const message = (err as Error).message;
      if (message === 'PLAN_LIMIT') {
        setError('Alcanzaste el límite de tu plan. Actualizá para agregar más envíos.');
      } else {
        setError('No pudimos crear el envío. Verificá el código.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    if (!pendingShipmentId || !pendingCourier) return;
    const carrierInfo = carrierConfig[pendingCourier];
    if (!carrierInfo) return;
    setLoading(true);
    setError('');
    setWarning('');
    try {
      const tracking = await fetchTracking(carrierInfo.id, code.trim());
      applyTrackingToShipment(pendingShipmentId, tracking, pendingCourier);
      onCreated();
      setPendingShipmentId(null);
      setPendingCourier(null);
      setCode('');
      setAlias('');
      setCourier('auto');
      onClose();
    } catch (err) {
      if (err instanceof TrackingLookupError) {
        const friendly =
          err.kind === 'NOT_FOUND'
            ? err.message || `No encontramos este envío en ${carrierInfo.label}. Verificá el código.`
            : err.message || 'No pudimos consultar el courier en este momento. Probá más tarde.';
        setError(friendly);
        console.error('Tracking retry failed', { message: err.message, status: err.status });
      } else {
        setError('No pudimos consultar el courier en este momento. Probá más tarde.');
        console.error('Tracking retry failed', err);
      }
      setWarning(
        'No pudimos traer el estado ahora. El envío se creó igual. Podés intentar actualizarlo desde la pantalla del envío.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="card w-full max-w-lg p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Agregar tracking</h3>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <form className="mt-4 space-y-4" onSubmit={submit}>
          <div>
            <label className="label">Código de seguimiento</label>
            <input className="input mt-1" value={code} onChange={(e) => setCode(e.target.value)} required disabled={loading} />
            <p className="mt-1 text-xs text-slate-500">Detectado: {detected}</p>
          </div>
          <div>
            <label className="label">Alias</label>
            <input
              className="input mt-1"
              placeholder="Ej: Compra ML"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label className="label">Courier</label>
            <select
              className="input mt-1"
              value={courier}
              onChange={(e) => setCourier(e.target.value as Courier | 'auto')}
              disabled={loading}
            >
              <option value="auto">Auto-detectar</option>
              {courierOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              <p>{error}</p>
              <button
                type="button"
                className="font-semibold underline"
                onClick={() => {
                  setRedirectPath('/dashboard');
                  router.push('/pricing');
                }}
              >
                Ver planes
              </button>
            </div>
          )}
          {warning && (
            <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-800">
              <p>{warning}</p>
              <p className="mt-1 text-xs text-slate-600">
                Si la web del courier muestra eventos y acá no, abrí la consola (F12) y copiá el HTML/XHR que trae los datos para ajustar el parser.
              </p>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn-secondary rounded-xl px-4 py-2" disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary rounded-xl px-4 py-2" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
          {!loading && pendingShipmentId && (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
              <span>El envío quedó creado, pero aún no pudimos traer el estado.</span>
              <button type="button" className="font-semibold text-slate-900 underline" onClick={handleRetry}>
                Reintentar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
