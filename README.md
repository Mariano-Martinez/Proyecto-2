# TrackHub AR (mock)

TrackHub AR es un mock de una aplicación Next.js (App Router) para unificar el seguimiento de envíos de Argentina. Usa datos en `localStorage`, límites por plan y flujos de autenticación simulados para que puedas navegar el producto sin backend.

## Stack
- Next.js 14 (App Router) + TypeScript
- TailwindCSS
- React (client components donde se necesita `localStorage`)

## Cómo correr el proyecto
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Levantar el entorno de desarrollo:
   ```bash
   npm run dev
   ```
3. Abrir en el navegador: `http://localhost:3000`

> Nota: el entorno usa `localStorage`. Si limpiás el storage del navegador, se re-seedean los envíos mock y se resetea el flag de autenticación.

## Rutas principales
- `/` Landing con hero, cómo funciona, couriers soportados y resumen de pricing.
- `/pricing` Comparativa completa de planes, tabla de features, FAQ y lógica para guardar el plan en `localStorage`.
- `/dashboard` Vista principal con sidebar desktop/bottom nav mobile, métricas, plan actual y listado de envíos.
- `/shipments` Gestión con filtros, selección múltiple y cambio de vista (cards/tabla).
- `/shipments/[id]` Detalle con timeline y botón “Simular actualización” que avanza el estado.
- `/integrations` UI mock para integraciones (MercadoLibre/Gmail/Shopify) con gating de plan.
- `/settings` Perfil mock, preferencias de notificaciones/tema y gestión de plan.

## Lógica mock
- **Planes**: enum `Plan` (FREE, BASIC, PRO, BUSINESS, ENTERPRISE) con límites activos (3, 15, 50, 200, ∞). Persistidos en `localStorage`.
- **Auth**: flag booleano `auth=true` en `localStorage`. Las rutas protegidas redirigen a `/login` (o la landing) si no hay sesión.
- **Envíos**: se guardan en `localStorage` con seed inicial de 5 envíos. Si el plan es FREE, se respetan 3 activos máximo (resto se marca entregado).
- **Detección de courier**: función `detectCourier` con reglas simples por prefijo/longitud.
- **State machine**: CREATED → DISPATCHED → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED (+ CUSTOMS, ISSUE). El botón “Simular actualización” avanza al siguiente estado y agrega eventos al timeline.

## Estructura rápida
- `src/app` Rutas App Router (landing, pricing, dashboard, shipments, integrations, settings).
- `src/components` UI reutilizable: sidebar, mobile nav, tablas/cards de envíos, badges, pricing, timeline, modal para agregar tracking.
- `src/lib` Tipos, planes/limits, storage service, detección de courier y helpers de estado/auth.
- `public/images` Placeholders de logos de couriers.

## Cómo conectar un backend real después
- **Storage service** (`src/lib/storage.ts`): reemplazá las lecturas/escrituras de `localStorage` por llamadas a API routes o un client HTTP. Mantiene la interfaz `getShipments/addShipment/updateShipment/deleteShipment/getPlan/setPlan/getAuth`.
- **Auth real**: cambiá `setAuth/getAuth` para usar sesiones/ JWT. Actualizá el guard (`useAuthGuard`) para verificar tokens en vez de `localStorage`.
- **Estados y eventos**: hoy se simulan en el cliente; podrías mover `simulateProgress` a un endpoint y consumir actualizaciones vía WebSockets o polling.

## Nota sobre el mock
Todo el contenido es estático o persistido en el navegador. No hay llamadas a APIs externas ni integraciones reales; la UI está lista para conectar servicios de correo más adelante.
