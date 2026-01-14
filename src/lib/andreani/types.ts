export type AndreaniTimelineEvent = {
  fecha: string | null;
  texto: string | null;
  sucursalNombre: string | null;
};

export type AndreaniTimeline = {
  orden: number | null;
  titulo: string | null;
  eventos: AndreaniTimelineEvent[];
};

export type AndreaniTrackingNormalized = {
  numeroAndreani: string | null;
  estado: string | null;
  fechaUltimoEvento: string | null;
  fechaEstimadaEntrega: string | null;
  timelines: AndreaniTimeline[];
};
