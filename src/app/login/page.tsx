'use client';

import { setAuth, setPlan, getPlan, setUser } from '@/lib/storage';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ScrollReveal } from '@/components/ScrollReveal';

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
    'flex h-12 w-full items-center gap-3 rounded-full border border-subtle bg-[rgba(0,0,0,0.45)] px-4 text-sm font-semibold text-strong transition hover:bg-[rgba(255,255,255,0.06)] focus-visible:focus-ring';

  return (
    <main className="flex min-h-screen items-center justify-center bg-layer-0 px-4">
      <ScrollReveal />
      <div className="card card-lg w-full max-w-md fade-in-up">
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
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-subtle bg-[rgba(0,0,0,0.45)]">
              <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
            </span>
            <span>Continuar con Google</span>
          </button>
          <button type="button" className={providerBtn} onClick={() => handleSocial('Apple')}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-subtle bg-[rgba(0,0,0,0.45)]">
              <Image src="/icons/apple.svg" alt="Apple" width={20} height={20} />
            </span>
            <span>Continuar con Apple</span>
          </button>
          <button type="button" className={providerBtn} onClick={handleMicrosoft}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-subtle bg-[rgba(0,0,0,0.45)]">
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
