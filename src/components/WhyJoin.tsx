"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";

export default function WhyJoin() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".whyjoin-reveal", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="por-que-yo"
      ref={rootRef}
      className="flex min-h-screen items-center border-t border-white/10 bg-zinc-950 px-6 py-28"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        <Eyebrow className="whyjoin-reveal">Para cerrar</Eyebrow>

        <h2 className="whyjoin-reveal text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
          Por qué me gustaría formar parte del equipo
        </h2>

        <div className="whyjoin-reveal flex flex-col gap-4 text-left">
          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            Hace un par de años hice mis prácticas en una empresa del sector tech,
            enfocadas en desarrollo web combinado con IA. Desde entonces he seguido
            profundizando en ambos mundos, y busco una oportunidad que me permita
            crecer desarrollando software de verdad.
          </p>
          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            Para demostrar lo que puedo aportar, he construido esta web en menos de
            24 horas. Aquí puedes comprobar de primera mano mis habilidades: cómo
            integro IA en local con Ollama (porque no siempre conviene depender de
            IA en servidores externos), y cómo combino herramientas como Claude
            Code, Gemini y ChatGPT en mi flujo de desarrollo. Puedes probar el chat
            tú mismo — sé que no es perfecto, pero la idea es justamente esa: seguir
            aportando valor de forma continua.
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
