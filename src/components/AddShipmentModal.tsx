'use client';

import { detectCourier } from '@/lib/detection';
import { addShipment, setRedirectPath, getAuth } from '@/lib/storage';
import { Courier } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const courierOptions = Object.values(Courier);

class AndreaniLookupError extends Error {
  constructor(
    message: string,
    public kind: 'NOT_FOUND' | 'FETCH_FAILED',
    public details?: string,
    public status?: number,
    public debugInfo?: any
  ) {
    super(message);
    this.name = 'AndreaniLookupError';
  }
}

export const AddShipmentModal = ({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [alias, setAlias] = useState('');
  const [courier, setCourier] = useState<Courier | 'auto'>('auto');
  const [error, setError] = useState('');
  const [errorDebug, setErrorDebug] = useState('');
  const [warning, setWarning] = useState('');
  const [warningDebug, setWarningDebug] = useState('');
  const [debugDump, setDebugDump] = useState('');
  const [loading, setLoading] = useState(false);

  const detected = useMemo(() => detectCourier(code), [code]);

  if (!open) return null;

  const fetchAndreani = async (shipmentCode: string) => {
    const response = await fetch('/api/track/andreani', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code: shipmentCode }),
    });
    const payload = await response.json().catch(() => ({}));
    const debugInfo = payload?.debugInfo;
    if (response.status === 404) {
      const message = payload?.error ?? 'Envío no encontrado';
      throw new AndreaniLookupError(message, 'NOT_FOUND', payload?.details, response.status, debugInfo);
    }
    if (!response.ok) {
      const message = payload?.error || 'No pudimos consultar Andreani';
      const details = payload?.details || buildDebugSummary(debugInfo) || `HTTP ${response.status}`;
      throw new AndreaniLookupError(message, 'FETCH_FAILED', details, response.status, debugInfo);
    }
    return payload;
  };

  const buildDebugSummary = (debugInfo: any) => {
    if (!debugInfo) return '';
    const parts: string[] = [];
    if (typeof debugInfo.eventsFromApi === 'number') parts.push(`eventsFromApi=${debugInfo.eventsFromApi}`);
    if (typeof debugInfo.eventsFromJson === 'number') parts.push(`eventsFromJson=${debugInfo.eventsFromJson}`);
    if (typeof debugInfo.eventsFromText === 'number') parts.push(`eventsFromText=${debugInfo.eventsFromText}`);
    if (typeof debugInfo.eventsFromLines === 'number') parts.push(`eventsFromLines=${debugInfo.eventsFromLines}`);
    if (typeof debugInfo.apiStatusV1 === 'number') parts.push(`apiStatusV1=${debugInfo.apiStatusV1}`);
    if (typeof debugInfo.apiStatusV3 === 'number') parts.push(`apiStatusV3=${debugInfo.apiStatusV3}`);
    if (typeof debugInfo.apiStatus === 'number') parts.push(`apiStatus=${debugInfo.apiStatus}`);
    if (typeof debugInfo.apiPayloadFound === 'boolean') parts.push(`apiPayloadFound=${debugInfo.apiPayloadFound}`);
    if (typeof debugInfo.apiCookieCaptured === 'boolean') parts.push(`apiCookieCaptured=${debugInfo.apiCookieCaptured}`);
    if (debugInfo.apiError) parts.push(`apiError=${debugInfo.apiError}`);
    return parts.join(', ');
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorDebug('');
    setWarning('');
    setWarningDebug('');
    setDebugDump('');
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
      let prefilled = undefined;
      if (selectedCourier === Courier.ANDREANI) {
        try {
          const tracking = await fetchAndreani(code.trim());
          const debugInfo = tracking?.debugInfo;
          setDebugDump(
            JSON.stringify(
              {
                code: code.trim(),
                status: tracking.status,
                events: tracking.events,
                debugInfo,
              },
              null,
              2
            )
          );
          const totalParsed =
            (debugInfo?.eventsFromApi ?? 0) +
            (debugInfo?.eventsFromJson ?? 0) +
            (debugInfo?.eventsFromText ?? 0) +
            (debugInfo?.eventsFromLines ?? 0);
          const hasRealEvents = Array.isArray(tracking.events) && tracking.events.some((ev: any) => !`${ev.id}`.endsWith('-fallback'));
          if (debugInfo && totalParsed === 0) {
            setWarning('No encontramos eventos en la respuesta de Andreani. Revisa que el tracking muestre eventos en la web.');
            setWarningDebug(
              `${buildDebugSummary(debugInfo)}, plainLength=${debugInfo.plainLength}, htmlLength=${debugInfo.htmlLength}, plainSample="${debugInfo.plainSample ?? ''}"`
            );
          }
          prefilled = {
            courier: Courier.ANDREANI,
            status: tracking.status,
            events: hasRealEvents ? tracking.events.filter((ev: any) => !`${ev.id}`.endsWith('-fallback')) : [],
            origin: tracking.origin,
            destination: tracking.destination,
            eta: tracking.eta,
            lastUpdated: tracking.lastUpdated,
          };
          } catch (err) {
            if (err instanceof AndreaniLookupError) {
              const friendly =
                err.kind === 'NOT_FOUND'
                  ? err.message || 'No encontramos este envío en Andreani. Verificá el código.'
                  : err.message || 'No pudimos consultar Andreani en este momento. Probá más tarde.';
              const debugFromResponse = (err as any)?.debugInfo;
              const debugDetails = debugFromResponse ? buildDebugSummary(debugFromResponse) : '';
              setError(friendly);
              setErrorDebug(err.details || debugDetails || `Status: ${err.status ?? 'n/d'}`);
              console.error('Andreani lookup failed', { message: err.message, details: err.details, status: err.status });
            } else {
              setError('No pudimos consultar Andreani en este momento. Probá más tarde.');
              setErrorDebug((err as Error)?.message ?? '');
              console.error('Andreani lookup failed', err);
          }
          setLoading(false);
          return;
        }
      }

      addShipment({ code, alias, courier: selectedCourier === 'auto' ? undefined : selectedCourier, prefilled });
      onCreated();
      setCode('');
      setAlias('');
      setCourier('auto');
      onClose();
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
            <input className="input mt-1" value={code} onChange={(e) => setCode(e.target.value)} required />
            <p className="mt-1 text-xs text-slate-500">Detectado: {detected}</p>
          </div>
          <div>
            <label className="label">Alias</label>
            <input className="input mt-1" placeholder="Ej: Compra ML" value={alias} onChange={(e) => setAlias(e.target.value)} />
          </div>
          <div>
            <label className="label">Courier</label>
            <select
              className="input mt-1"
              value={courier}
              onChange={(e) => setCourier(e.target.value as Courier | 'auto')}
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
              {errorDebug && <p className="mt-1 text-xs text-slate-600">Detalle técnico: {errorDebug}</p>}
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
              {warningDebug && <p className="mt-1 text-xs text-slate-600">Detalle técnico: {warningDebug}</p>}
              <p className="mt-1 text-xs text-slate-600">
                Si la web de Andreani muestra eventos y acá no, abrí la consola (F12) y copiá el HTML/XHR que trae los datos para ajustar el parser.
              </p>
              {debugDump && (
                <div className="mt-2 space-y-1 text-xs">
                  <button
                    type="button"
                    className="btn-secondary rounded-lg px-3 py-1 text-xs"
                    onClick={() => navigator.clipboard.writeText(debugDump)}
                  >
                    Copiar dump de depuración
                  </button>
                  <pre className="max-h-40 overflow-auto rounded bg-slate-100 p-2 text-[11px] text-slate-700">{debugDump}</pre>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn-secondary rounded-xl px-4 py-2">
              Cancelar
            </button>
            <button type="submit" className="btn-primary rounded-xl px-4 py-2" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
