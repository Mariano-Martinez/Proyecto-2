'use client';

import { AppShell } from '@/components/layout/AppShell';
import { useAuthGuard } from '@/lib/hooks';

export default function NotificationsPage() {
  const ready = useAuthGuard();

  if (!ready) return null;

  return (
    <AppShell>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--panel-bg))] p-10 text-center">
        <p className="text-lg font-bold text-[rgb(var(--foreground))]">Notificaciones</p>
        <p className="text-sm text-[rgb(var(--muted-foreground))]">
          Este apartado es un placeholder. Configurá alertas desde el dashboard.
        </p>
        <div className="mt-2 rounded-xl bg-sky-500/10 px-4 py-2 text-xs font-semibold text-sky-400">
          Próximamente vas a poder activar reglas, canales y alertas personalizadas.
        </div>
      </div>
    </AppShell>
  );
}
