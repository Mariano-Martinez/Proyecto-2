import Link from 'next/link';
import { PricingCard } from '@/components/PricingCard';
import { pricingTiers } from '@/lib/plans';
import Image from 'next/image';
import { Courier } from '@/lib/types';

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
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12">
        <section className="gradient-hero relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-12 shadow-sm">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                Nuevo • Mock interactivo
              </span>
              <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
                Seguimiento unificado de envíos
              </h1>
              <p className="text-lg text-slate-600">
                Todos tus códigos, todos tus correos, en un solo lugar. TrackHub AR centraliza el seguimiento para
                Andreani, OCA, Correo Argentino y más.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/auth" className="btn-primary rounded-xl px-5 py-3 text-base">
                  Entrar
                </Link>
                <Link href="/pricing" className="btn-secondary rounded-xl px-5 py-3 text-base">
                  Ver precios
                </Link>
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
                Más de 5 envíos mock listos para probar.
              </div>
            </div>
            <div className="card relative overflow-hidden border-sky-100 bg-white px-6 py-8 shadow-lg">
              <div className="mb-4 text-sm font-semibold uppercase text-slate-500">Cómo funciona</div>
              <div className="grid gap-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                      {step}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {step === 1 && 'Ingresá tus códigos'}
                        {step === 2 && 'Centralizá tus envíos'}
                        {step === 3 && 'Recibí alertas y métricas'}
                      </p>
                      <p className="text-sm text-slate-600">
                        {step === 1 && 'Copiá/pegá códigos y detectamos el courier automáticamente.'}
                        {step === 2 && 'Visualizá tabla o cards mobile con estados y timeline.'}
                        {step === 3 && 'Simulá actualizaciones y medí tu capacidad por plan.'}
                      </p>
                    </div>
                  </div>
                ))}
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
