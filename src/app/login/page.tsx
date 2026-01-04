'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuth, setPlan, getPlan, consumeRedirectPath, setRedirectPath } from '@/lib/storage';
import Image from 'next/image';

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

  const handleMicrosoft = () => {
    alert('Microsoft SSO (mock): aún no está conectado.');
  };

  const providerBtn =
    'flex h-12 w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500';

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
          <button onClick={login} className={providerBtn}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
            </span>
            <span>Continuar con Google</span>
          </button>
          <button onClick={login} className={providerBtn}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <Image src="/icons/apple.svg" alt="Apple" width={20} height={20} />
            </span>
            <span>Continuar con Apple</span>
          </button>
          <button type="button" onClick={handleMicrosoft} className={providerBtn}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <Image src="/icons/microsoft.svg" alt="Microsoft" width={20} height={20} />
            </span>
            <span>Continuar con Microsoft</span>
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
