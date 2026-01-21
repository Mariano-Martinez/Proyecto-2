import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Soporte — TrackHub AR',
  description: 'Canales oficiales de soporte y resolución de incidencias de TrackHub AR.',
};

export default function SoportePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold sm:text-4xl">Soporte — TrackHub AR (formal)</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Última actualización: [COMPLETAR FECHA]</p>
        </header>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <p>En esta sección encontrará los canales oficiales de atención y resolución de incidencias de TrackHub AR.</p>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">1. Canales de contacto</h2>
            <p>Correo electrónico: [COMPLETAR EMAIL DE SOPORTE]</p>
            <p>Horario de atención: [COMPLETAR HORARIO]</p>
            <p>Tiempo estimado de respuesta: 24 a 72 horas hábiles</p>
            <p>Para facilitar la atención, sugerimos incluir en el asunto del mensaje:</p>
            <p>“Soporte TrackHub AR – Consulta”</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              2. Asistencia sobre seguimiento de envíos
            </h2>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">2.1 Código de seguimiento no reconocido</h3>
            <p>Verifique que el código:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>esté completo y sin espacios,</li>
              <li>coincida con el formato del Courier (por ejemplo, letras y números en un único bloque),</li>
              <li>corresponda a un envío vigente.</li>
            </ul>
            <p>En algunos casos, el Courier puede demorar en registrar o publicar movimientos del envío.</p>

            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">2.2 Estado sin actualización</h3>
            <p>Los estados pueden presentar demoras debido a:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>retrasos en la publicación de eventos por parte del Courier,</li>
              <li>períodos sin movimientos operativos,</li>
              <li>interrupciones temporales de servicios externos.</li>
            </ul>
            <p>Para envíos urgentes, se recomienda contrastar con la fuente oficial del Courier.</p>

            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">2.3 Notificaciones no recibidas</h3>
            <p>Si las notificaciones no se reciben, se sugiere:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>revisar permisos del navegador/dispositivo,</li>
              <li>revisar bandejas de correo no prioritarias o spam,</li>
              <li>verificar configuración del envío dentro de TrackHub AR.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">3. Reporte de errores (recomendado)</h2>
            <p>Para reportar un inconveniente con mayor precisión, incluya:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Descripción de la acción realizada:</li>
              <li>Resultado esperado:</li>
              <li>Resultado obtenido:</li>
              <li>Courier y código de seguimiento (si aplica):</li>
              <li>Capturas o video (si es posible):</li>
              <li>Navegador y dispositivo:</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">4. Solicitudes de mejora</h2>
            <p>TrackHub AR recibe propuestas de nuevas funciones e integraciones. Puede enviar sugerencias a:</p>
            <p>[COMPLETAR EMAIL DE SOPORTE]</p>
            <p>Asunto sugerido: “Sugerencia TrackHub AR”</p>
          </section>
        </div>
      </div>
    </main>
  );
}
