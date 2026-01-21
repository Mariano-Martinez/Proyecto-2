'use client';

import { detectCourier } from './detection';
import { planLimits } from './plans';
import { getNextStatus, isActiveStatus } from './state';
import { Courier, Plan, Shipment, ShipmentStatus, TimelineEvent } from './types';

const STORAGE_KEYS = {
  shipments: 'trackhub_shipments',
  recentlyViewedShipments: 'trackhub_recently_viewed_shipments',
  auth: 'trackhub_auth',
  plan: 'trackhub_plan',
  redirect: 'trackhub_redirect',
  user: 'trackhub_user',
};

const nowISO = () => new Date().toISOString();

const readLocal = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error('Failed to parse storage', key, err);
    return null;
  }
};

const writeLocal = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

const MAX_RECENTLY_VIEWED = 7;

const getRecentlyViewedIds = () => readLocal<string[]>(STORAGE_KEYS.recentlyViewedShipments) ?? [];

const setRecentlyViewedIds = (ids: string[]) => writeLocal(STORAGE_KEYS.recentlyViewedShipments, ids);

export const getShipments = (): Shipment[] => {
  if (typeof window === 'undefined') return [];
  const stored = readLocal<Shipment[]>(STORAGE_KEYS.shipments) ?? [];
  const normalized = stored.map((shipment) => ({
    ...shipment,
    createdAt: shipment.createdAt ?? shipment.lastUpdated ?? nowISO(),
  }));
  if (normalized.some((shipment, index) => shipment.createdAt !== stored[index]?.createdAt)) {
    writeLocal(STORAGE_KEYS.shipments, normalized);
  }
  return normalized;
};

export const addShipment = (data: {
  code: string;
  alias?: string;
  courier?: Courier;
  prefilled?: Partial<Shipment>;
}): Shipment => {
  const shipments = getShipments();
  const plan = getPlan();
  const active = shipments.filter((s) => isActiveStatus(s.status)).length;
  const limit = planLimits[plan];
  if (active >= limit) {
    throw new Error('PLAN_LIMIT');
  }
  const courier = data.prefilled?.courier ?? data.courier ?? detectCourier(data.code);
  const createdAt = nowISO();
  const newShipment: Shipment = {
    id: crypto.randomUUID(),
    code: data.code,
    alias: data.alias?.trim() || 'Envío sin alias',
    courier,
    status: data.prefilled?.status ?? ShipmentStatus.CREATED,
    createdAt,
    lastUpdated: data.prefilled?.lastUpdated ?? createdAt,
    origin: data.prefilled?.origin ?? 'Buenos Aires',
    destination: data.prefilled?.destination ?? 'Argentina',
    eta: data.prefilled?.eta ?? 'Próximamente',
    events:
      data.prefilled && 'events' in data.prefilled
        ? data.prefilled?.events && data.prefilled.events.length > 0
          ? [...data.prefilled.events].sort((a, b) => (a.date < b.date ? 1 : -1))
          : []
        : [
            {
              id: 'created',
              label: 'Envío creado',
              date: createdAt,
            },
          ],
  };
  const updated = [newShipment, ...shipments];
  writeLocal(STORAGE_KEYS.shipments, updated);
  return newShipment;
};

export const updateShipment = (id: string, data: Partial<Shipment>) => {
  const shipments = getShipments();
  const updated = shipments.map((s) => (s.id === id ? { ...s, ...data, lastUpdated: nowISO() } : s));
  writeLocal(STORAGE_KEYS.shipments, updated);
};

export const applyPrefilledShipment = (id: string, data: Partial<Shipment>): Shipment | null => {
  const shipments = getShipments();
  let updatedShipment: Shipment | null = null;
  const updated = shipments.map((s) => {
    if (s.id !== id) return s;
    const incomingEvents = data.events?.filter((ev) => !`${ev.id}`.endsWith('-fallback'));
    const next: Shipment = {
      ...s,
      ...data,
      courier: data.courier ?? s.courier,
      status: data.status ?? s.status,
      origin: data.origin ?? s.origin,
      destination: data.destination ?? s.destination,
      eta: data.eta ?? s.eta,
      lastUpdated: data.lastUpdated ?? s.lastUpdated ?? nowISO(),
      events:
        incomingEvents && incomingEvents.length > 0
          ? [...incomingEvents].sort((a, b) => (a.date < b.date ? 1 : -1))
          : s.events,
    };
    updatedShipment = next;
    return next;
  });
  writeLocal(STORAGE_KEYS.shipments, updated);
  return updatedShipment;
};

export const deleteShipment = (id: string) => {
  const shipments = getShipments();
  const updated = shipments.filter((s) => s.id !== id);
  writeLocal(STORAGE_KEYS.shipments, updated);
  const currentRecent = getRecentlyViewedIds();
  const nextRecent = currentRecent.filter((recentId) => recentId !== id);
  if (nextRecent.length !== currentRecent.length) {
    setRecentlyViewedIds(nextRecent);
  }
};

export const simulateProgress = (id: string) => {
  const shipments = getShipments();
  const updated = shipments.map((s) => {
    if (s.id !== id) return s;
    const nextStatus = getNextStatus(s.status);
    const event: TimelineEvent = {
      id: `${id}-${Date.now()}`,
      label: `Estado: ${nextStatus}`,
      date: nowISO(),
    };
    return { ...s, status: nextStatus, lastUpdated: nowISO(), events: [event, ...s.events] };
  });
  writeLocal(STORAGE_KEYS.shipments, updated);
};

export const getAuth = () => {
  if (typeof window === 'undefined') return false;
  return readLocal<boolean>(STORAGE_KEYS.auth) ?? false;
};

export const setAuth = (flag: boolean) => writeLocal(STORAGE_KEYS.auth, flag);

export const clearAuth = () => {
  writeLocal(STORAGE_KEYS.auth, false);
  writeLocal(STORAGE_KEYS.user, '');
};

export const getPlan = (): Plan => {
  if (typeof window === 'undefined') return Plan.FREE;
  return (readLocal<Plan>(STORAGE_KEYS.plan) as Plan) ?? Plan.FREE;
};

export const setPlan = (plan: Plan) => writeLocal(STORAGE_KEYS.plan, plan);

export const setRedirectPath = (path: string) => writeLocal(STORAGE_KEYS.redirect, path);
export const consumeRedirectPath = (): string | null => {
  const value = readLocal<string>(STORAGE_KEYS.redirect);
  if (value) writeLocal(STORAGE_KEYS.redirect, '');
  return value;
};

type StoredUser = {
  name?: string;
  email?: string;
  provider?: string;
};

export const setUser = (user: StoredUser) => writeLocal(STORAGE_KEYS.user, user);
export const getUser = (): StoredUser | null => readLocal<StoredUser>(STORAGE_KEYS.user);
export const clearUser = () => writeLocal(STORAGE_KEYS.user, '');

export const getUsage = () => {
  const shipments = getShipments();
  const plan = getPlan();
  const active = shipments.filter((s) => isActiveStatus(s.status)).length;
  return { active, limit: planLimits[plan], plan };
};

export const overwriteShipments = (shipments: Shipment[]) => writeLocal(STORAGE_KEYS.shipments, shipments);

export const markShipmentViewed = (id: string) => {
  const shipments = getShipments();
  if (!shipments.some((shipment) => shipment.id === id)) return;
  const current = getRecentlyViewedIds();
  const next = [id, ...current.filter((item) => item !== id)].slice(0, MAX_RECENTLY_VIEWED);
  setRecentlyViewedIds(next);
};

export const getRecentlyViewedShipments = (): Shipment[] => {
  const shipments = getShipments();
  const shipmentMap = new Map(shipments.map((shipment) => [shipment.id, shipment]));
  const ids = getRecentlyViewedIds();
  const normalized = ids.filter((id) => shipmentMap.has(id));
  if (normalized.length !== ids.length) {
    setRecentlyViewedIds(normalized);
  }
  return normalized.map((id) => shipmentMap.get(id)!).slice(0, MAX_RECENTLY_VIEWED);
};
