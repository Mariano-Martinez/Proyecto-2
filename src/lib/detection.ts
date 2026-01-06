import { Courier } from './types';

export const detectCourier = (code: string): Courier => {
  const value = code.trim().toUpperCase();
  const digitsOnly = value.replace(/[^0-9]/g, '');
  if (value.startsWith('1Z')) return Courier.UPS;
  if (value.startsWith('OC')) return Courier.OCA;
  if (value.startsWith('AR')) return Courier.CORREO_ARGENTINO;
  if (/DHL/.test(value) || value.length === 10) return Courier.DHL;
  if (/FDX/.test(value) || value.length === 12) return Courier.FEDEX;
  if (/URB/.test(value)) return Courier.URBANO;
  if (/AN/.test(value)) return Courier.ANDREANI;
  if (/^\d{14,16}$/.test(digitsOnly)) return Courier.ANDREANI;
  return Courier.UNKNOWN;
};
