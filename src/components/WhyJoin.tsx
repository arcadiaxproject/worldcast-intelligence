import Eyebrow from "./Eyebrow";

export default function WhyJoin() {
  return (
    <section
      id="por-que-yo"
      className="flex min-h-screen items-center border-t border-white/10 bg-zinc-950 px-6 py-28"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        <Eyebrow className="whyjoin-reveal">Para cerrar</Eyebrow>

        <h2 className="whyjoin-reveal text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
          ¿Por qué contratarme?
        </h2>

        <div className="whyjoin-reveal flex flex-col gap-4 text-left">
          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            Aunque me encuentro al comienzo de mi carrera profesional, he tenido la
            oportunidad de trabajar como <strong className="font-semibold text-zinc-100">desarrollador Full Stack</strong> en
            distintos proyectos, participando tanto en el desarrollo de interfaces
            como en la implementación de <strong className="font-semibold text-zinc-100">servicios backend, APIs y
            automatización de procesos</strong>.
          </p>
          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            Además del desarrollo Full Stack tradicional, me he especializado de
            forma <strong className="font-semibold text-zinc-100">autodidacta en la aplicación de la inteligencia
            artificial</strong> al desarrollo de software. Trabajo con herramientas que
            aceleran el ciclo de desarrollo y también con{" "}
            <strong className="font-semibold text-zinc-100">
              modelos ejecutados de forma local, agentes de IA, RAG,
              automatizaciones e integraciones
            </strong>{" "}
            en aplicaciones reales, como las que he desarrollado en mis proyectos
            personales.
          </p>
          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            Creo que esta combinación me permite aportar{" "}
            <strong className="font-semibold text-zinc-100">un perfil diferente</strong>: no solo puedo
            desarrollar <strong className="font-semibold text-zinc-100">aplicaciones de extremo a extremo</strong>,
            sino también incorporar <strong className="font-semibold text-zinc-100">soluciones basadas en IA</strong> que
            mejoran la productividad, automatizan procesos y amplían las
            capacidades del software. Mi objetivo es seguir creciendo como
            ingeniero mientras ayudo a los equipos a adoptar estas tecnologías de
            forma práctica y eficiente.
          </p>
        </div>

        <div className="whyjoin-reveal flex flex-wrap justify-center gap-3 pt-2">
          <a
            href="/cv.pdf"
            download
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90"
          >
            Descargar CV
          </a>
          <a
            href="#chat"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-200 backdrop-blur transition-colors hover:bg-white/[0.08]"
          >
            Pruébalo tú mismo
          </a>
        </div>
      </div>
    </section>
  );
}
