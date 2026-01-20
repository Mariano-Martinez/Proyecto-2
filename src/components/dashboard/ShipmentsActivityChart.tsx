'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Panel } from '@/components/ui/Panel';

// Mock dataset for UI preview (replace with real analytics data when available).
const chartData = [
  { day: 'Mon', entregas: 4, transitos: 2 },
  { day: 'Tue', entregas: 3, transitos: 5 },
  { day: 'Wed', entregas: 5, transitos: 3 },
  { day: 'Thu', entregas: 7, transitos: 4 },
  { day: 'Fri', entregas: 6, transitos: 6 },
  { day: 'Sat', entregas: 4, transitos: 8 },
  { day: 'Sun', entregas: 3, transitos: 2 },
];

const tooltipStyles = {
  backgroundColor: 'rgba(17, 24, 39, 0.9)',
  border: '1px solid rgba(148, 163, 184, 0.25)',
  borderRadius: '10px',
  padding: '8px 12px',
};

export const ShipmentsActivityChart = () => {
  return (
    <Panel interactive className="flex h-full flex-col p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">Actividad de Envíos</h3>
          <p className="mt-1 text-sm text-[rgb(var(--muted-foreground))]">Frecuencia de entregas vs tránsitos</p>
        </div>
        <select className="rounded-full border border-[rgb(var(--panel-border))] bg-[rgb(var(--panel-bg))] px-4 py-2 text-xs font-semibold text-[rgb(var(--foreground))] outline-none transition hover:border-[rgb(var(--panel-hover-border))] focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20">
          <option>Últimos 7 días</option>
        </select>
      </div>
      <div className="mt-6 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ left: -10, right: 10 }}>
            <defs>
              <linearGradient id="deliveryFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="transitFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgb(var(--muted-foreground))', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgb(var(--muted-foreground))', fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyles} labelStyle={{ color: '#e2e8f0' }} />
            <Area
              type="monotone"
              dataKey="entregas"
              stroke="#60a5fa"
              strokeWidth={2.5}
              fill="url(#deliveryFill)"
              fillOpacity={1}
              activeDot={{ r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="transitos"
              stroke="#34d399"
              strokeWidth={2.5}
              fill="url(#transitFill)"
              fillOpacity={1}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
};
