'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Courier, Plan } from '@/lib/types';
import { setAuth, setPlan, getPlan } from '@/lib/storage';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const couriers: { name: Courier; logo: string }[] = [
  { name: Courier.ANDREANI, logo: '/images/andreani.svg' },
  { name: Courier.OCA, logo: '/images/oca.svg' },
  { name: Courier.CORREO_ARGENTINO, logo: '/images/correo.svg' },
  { name: Courier.URBANO, logo: '/images/urbano.svg' },
  { name: Courier.DHL, logo: '/images/dhl.svg' },
  { name: Courier.FEDEX, logo: '/images/fedex.svg' },
  { name: Courier.UPS, logo: '/images/ups.svg' },
];

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const persistAuth = () => {
    setAuth(true);
    if (!getPlan()) setPlan(Plan.FREE);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    persistAuth();
    router.replace('/dashboard');
  };

  const handleSocial = (provider: string) => {
    persistAuth();
    router.replace('/dashboard');
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
                Gestioná todo en un solo lugar: detección automática de courier, timeline por paquete y upgrades de plan
                en un clic. Listo para equipos que necesitan visibilidad y velocidad.
              </p>
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
              <div className="flex flex-wrap gap-3">
                <Link href="/pricing" className="btn-secondary rounded-xl px-5 py-3 text-base">
                  Ver planes
                </Link>
              </div>
            </div>

            <div className="card relative overflow-hidden border-sky-100 bg-white px-6 py-8 shadow-lg">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase text-slate-500">Accedé ahora</p>
                  <h2 className="text-2xl font-bold text-slate-900">Logueate directo en el landing</h2>
                  <p className="text-sm text-slate-600">Activamos tu cuenta y seguimos tu actividad desde el panel.</p>
                </div>
                <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">En línea</div>
              </div>
              <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                <div>
                  <label className="label">Nombre</label>
                  <input
                    className="input mt-1"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    className="input mt-1"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-primary w-full rounded-xl px-4 py-3 text-base">
                  Entrar al panel (Plan Free)
                </button>
              </form>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase text-slate-500">Login rápido</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    className="btn-secondary w-full rounded-xl px-4 py-2"
                    onClick={() => handleSocial('Google')}
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    className="btn-secondary w-full rounded-xl px-4 py-2"
                    onClick={() => handleSocial('Facebook')}
                  >
                    Facebook
                  </button>
                  <button
                    type="button"
                    className="btn-secondary w-full rounded-xl px-4 py-2"
                    onClick={() => handleSocial('Apple')}
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
        </section>

        <section className="space-y-6">
          <h2 className="section-title">Couriers soportados</h2>
          <p className="section-subtitle">Placeholders de logos listos para conectar con APIs reales.</p>
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-3 md:grid-cols-4">
            {couriers.map((courier) => (
              <div key={courier.name} className="flex items-center justify-center rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                <Image src={courier.logo} alt={courier.name} width={80} height={32} className="h-6 w-auto object-contain" />
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
