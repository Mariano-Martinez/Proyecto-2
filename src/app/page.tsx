'use client';

import Link from 'next/link';
import { PricingCard } from '@/components/PricingCard';
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
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                Mock interactivo
                <span className="text-sky-500">•</span>
                Plan Free al iniciar sesión
              </span>
              <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
                Seguimiento unificado y upgrades en un clic
              </h1>
              <p className="text-lg text-slate-600">
                Centralizá todos tus envíos en Argentina con detección automática de courier, estados en tiempo real y
                upgrades simulados. Ideal para demos y para planificar tu stack real.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-sky-50 p-4 text-sm text-sky-800">
                  <p className="font-semibold text-slate-900">Visibilidad total</p>
                  <p>Tabla + cards mobile, timeline y métricas por estado.</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
                  <p className="font-semibold text-slate-900">Ready para upgrades</p>
                  <p>Elegí Planes y simulá Business/Enterprise sin tocar el backend.</p>
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
                Más de 5 envíos mock listos para probar desde el minuto uno.
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/pricing#planes" className="btn-secondary rounded-xl px-5 py-3 text-base">
                  Ver planes y upgrades
                </Link>
                <Link href="/dashboard" className="btn-link text-base font-semibold text-sky-700">
                  Ir al panel
                </Link>
              </div>
            </div>

            <div className="card relative overflow-hidden border-sky-100 bg-white px-6 py-8 shadow-lg">
              <div className="mb-2 text-sm font-semibold uppercase text-slate-500">Accedé ahora</div>
              <h2 className="text-2xl font-bold text-slate-900">Logueate directo en el landing</h2>
              <p className="text-sm text-slate-600">Todo es mock: guardamos el flag y te damos el plan Free.</p>
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
                <p className="text-xs font-semibold uppercase text-slate-500">Login rápido (mock)</p>
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
                  Tras loguearte, podés upgradear desde Planes y probar límites de envíos.
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

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="section-title">Pricing</h2>
              <p className="section-subtitle">Planes pensados para vendedores, equipos y empresas.</p>
            </div>
            <Link href="/pricing" className="btn-secondary rounded-xl px-4 py-2">
              Comparar planes
            </Link>
          </div>
          <PricingCard annual={false} />
        </section>

        <footer className="flex flex-col gap-3 border-t border-slate-200 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            TrackHub AR
            <span className="text-xs text-slate-500">Mock</span>
          </div>
          <div className="flex gap-4">
            <Link href="/pricing" className="hover:text-sky-600">
              Precios
            </Link>
            <Link href="/auth" className="hover:text-sky-600">
              Entrar
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
