"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";

const TIMELINE = [
  {
    year: "2019 – 2020",
    title: "La Pollería",
    image: "/story/polleria.png",
    description:
      "Como mucha otra gente, conocí a Pedro Bernabau por La Pollería. Fui por primera vez con mi pareja, sin imaginar que años después su contenido me haría reflexionar sobre hacia dónde quería llevar mi carrera.",
  },
  {
    year: "2023",
    title: "El vídeo de la dopamina",
    image: "/story/dopamina.jpg",
    description:
      "Me lo volví a cruzar en YouTube, esta vez con un vídeo sobre la dopamina. Me hizo pensar en serio sobre lo que estaba haciendo con mi vida. Me suscribí a su canal ese mismo día.",
  },
  {
    year: "2023 – hoy",
    title: "Descubriendo Worldcast",
    image: "/story/worldcast-video.jpg",
    description:
      "Poco después me suscribí también a Worldcast, donde toca temas muy variados. Mis favoritos son siempre los de IA: es mi principal foco de interés porque soy programador, y es la parte del oficio que más me apasiona seguir de cerca.",
  },
];

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d={direction === "left" ? "M12 4l-6 6 6 6" : "M8 4l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Story() {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".story-intro", {
        y: 24,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
      });

      gsap.from(".story-carousel", {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 65%" },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!imageRef.current) return;
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, scale: 1.03 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
    );
  }, [index]);

  function go(delta: number) {
    setIndex((i) => (i + delta + TIMELINE.length) % TIMELINE.length);
  }

  const current = TIMELINE[index];

  return (
    <section
      id="historia"
      ref={rootRef}
      className="flex min-h-screen items-center border-t border-white/10 bg-zinc-950 px-6 py-28"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <div className="story-intro flex flex-col gap-4 sm:max-w-2xl">
          <Eyebrow>Por qué este proyecto</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Cómo llegué hasta Worldcast
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            Antes de ser un proyecto de portfolio, Worldcast fue algo que llevaba
            tiempo siguiendo. Esta es la historia corta de cómo llegué hasta aquí.
          </p>
        </div>

        <div className="story-carousel flex flex-col gap-5">
          <div className="relative h-[26rem] w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 sm:h-[34rem] lg:h-[42rem]">
            <div ref={imageRef} className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.image}
                alt={current.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-6 sm:p-8">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
                {current.year}
              </span>
              <h3 className="text-xl font-bold text-zinc-50 sm:text-2xl">{current.title}</h3>
              <p className="max-w-xl text-sm leading-relaxed text-zinc-300">
                {current.description}
              </p>
            </div>

            <button
              onClick={() => go(-1)}
              aria-label="Anterior"
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-zinc-950/60 text-zinc-100 backdrop-blur transition-colors hover:bg-zinc-950/90"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Siguiente"
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-zinc-950/60 text-zinc-100 backdrop-blur transition-colors hover:bg-zinc-950/90"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            {TIMELINE.map((item, i) => (
              <button
                key={item.title}
                onClick={() => setIndex(i)}
                aria-label={item.title}
                className={
                  i === index
                    ? "h-2 w-6 rounded-full bg-emerald-400 transition-all"
                    : "h-2 w-2 rounded-full bg-white/20 transition-all hover:bg-white/40"
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
