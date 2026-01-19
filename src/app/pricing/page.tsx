'use client';

import { useState } from 'react';
import { PricingCard } from '@/components/PricingCard';
import { PricingComparison } from '@/components/PricingComparison';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';

const faqs = [
  {
    q: '¿Puedo cambiar de plan cuando quiera?',
    a: 'Sí, podés elegir otro plan cuando quieras y actualizamos tu límite de envíos al instante.',
  },
  {
    q: '¿Cómo funciona el límite de envíos?',
    a: 'Contamos los envíos activos (no entregados). Si alcanzás el límite, verás un aviso antes de cargar otro.',
  },
  {
    q: '¿Hay integración real con correos?',
    a: 'Estamos listos para conectar con APIs de correos. Hoy usamos datos locales y detección por prefijos.',
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const router = useRouter();

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <div className="fade-in-up flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Planes</p>
            <h1 className="text-4xl font-black text-strong">Precios pensados para crecer</h1>
            <p className="mt-2 max-w-2xl text-muted">
              Cambiá entre mensual/anual, simulá upgrades y guardamos tu elección en localStorage.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-subtle bg-[rgba(0,0,0,0.4)] px-3 py-2">
            <span className={!annual ? 'font-semibold text-strong' : 'text-muted'}>Mensual</span>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" checked={annual} onChange={(e) => setAnnual(e.target.checked)} />
              <div className="peer h-6 w-11 rounded-full bg-[rgba(255,255,255,0.18)] after:absolute after:left-[4px] after:top-[4px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-[rgb(0,115,255)] peer-checked:after:translate-x-full" />
            </label>
            <div className="flex items-center gap-1">
              <span className={annual ? 'font-semibold text-strong' : 'text-muted'}>Anual</span>
              <span className="rounded-full border border-[rgba(0,199,99,0.3)] bg-[rgba(0,199,99,0.16)] px-2 py-1 text-[10px] font-bold uppercase text-[rgba(0,199,99,0.95)]">
                Ahorra 15%
              </span>
            </div>
          </div>
        </div>

        <section id="planes" className="fade-in-on-scroll scroll-mt-10 space-y-4">
          <PricingCard annual={annual} />
        </section>

        <div className="fade-in-on-scroll space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-strong">Comparativa de features</h2>
            <button onClick={() => router.push('/login')} className="btn-secondary">
              Probar ahora
            </button>
          </div>
          <PricingComparison />
        </div>

        <section className="fade-in-on-scroll grid gap-4 lg:grid-cols-3">
          <div className="card lg:col-span-2">
            <h3 className="text-xl font-bold text-strong">Preguntas frecuentes</h3>
            <div className="mt-4 space-y-3">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-xl border border-subtle bg-[rgba(0,0,0,0.35)] p-4">
                  <p className="font-semibold text-strong">{item.q}</p>
                  <p className="text-sm text-muted">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card flex flex-col gap-3">
            <h3 className="text-lg font-bold text-strong">Beneficios rápidos</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>• Límite de envíos activo por plan.</li>
              <li>• Persistencia local lista para conectarse a tus APIs.</li>
              <li>• Flujo de upgrade guiado desde el panel.</li>
            </ul>
            <div className="rounded-xl border border-[rgba(0,115,255,0.3)] bg-[rgba(0,115,255,0.12)] p-4 text-primary">
              Conecta tu backend cuando quieras: reemplazá el almacenamiento local por tus endpoints.
            </div>
          </div>
        </section>

        <div className="fade-in-on-scroll card flex flex-col items-start gap-3 text-left sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase text-muted">¿Listo para empezar?</p>
            <h3 className="text-xl font-bold text-strong">Elegí un plan y probá TrackHub AR</h3>
            <p className="text-sm text-muted">Podés cambiar de plan luego desde Configuración.</p>
          </div>
          <button onClick={() => router.push('/login')} className="btn-primary btn-primary--hero btn-primary--emphasis">
            Probar ahora
          </button>
        </div>
      </div>
    </AppShell>
  );
}
