"use client";

import { useEffect, useRef } from "react";
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

export default function Story() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".story-item", {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
        },
      });

      gsap.from(".story-pitch", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".story-pitch",
          start: "top 80%",
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="historia"
      ref={rootRef}
      className="flex min-h-screen items-center border-t border-white/10 bg-zinc-950 px-6 py-28"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <div className="flex flex-col gap-4 sm:max-w-2xl">
          <Eyebrow>Por qué este proyecto</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Cómo llegué hasta Worldcast
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            Antes de ser un proyecto de portfolio, Worldcast fue algo que llevaba
            tiempo siguiendo. Esta es la historia corta de cómo llegué hasta aquí.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {TIMELINE.map((item) => (
            <div
              key={item.title}
              className="story-item flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2 p-5">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  {item.year}
                </span>
                <h3 className="text-sm font-semibold text-zinc-50">{item.title}</h3>
                <p className="text-xs leading-relaxed text-zinc-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="story-pitch rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-zinc-50">
            Por qué me gustaría formar parte del proyecto
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Hace un par de años hice mis prácticas en una empresa del sector tech,
            enfocadas en desarrollo web combinado con IA. Desde entonces he seguido
            profundizando en ambos mundos, y busco una oportunidad que me permita
            crecer desarrollando software de verdad.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Para demostrar lo que puedo aportar, he construido esta web en menos de
            24 horas. Aquí puedes comprobar de primera mano mis habilidades: cómo
            integro IA en local con Ollama (porque no siempre conviene depender de
            IA en servidores externos), y cómo combino herramientas como Claude
            Code, Gemini y ChatGPT en mi flujo de desarrollo. Puedes probar el chat
            tú mismo — sé que no es perfecto, pero la idea es justamente esa: seguir
            aportando valor de forma continua.
          </p>
        </div>
      </div>
    </section>
  );
}
