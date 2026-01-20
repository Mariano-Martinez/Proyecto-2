'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuthGuard } from '@/lib/hooks';
import { deleteShipment, getShipments, getUsage } from '@/lib/storage';
import { Courier, Shipment, ShipmentStatus } from '@/lib/types';
import { ShipmentCard } from '@/components/ShipmentCard';
import { ShipmentTable } from '@/components/ShipmentTable';
import { ArrowDownTrayIcon, FunnelIcon, Squares2X2Icon, TableCellsIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AppShell } from '@/components/layout/AppShell';
import { Toast, useToast } from '@/components/Toast';
import { motion } from 'framer-motion';
import { fadeInUp, listStagger } from '@/lib/motion';

export default function ShipmentsPage() {
  const ready = useAuthGuard();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [status, setStatus] = useState<string>('all');
  const [courier, setCourier] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [usage, setUsage] = useState<{ active: number; limit: number }>({ active: 0, limit: 3 });
  const [page, setPage] = useState(1);
  const { toast, showToast, clearToast } = useToast();
  const pageSize = 6;

  const handleDelete = (id: string) => {
    if (!window.confirm('¿Eliminar este envío?')) return;
    deleteShipment(id);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    refresh();
    showToast('Envío eliminado');
  };

  useEffect(() => {
    if (!ready) return;
    if (typeof window !== 'undefined') {
      setView(window.innerWidth >= 1024 ? 'table' : 'cards');
    }
    refresh();
  }, [ready]);

  useEffect(() => {
    setPage(1);
  }, [status, courier, search, view]);

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

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const bulkDelete = () => {
    if (!window.confirm('¿Eliminar envíos seleccionados?')) return;
    selected.forEach((id) => deleteShipment(id));
    setSelected(new Set());
    refresh();
    showToast('Selección eliminada');
  };

  const exportSelected = () => {
    const rows = shipments.filter((s) => selected.has(s.id));
    if (rows.length === 0) return;
    const header = ['Alias', 'Courier', 'Código', 'Estado', 'Actualizado'];
    const csv = [header.join(',')].concat(
      rows.map((s) =>
        [s.alias, s.courier, s.code, s.status, new Date(s.lastUpdated).toISOString().slice(0, 10)].join(',')
      )
    );
    const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'envios.csv';
    link.click();
    showToast('Exportado como CSV');
  };

  const handleCopy = () => showToast('Código copiado');
  const clearSelection = () => setSelected(new Set());

  useEffect(() => {
    setSelected((prev) => new Set([...prev].filter((id) => shipments.some((s) => s.id === id))));
  }, [shipments]);

  if (!ready) return null;

  return (
    <AppShell>
      <motion.div className="space-y-4" variants={listStagger} initial="initial" animate="animate">
        <motion.div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" variants={fadeInUp}>
          <div>
            <p className="text-sm font-semibold text-sky-600">Gestión de envíos</p>
            <h1 className="text-3xl font-black text-slate-900">Mis envíos</h1>
            <p className="text-sm text-slate-600">
              Activos: {usage.active} / {usage.limit === Infinity ? '∞' : usage.limit}
            </p>
          </div>
          <div className="panel flex items-center gap-2 rounded-full p-1">
            <button
              onClick={() => setView('cards')}
              className={`ui-transition ui-press ui-focus-ring rounded-full px-4 py-2 text-sm font-semibold ${
                view === 'cards'
                  ? 'bg-[rgb(var(--muted))] text-[rgb(var(--foreground))] shadow-sm ring-1 ring-[rgb(var(--border))]'
                  : 'text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))]'
              }`}
            >
              <Squares2X2Icon className="mr-1 inline h-4 w-4" /> Cards
            </button>
            <button
              onClick={() => setView('table')}
              className={`ui-transition ui-press ui-focus-ring rounded-full px-4 py-2 text-sm font-semibold ${
                view === 'table'
                  ? 'bg-[rgb(var(--muted))] text-[rgb(var(--foreground))] shadow-sm ring-1 ring-[rgb(var(--border))]'
                  : 'text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))]'
              }`}
            >
              <TableCellsIcon className="mr-1 inline h-4 w-4" /> Tabla
            </button>
          </div>
        </motion.div>

        <motion.div className="panel mt-4 grid gap-4 rounded-2xl p-4 sm:grid-cols-2 lg:grid-cols-4" variants={fadeInUp}>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-[rgb(var(--muted-foreground))]">Estado</p>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Todos</option>
              {Object.values(ShipmentStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-[rgb(var(--muted-foreground))]">Courier</p>
            <select className="input" value={courier} onChange={(e) => setCourier(e.target.value)}>
              <option value="all">Todos</option>
              {Object.values(Courier).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs uppercase tracking-wide text-[rgb(var(--muted-foreground))]">Buscar</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                className="input"
                placeholder="Alias o código"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="ui-transition hidden rounded-xl bg-[rgb(var(--muted))] px-3 py-2 text-xs text-[rgb(var(--muted-foreground))] ring-1 ring-[rgb(var(--border))] sm:inline-flex">
                <FunnelIcon className="mr-1 h-4 w-4" /> Filtros móviles acá
              </span>
            </div>
          </div>
        </motion.div>

        {selected.size > 0 && (
          <motion.div
            className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-3"
            variants={fadeInUp}
          >
            <div className="text-sm font-semibold text-[rgb(var(--foreground))]">{selected.size} seleccionados</div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={exportSelected}
                className="btn-secondary rounded-xl px-4 py-2"
                title="Exportar selección"
              >
                <ArrowDownTrayIcon className="mr-1 inline h-4 w-4" /> Exportar CSV
              </button>
              <button onClick={bulkDelete} className="btn-primary rounded-xl px-4 py-2">
                <TrashIcon className="mr-1 inline h-4 w-4" /> Eliminar
              </button>
            </div>
          </motion.div>
        )}

        <motion.div className="mt-6 space-y-4" variants={fadeInUp}>
          {view === 'table' ? (
            <div className="hidden lg:block">
              <ShipmentTable
                shipments={paginated}
                onDelete={handleDelete}
                selectable
                selectedIds={selected}
                onToggleSelect={toggleSelect}
                onCopy={handleCopy}
              />
              <div className="panel mt-2 flex items-center justify-between rounded-xl px-4 py-3 text-sm text-[rgb(var(--muted-foreground))]">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[rgb(var(--border))] bg-[rgb(var(--panel-bg))] text-sky-500"
                    checked={selected.size === paginated.length && paginated.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected(new Set(paginated.map((s) => s.id)));
                      } else {
                        clearSelection();
                      }
                    }}
                  />
                  <span>Seleccionar todos</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="ui-transition ui-press ui-focus-ring rounded-lg border border-[rgb(var(--border))] px-3 py-2 text-xs font-semibold text-[rgb(var(--foreground))] hover:border-sky-400/60 hover:text-sky-300 disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Anterior
                  </button>
                  <span className="text-xs text-[rgb(var(--muted-foreground))]">
                    Página {page} de {totalPages}
                  </span>
                  <button
                    className="ui-transition ui-press ui-focus-ring rounded-lg border border-[rgb(var(--border))] px-3 py-2 text-xs font-semibold text-[rgb(var(--foreground))] hover:border-sky-400/60 hover:text-sky-300 disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 lg:hidden">
              {paginated.map((shipment) => (
                <ShipmentCard key={shipment.id} shipment={shipment} onDelete={handleDelete} onCopy={handleCopy} />
              ))}
              {filtered.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--panel-bg))] p-6 text-center text-sm text-[rgb(var(--muted-foreground))]">
                  No hay envíos con estos filtros.
                </div>
              )}
              {filtered.length > pageSize && (
                <div className="panel flex items-center justify-between rounded-xl px-4 py-3 text-sm text-[rgb(var(--muted-foreground))]">
                  <div>
                    Página {page} de {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="ui-transition ui-press ui-focus-ring rounded-lg border border-[rgb(var(--border))] px-3 py-2 text-xs font-semibold text-[rgb(var(--foreground))] hover:border-sky-400/60 hover:text-sky-300 disabled:pointer-events-none disabled:opacity-50"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Anterior
                    </button>
                    <button
                      className="ui-transition ui-press ui-focus-ring rounded-lg border border-[rgb(var(--border))] px-3 py-2 text-xs font-semibold text-[rgb(var(--foreground))] hover:border-sky-400/60 hover:text-sky-300 disabled:pointer-events-none disabled:opacity-50"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
      <Toast toast={toast} onClose={clearToast} />
    </AppShell>
  );
}
