'use client';

import { detectCourier } from '@/lib/detection';
import { addShipment, setRedirectPath, getAuth } from '@/lib/storage';
import { Courier } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const courierOptions = Object.values(Courier);

export const AddShipmentModal = ({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [alias, setAlias] = useState('');
  const [courier, setCourier] = useState<Courier | 'auto'>('auto');
  const [error, setError] = useState('');
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
    if (response.status === 404) {
      const message = payload?.error ?? 'Envío no encontrado';
      throw new Error(`NOT_FOUND:${message}`);
    }
    if (!response.ok) {
      const message = payload?.details || payload?.error || `HTTP ${response.status}`;
      throw new Error(`FETCH_FAILED:${message}`);
    }
    return payload;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
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
          prefilled = {
            courier: Courier.ANDREANI,
            status: tracking.status,
            events: tracking.events,
            origin: tracking.origin,
            destination: tracking.destination,
            eta: tracking.eta,
            lastUpdated: tracking.lastUpdated,
          };
        } catch (err) {
          const reason = (err as Error).message;
          if (reason.startsWith('NOT_FOUND')) {
            setError(reason.split(':').slice(1).join(':') || 'No encontramos este envío en Andreani. Verificá el código.');
          } else if (reason.startsWith('FETCH_FAILED')) {
            setError(reason.split(':').slice(1).join(':') || 'No pudimos consultar Andreani en este momento. Probá más tarde.');
          } else {
            setError('No pudimos consultar Andreani en este momento. Probá más tarde.');
          }
          console.error('Andreani lookup failed', reason);
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
              {error}{' '}
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
