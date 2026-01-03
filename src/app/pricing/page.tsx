'use client';

import { useState } from 'react';
import { PricingCard } from '@/components/PricingCard';
import { PricingComparison } from '@/components/PricingComparison';
import { pricingTiers } from '@/lib/plans';
import { useRouter } from 'next/navigation';

const faqs = [
  {
    q: '¿Puedo cambiar de plan cuando quiera?',
    a: 'Sí, en el mock podés elegir otro plan y se actualiza el límite localmente.',
  },
  {
    q: '¿Cómo funciona el límite de envíos?',
    a: 'Contamos los envíos activos (no entregados). Si alcanzás el límite, el botón para agregar mostrará un aviso.',
  },
  {
    q: '¿Hay integración real con correos?',
    a: 'Todavía no. Todo es mock con datos locales y detección simple por prefijos.',
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-600">Planes</p>
            <h1 className="text-4xl font-black text-slate-900">Precios pensados para crecer</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Cambiá entre mensual/anual, simulá upgrades y guardamos tu elección en localStorage.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <span className={!annual ? 'font-semibold text-slate-900' : 'text-slate-500'}>Mensual</span>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" checked={annual} onChange={(e) => setAnnual(e.target.checked)} />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[4px] after:top-[4px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-sky-500 peer-checked:after:translate-x-full" />
            </label>
            <span className={annual ? 'font-semibold text-slate-900' : 'text-slate-500'}>Anual</span>
          </div>
        </div>

        <PricingCard annual={annual} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Comparativa de features</h2>
            <button onClick={() => router.push('/auth')} className="btn-secondary rounded-xl px-4 py-2">
              Probar ahora
            </button>
          </div>
          <PricingComparison />
        </div>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="card p-5 lg:col-span-2">
            <h3 className="text-xl font-bold text-slate-900">Preguntas frecuentes</h3>
            <div className="mt-4 space-y-3">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{item.q}</p>
                  <p className="text-sm text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card flex flex-col gap-3 p-5">
            <h3 className="text-lg font-bold text-slate-900">Beneficios rápidos</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Enforce de límite de envíos por plan.</li>
              <li>• Persistencia local (localStorage) lista para reemplazar por API.</li>
              <li>• Mock de upgrades y redirecciones a /auth.</li>
            </ul>
            <div className="rounded-xl bg-sky-50 p-4 text-sky-700">
              Más adelante: reemplazá la escritura en localStorage por llamados a tus API routes.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
