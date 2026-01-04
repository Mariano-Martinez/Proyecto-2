'use client';

import { detectCourier } from './detection';
import { planLimits } from './plans';
import { getNextStatus, isActiveStatus } from './state';
import { Courier, Plan, Shipment, ShipmentStatus, TimelineEvent } from './types';

const STORAGE_KEYS = {
  shipments: 'trackhub_shipments',
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

export const getShipments = (): Shipment[] => {
  if (typeof window === 'undefined') return [];
  return readLocal<Shipment[]>(STORAGE_KEYS.shipments) ?? [];
};

export const addShipment = (data: {
  code: string;
  alias?: string;
  courier?: Courier;
}): Shipment => {
  const shipments = getShipments();
  const plan = getPlan();
  const active = shipments.filter((s) => isActiveStatus(s.status)).length;
  const limit = planLimits[plan];
  if (active >= limit) {
    throw new Error('PLAN_LIMIT');
  }
  const courier = data.courier ?? detectCourier(data.code);
  const newShipment: Shipment = {
    id: crypto.randomUUID(),
    code: data.code,
    alias: data.alias?.trim() || 'Envío sin alias',
    courier,
    status: ShipmentStatus.CREATED,
    lastUpdated: nowISO(),
    origin: 'Buenos Aires',
    destination: 'Argentina',
    eta: 'Próximamente',
    events: [
      {
        id: 'created',
        label: 'Envío creado',
        date: nowISO(),
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

export const deleteShipment = (id: string) => {
  const shipments = getShipments();
  const updated = shipments.filter((s) => s.id !== id);
  writeLocal(STORAGE_KEYS.shipments, updated);
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
