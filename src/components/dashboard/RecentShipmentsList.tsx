'use client';

import { ChevronRight, Truck } from 'lucide-react';
import { Panel } from '@/components/ui/Panel';
import { IconBadge } from '@/components/ui/IconBadge';

// Mock dataset for UI preview (replace with real shipment activity).
const recentShipments = [
  { id: '1', title: 'Zapatillas Nike Air', courier: 'Andreani', time: 'Hace 2hs' },
  { id: '2', title: 'iPhone 15 Case', courier: 'Correo Argentino', time: 'Hace 3hs' },
  { id: '3', title: 'Monitor Gamer 24"', courier: 'OCASA', time: 'Hace 5hs' },
];

export const RecentShipmentsList = () => {
  return (
    <Panel interactive className="h-full p-5">
      <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">Últimos envíos registrados</h3>
      <div className="mt-6 space-y-4">
        {recentShipments.map((item) => (
          <div
            key={item.id}
            className="panel flex items-center justify-between bg-[rgb(var(--muted))] px-4 py-3 transition hover:border-[rgb(var(--panel-hover-border))] hover:shadow-[0_8px_18px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-center gap-3">
              <IconBadge icon={Truck} className="bg-sky-500/10 text-sky-400 dark:text-sky-300" />
              <div>
                <p className="text-sm font-semibold text-[rgb(var(--foreground))]">{item.title}</p>
                <p className="text-xs text-[rgb(var(--muted-foreground))]">
                  {item.courier} · {item.time}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[rgb(var(--muted-foreground))]" />
          </div>
        ))}
      </div>
    </Panel>
  );
};
