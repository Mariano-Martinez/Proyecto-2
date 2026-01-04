'use client';

import Link from 'next/link';
import { Courier } from '@/lib/types';
import { setAuth, setPlan, getPlan } from '@/lib/storage';
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

  const handleSocial = () => {
    persistAuth();
    router.replace('/dashboard');
  };

  const handleMicrosoft = () => {
    alert('Microsoft SSO (mock): aún no está conectado.');
  };

  const goLogin = () => {
    router.push('/login');
  };

  const providerBtn =
    'flex h-12 w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500';

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12">
        <section className="gradient-hero relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-12 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-4 py-2 text-white shadow-lg">
              <span className="text-sm font-semibold">TrackHub AR</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-600 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Panel unificado de envíos y notificaciones
            </div>
          </div>
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
                Seguimiento unificado para tus envíos
              </h1>
              <p className="text-lg text-slate-600">
                Accedé al panel de envíos y notificaciones. Empezá con el Plan Free y activá mejoras cuando quieras.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={goLogin} className="btn-primary rounded-xl px-5 py-3 text-base">
                  Continuar gratis
                </button>
                <Link href="/pricing" className="btn-secondary rounded-xl px-5 py-3 text-base">
                  Ver planes
                </Link>
              </div>
              <p className="text-sm font-semibold text-slate-600">Sin tarjeta • Podés cancelar cuando quieras.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-sky-50 p-4 text-sm text-sky-800 shadow-sm">
                  <p className="font-semibold text-slate-900">Visibilidad total</p>
                  <p>Dashboard, tabla y cards mobile con métricas por estado.</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm">
                  <p className="font-semibold text-slate-900">Límite controlado</p>
                  <p>Plan Free por defecto y upgrade desde Planes cuando quieras.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="h-9 w-9 rounded-full border-2 border-white bg-sky-100"
                      aria-hidden
                    />
                  ))}
                </div>
                Envíos listos para que pruebes filtros, métricas y acciones sin fricción.
              </div>
            </div>

            <div className="card relative overflow-hidden border-sky-100 bg-white px-6 py-8 shadow-lg">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase text-slate-500">ACCEDÉ AHORA</p>
                  <h2 className="text-2xl font-bold text-slate-900">Continuar gratis</h2>
                  <p className="text-sm text-slate-600">Creá tu cuenta en segundos. Plan Free incluido.</p>
                  <p className="text-xs text-slate-500 mt-1">Sin tarjeta • Podés cancelar cuando quieras</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <button type="button" className={providerBtn} onClick={handleSocial}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                    <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                  </span>
                  <span>Continuar con Google</span>
                </button>
                <button type="button" className={providerBtn} onClick={handleSocial}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                    <Image src="/icons/apple.svg" alt="Apple" width={20} height={20} />
                  </span>
                  <span>Continuar con Apple</span>
                </button>
                <button type="button" className={providerBtn} onClick={handleMicrosoft}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                    <Image src="/icons/microsoft.svg" alt="Microsoft" width={20} height={20} />
                  </span>
                  <span>Continuar con Microsoft</span>
                </button>
                <p className="text-xs text-slate-500 text-center">
                  Al continuar, aceptás los Términos y la Política de privacidad.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-sky-600">Cómo funciona</p>
              <h2 className="text-2xl font-bold text-slate-900">3 pasos simples</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <ShieldCheckIcon className="h-5 w-5 text-sky-600" />
              Acceso seguro con SSO y Plan Free de inicio.
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
                <div key={step} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Paso {step}</p>
                  <p className="text-sm text-slate-600">{copy}</p>
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
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">+5 más</span>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-3 md:grid-cols-4">
            {couriers.map((courier) => (
              <div key={courier.name} className="flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                <Image src={courier.logo} alt={courier.name} width={80} height={32} className="h-6 w-auto object-contain" />
                <span>{courier.name}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-slate-200 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            TrackHub AR
            <span className="text-xs text-slate-500">Plataforma de envíos</span>
          </div>
          <div className="flex gap-4 text-slate-500">
            <span>Soporte</span>
            <span>Privacidad</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
