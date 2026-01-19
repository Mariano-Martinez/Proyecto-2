'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuth, setPlan, getPlan, consumeRedirectPath, setRedirectPath, setUser } from '@/lib/storage';
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

  const login = (provider: 'Google' | 'Apple') => {
    setAuth(true);
    setPlan(getPlan());
    setUser({
      name: provider === 'Apple' ? 'Lucía Torres' : 'María González',
      email: provider === 'Apple' ? 'lucia@trackhub.ar' : 'maria@trackhub.ar',
      provider,
    });
    const redirect = consumeRedirectPath();
    router.replace(redirect || search.get('next') || '/dashboard');
  };

  const handleMicrosoft = () => {
    alert('Microsoft SSO (mock): aún no está conectado.');
  };

  const providerBtn =
    'flex h-12 w-full items-center gap-3 rounded-xl border border-subtle bg-surface-1 px-4 text-sm font-semibold text-default shadow-depth-sm transition hover:shadow-depth-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring)/0.35)]';

  return (
    <main className="flex min-h-screen items-center justify-center bg-layer-0 px-4">
      <div className="card w-full max-w-md space-y-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase text-muted">Accedé ahora</p>
          <h1 className="text-2xl font-bold text-default">Continuar gratis</h1>
          <p className="text-sm text-muted">
            {reason === 'save'
              ? 'Creá una cuenta para guardar envíos, recibir alertas y sincronizar en todos tus dispositivos.'
              : 'Accedé al panel y conectá tus couriers cuando estés listo.'}
          </p>
        </div>
        <div className="space-y-3">
          <button onClick={() => login('Google')} className={providerBtn}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 shadow-inset">
              <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
            </span>
            <span>Continuar con Google</span>
          </button>
          <button onClick={() => login('Apple')} className={providerBtn}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 shadow-inset">
              <Image src="/icons/apple.svg" alt="Apple" width={20} height={20} />
            </span>
            <span>Continuar con Apple</span>
          </button>
          <button type="button" onClick={handleMicrosoft} className={providerBtn}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 shadow-inset">
              <Image src="/icons/microsoft.svg" alt="Microsoft" width={20} height={20} />
            </span>
            <span>Continuar con Microsoft</span>
          </button>
          <p className="text-xs text-muted text-center">Plan Free incluido. Podés cancelar cuando quieras.</p>
        </div>
        <button onClick={() => router.replace('/')} className="btn-secondary w-full justify-center rounded-xl px-4 py-2">
          Cancelar y volver
        </button>
      </div>
    </main>
  );
}
