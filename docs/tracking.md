# Arquitectura de tracking

## Modelo normalizado
El modelo normalizado vive en `src/lib/tracking/types.ts` y representa un tracking agnóstico al courier. Las pantallas consumen únicamente este modelo para mostrar eventos y estado.

## Providers
Los providers viven en `src/lib/tracking/providers/` y cada uno implementa el contrato `TrackingProvider` para devolver `TrackingNormalized`.

- Registro/dispatcher: `src/lib/tracking/providers/index.ts`
- Andreani: `src/lib/tracking/providers/andreani.ts`

El provider de Andreani usa Playwright para interceptar el XHR de `tracking-api.andreani.com` y normaliza la respuesta.

## Utilidades compartidas
- Sanitización HTML: `src/lib/tracking/sanitize.ts`
- Fechas: `src/lib/tracking/dates.ts`

## API
Endpoint genérico:
```
GET /api/tracking/refresh?carrier=andreani&trackingNumber=3600...
```

Retorna `{ ok: true, data: TrackingNormalized }`.

## Setup
Instalar dependencias y Playwright:
```
npm install
npx playwright install chromium
```

## Smoke test
Con la app corriendo en `localhost:3000`:
```
npm run tracking:smoke -- --carrier=andreani --trackingNumber=TU_NUMERO
```
