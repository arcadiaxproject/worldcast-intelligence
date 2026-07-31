import Eyebrow from "./Eyebrow";

const STEPS = [
  {
    title: "Descarga",
    tool: "yt-dlp",
    description: "Se descarga el audio de cada vídeo de YouTube a partir de su URL.",
  },
  {
    title: "Transcripción",
    tool: "Whisper (local)",
    description: "El audio se transcribe en local, con marca de tiempo por segmento.",
  },
  {
    title: "Fragmentación",
    tool: "chunking",
    description: "La transcripción se agrupa en fragmentos de ~45s conservando el timestamp de inicio.",
  },
  {
    title: "Embeddings",
    tool: "nomic-embed-text",
    description: "Cada fragmento se vectoriza y se guarda en un índice local para búsqueda semántica.",
  },
  {
    title: "Búsqueda",
    tool: "similitud coseno",
    description: "La pregunta del usuario se vectoriza y se comparan los fragmentos más relevantes.",
  },
  {
    title: "Respuesta",
    tool: "llama3.1 (Ollama)",
    description: "El modelo genera la respuesta citando el vídeo y el minuto exacto de origen.",
  },
];

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="flex min-h-screen items-center border-t border-white/10 bg-zinc-950 px-6 py-28"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="flex flex-col gap-4 sm:max-w-2xl">
          <Eyebrow>Cómo funciona</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            El workflow, paso a paso
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            Desde el vídeo de YouTube hasta la respuesta citada con timestamp: así
            construye Worldcast Intelligence su base de conocimiento y responde cada
            pregunta, todo ejecutado en local.
          </p>
        </div>

        <div className="relative">
          <div className="workflow-line absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {STEPS.map((step, i) => (
              <div key={step.title} className="workflow-step flex flex-col gap-3">
                <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-0">
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-sm font-bold text-emerald-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="lg:mt-3 lg:hidden">
                    <h3 className="text-sm font-semibold text-zinc-50">{step.title}</h3>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-emerald-400/20 hover:bg-white/[0.05]">
                  <h3 className="hidden text-sm font-semibold text-zinc-50 lg:block">
                    {step.title}
                  </h3>
                  <p className="mt-0 text-[11px] font-medium uppercase tracking-wide text-emerald-400/70 lg:mt-1">
                    {step.tool}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
