'use client';

import { Courier } from '@/lib/types';
import { setAuth, setPlan, getPlan, setUser } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { ScrollReveal } from '@/components/ScrollReveal';

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
    'flex h-12 w-full items-center gap-3 rounded-full border border-subtle bg-[rgba(0,0,0,0.4)] px-4 text-sm font-semibold text-strong transition hover:bg-[rgba(255,255,255,0.06)] focus-visible:focus-ring';

  return (
    <main className="gradient-page flex min-h-screen flex-col">
      <ScrollReveal />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-12">
        <section className="gradient-hero fade-in-up relative overflow-hidden rounded-[32px] border border-subtle bg-[rgba(0,0,0,0.4)] px-6 py-12 shadow-depth-lg">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-start">
            <div className="inline-flex items-center gap-3 rounded-full border border-subtle bg-[rgba(0,0,0,0.4)] px-4 py-2 text-strong shadow-depth-sm">
              <span className="text-sm font-semibold">TrackHub AR</span>
            </div>
          </div>
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-4xl font-black text-strong sm:text-5xl">
                Seguimiento unificado para tus envíos
              </h1>
              <p className="max-w-xl text-lg text-muted">
                Accedé al panel de envíos y notificaciones. Empezá con el Plan Free y activá mejoras cuando quieras.
              </p>
              <p className="text-sm font-semibold text-muted">Sin tarjeta • Sin anuncios • Podés cancelar cuando quieras.</p>
              <div className="benefits-grid grid gap-3 md:grid-cols-2">
                <div className="benefit-card fade-in-on-scroll rounded-2xl border border-subtle bg-[rgba(0,0,0,0.35)] p-4 text-sm text-primary">
                  <p className="font-semibold text-strong">Visibilidad total</p>
                  <p>Dashboard, tabla y cards mobile con métricas por estado.</p>
                </div>
                <div className="benefit-card fade-in-on-scroll rounded-2xl border border-subtle bg-[rgba(0,0,0,0.35)] p-4 text-sm text-strong">
                  <p className="font-semibold text-strong">Límite controlado</p>
                  <p className="text-muted">Plan Free por defecto y upgrade desde Planes cuando quieras.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted">
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="h-8 w-8 rounded-full border border-subtle bg-[rgba(0,0,0,0.4)]"
                      aria-hidden
                    />
                  ))}
                </div>
                Envíos listos para que pruebes filtros, métricas y acciones sin fricción.
              </div>
            </div>

            <div className="card card-lg relative overflow-hidden rounded-3xl border-subtle bg-[rgba(0,0,0,0.4)] shadow-depth-lg">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase text-muted">ACCEDÉ AHORA</p>
                  <h2 className="text-2xl font-bold text-strong">Continuar gratis</h2>
                  <p className="text-sm text-muted">Creá tu cuenta en segundos. Plan Free incluido.</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <button type="button" className={providerBtn} onClick={() => handleSocial('Google')}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-subtle bg-[rgba(0,0,0,0.4)]">
                    <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                  </span>
                  <span>Continuar con Google</span>
                </button>
                <button type="button" className={providerBtn} onClick={() => handleSocial('Apple')}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-subtle bg-[rgba(0,0,0,0.4)]">
                    <Image src="/icons/apple.svg" alt="Apple" width={20} height={20} />
                  </span>
                  <span>Continuar con Apple</span>
                </button>
                <button type="button" className={providerBtn} onClick={handleMicrosoft}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-subtle bg-[rgba(0,0,0,0.4)]">
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

        <section className="fade-in-on-scroll rounded-3xl border border-subtle bg-[rgba(0,0,0,0.3)] p-6 shadow-depth-md">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Cómo funciona</p>
              <h2 className="text-2xl font-bold text-strong">3 pasos simples</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted sm:self-start">
              <ShieldCheckIcon className="h-5 w-5 text-primary" />
              <span className="leading-5">Acceso seguro con SSO y Plan Free de inicio.</span>
            </div>
          </div>
          <div className="benefits-grid mt-6 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((step) => {
              const copy = [
                'Pegá un tracking o conectá un courier',
                'Unificamos estados y timeline',
                'Te avisamos cambios y mantenés historial',
              ][step - 1];
              return (
                <div key={step} className="benefit-card fade-in-on-scroll flex h-full flex-col gap-2 rounded-2xl border border-subtle bg-[rgba(0,0,0,0.35)] p-4">
                  <p className="text-sm font-semibold text-strong">Paso {step}</p>
                  <p className="text-sm text-muted leading-relaxed">{copy}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="fade-in-on-scroll space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="section-title">Couriers soportados</h2>
              <p className="section-subtitle">Integraciones en progreso. APIs reales se conectan después.</p>
            </div>
            <span className="rounded-full border border-subtle bg-[rgba(0,0,0,0.35)] px-4 py-2 text-sm font-semibold text-muted">+5 más</span>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-subtle bg-[rgba(0,0,0,0.35)] p-6 shadow-depth-sm sm:grid-cols-3 md:grid-cols-4">
            {couriers.map((courier) => (
              <div
                key={courier.name}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-subtle bg-[rgba(0,0,0,0.35)] p-4 text-sm font-semibold text-muted"
              >
                <Image src={courier.logo} alt={courier.name} width={80} height={32} className="h-6 w-auto object-contain" />
                <span>{courier.name}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="fade-in-on-scroll flex flex-col gap-3 border-t border-strong py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-semibold text-strong">
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
