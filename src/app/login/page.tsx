'use client';

import { setAuth, setPlan, getPlan, setUser } from '@/lib/storage';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  const persistAuth = () => {
    setAuth(true);
    setPlan(getPlan());
  };

  const handleSocial = (provider: 'Google' | 'Apple') => {
    persistAuth();
    setUser({
      name: provider === 'Apple' ? 'Lucía Torres' : 'María González',
      email: provider === 'Apple' ? 'lucia@trackhub.ar' : 'maria@trackhub.ar',
      provider,
    });
    router.replace('/dashboard');
  };

  const handleMicrosoft = () => {
    alert('Microsoft SSO (mock): aún no está conectado.');
  };

  const providerBtn =
    'flex h-12 w-full items-center gap-3 rounded-xl border border-subtle bg-layer-1 px-4 text-sm font-semibold text-strong shadow-depth-sm transition hover-lift focus-visible:focus-ring';

  return (
    <main className="flex min-h-screen items-center justify-center bg-layer-0 px-4">
      <div className="card w-full max-w-md p-6">
        <div>
          <p className="text-xs font-semibold uppercase text-muted">Accedé ahora</p>
          <h1 className="text-2xl font-bold text-strong">Continuar gratis</h1>
          <p className="text-sm text-muted">
            {reason === 'save'
              ? 'Iniciá sesión para guardar este envío en tu panel.'
              : 'Creá tu cuenta en segundos para acceder al dashboard.'}
          </p>
        </div>
        <div className="mt-6 space-y-3">
          <button type="button" className={providerBtn} onClick={() => handleSocial('Google')}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-layer-0 shadow-inset">
              <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
            </span>
            <span>Continuar con Google</span>
          </button>
          <button type="button" className={providerBtn} onClick={() => handleSocial('Apple')}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-layer-0 shadow-inset">
              <Image src="/icons/apple.svg" alt="Apple" width={20} height={20} />
            </span>
            <span>Continuar con Apple</span>
          </button>
          <button type="button" className={providerBtn} onClick={handleMicrosoft}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-layer-0 shadow-inset">
              <Image src="/icons/microsoft.svg" alt="Microsoft" width={20} height={20} />
            </span>
            <span>Continuar con Microsoft</span>
          </button>
          <p className="text-xs text-muted text-center">Plan Free incluido. Podés cancelar cuando quieras.</p>
        </div>
      </div>
    </main>
  );
}
