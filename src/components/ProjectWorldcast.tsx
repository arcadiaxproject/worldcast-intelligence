import Eyebrow from "./Eyebrow";

const STACK = [
  "Next.js (App Router)",
  "TypeScript",
  "Ollama (local)",
  "RAG / Embeddings",
  "Tailwind CSS",
  "Cloudflare Tunnel",
];

const HIGHLIGHTS = [
  {
    title: "IA 100% local",
    description:
      "Nada de mandar tus preguntas a servidores de terceros: el modelo y los embeddings corren aquí mismo, en mi máquina, con Ollama. Tus datos no salen de casa.",
    icon: (
      <path
        d="M10 2l6.5 3.75v8.5L10 18l-6.5-3.75v-8.5L10 2z M10 2v16 M3.5 5.75L10 9.5l6.5-3.75 M3.5 14.25L10 10.5l6.5 3.75"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "RAG desde cero",
    description:
      "Construí yo mismo el pipeline: trocea el contenido, lo convierte en vectores y busca el fragmento más relevante antes de responder. Sin atajos ni librerías mágicas.",
    icon: (
      <>
        <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M16.5 16.5L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Pensado para no romperse",
    description:
      "Límite de peticiones, validaciones, mensajes claros si algo falla y registro de cada consulta. Los detalles que separan un experimento de algo que se puede usar de verdad.",
    icon: (
      <path
        d="M10 2l7 3.5v5c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5v-5L10 2z M7 10l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function ProjectWorldcast() {
  return (
    <section
      id="worldcast-intelligence"
      className="relative flex min-h-screen items-center overflow-hidden border-t border-white/10 bg-zinc-950 px-4 py-16 sm:px-6 sm:py-28"
    >
      <div className="pointer-events-none absolute right-0 top-1/4 h-[26rem] w-[26rem] rounded-full bg-emerald-500/10 blur-[110px]" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-12">
        <div className="project-reveal flex flex-col gap-4 sm:max-w-2xl">
          <Eyebrow>Proyecto</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Worldcast Intelligence
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            Sí, esta misma página es el proyecto. Le puedes preguntar cosas sobre
            contenido real y te responde apoyándose en un modelo de IA que corre
            enterito en local, sin llamar a ningún servidor externo. La idea de
            fondo es sencilla: el modelo, los datos y las respuestas se quedan bajo
            mi control, punto.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.title}
              className="project-reveal group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-white/[0.05]"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-400/0 blur-2xl transition-colors group-hover:bg-emerald-400/10" />

              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                  {h.icon}
                </svg>
              </span>

              <h3 className="relative text-sm font-semibold text-zinc-50">{h.title}</h3>
              <p className="relative text-xs leading-relaxed text-zinc-400">
                {h.description}
              </p>
            </div>
          ))}
        </div>

        <div className="project-reveal flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {STACK.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300"
              >
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                {s}
              </span>
            ))}
          </div>
        </div>

        <p className="project-reveal flex items-center gap-2 text-xs text-zinc-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Más abajo tienes el chat de verdad — pruébalo, dale caña y comprueba tú
          mismo que no es solo una maqueta bonita.
        </p>
      </div>
    </section>
  );
}
