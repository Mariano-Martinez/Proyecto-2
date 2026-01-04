'use client';

import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { useAuthGuard } from '@/lib/hooks';
import { getPlan, getUsage } from '@/lib/storage';
import { useEffect, useState } from 'react';
import { TopBar } from '@/components/TopBar';

export default function SettingsPage() {
  const ready = useAuthGuard();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [usage, setUsage] = useState<{ active: number; limit: number; plan: string }>({ active: 0, limit: 3, plan: 'FREE' });

  useEffect(() => {
    if (!ready) return;
    const u = getUsage();
    setUsage({ ...u, plan: getPlan() });
  }, [ready]);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="lg:flex lg:min-h-screen">
        <Sidebar />
        <main className="flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-12">
          <TopBar />
          <h1 className="mt-4 text-3xl font-black text-slate-900">Configuración</h1>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="card space-y-4 p-5">
              <h3 className="text-lg font-bold text-slate-900">Perfil</h3>
              <div>
                <label className="label">Nombre</label>
                <input className="input mt-1" defaultValue="Usuario TrackHub" />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input mt-1" defaultValue="usuario@trackhub.ar" />
              </div>
            </div>

            <div className="card space-y-4 p-5">
              <h3 className="text-lg font-bold text-slate-900">Preferencias</h3>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Notificaciones</p>
                  <p className="text-xs text-slate-500">Email y push</p>
                </div>
                <label className="inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="sr-only" defaultChecked />
                  <div className="h-6 w-11 rounded-full bg-slate-300 after:ml-[2px] after:block after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:bg-sky-500" />
                </label>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Tema</p>
                  <p className="text-xs text-slate-500">Claro/Oscuro</p>
                </div>
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="btn-secondary rounded-xl px-4 py-2"
                >
                  {theme === 'light' ? 'Cambiar a oscuro' : 'Cambiar a claro'}
                </button>
              </div>
            </div>

            <div className="card space-y-3 p-5 lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-900">Plan y facturación</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-sky-50 p-4">
                  <p className="text-xs uppercase text-slate-500">Plan actual</p>
                  <p className="text-xl font-bold text-slate-900">{usage.plan}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs uppercase text-slate-500">Envíos activos</p>
                  <p className="text-xl font-bold text-slate-900">{usage.active}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs uppercase text-slate-500">Límite</p>
                  <p className="text-xl font-bold text-slate-900">{usage.limit === Infinity ? '∞' : usage.limit}</p>
                </div>
              </div>
              <a href="/pricing" className="btn-secondary inline-flex w-fit rounded-xl px-4 py-2">
                Cambiar plan
              </a>
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
