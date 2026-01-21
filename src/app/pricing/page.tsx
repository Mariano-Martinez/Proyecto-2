'use client';

import { useState } from 'react';
import { PricingCard } from '@/components/PricingCard';
import { PricingComparison } from '@/components/PricingComparison';
import { AppShell } from '@/components/layout/AppShell';

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

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-600">Planes</p>
            <h1 className="text-4xl font-black text-slate-900">Precios pensados para crecer</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Cambiá entre mensual/anual, simulá upgrades y guardamos tu elección en localStorage.
            </p>
          </div>
          <div className="panel flex items-center gap-3 rounded-full px-3 py-2">
            <span className={!annual ? 'font-semibold text-[rgb(var(--foreground))]' : 'text-[rgb(var(--muted-foreground))]'}>Mensual</span>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" checked={annual} onChange={(e) => setAnnual(e.target.checked)} />
              <div className="peer h-6 w-11 rounded-full bg-[rgb(var(--muted))] after:absolute after:left-[4px] after:top-[4px] after:h-4 after:w-4 after:rounded-full after:bg-[rgb(var(--panel-bg))] after:transition peer-checked:bg-sky-500 peer-checked:after:translate-x-full" />
            </label>
            <div className="flex items-center gap-1">
              <span className={annual ? 'font-semibold text-[rgb(var(--foreground))]' : 'text-[rgb(var(--muted-foreground))]'}>Anual</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase text-emerald-400 ring-1 ring-emerald-500/20">
                Ahorra 15%
              </span>
            </div>
          </div>
        </div>

        <section id="planes" className="scroll-mt-10 space-y-4">
          <PricingCard annual={annual} />
        </section>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Comparativa de features</h2>
          <PricingComparison />
        </div>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="card p-5 lg:col-span-2">
            <h3 className="text-xl font-bold text-slate-900">Preguntas frecuentes</h3>
            <div className="mt-4 space-y-3">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--muted))] p-4">
                  <p className="font-semibold text-slate-900">{item.q}</p>
                  <p className="text-sm text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card flex flex-col gap-3 p-5">
            <h3 className="text-lg font-bold text-slate-900">Beneficios rápidos</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Límite de envíos activo por plan.</li>
              <li>• Persistencia local lista para conectarse a tus APIs.</li>
              <li>• Flujo de upgrade guiado desde el panel.</li>
            </ul>
            <div className="rounded-xl bg-sky-500/10 p-4 text-sky-400">
              Conecta tu backend cuando quieras: reemplazá el almacenamiento local por tus endpoints.
            </div>
          </div>
        </section>

        <footer className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-[rgb(var(--border))] py-8 text-xs text-[rgb(var(--muted-foreground))] sm:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500" />
              © 2024 TrackHub AR. Todos los derechos reservados.
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <span>Privacidad</span>
            <span>Términos</span>
            <span>Soporte</span>
          </div>
        </footer>
      </div>
    </AppShell>
  );
}
