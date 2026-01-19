'use client';

import { Courier } from '@/lib/types';
import { setAuth, setPlan, getPlan, setUser } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const couriers: { name: Courier; logo: string }[] = [
  { name: Courier.OCA, logo: '/images/oca.svg' },
  { name: Courier.CORREO_ARGENTINO, logo: '/images/correo.svg' },
  { name: Courier.ANDREANI, logo: '/images/andreani.svg' },
  { name: Courier.URBANO, logo: '/images/urbano.svg' },
  { name: Courier.DHL, logo: '/images/dhl.svg' },
  { name: Courier.FEDEX, logo: '/images/fedex.svg' },
];

export default function HomePage() {
  const router = useRouter();

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
    'flex h-12 w-full items-center gap-3 rounded-xl border border-subtle bg-surface-1 px-4 text-sm font-semibold text-default shadow-depth-sm transition hover:shadow-depth-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring)/0.35)]';

  return (
    <main className="gradient-page flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-12">
        <section className="gradient-hero relative overflow-hidden rounded-3xl border border-subtle bg-surface-0 px-6 py-12 shadow-depth-lg">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-start">
            <div className="inline-flex items-center gap-3 rounded-full bg-[hsl(var(--surface-2))] px-4 py-2 text-default shadow-depth-md">
              <span className="text-sm font-semibold">TrackHub AR</span>
            </div>
          </div>
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-4xl font-black text-default sm:text-5xl">
                Seguimiento unificado para tus envíos
              </h1>
              <p className="max-w-xl text-lg text-muted">
                Accedé al panel de envíos y notificaciones. Empezá con el Plan Free y activá mejoras cuando quieras.
              </p>
              <p className="text-sm font-semibold text-muted">Sin tarjeta • Sin anuncios • Podés cancelar cuando quieras.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--primary)/0.12)] p-4 text-sm text-primary shadow-depth-sm">
                  <p className="font-semibold text-default">Visibilidad total</p>
                  <p>Dashboard, tabla y cards mobile con métricas por estado.</p>
                </div>
                <div className="rounded-2xl border border-[hsl(var(--success)/0.2)] bg-[hsl(var(--success)/0.12)] p-4 text-sm text-[hsl(var(--success))] shadow-depth-sm">
                  <p className="font-semibold text-default">Límite controlado</p>
                  <p>Plan Free por defecto y upgrade desde Planes cuando quieras.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted">
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="h-8 w-8 rounded-full border border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--surface-1)/0.7)]"
                      aria-hidden
                    />
                  ))}
                </div>
                Envíos listos para que pruebes filtros, métricas y acciones sin fricción.
              </div>
            </div>

            <div className="card relative overflow-hidden rounded-3xl border-subtle bg-[hsl(var(--surface-0)/0.95)] px-6 py-8 shadow-depth-lg backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase text-muted">ACCEDÉ AHORA</p>
                  <h2 className="text-2xl font-bold text-default">Continuar gratis</h2>
                  <p className="text-sm text-muted">Creá tu cuenta en segundos. Plan Free incluido.</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <button type="button" className={providerBtn} onClick={() => handleSocial('Google')}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 shadow-inset">
                    <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                  </span>
                  <span>Continuar con Google</span>
                </button>
                <button type="button" className={providerBtn} onClick={() => handleSocial('Apple')}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 shadow-inset">
                    <Image src="/icons/apple.svg" alt="Apple" width={20} height={20} />
                  </span>
                  <span>Continuar con Apple</span>
                </button>
                <button type="button" className={providerBtn} onClick={handleMicrosoft}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 shadow-inset">
                    <Image src="/icons/microsoft.svg" alt="Microsoft" width={20} height={20} />
                  </span>
                  <span>Continuar con Microsoft</span>
                </button>
                <p className="text-xs text-muted text-center">
                  Al continuar, aceptás los Términos y la Política de privacidad.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-subtle bg-surface-0 p-6 shadow-depth-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Cómo funciona</p>
              <h2 className="text-2xl font-bold text-default">3 pasos simples</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted sm:self-start">
              <ShieldCheckIcon className="h-5 w-5 text-primary" />
              <span className="leading-5">Acceso seguro con SSO y Plan Free de inicio.</span>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((step) => {
              const copy = [
                'Pegá un tracking o conectá un courier',
                'Unificamos estados y timeline',
                'Te avisamos cambios y mantenés historial',
              ][step - 1];
              return (
                <div key={step} className="flex h-full flex-col gap-2 rounded-2xl border border-subtle bg-surface-1 p-4 shadow-inset">
                  <p className="text-sm font-semibold text-default">Paso {step}</p>
                  <p className="text-sm text-muted leading-relaxed">{copy}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="section-title">Couriers soportados</h2>
              <p className="section-subtitle">Integraciones en progreso. APIs reales se conectan después.</p>
            </div>
            <span className="rounded-full bg-surface-1 px-4 py-2 text-sm font-semibold text-muted shadow-inset">+5 más</span>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-subtle bg-surface-0 p-6 sm:grid-cols-3 md:grid-cols-4 shadow-depth-sm">
            {couriers.map((courier) => (
              <div key={courier.name} className="flex flex-col items-center justify-center gap-2 rounded-xl bg-surface-1 p-4 text-sm font-semibold text-muted shadow-inset">
                <Image src={courier.logo} alt={courier.name} width={80} height={32} className="h-6 w-auto object-contain" />
                <span>{courier.name}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-subtle py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-semibold text-default">
            TrackHub AR
            <span className="text-xs text-muted">Plataforma de envíos</span>
          </div>
          <div className="flex gap-4 text-muted">
            <span>Soporte</span>
            <span>Privacidad</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
