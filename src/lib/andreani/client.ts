import { ShipmentStatus, TimelineEvent } from '@/lib/types';
import { AndreaniTrackingNormalized } from './types';

export const mapAndreaniEstadoToStatus = (estado: string | null): ShipmentStatus => {
  if (!estado) return ShipmentStatus.IN_TRANSIT;
  const value = estado.toLowerCase();
  if (value.includes('entregado') || value.includes('entrega')) return ShipmentStatus.DELIVERED;
  if (value.includes('en camino') || value.includes('en viaje') || value.includes('transito') || value.includes('tránsito')) {
    return ShipmentStatus.IN_TRANSIT;
  }
  if (value.includes('pendiente de ingreso') || value.includes('pendiente')) return ShipmentStatus.CREATED;
  if (value.includes('ingresado') || value.includes('ingreso') || value.includes('preparacion')) return ShipmentStatus.DISPATCHED;
  if (value.includes('listo para retiro') || value.includes('out for delivery') || value.includes('en reparto')) {
    return ShipmentStatus.OUT_FOR_DELIVERY;
  }
  if (value.includes('incidencia') || value.includes('visita fallida') || value.includes('no responde') || value.includes('demorado')) {
    return ShipmentStatus.ISSUE;
  }
  return ShipmentStatus.IN_TRANSIT;
};

export const flattenAndreaniTimelines = (tracking: AndreaniTrackingNormalized): TimelineEvent[] => {
  const fallbackDate = tracking.fechaUltimoEvento ?? new Date().toISOString();
  return tracking.timelines.flatMap((timeline, timelineIndex) =>
    timeline.eventos.map((evento, eventIndex) => ({
      id: `${timelineIndex}-${eventIndex}-${evento.fecha ?? 'sin-fecha'}`,
      label: evento.texto ?? 'Evento',
      date: evento.fecha ?? fallbackDate,
      location: evento.sucursalNombre ?? undefined,
    }))
  );
};
