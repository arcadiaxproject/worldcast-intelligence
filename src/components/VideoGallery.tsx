"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";
import { VIDEOS } from "@/lib/videos";

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes} min`;
}

export default function VideoGallery({
  onAsk,
}: {
  onAsk?: (videoId: string) => void;
}) {
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
      className="flex min-h-screen items-center border-t border-white/10 bg-zinc-950 px-6 py-28"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="flex flex-col gap-4 sm:max-w-2xl">
          <Eyebrow>Base de conocimiento</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Vídeos indexados
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            El asistente responde en base al contenido de estos vídeos, transcritos
            localmente con Whisper y vectorizados para búsqueda semántica. Elige uno
            para preguntarle solo a él en el chat.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VIDEOS.map((v) => (
            <div
              key={v.id}
              className="video-card group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20 hover:bg-white/[0.05]"
            >
              <a
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
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
              </a>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <p className="text-sm font-medium leading-snug text-zinc-100">
                  {v.title}
                </p>
                <button
                  onClick={() => onAsk?.(v.id)}
                  className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08]"
                >
                  Preguntar sobre este vídeo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
