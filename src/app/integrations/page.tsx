'use client';

import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { useAuthGuard } from '@/lib/hooks';
import { getPlan } from '@/lib/storage';
import { Plan } from '@/lib/types';
import { ArrowUpRightIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { TopBar } from '@/components/TopBar';

const integrations = [
  { name: 'MercadoLibre', description: 'Sincronizá ventas e importá trackings.', plan: Plan.BUSINESS },
  { name: 'Gmail', description: 'Detectamos códigos en tus emails y creamos envíos.', plan: Plan.BUSINESS },
  { name: 'Shopify', description: 'Próximamente, importación automática.', plan: Plan.BUSINESS },
];

export default function IntegrationsPage() {
  const ready = useAuthGuard();
  const plan = typeof window === 'undefined' ? Plan.FREE : getPlan();

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="lg:flex lg:min-h-screen">
        <Sidebar />
        <main className="flex-1 px-4 pb-24 lg:px-8 lg:pb-12">
          <TopBar />
          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-sky-600">Integraciones</p>
              <h1 className="text-3xl font-black text-slate-900">Conectá tus canales</h1>
              <p className="text-sm text-slate-600">Disponibles en Business+. Gestioná tus canales desde un solo panel.</p>
            </div>
            {plan !== Plan.BUSINESS && plan !== Plan.ENTERPRISE && (
              <a href="/pricing" className="btn-primary rounded-xl px-4 py-2">
                Upgrade
              </a>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((item) => (
              <div key={item.name} className="card space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                  <LockClosedIcon className="h-5 w-5 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600">{item.description}</p>
                <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">Disponible en Business+</div>
                <button className="btn-secondary w-full justify-center rounded-xl px-4 py-2" disabled>
                  Conectar <ArrowUpRightIcon className="ml-1 inline h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
