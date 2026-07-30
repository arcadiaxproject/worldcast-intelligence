"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-eyebrow", { y: 16, opacity: 0, duration: 0.5 })
        .from(".hero-name", { y: 50, opacity: 0, duration: 0.8 }, "-=0.25")
        .from(".hero-role", { y: 24, opacity: 0, duration: 0.6 }, "-=0.45")
        .from(".hero-sub", { y: 16, opacity: 0, duration: 0.6 }, "-=0.35")
        .from(
          ".hero-badge",
          { y: 12, opacity: 0, duration: 0.5, stagger: 0.06 },
          "-=0.3"
        )
        .from(".hero-actions", { y: 12, opacity: 0, duration: 0.5 }, "-=0.2")
        .from(".hero-scroll", { opacity: 0, duration: 0.6 }, "-=0.2");

      gsap.to(".hero-glow", {
        x: 60,
        y: -30,
        scale: 1.1,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".hero-scroll-dot", {
        y: 6,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-screen items-center overflow-hidden border-b border-zinc-800 bg-zinc-950"
    >
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" />

      <div className="hero-glow pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-fuchsia-500/25 via-indigo-500/25 to-cyan-400/25 blur-[100px]" />

      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center gap-5 px-6 py-16 text-center">
        <span className="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-900/50 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-widest text-zinc-400 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
          Esto no es solo un portfolio
        </span>

        <h1 className="hero-name bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
          Javier Navas
        </h1>

        <p className="hero-role max-w-lg text-base font-medium text-zinc-300 sm:text-lg">
          Desarrollador Full Stack con interés en IA y automatización
        </p>

        <p className="hero-sub max-w-md text-sm leading-relaxed text-zinc-500">
          Estoy dando mis primeros pasos como desarrollador Full Stack y me gusta
          aprender construyendo proyectos reales. Actualmente estoy profundizando en
          backend, inteligencia artificial y automatización, con el objetivo de seguir
          creciendo como ingeniero de software.
        </p>

        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {["Ollama local", "RAG en tiempo real", "Datos privados"].map((b) => (
            <span
              key={b}
              className="hero-badge rounded-full border border-zinc-800 bg-zinc-900/70 px-3.5 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur"
            >
              {b}
            </span>
          ))}
        </div>

        <div className="hero-actions flex flex-wrap justify-center gap-3 pt-2">
          <a
            href="#worldcast-intelligence"
            className="rounded-full bg-zinc-50 px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Ver proyecto
          </a>
          <a
            href="/cv.pdf"
            download
            className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-900"
          >
            Descargar CV
          </a>
        </div>

        <div className="hero-scroll absolute bottom-10 flex flex-col items-center gap-2 text-zinc-600">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-zinc-700 p-1">
            <span className="hero-scroll-dot h-1.5 w-1.5 rounded-full bg-zinc-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
