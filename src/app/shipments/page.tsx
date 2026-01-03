'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { useAuthGuard } from '@/lib/hooks';
import { deleteShipment, getShipments, getUsage } from '@/lib/storage';
import { Courier, Shipment, ShipmentStatus } from '@/lib/types';
import { ShipmentCard } from '@/components/ShipmentCard';
import { ShipmentTable } from '@/components/ShipmentTable';
import { FunnelIcon, Squares2X2Icon, TableCellsIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ShipmentsPage() {
  const ready = useAuthGuard();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [status, setStatus] = useState<string>('all');
  const [courier, setCourier] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [usage, setUsage] = useState<{ active: number; limit: number }>({ active: 0, limit: 3 });
  const handleDelete = (id: string) => {
    deleteShipment(id);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    refresh();
  };

  useEffect(() => {
    if (!ready) return;
    if (typeof window !== 'undefined') {
      setView(window.innerWidth >= 1024 ? 'table' : 'cards');
    }
    refresh();
  }, [ready]);

  const refresh = () => {
    setShipments(getShipments());
    const u = getUsage();
    setUsage({ active: u.active, limit: u.limit });
  };

  const filtered = useMemo(() => {
    return shipments.filter((s) => {
      const matchStatus = status === 'all' || s.status === status;
      const matchCourier = courier === 'all' || s.courier === courier;
      const q = search.toLowerCase();
      const matchSearch = s.alias.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
      return matchStatus && matchCourier && matchSearch;
    });
  }, [shipments, status, courier, search]);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const bulkDelete = () => {
    selected.forEach((id) => deleteShipment(id));
    setSelected(new Set());
    refresh();
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="lg:flex">
        <Sidebar />
        <main className="flex-1 px-4 pb-24 pt-4 lg:px-8 lg:pb-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-sky-600">Gestión de envíos</p>
              <h1 className="text-3xl font-black text-slate-900">Mis envíos</h1>
              <p className="text-sm text-slate-600">
                Activos: {usage.active} / {usage.limit === Infinity ? '∞' : usage.limit}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('cards')}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                  view === 'cards' ? 'border-sky-200 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600'
                }`}
              >
                <Squares2X2Icon className="mr-1 inline h-4 w-4" /> Cards
              </button>
              <button
                onClick={() => setView('table')}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                  view === 'table' ? 'border-sky-200 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600'
                }`}
              >
                <TableCellsIcon className="mr-1 inline h-4 w-4" /> Tabla
              </button>
              {selected.size > 0 && (
                <button onClick={bulkDelete} className="btn-primary rounded-xl px-4 py-2">
                  <TrashIcon className="mr-1 inline h-4 w-4" /> Eliminar ({selected.size})
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs uppercase text-slate-500">Estado</p>
              <select className="input mt-1" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="all">Todos</option>
                {Object.values(ShipmentStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Courier</p>
              <select className="input mt-1" value={courier} onChange={(e) => setCourier(e.target.value)}>
                <option value="all">Todos</option>
                {Object.values(Courier).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase text-slate-500">Buscar</p>
              <div className="flex items-center gap-2">
                <input
                  className="input mt-1"
                  placeholder="Alias o código"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span className="hidden rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-600 sm:inline-flex">
                  <FunnelIcon className="mr-1 h-4 w-4" /> Filtros mobile en este bloque
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {view === 'table' ? (
              <div className="hidden lg:block">
                <ShipmentTable
                  shipments={filtered}
                  onDelete={handleDelete}
                  selectable
                  selectedIds={selected}
                  onToggleSelect={toggleSelect}
                />
                {filtered.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
                    No hay envíos con esos filtros.
                  </div>
                )}
              </div>
            ) : null}

            {view === 'cards' && (
              <div className="grid gap-3 sm:grid-cols-2">
                {filtered.map((shipment) => (
                  <div key={shipment.id} className={`relative ${selected.has(shipment.id) ? 'ring-2 ring-sky-400' : ''}`}>
                    <label className="absolute right-3 top-3 inline-flex items-center gap-1 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-sky-600"
                        checked={selected.has(shipment.id)}
                        onChange={() => toggleSelect(shipment.id)}
                      />
                      Sel.
                    </label>
                    <ShipmentCard shipment={shipment} onDelete={handleDelete} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
