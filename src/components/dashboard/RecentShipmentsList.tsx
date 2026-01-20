'use client';

import { useMemo } from 'react';
import { ChevronRight, PackageSearch, Truck } from 'lucide-react';
import { Panel } from '@/components/ui/Panel';
import { IconBadge } from '@/components/ui/IconBadge';
import { Shipment } from '@/lib/types';
import Link from 'next/link';

const formatRelativeTime = (timestamp: string) => {
  const parsed = Date.parse(timestamp);
  if (Number.isNaN(parsed)) return 'Hace instantes';
  const diffMs = Date.now() - parsed;
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
  if (diffMinutes < 2) return 'Hace instantes';
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} hs`;
  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} días`;
};

export const RecentShipmentsList = ({ shipments }: { shipments: Shipment[] }) => {
  const recentShipments = useMemo(() => {
    return [...shipments]
      .sort((a, b) => Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated))
      .slice(0, 3);
  }, [shipments]);

  return (
    <Panel interactive className="h-full p-5">
      <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">Últimos envíos registrados</h3>
      <div className="mt-6 space-y-4">
        {recentShipments.length === 0 ? (
          <div className="panel flex flex-col items-center gap-2 bg-[rgb(var(--muted))] px-4 py-6 text-center">
            <IconBadge icon={PackageSearch} className="bg-sky-500/10 text-sky-400 dark:text-sky-300" />
            <div>
              <p className="text-sm font-semibold text-[rgb(var(--foreground))]">Todavía no registraste envíos</p>
              <p className="text-xs text-[rgb(var(--muted-foreground))]">
                Agregá tu primer tracking para ver el historial reciente.
              </p>
            </div>
          </div>
        ) : (
          recentShipments.map((item) => (
            <Link
              key={item.id}
              href={`/shipments/${item.id}`}
              className="panel flex items-center justify-between bg-[rgb(var(--muted))] px-4 py-3 transition hover:border-[rgb(var(--panel-hover-border))] hover:shadow-[0_8px_18px_rgba(0,0,0,0.2)]"
              aria-label={`Ver envío ${item.alias}`}
            >
              <div className="flex items-center gap-3">
                <IconBadge icon={Truck} className="bg-sky-500/10 text-sky-400 dark:text-sky-300" />
                <div>
                  <p className="text-sm font-semibold text-[rgb(var(--foreground))]">{item.alias}</p>
                  <p className="text-xs text-[rgb(var(--muted-foreground))]">
                    {item.courier} · {formatRelativeTime(item.lastUpdated)}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[rgb(var(--muted-foreground))]" />
            </Link>
          ))
        )}
      </div>
    </Panel>
  );
};
