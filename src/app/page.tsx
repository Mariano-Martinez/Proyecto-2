'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Courier } from '@/lib/types';
import { setAuth, setPlan, getPlan } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

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

  const goDemo = () => {
    router.push('/dashboard');
  };

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
                Probá el panel en segundos con datos de ejemplo. Cuando quieras guardar envíos reales o activar alertas,
                iniciás sesión y listo.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={goDemo} className="btn-primary rounded-xl px-5 py-3 text-base">
                  Probar demo
                </button>
                <Link href="/pricing" className="btn-secondary rounded-xl px-5 py-3 text-base">
                  Ver planes
                </Link>
              </div>
              <p className="text-sm font-semibold text-slate-600">Sin tarjeta. Sin spam.</p>
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
                  <h2 className="text-2xl font-bold text-slate-900">Probá el panel en 10 segundos</h2>
                  <p className="text-sm text-slate-600">
                    Sin registro. Datos de ejemplo. Para guardar envíos reales y activar alertas, necesitás cuenta.
                  </p>
                </div>
                <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">Modo demo</div>
              </div>
              <div className="mt-6 space-y-4">
                <button onClick={goDemo} className="btn-primary w-full rounded-xl px-4 py-3 text-base">
                  Probar demo
                </button>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">¿Querés guardar tu seguimiento?</p>
                  <button onClick={() => router.push('/login')} className="btn-secondary mt-2 w-full rounded-xl px-4 py-2">
                    Iniciar sesión
                  </button>
                  <p className="mt-2 text-xs text-slate-500">Guardá envíos reales • Alertas • Sync entre dispositivos</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-slate-500">Login rápido</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      className="btn-secondary w-full rounded-xl px-4 py-2"
                      onClick={handleSocial}
                    >
                      Google
                    </button>
                    <button
                      type="button"
                      className="btn-secondary w-full rounded-xl px-4 py-2"
                      onClick={handleSocial}
                    >
                      Apple
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Tras loguearte, podés upgradear desde Planes y gestionar envíos ilimitados.
                  </p>
                </div>
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
              Sin fricción: podés probar antes de registrarte.
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
