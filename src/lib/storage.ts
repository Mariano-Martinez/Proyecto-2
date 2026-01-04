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
  demo: 'trackhub_demo',
};

const nowISO = () => new Date().toISOString();

const demoEvents = (status: ShipmentStatus): TimelineEvent[] => [
  {
    id: 'evt-created',
    label: 'Envío creado',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'evt-dispatched',
    label: 'Paquete despachado',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'evt-status',
    label: `Estado actual: ${status}`,
    date: nowISO(),
  },
];

const demoShipments = (): Shipment[] => [
  {
    id: 's1',
    code: 'AN123456789012',
    alias: 'Zapatillas ML',
    courier: Courier.ANDREANI,
    status: ShipmentStatus.IN_TRANSIT,
    lastUpdated: nowISO(),
    origin: 'Córdoba',
    destination: 'Buenos Aires',
    eta: '2 días',
    events: demoEvents(ShipmentStatus.IN_TRANSIT),
  },
  {
    id: 's2',
    code: 'OC9988776655',
    alias: 'Regalo mamá',
    courier: Courier.OCA,
    status: ShipmentStatus.OUT_FOR_DELIVERY,
    lastUpdated: nowISO(),
    origin: 'Rosario',
    destination: 'Mendoza',
    eta: 'Hoy',
    events: demoEvents(ShipmentStatus.OUT_FOR_DELIVERY),
  },
  {
    id: 's3',
    code: 'AR4455667788',
    alias: 'Compra internacional',
    courier: Courier.CORREO_ARGENTINO,
    status: ShipmentStatus.CUSTOMS,
    lastUpdated: nowISO(),
    origin: 'Miami',
    destination: 'Buenos Aires',
    eta: '5 días',
    events: demoEvents(ShipmentStatus.CUSTOMS),
  },
  {
    id: 's4',
    code: 'DHL1234567890',
    alias: 'Repuestos bici',
    courier: Courier.DHL,
    status: ShipmentStatus.DELIVERED,
    lastUpdated: nowISO(),
    origin: 'Berlin',
    destination: 'Mar del Plata',
    eta: 'Entregado',
    events: demoEvents(ShipmentStatus.DELIVERED),
  },
  {
    id: 's5',
    code: '1Z999AA10123456784',
    alias: 'Laptop',
    courier: Courier.UPS,
    status: ShipmentStatus.DISPATCHED,
    lastUpdated: nowISO(),
    origin: 'San Francisco',
    destination: 'Buenos Aires',
    eta: '7 días',
    events: demoEvents(ShipmentStatus.DISPATCHED),
  },
];

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

const ensureSeed = () => {
  if (typeof window === 'undefined') return [] as Shipment[];
  const existing = readLocal<Shipment[]>(STORAGE_KEYS.shipments);
  const plan = getPlan();
  if (existing && existing.length) return existing;
  const seeded = demoShipments();
  if (plan === Plan.FREE) {
    let activeCount = 0;
    seeded.forEach((shipment) => {
      if (isActiveStatus(shipment.status)) {
        activeCount += 1;
        if (activeCount > 3) {
          shipment.status = ShipmentStatus.DELIVERED;
          shipment.events.push({
            id: `${shipment.id}-delivered`,
            label: 'Entregado (limitado por plan)',
            date: nowISO(),
          });
        }
      }
    });
  }
  writeLocal(STORAGE_KEYS.shipments, seeded);
  return seeded;
};

export const getShipments = (): Shipment[] => {
  if (typeof window === 'undefined') return [];
  return ensureSeed();
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

export const getUsage = () => {
  const shipments = getShipments();
  const plan = getPlan();
  const active = shipments.filter((s) => isActiveStatus(s.status)).length;
  return { active, limit: planLimits[plan], plan };
};

export const overwriteShipments = (shipments: Shipment[]) => writeLocal(STORAGE_KEYS.shipments, shipments);
