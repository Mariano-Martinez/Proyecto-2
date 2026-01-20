export enum Plan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
  BUSINESS = 'BUSINESS',
  ENTERPRISE = 'ENTERPRISE',
}

export enum ShipmentStatus {
  CREATED = 'CREATED',
  DISPATCHED = 'DISPATCHED',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CUSTOMS = 'CUSTOMS',
  ISSUE = 'ISSUE',
}

export enum Courier {
  ANDREANI = 'Andreani',
  VIA_CARGO = 'Via Cargo',
  OCA = 'OCA',
  CORREO_ARGENTINO = 'Correo Argentino',
  URBANO = 'Urbano',
  DHL = 'DHL',
  FEDEX = 'FedEx',
  UPS = 'UPS',
  UNKNOWN = 'Desconocido',
}

export type TimelineEvent = {
  id: string;
  label: string;
  date: string;
  location?: string;
};

export type Shipment = {
  id: string;
  code: string;
  alias: string;
  courier: Courier;
  status: ShipmentStatus;
  createdAt: string;
  lastUpdated: string;
  origin?: string;
  destination?: string;
  eta?: string;
  events: TimelineEvent[];
};
