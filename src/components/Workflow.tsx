"use client";

import { useEffect, useRef } from "react";
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
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let rafId: number | null = null;

    function update() {
      rafId = null;
      const viewportCenter = window.innerHeight / 2;

      for (let i = 0; i < STEPS.length; i++) {
        const card = cardRefs.current[i];
        const icon = iconRefs.current[i];
        if (!card || !icon) continue;

        const rect = card.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elCenter - viewportCenter);
        const maxDistance = viewportCenter + rect.height / 2;
        const progress = Math.min(1, Math.max(0, 1 - distance / maxDistance));

        icon.style.transform = `scale(${1 + progress * 0.25})`;
        icon.style.borderColor = `rgba(52, 211, 153, ${0.1 + progress * 0.5})`;
        icon.style.backgroundColor = `rgba(52, 211, 153, ${0.05 + progress * 0.15})`;
        icon.style.color = `rgba(${226 - progress * 20}, ${232 - progress * 30}, ${240 - progress * 100}, 1)`;
        icon.style.boxShadow = `0 0 ${progress * 24}px rgba(52, 211, 153, ${progress * 0.4})`;

        card.style.transform = `scale(${1 + progress * 0.04})`;
        card.style.opacity = `${0.65 + progress * 0.35}`;
        card.style.borderColor = `rgba(52, 211, 153, ${progress * 0.3})`;
        card.style.backgroundColor = `rgba(255, 255, 255, ${0.02 + progress * 0.04})`;
      }
    }

    function onScroll() {
      if (rafId === null) rafId = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="workflow"
      className="flex min-h-screen items-center border-t border-white/10 bg-zinc-950 px-4 py-16 sm:px-6 sm:py-28"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
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

        <div className="relative flex flex-col">
          <div className="absolute left-6 top-2 bottom-2 w-px bg-white/10" />

          {STEPS.map((step, i) => (
            <div key={step.title} className="relative flex gap-5 py-5">
              <span
                ref={(el) => {
                  iconRefs.current[i] = el;
                }}
                className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-sm font-bold text-zinc-500 will-change-transform"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="flex-1 origin-left rounded-2xl border border-white/10 bg-white/[0.02] p-5 will-change-transform"
              >
                <h3 className="text-sm font-semibold text-zinc-50 sm:text-base">
                  {step.title}
                </h3>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-emerald-400/70">
                  {step.tool}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
