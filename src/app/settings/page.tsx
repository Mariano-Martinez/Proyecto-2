'use client';

import { useAuthGuard } from '@/lib/hooks';
import { getPlan, getUsage } from '@/lib/storage';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { Toast, useToast } from '@/components/Toast';

export default function SettingsPage() {
  const ready = useAuthGuard();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [usage, setUsage] = useState<{ active: number; limit: number; plan: string }>({ active: 0, limit: 3, plan: 'FREE' });
  const [saved, setSaved] = useState(false);
  const { toast, showToast, clearToast } = useToast();

  useEffect(() => {
    if (!ready) return;
    const u = getUsage();
    setUsage({ ...u, plan: getPlan() });
  }, [ready]);

  const handleSave = () => {
    setSaved(true);
    showToast('Cambios guardados');
    setTimeout(() => setSaved(false), 1800);
  };

  if (!ready) return null;

  return (
    <AppShell>
      <h1 className="text-3xl font-black text-slate-900">Configuración</h1>
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
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="h-6 w-11 rounded-full bg-slate-300 after:ml-[2px] after:block after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:bg-sky-500" />
            </label>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Tema</p>
              <p className="text-xs text-slate-500">Claro/Oscuro</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Claro</span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={theme === 'dark'}
                  onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[4px] after:top-[4px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-sky-500 peer-checked:after:translate-x-full" />
              </label>
              <span className="text-xs font-semibold text-slate-600">Oscuro</span>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleSave} className="btn-primary rounded-xl px-4 py-2">
              Guardar cambios
            </button>
          </div>
          {saved && <p className="text-xs font-semibold text-emerald-600">Cambios guardados</p>}
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
          <div className="flex flex-wrap gap-2">
            <a href="/pricing" className="btn-secondary inline-flex w-fit rounded-xl px-4 py-2">
              Ver planes
            </a>
            <button className="btn-secondary inline-flex w-fit rounded-xl px-4 py-2">Administrar plan</button>
            <button className="btn-secondary inline-flex w-fit rounded-xl px-4 py-2">Ver facturas</button>
          </div>
        </div>
      </div>
      <Toast toast={toast} onClose={clearToast} />
    </AppShell>
  );
}
