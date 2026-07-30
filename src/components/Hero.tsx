"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Eyebrow from "./Eyebrow";

const CHECKLIST = [
  "IA 100% local, cero dependencia de proveedores externos",
  "RAG en tiempo real con citas de fuente y timestamp",
  "Construido en menos de 24h con Claude Code, Gemini y ChatGPT",
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0 text-emerald-400">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M6.5 10.2l2.2 2.2 4.8-4.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-eyebrow", { y: 16, opacity: 0, duration: 0.5 })
        .from(".hero-name", { y: 40, opacity: 0, duration: 0.7 }, "-=0.25")
        .from(".hero-role", { y: 24, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".hero-sub", { y: 16, opacity: 0, duration: 0.5 }, "-=0.35")
        .from(".hero-check", { x: -12, opacity: 0, duration: 0.4, stagger: 0.08 }, "-=0.25")
        .from(".hero-actions", { y: 12, opacity: 0, duration: 0.5 }, "-=0.15")
        .from(".hero-panel", { scale: 0.94, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(
          ".hero-float",
          { y: 16, opacity: 0, duration: 0.5, stagger: 0.1 },
          "-=0.4"
        );

      gsap.to(".hero-glow", {
        x: 50,
        y: -20,
        scale: 1.1,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".hero-float-1", {
        y: -10,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".hero-float-2", {
        y: 10,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="top"
      ref={rootRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-zinc-950"
    >
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />

      <div className="hero-glow pointer-events-none absolute left-1/4 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[110px]" />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 px-6 py-16 pt-32 lg:grid-cols-[1.1fr_0.9fr] lg:pt-28">
        <div className="flex flex-col items-start gap-5 text-left">
          <Eyebrow className="hero-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
            Esto no es solo un portfolio
          </Eyebrow>

          <h1 className="flex flex-col text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            <span className="hero-name text-zinc-50">Javier Navas</span>
            <span className="hero-role text-emerald-400">
              Desarrollador Full Stack con IA como copiloto
            </span>
          </h1>

          <p className="hero-sub max-w-lg text-sm leading-relaxed text-zinc-400 sm:text-base">
            Estoy dando mis primeros pasos como desarrollador Full Stack y me gusta
            aprender construyendo proyectos reales. Este sitio es la prueba: un
            asistente de IA que corre íntegramente en local, sin depender de
            servicios de inferencia externos.
          </p>

          <ul className="flex flex-col gap-2.5 pt-1">
            {CHECKLIST.map((item) => (
              <li key={item} className="hero-check flex items-center gap-2.5 text-sm text-zinc-300">
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>

          <div className="hero-actions flex flex-wrap gap-3 pt-3">
            <a
              href="#worldcast-intelligence"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90"
            >
              Ver proyecto
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                <path
                  d="M3 8h10m0 0L9 4m4 4L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="/cv.pdf"
              download
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-200 backdrop-blur transition-colors hover:bg-white/[0.08]"
            >
              Descargar CV
            </a>
          </div>
        </div>

        <div className="hero-panel relative mx-auto w-full max-w-sm">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/50 backdrop-blur">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.5)]" />
              <span className="text-xs font-medium text-zinc-400">Worldcast Intelligence</span>
            </div>
            <div className="flex flex-col gap-3 p-4">
              <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs leading-relaxed text-zinc-200">
                ¿Qué se dice sobre los agentes de IA en el vídeo?
              </div>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-emerald-400/90 px-3.5 py-2 text-xs leading-relaxed text-zinc-950">
                Según el minuto 13:03, los agentes de IA automatizan tareas completas,
                no solo responden preguntas puntuales.
              </div>
              <div className="h-20 w-full rounded-xl border border-white/10 bg-zinc-950" />
            </div>
          </div>

          <div className="hero-float hero-float-1 absolute -left-8 top-6 flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/90 px-3 py-2 text-[11px] font-medium text-zinc-200 shadow-lg backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            IA local activa
          </div>

          <div className="hero-float hero-float-2 absolute -right-6 top-1/2 flex flex-col rounded-xl border border-white/10 bg-zinc-900/90 px-3 py-2 shadow-lg backdrop-blur">
            <span className="text-sm font-bold text-emerald-400">412</span>
            <span className="text-[10px] text-zinc-400">fragmentos indexados</span>
          </div>

          <div className="hero-float absolute -bottom-6 left-8 flex flex-col rounded-xl border border-white/10 bg-zinc-900/90 px-3 py-2 shadow-lg backdrop-blur">
            <span className="text-sm font-bold text-zinc-50">2 vídeos</span>
            <span className="text-[10px] text-zinc-400">transcritos con Whisper</span>
          </div>
        </div>
      </div>
    </div>
  );
}
