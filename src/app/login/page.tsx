'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuth, setPlan, getPlan, consumeRedirectPath, setRedirectPath } from '@/lib/storage';
import { PhoneIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const reason = search.get('reason');

  useEffect(() => {
    const next = search.get('next');
    if (next) {
      setRedirectPath(next);
    }
  }, [search]);

  const login = () => {
    setAuth(true);
    setPlan(getPlan());
    const redirect = consumeRedirectPath();
    router.replace(redirect || search.get('next') || '/dashboard');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="card w-full max-w-md space-y-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Accedé ahora</p>
          <h1 className="text-2xl font-bold text-slate-900">Continuar gratis</h1>
          <p className="text-sm text-slate-600">
            {reason === 'save'
              ? 'Creá una cuenta para guardar envíos, recibir alertas y sincronizar en todos tus dispositivos.'
              : 'Accedé al panel y conectá tus couriers cuando estés listo.'}
          </p>
        </div>
        <div className="space-y-3">
          <button onClick={login} className="btn-primary w-full justify-start gap-3 rounded-xl px-4 py-3 text-base">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-900">
              G
            </span>
            Continuar con Google
          </button>
          <button onClick={login} className="btn-secondary w-full justify-start gap-3 rounded-xl px-4 py-3 text-base">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              
            </span>
            Continuar con Apple
          </button>
          <button
            className="btn-secondary w-full justify-start gap-3 rounded-xl px-4 py-3 text-base opacity-70"
            type="button"
            disabled
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
              MS
            </span>
            Continuar con Microsoft
            <span className="ml-auto rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">Próx.</span>
          </button>
          <button
            className="btn-secondary w-full justify-start gap-3 rounded-xl px-4 py-3 text-base opacity-70"
            type="button"
            disabled
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700">
              <PhoneIcon className="h-4 w-4" />
            </span>
            Continuar con el teléfono
            <span className="ml-auto rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">Próx.</span>
          </button>
          <p className="text-xs text-slate-500 text-center">Plan Free incluido. Podés cancelar cuando quieras.</p>
        </div>
        <button onClick={() => router.replace('/')} className="btn-secondary w-full justify-center rounded-xl px-4 py-2">
          Cancelar y volver
        </button>
      </div>
    </main>
  );
}
