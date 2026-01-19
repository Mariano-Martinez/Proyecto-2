'use client';

import { useMemo, useState } from 'react';
import { useAuthGuard } from '@/lib/hooks';
import { getPlan } from '@/lib/storage';
import { Plan } from '@/lib/types';
import { ArrowUpRightIcon, LockClosedIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AppShell } from '@/components/AppShell';

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
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Integraciones</p>
          <h1 className="text-3xl font-black text-strong">Conectá tus canales</h1>
          <p className="text-sm text-muted">Disponibles en Business+. Gestioná tus canales desde un solo panel.</p>
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
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border border-subtle text-sm font-bold shadow-inset ${
                    item.name === 'MercadoLibre'
                      ? 'bg-[hsl(var(--warning)/0.2)] text-[hsl(var(--warning))]'
                      : item.name === 'Gmail'
                        ? 'bg-[hsl(var(--danger)/0.18)] text-[hsl(var(--danger))]'
                        : 'bg-[hsl(var(--success)/0.18)] text-[hsl(var(--success))]'
                  }`}
                  aria-hidden
                >
                  {item.name === 'MercadoLibre' ? 'ML' : item.name === 'Gmail' ? 'G' : 'S'}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-strong">{item.name}</h3>
                  <p className="text-xs text-muted">Sincronización segura</p>
                </div>
              </div>
              <span className="badge">{item.status}</span>
            </div>
            <p className="text-sm text-muted">{item.description}</p>
            <div className="flex items-center gap-2 rounded-xl border border-subtle bg-layer-0 px-3 py-2 text-xs font-semibold text-muted shadow-inset">
              <LockClosedIcon className="h-4 w-4 text-muted" /> Disponible en Business+
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="card w-full max-w-lg border-subtle bg-layer-1 p-6 shadow-depth-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted">Integración</p>
                <h3 className="text-xl font-bold text-strong">{selectedIntegration.name}</h3>
              </div>
              <button
                onClick={() => setSelectedIntegration(null)}
                className="rounded-lg p-1 text-muted transition hover:bg-[hsl(var(--surface-2))] hover:text-strong focus-visible:focus-ring"
                aria-label="Cerrar"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-muted">{selectedIntegration.description}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
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
