'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuth, setPlan, getPlan, consumeRedirectPath, setRedirectPath } from '@/lib/storage';

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
          <p className="text-xs font-semibold uppercase text-slate-500">Iniciá sesión</p>
          <h1 className="text-2xl font-bold text-slate-900">Entrá para guardar tu seguimiento</h1>
          <p className="text-sm text-slate-600">
            {reason === 'save'
              ? 'Creá una cuenta para guardar envíos, recibir alertas y sincronizar en todos tus dispositivos.'
              : 'Accedé al panel y conectá tus couriers cuando estés listo.'}
          </p>
        </div>
        <div className="space-y-3">
          <button onClick={login} className="btn-primary w-full rounded-xl px-4 py-3 text-base">
            Continuar con Google
          </button>
          <button onClick={login} className="btn-secondary w-full rounded-xl px-4 py-3 text-base">
            Continuar con Apple
          </button>
          <p className="text-xs text-slate-500 text-center">Simulación de login. Se usa auth mock.</p>
        </div>
        <button onClick={() => router.replace('/')} className="btn-secondary w-full justify-center rounded-xl px-4 py-2">
          Cancelar y volver
        </button>
      </div>
    </main>
  );
}
