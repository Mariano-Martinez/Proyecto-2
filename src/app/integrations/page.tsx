'use client';

import { useMemo, useState } from 'react';
import { useAuthGuard } from '@/lib/hooks';
import { getPlan } from '@/lib/storage';
import { Plan } from '@/lib/types';
import { ArrowUpRightIcon, LockClosedIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AppShell } from '@/components/layout/AppShell';

const integrations = [
  { name: 'MercadoLibre', description: 'Sincronizá ventas e importá trackings.', plan: Plan.BUSINESS, status: 'Beta' },
  { name: 'Gmail', description: 'Detectamos códigos en tus emails y creamos envíos.', plan: Plan.BUSINESS, status: 'Próximamente' },
  { name: 'Shopify', description: 'Próximamente, importación automática.', plan: Plan.BUSINESS, status: 'Coming soon' },
] as const;

export default function IntegrationsPage() {
  const ready = useAuthGuard();
  const plan = typeof window === 'undefined' ? Plan.FREE : getPlan();
  const [selectedIntegration, setSelectedIntegration] = useState<(typeof integrations)[number] | null>(null);

  const isBusiness = useMemo(() => plan === Plan.BUSINESS || plan === Plan.ENTERPRISE, [plan]);

  if (!ready) return null;

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-sky-600">Integraciones</p>
          <h1 className="text-3xl font-black text-slate-900">Conectá tus canales</h1>
          <p className="text-sm text-slate-600">Disponibles en Business+. Gestioná tus canales desde un solo panel.</p>
        </div>
        {!isBusiness && (
          <a href="/pricing" className="btn-primary rounded-xl px-4 py-2">
            Upgrade
          </a>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((item) => (
          <div key={item.name} className="card flex h-full flex-col gap-4 p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-slate-900 ring-1 ring-slate-200 ${
                    item.name === 'MercadoLibre'
                      ? 'bg-amber-50 text-amber-700 ring-amber-100'
                      : item.name === 'Gmail'
                        ? 'bg-rose-50 text-rose-700 ring-rose-100'
                        : 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                  }`}
                  aria-hidden
                >
                  {item.name === 'MercadoLibre' ? 'ML' : item.name === 'Gmail' ? 'G' : 'S'}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                  <p className="text-xs text-slate-500">Sincronización segura</p>
                </div>
              </div>
              <span className="badge bg-slate-50 text-slate-700 ring-1 ring-slate-200">{item.status}</span>
            </div>
            <p className="text-sm text-slate-600">{item.description}</p>
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
              <LockClosedIcon className="h-4 w-4 text-slate-400" /> Disponible en Business+
            </div>
            <div className="flex flex-1 items-end justify-between gap-2">
              <button
                className="btn-secondary w-full justify-center rounded-xl px-4 py-2"
                onClick={() => setSelectedIntegration(item)}
              >
                Ver detalles <ArrowUpRightIcon className="ml-1 inline h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="card w-full max-w-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-slate-500">Integración</p>
                <h3 className="text-xl font-bold text-slate-900">{selectedIntegration.name}</h3>
              </div>
              <button
                onClick={() => setSelectedIntegration(null)}
                className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Cerrar"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-600">{selectedIntegration.description}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Resumen de datos sincronizados y próximos pasos.</li>
              <li>Requiere plan Business+ para habilitar conexiones.</li>
              <li>Configuración guiada y auditoría de permisos.</li>
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <a href="/pricing" className="btn-primary rounded-xl px-4 py-2">
                Upgrade a Business+
              </a>
              <button onClick={() => setSelectedIntegration(null)} className="btn-secondary rounded-xl px-4 py-2">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
