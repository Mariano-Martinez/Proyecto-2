import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad — TrackHub AR',
  description: 'Política de Privacidad de TrackHub AR y uso de Supabase.',
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-12 sm:py-16">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold sm:text-4xl">Política de Privacidad — TrackHub AR (con Supabase)</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Última actualización: [COMPLETAR FECHA]</p>
        </header>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            La presente Política de Privacidad describe cómo TrackHub AR recopila, utiliza y protege datos personales en
            el marco del uso del Servicio. TrackHub AR procura cumplir con la normativa aplicable, incluyendo la Ley
            25.326 de Protección de Datos Personales (Argentina), en lo que resulte pertinente.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">1. Responsable del tratamiento</h2>
            <p>TrackHub AR es responsable del tratamiento de los datos personales procesados en el marco del Servicio.</p>
            <p>Contacto: [COMPLETAR EMAIL DE PRIVACIDAD/SOPORTE]</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">2. Datos personales que recopilamos</h2>
            <p>TrackHub AR podrá recopilar y tratar las siguientes categorías:</p>

            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">2.1 Datos de cuenta</h3>
            <ul className="list-inside list-disc space-y-1">
              <li>correo electrónico,</li>
              <li>nombre o identificador público (si lo aporta el proveedor de autenticación),</li>
              <li>identificadores técnicos vinculados al inicio de sesión (por ejemplo, ID del proveedor).</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">2.2 Datos vinculados al uso del Servicio</h3>
            <ul className="list-inside list-disc space-y-1">
              <li>códigos de seguimiento ingresados por el Usuario,</li>
              <li>courier detectado o seleccionado,</li>
              <li>estados e historial de seguimiento disponibles,</li>
              <li>preferencias del Usuario (por ejemplo, notificaciones, organización de envíos).</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">2.3 Datos técnicos y de diagnóstico</h3>
            <ul className="list-inside list-disc space-y-1">
              <li>información básica del navegador/dispositivo,</li>
              <li>registros de errores y eventos técnicos,</li>
              <li>métricas de uso destinadas a mejorar rendimiento y estabilidad.</li>
            </ul>
            <p>
              TrackHub AR no solicita datos sensibles (por ejemplo, datos biométricos, salud o información financiera
              personal) como condición para el uso normal del Servicio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">3. Finalidades del tratamiento</h2>
            <p>TrackHub AR utiliza los datos para:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>gestionar el registro y autenticación del Usuario,</li>
              <li>brindar las funcionalidades principales del Servicio,</li>
              <li>almacenar la configuración y preferencias del Usuario,</li>
              <li>mejorar la experiencia, estabilidad y seguridad de la Plataforma,</li>
              <li>prevenir fraude, abuso y accesos no autorizados,</li>
              <li>cumplir obligaciones legales o requerimientos de autoridad competente.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">4. Base de datos y autenticación (Supabase)</h2>
            <p>TrackHub AR utiliza Supabase como proveedor de infraestructura para:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>autenticación y gestión de sesiones,</li>
              <li>almacenamiento de datos asociados a la cuenta y funcionamiento del Servicio,</li>
              <li>bases de datos y servicios vinculados.</li>
            </ul>
            <p>
              Supabase actúa como encargado del tratamiento o proveedor tecnológico, procesando información únicamente
              para posibilitar la operación de la Plataforma, conforme a sus condiciones y políticas aplicables.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">5. Cesión y compartición de datos</h2>
            <p>TrackHub AR no comercializa datos personales.</p>
            <p>Podremos compartir datos únicamente:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>con proveedores necesarios para operar el Servicio (infraestructura, autenticación, notificaciones),</li>
              <li>ante requerimiento legal válido,</li>
              <li>para proteger derechos, seguridad e integridad de TrackHub AR, Usuarios o terceros.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              6. Información proveniente de terceros (Couriers)
            </h2>
            <p>
              El estado y eventos de seguimiento pueden provenir de sistemas externos (Couriers y servicios asociados).
              TrackHub AR actúa como visualizador e integrador informativo, por lo que:
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>no controla dichos datos,</li>
              <li>no garantiza exactitud o actualización,</li>
              <li>la fuente oficial del envío es el Courier correspondiente.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">7. Cookies y tecnologías similares</h2>
            <p>La Plataforma puede utilizar cookies o tecnologías equivalentes con fines de:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>mantener sesión y autenticación,</li>
              <li>recordar preferencias del Usuario,</li>
              <li>mejorar rendimiento y seguridad.</li>
            </ul>
            <p>
              El Usuario puede gestionar cookies desde su navegador, entendiendo que algunas funciones podrían verse
              afectadas.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">8. Seguridad de la información</h2>
            <p>
              TrackHub AR adopta medidas razonables de seguridad para proteger la información, incluyendo mecanismos de
              acceso y transmisión segura. No obstante, ningún sistema puede garantizar seguridad absoluta.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">9. Conservación de datos</h2>
            <p>Los datos se conservarán:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>mientras exista una cuenta activa,</li>
              <li>durante el tiempo necesario para prestar el Servicio,</li>
              <li>o por períodos adicionales cuando sea requerido por obligaciones legales, seguridad o resolución de disputas.</li>
            </ul>
            <p>El Usuario podrá solicitar la eliminación de su cuenta, sujeto a limitaciones técnicas o legales razonables.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">10. Derechos del Usuario</h2>
            <p>El Usuario puede solicitar:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>acceso a sus datos,</li>
              <li>rectificación,</li>
              <li>actualización,</li>
              <li>eliminación,</li>
              <li>información sobre el tratamiento.</li>
            </ul>
            <p>Para ejercer estos derechos, contactarse a:</p>
            <p>[COMPLETAR EMAIL DE PRIVACIDAD/SOPORTE]</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">11. Modificaciones</h2>
            <p>TrackHub AR podrá actualizar esta Política. Las modificaciones entrarán en vigencia desde su publicación en la Plataforma.</p>
          </section>
        </div>

        <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 py-8 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500" />
            © 2024 TrackHub AR. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/privacidad" className="transition hover:text-sky-500">
              Privacidad
            </Link>
            <Link href="/terminos" className="transition hover:text-sky-500">
              Términos
            </Link>
            <Link href="/soporte" className="transition hover:text-sky-500">
              Soporte
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
