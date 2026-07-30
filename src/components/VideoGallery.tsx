"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface VideoInfo {
  id: string;
  title: string;
  durationSeconds: number;
}

const VIDEOS: VideoInfo[] = [
  {
    id: "vh2kzlw3go8",
    title: "La IA es un Tsunami: ¿Estos son los únicos trabajos que van a sobrevivir en 2030?",
    durationSeconds: 6139,
  },
  {
    id: "eLEyiVDBHQQ",
    title: "Los agentes de IA ya han llegado: cómo hacer que la IA trabaje para ti",
    durationSeconds: 7759,
  },
  {
    id: "NWfMNnZ-C4s",
    title: "Experto en IA advierte: no tienes idea de lo que se viene",
    durationSeconds: 7043,
  },
  {
    id: "rwRxe1XDq40",
    title: "Tus datos están en la Dark Web: un experto en ciberseguridad te lo demuestra",
    durationSeconds: 6435,
  },
];

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes} min`;
}

export default function VideoGallery() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".video-card", {
        y: 28,
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
      id="videos"
      ref={rootRef}
      className="border-b border-zinc-800 bg-zinc-950 px-6 py-24"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-900/50 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-widest text-zinc-400">
            Base de conocimiento
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Vídeos indexados
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            El asistente responde en base al contenido de estos vídeos, transcritos
            localmente con Whisper y vectorizados para búsqueda semántica. Pregúntale
            algo sobre cualquiera de ellos en el chat.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {VIDEOS.map((v) => (
            <a
              key={v.id}
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="video-card group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition-colors hover:border-zinc-700"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                  alt={v.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-zinc-200">
                  {formatDuration(v.durationSeconds)}
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium leading-snug text-zinc-100">
                  {v.title}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
