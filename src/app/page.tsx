'use client';

import { Courier } from '@/lib/types';
import { setAuth, setPlan, getPlan, setUser } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRightIcon, CheckBadgeIcon, EyeIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

const couriers: { name: Courier; logo: string }[] = [
  { name: Courier.OCA, logo: '/images/oca.svg' },
  { name: Courier.CORREO_ARGENTINO, logo: '/images/correo.svg' },
  { name: Courier.ANDREANI, logo: '/images/andreani.svg' },
  { name: Courier.URBANO, logo: '/images/urbano.svg' },
  { name: Courier.DHL, logo: '/images/dhl.svg' },
  { name: Courier.FEDEX, logo: '/images/fedex.svg' },
];

const RevealSection = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className ?? ''}`}
    >
      {children}
    </div>
  );
};

export default function HomePage() {
  const router = useRouter();

  const persistAuth = () => {
    setAuth(true);
    setPlan(getPlan());
  };

  const handleSocial = (provider: 'Google' | 'Apple') => {
    persistAuth();
    setUser({
      name: provider === 'Apple' ? 'Lucía Torres' : 'María González',
      email: provider === 'Apple' ? 'lucia@trackhub.ar' : 'maria@trackhub.ar',
      provider,
    });
    router.replace('/dashboard');
  };

  const handleMicrosoft = () => {
    alert('Microsoft SSO (mock): aún no está conectado.');
  };

  const providerBtn =
    'flex h-12 w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white shadow-sm transition hover:border-white/30 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500';

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#101827,_#05060a_60%)] text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col space-y-16 px-4 py-12 md:space-y-28">
        <section>
          <RevealSection className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.45)] backdrop-blur">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                TrackHub AR
              </div>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Seguimiento unificado para tus envíos
              </h1>
              <p className="max-w-xl text-lg text-slate-200">
                Controlá todos tus paquetes en un solo lugar. Plan Free sin límites y notificaciones en tiempo real.
              </p>
              <ul className="space-y-2 text-sm text-slate-200">
                {['Sin tarjeta requerida', 'Sin anuncios molestos', '3 envíos activos gratis', 'Notificaciones en tiempo real'].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckBadgeIcon className="h-4 w-4 text-emerald-400" />
                      <span>{item}</span>
                    </li>
                  )
                )}
              </ul>
              <div className="grid gap-4 pt-4 sm:grid-cols-2">
                {[
                  { title: 'Visibilidad total', description: 'Seguí cada paso de tu paquete desde un solo panel.', icon: EyeIcon },
                  { title: 'Límite controlado', description: 'Hasta 3 envíos activos, perfecto para uso personal.', icon: CheckBadgeIcon },
                ].map((feature) => (
                  <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-300">
                        <feature.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{feature.title}</p>
                        <p className="text-xs text-slate-300">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <div className="flex -space-x-2">
                  {['A', 'B', 'C', 'D'].map((letter) => (
                    <div
                      key={letter}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-900 bg-gradient-to-br from-sky-500 to-indigo-500 text-xs font-semibold text-white"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                +1,200 usuarios ya están usando TrackHub
              </div>
            </div>

            <div className="w-full max-w-md flex-1 rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.6)]">
              <div className="text-center">
                <p className="text-sm font-semibold uppercase text-slate-400">Accedé ahora</p>
                <h2 className="mt-2 text-2xl font-semibold">Continuar gratis</h2>
                <p className="text-sm text-slate-300">Creá tu cuenta en segundos.</p>
              </div>
              <div className="mt-6 space-y-3">
                <button type="button" className={providerBtn} onClick={() => handleSocial('Google')}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                  </span>
                  <span>Continuar con Google</span>
                </button>
                <button type="button" className={providerBtn} onClick={() => handleSocial('Apple')}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Image src="/icons/apple.svg" alt="Apple" width={20} height={20} />
                  </span>
                  <span>Continuar con Apple</span>
                </button>
                <button type="button" className={providerBtn} onClick={handleMicrosoft}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Image src="/icons/microsoft.svg" alt="Microsoft" width={20} height={20} />
                  </span>
                  <span>Continuar con Microsoft</span>
                </button>
                <div className="flex items-center gap-4 py-2 text-xs text-slate-400">
                  <span className="h-px flex-1 bg-white/10" />
                  o
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <button
                  type="button"
                  onClick={() => handleSocial('Google')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px]"
                >
                  Continuar con Email
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
                <p className="text-center text-xs text-slate-400">
                  Al continuar, aceptás nuestros{' '}
                  <Link href="/terminos" className="text-sky-300 transition hover:text-sky-200">
                    Términos de Servicio
                  </Link>{' '}
                  y{' '}
                  <Link href="/privacidad" className="text-sky-300 transition hover:text-sky-200">
                    Política de Privacidad
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </RevealSection>
        </section>

        <section>
          <RevealSection className="grid gap-8 lg:grid-cols-3">
          {[
            { title: 'Agregá tu tracking', copy: 'Copiá el código de seguimiento y agregalo a TrackHub en segundos.' },
            { title: 'Seguí en tiempo real', copy: 'Recibí notificaciones automáticas en cada actualización del envío.' },
            { title: 'Administrá todo', copy: 'Visualizá todos tus paquetes en un solo lugar organizado.' },
          ].map((step, index) => (
            <div key={step.title} className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="absolute -top-5 left-6 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-semibold">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{step.copy}</p>
            </div>
          ))}
          </RevealSection>
        </section>

        <section>
          <RevealSection className="space-y-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Couriers soportados</p>
            <h2 className="mt-3 text-3xl font-semibold">Integraciones con los principales servicios de envío</h2>
            <p className="mt-2 text-sm text-slate-300">
              Conectamos con los couriers más usados en Argentina y el mundo.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {couriers.map((courier) => (
              <div key={courier.name} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Image src={courier.logo} alt={courier.name} width={40} height={24} className="h-6 w-auto object-contain" />
                </div>
                <p className="mt-4 text-sm font-semibold">{courier.name}</p>
              </div>
            ))}
          </div>
          </RevealSection>
        </section>

        <section>
          <RevealSection className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-10 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">Empezá a rastrear tus envíos hoy</h2>
          <p className="mt-2 text-sm text-slate-300">
            Unite a miles de usuarios que ya confían en TrackHub para gestionar sus paquetes.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => handleSocial('Google')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px]"
            >
              Comenzar gratis
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
            </button>
          </div>
          </RevealSection>
        </section>

        <footer className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-xs text-slate-400 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500" />
            © 2024 TrackHub AR. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/privacidad" className="transition hover:text-sky-300">
              Privacidad
            </Link>
            <Link href="/terminos" className="transition hover:text-sky-300">
              Términos
            </Link>
            <Link href="/soporte" className="transition hover:text-sky-300">
              Soporte
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
