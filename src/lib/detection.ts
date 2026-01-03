import { Courier } from './types';

export const detectCourier = (code: string): Courier => {
  const value = code.trim().toUpperCase();
  if (value.startsWith('1Z')) return Courier.UPS;
  if (value.startsWith('OC')) return Courier.OCA;
  if (value.startsWith('AR')) return Courier.CORREO_ARGENTINO;
  if (/DHL/.test(value) || value.length === 10) return Courier.DHL;
  if (/FDX/.test(value) || value.length === 12) return Courier.FEDEX;
  if (/URB/.test(value)) return Courier.URBANO;
  if (/AN/.test(value) || value.length === 14) return Courier.ANDREANI;
  return Courier.UNKNOWN;
};
