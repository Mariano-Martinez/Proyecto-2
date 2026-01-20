'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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
  backgroundColor: 'rgba(15, 23, 42, 0.9)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  borderRadius: '12px',
  padding: '8px 12px',
};

export const ShipmentsActivityChart = () => {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">Actividad de Envíos</h3>
          <p className="mt-1 text-sm text-[rgb(var(--muted-foreground))]">Frecuencia de entregas vs tránsitos</p>
        </div>
        <select className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2 text-xs font-semibold text-[rgb(var(--foreground))] outline-none">
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
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 12 }} />
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
    </div>
  );
};
