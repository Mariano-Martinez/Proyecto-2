'use client';

import { useState } from 'react';
import { setAuth, setPlan, getPlan, consumeRedirectPath } from '@/lib/storage';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plan } from '@/lib/types';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get('next') || '/dashboard';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuth(true);
    if (!getPlan()) setPlan(Plan.FREE);
    const stored = consumeRedirectPath();
    router.replace(stored || next);
  };

  const handleSocial = () => {
    setAuth(true);
    if (!getPlan()) setPlan(Plan.FREE);
    const stored = consumeRedirectPath();
    router.replace(stored || next);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1 space-y-4">
          <p className="text-sm font-semibold text-sky-600">TrackHub AR</p>
          <h1 className="text-4xl font-black text-slate-900">Accedé a tu panel</h1>
          <p className="text-lg text-slate-600">
            Este flujo es 100% mock: guardamos un flag en localStorage para navegar y probar el dashboard.
          </p>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            Si venís desde pricing, respetamos tu plan elegido y te redirigimos al dashboard.
          </div>
        </div>
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
            <button
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
              onClick={() => setMode('login')}
            >
              Iniciar sesión
            </button>
            <button
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold ${
                mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
              onClick={() => setMode('signup')}
            >
              Crear cuenta
            </button>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input mt-1" required placeholder="tu@email.com" />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <input type="password" className="input mt-1" required placeholder="••••••••" />
            </div>
            <button type="submit" className="btn-primary w-full rounded-xl px-4 py-2">
              {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
            <div className="grid gap-2 sm:grid-cols-3">
              {['Google', 'Facebook', 'Apple'].map((provider) => (
                <button
                  key={provider}
                  type="button"
                  className="btn-secondary w-full rounded-xl px-4 py-2"
                  onClick={handleSocial}
                >
                  {provider}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-slate-600">
              ¿Todavía no sabés qué plan elegir?{' '}
              <Link href="/pricing" className="font-semibold text-sky-600">
                Ver precios
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
