'use client';

import { ChevronRight, Truck } from 'lucide-react';

// Mock dataset for UI preview (replace with real shipment activity).
const recentShipments = [
  { id: '1', title: 'Zapatillas Nike Air', courier: 'Andreani', time: 'Hace 2hs' },
  { id: '2', title: 'iPhone 15 Case', courier: 'Correo Argentino', time: 'Hace 3hs' },
  { id: '3', title: 'Monitor Gamer 24"', courier: 'OCASA', time: 'Hace 5hs' },
];

export const RecentShipmentsList = () => {
  return (
    <div className="h-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
      <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">Últimos envíos registrados</h3>
      <div className="mt-6 space-y-4">
        {recentShipments.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--muted))] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 dark:text-sky-300">
                <Truck className="h-5 w-5" />
              </div>
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
    </div>
  );
};
