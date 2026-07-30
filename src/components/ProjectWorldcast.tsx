"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
      "El modelo de lenguaje y los embeddings corren en Ollama, en la propia máquina. Ningún dato ni consulta sale hacia un proveedor de inferencia externo.",
  },
  {
    title: "RAG desde cero",
    description:
      "Pipeline propio de ingesta: los documentos se trocean, se vectorizan (nomic-embed-text) y se indexan localmente para recuperar el contexto más relevante en cada consulta.",
  },
  {
    title: "API con criterio de producción",
    description:
      "Rate limiting por IP, validación del tamaño de las consultas, manejo explícito de errores de conexión con Ollama y logging estructurado de cada petición.",
  },
];

export default function ProjectWorldcast() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".project-reveal", {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 75%",
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="worldcast-intelligence"
      ref={rootRef}
      className="flex min-h-screen items-center border-t border-white/10 bg-zinc-950 px-6 py-28"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="project-reveal flex flex-col gap-4 sm:max-w-2xl">
          <Eyebrow>Proyecto</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Worldcast Intelligence
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            Esta misma página es el proyecto: una plataforma que responde preguntas
            sobre contenido propio combinando recuperación de información (RAG) con
            un modelo de lenguaje ejecutado íntegramente en local mediante Ollama.
            Nace de una premisa clara: el modelo, los embeddings y los datos deben
            permanecer bajo control total, sin depender de servicios de inferencia
            externos ni exponer directamente el motor de IA a Internet.
          </p>
        </div>

        <div className="project-reveal grid gap-4 sm:grid-cols-3">
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
            >
              <h3 className="text-sm font-semibold text-zinc-50">{h.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                {h.description}
              </p>
            </div>
          ))}
        </div>

        <div className="project-reveal flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {STACK.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <p className="project-reveal text-xs text-zinc-500">
          Prueba el chat justo debajo: hace RAG en tiempo real contra el motor de IA
          local y responde solo con base en el contenido indexado.
        </p>
      </div>
    </section>
  );
}
