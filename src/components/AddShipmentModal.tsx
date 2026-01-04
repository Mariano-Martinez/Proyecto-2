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

  const detected = useMemo(() => detectCourier(code), [code]);

  if (!open) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!getAuth()) {
      if (typeof window !== 'undefined') {
        setRedirectPath(window.location.pathname);
      }
      router.push('/login?reason=save');
      return;
    }
    try {
      addShipment({ code, alias, courier: courier === 'auto' ? undefined : courier });
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
            <button type="submit" className="btn-primary rounded-xl px-4 py-2">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
