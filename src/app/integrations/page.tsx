'use client';

import { useMemo, useState } from 'react';
import { useAuthGuard } from '@/lib/hooks';
import { getPlan } from '@/lib/storage';
import { Plan } from '@/lib/types';
import { ArrowUpRightIcon, LockClosedIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AppShell } from '@/components/layout/AppShell';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeInUp, listStagger, motionTransitions } from '@/lib/motion';

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
      <motion.div className="flex flex-col gap-6" variants={listStagger} initial="initial" animate="animate">
        <motion.div className="flex items-center justify-between" variants={fadeInUp}>
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
        </motion.div>

        <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" variants={fadeInUp}>
          {integrations.map((item) => (
            <div key={item.name} className="card ui-hover-lift flex h-full flex-col gap-4 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ring-1 ${
                      item.name === 'MercadoLibre'
                        ? 'bg-amber-500/10 text-amber-400 ring-amber-500/30'
                        : item.name === 'Gmail'
                          ? 'bg-rose-500/10 text-rose-400 ring-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30'
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
                <span className="badge bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))] ring-1 ring-[rgb(var(--border))]">
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-slate-600">{item.description}</p>
              <div className="flex items-center gap-2 rounded-xl bg-[rgb(var(--muted))] px-3 py-2 text-xs font-semibold text-[rgb(var(--muted-foreground))] ring-1 ring-[rgb(var(--border))]">
                <LockClosedIcon className="h-4 w-4 text-[rgb(var(--muted-foreground))]" /> Disponible en Business+
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
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selectedIntegration && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: motionTransitions.base }}
            exit={{ opacity: 0, transition: motionTransitions.fast }}
          >
            <motion.div
              className="card glass-card w-full max-w-lg p-6"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: motionTransitions.slow }}
              exit={{ opacity: 0, y: 8, scale: 0.98, transition: motionTransitions.fast }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-[rgb(var(--muted-foreground))]">Integración</p>
                  <h3 className="text-xl font-bold text-slate-900">{selectedIntegration.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="ui-transition ui-icon-press ui-focus-ring rounded-lg p-1 text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
                  aria-label="Cerrar"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-600">{selectedIntegration.description}</p>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--muted-foreground))]">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
