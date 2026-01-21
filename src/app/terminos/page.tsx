import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones — TrackHub AR',
  description: 'Términos y Condiciones de uso de TrackHub AR.',
};

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-12 sm:py-16">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold sm:text-4xl">Términos y Condiciones — TrackHub AR</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Última actualización: [COMPLETAR FECHA]</p>
        </header>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Estos Términos y Condiciones (“Términos”) regulan el acceso y uso de TrackHub AR (en adelante, “TrackHub AR”,
            “la Plataforma”, “el Servicio”, “nosotros”). Al acceder o utilizar la Plataforma, usted acepta estos Términos.
            Si no está de acuerdo, por favor absténgase de utilizarla.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">1. Descripción del Servicio</h2>
            <p>
              TrackHub AR es una plataforma que permite centralizar y visualizar información de seguimiento de envíos
              provenientes de distintos servicios de mensajería, correo y logística (“Couriers”), con el objetivo de
              facilitar el monitoreo de estados y actualizaciones.
            </p>
            <p>
              TrackHub AR no es un courier ni presta servicios de transporte, logística o entrega. El Servicio actúa como
              intermediario informativo, por lo que no controla ni garantiza la operación de terceros.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">2. Elegibilidad y uso permitido</h2>
            <p>
              El uso del Servicio está destinado a usuarios con capacidad legal para contratar y utilizar servicios
              digitales. El Usuario se compromete a utilizar la Plataforma de manera lícita y conforme a estos Términos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">3. Registro, cuenta y autenticación</h2>
            <p>Para acceder a ciertas funciones, puede ser necesario crear una cuenta o autenticarse mediante:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>correo electrónico, o</li>
              <li>proveedores de identidad de terceros (por ejemplo, Google, Apple o Microsoft).</li>
            </ul>
            <p>El Usuario es responsable de:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>mantener la confidencialidad de sus credenciales,</li>
              <li>resguardar el acceso a su cuenta, y</li>
              <li>toda actividad realizada desde su cuenta.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">4. Planes, disponibilidad y modificaciones</h2>
            <p>
              TrackHub AR puede ofrecer planes gratuitos y/o pagos, con diferentes límites de uso, funcionalidades y
              disponibilidad.
            </p>
            <p>
              TrackHub AR podrá modificar, actualizar o discontinuar funcionalidades, planes o condiciones del Servicio,
              procurando comunicar cambios relevantes con un plazo razonable cuando corresponda.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">5. Conductas prohibidas</h2>
            <p>Queda estrictamente prohibido:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>utilizar la Plataforma con fines ilícitos, fraudulentos o abusivos;</li>
              <li>intentar vulnerar la seguridad, integridad o disponibilidad del Servicio;</li>
              <li>realizar ingeniería inversa, descompilación o extracción del código o recursos;</li>
              <li>automatizar consultas masivas o comportamientos que degraden el Servicio;</li>
              <li>eludir limitaciones técnicas o medidas de seguridad;</li>
              <li>acceder o intentar acceder a información de terceros sin autorización.</li>
            </ul>
            <p>
              TrackHub AR podrá suspender o restringir el acceso ante indicios razonables de uso indebido o violación de
              estos Términos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              6. Información de seguimiento y ausencia de garantías
            </h2>
            <p>La información visualizada en TrackHub AR proviene de fuentes externas (Couriers y servicios asociados). Por tal motivo:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>no se garantiza exactitud, integridad o actualización permanente de los estados,</li>
              <li>puede haber demoras, inconsistencias o interrupciones,</li>
              <li>el Usuario reconoce que el estado final del envío depende exclusivamente del Courier correspondiente.</li>
            </ul>
            <p>Para envíos críticos, se recomienda verificar información directamente en los canales oficiales del Courier.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">7. Notificaciones</h2>
            <p>
              Cuando estén disponibles, TrackHub AR podrá ofrecer notificaciones (por correo o dentro del Servicio)
              basadas en cambios detectados en el seguimiento. El Usuario reconoce que:
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>la entrega puede depender de servicios externos,</li>
              <li>puede no ser inmediata ni ininterrumpida,</li>
              <li>no constituye un aviso oficial del Courier.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">8. Propiedad intelectual</h2>
            <p>
              El software, diseño, marca, identidad visual, textos y demás elementos de TrackHub AR se encuentran
              protegidos por la normativa aplicable. Queda prohibida su reproducción, modificación o distribución sin
              autorización expresa.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">9. Servicios de terceros</h2>
            <p>El Servicio puede integrar o referenciar plataformas de terceros (Couriers u otros proveedores). TrackHub AR no se responsabiliza por:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>la disponibilidad de dichos servicios,</li>
              <li>sus políticas, contenidos o funcionamiento,</li>
              <li>sus decisiones operativas sobre envíos.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">10. Suspensión y finalización del Servicio</h2>
            <p>TrackHub AR podrá suspender, restringir o finalizar el acceso de un Usuario si:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>incumple estos Términos,</li>
              <li>se detecta actividad sospechosa,</li>
              <li>resulte necesario para proteger la Plataforma o a terceros.</li>
            </ul>
            <p>El Usuario puede dejar de utilizar el Servicio en cualquier momento.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">11. Limitación de responsabilidad</h2>
            <p>En la máxima medida permitida por la normativa aplicable, TrackHub AR no será responsable por:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>demoras, pérdidas, daños o extravíos de envíos,</li>
              <li>decisiones operativas de Couriers,</li>
              <li>daños indirectos, incidentales, especiales o consecuentes,</li>
              <li>interrupciones o errores ocasionados por terceros.</li>
            </ul>
            <p>El uso del Servicio se realiza bajo la exclusiva responsabilidad del Usuario.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">12. Cambios en los Términos</h2>
            <p>
              TrackHub AR podrá actualizar estos Términos. Las modificaciones entrarán en vigencia desde su publicación
              en la Plataforma, salvo que se indique lo contrario.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">13. Legislación aplicable y jurisdicción</h2>
            <p>
              Estos Términos se rigen por las leyes de la República Argentina. Cualquier controversia será sometida a los
              tribunales competentes de [CIUDAD/PROVINCIA], Argentina, salvo disposición legal en contrario.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">14. Contacto</h2>
            <p>Para consultas relacionadas con estos Términos:</p>
            <p>Email: [COMPLETAR EMAIL DE SOPORTE]</p>
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
