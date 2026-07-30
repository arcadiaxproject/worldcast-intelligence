"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";

const STATS = [
  { value: "2", label: "Vídeos transcritos con Whisper" },
  { value: "412", label: "Fragmentos indexados y vectorizados" },
  { value: "<24h", label: "De desarrollo, de cero a producción" },
];

export default function Stats() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".stats-reveal", {
        y: 24,
        opacity: 0,
        duration: 0.6,
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
      ref={rootRef}
      className="border-t border-white/10 bg-zinc-950 px-6 py-24"
    >
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-8 overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-b from-emerald-950/40 to-zinc-950 px-6 py-16 text-center">
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent)]" />

        <Eyebrow className="stats-reveal relative">Desde el minuto uno</Eyebrow>

        <h2 className="stats-reveal relative text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
          Una prueba, no una promesa
        </h2>

        <div className="stats-reveal relative flex flex-col items-center gap-1">
          <span className="text-6xl font-bold text-emerald-400 sm:text-7xl">100% local</span>
          <span className="text-sm text-zinc-400">
            modelo, embeddings y datos ejecutándose en tu propia máquina
          </span>
        </div>

        <div className="relative grid w-full max-w-2xl gap-6 pt-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="stats-reveal flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-zinc-50">{s.value}</span>
              <span className="text-xs leading-snug text-zinc-400">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
