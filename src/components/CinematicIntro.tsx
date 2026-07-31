"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

const HERO_CLIP_VERSION = "1785466633";
const HERO_CLIP_SRC = `/hero-clip.mp4?v=${HERO_CLIP_VERSION}`;

const LINE_1 = "Aquí es donde empieza mi camino.";
const LINE_2 = "Inspirado por una idea: construir el futuro con IA.";

function SplitChars({ text, className }: { text: string; className: string }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span key={i} className={`${className} inline-block`}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
      <path d="M6 4l10 6-10 6V4z" fill="currentColor" />
    </svg>
  );
}

export default function CinematicIntro() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const barTopRef = useRef<HTMLDivElement>(null);
  const barBottomRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closedByUser = useRef(false);

  function finish() {
    if (closedByUser.current) return;
    closedByUser.current = true;

    const video = videoRef.current;
    video?.pause();

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => {
        setIsOpen(false);
        document.body.style.overflow = "";
        document
          .getElementById("worldcast-intelligence")
          ?.scrollIntoView({ behavior: "smooth" });
      },
    });
  }

  function start() {
    setIsOpen(true);
    closedByUser.current = false;
    document.body.style.overflow = "hidden";
  }

  useEffect(() => {
    window.addEventListener("open-cinematic-intro", start);
    return () => window.removeEventListener("open-cinematic-intro", start);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    gsap.set(overlayRef.current, { opacity: 1 });
    gsap.set(barTopRef.current, { height: "12%" });
    gsap.set(barBottomRef.current, { height: "12%" });
    gsap.set(videoRef.current, { opacity: 0, scale: 1 });

    const tl = gsap.timeline();

    tl.from(".intro-char-1", {
      opacity: 0,
      y: 12,
      duration: 0.4,
      stagger: 0.025,
      ease: "power2.out",
    })
      .from(
        ".intro-char-2",
        {
          opacity: 0,
          y: 8,
          duration: 0.35,
          stagger: 0.015,
          ease: "power2.out",
        },
        "-=0.15"
      )
      .to({}, { duration: 1.1 })
      .to(textRef.current, {
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.6,
        ease: "power1.in",
      })
      .to(
        [barTopRef.current, barBottomRef.current],
        { height: "0%", duration: 0.6, ease: "power2.inOut" },
        "-=0.3"
      )
      .to(videoRef.current, { opacity: 1, duration: 0.4 }, "-=0.3")
      .call(() => {
        const video = videoRef.current;
        if (!video) return;
        video.play().catch(() => finish());
        gsap.to(video, {
          scale: 1.06,
          duration: video.duration || 8,
          ease: "none",
        });
      });

    const video = videoRef.current;
    video?.addEventListener("ended", finish);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") finish();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      tl.kill();
      video?.removeEventListener("ended", finish);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={start}
        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90"
      >
        <PlayIcon />
        ¿Por qué quiero programar?
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={overlayRef}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 opacity-0 backdrop-blur-sm sm:p-6"
          >
            <div className="relative h-full w-full overflow-hidden bg-black shadow-2xl shadow-black/60 sm:h-[80vh] sm:w-[80vw] sm:max-w-6xl sm:rounded-2xl sm:border sm:border-white/10">
              <div ref={barTopRef} className="absolute inset-x-0 top-0 z-10 bg-black" />
              <div ref={barBottomRef} className="absolute inset-x-0 bottom-0 z-10 bg-black" />

              <video
                ref={videoRef}
                src={HERO_CLIP_SRC}
                className="h-full w-full object-cover opacity-0"
                playsInline
              />

              <div
                ref={textRef}
                className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center sm:gap-4"
              >
                <p className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-4xl">
                  <SplitChars text={LINE_1} className="intro-char-1" />
                </p>
                <p className="max-w-[85%] text-xs text-zinc-300 sm:max-w-md sm:text-sm md:text-base">
                  <SplitChars text={LINE_2} className="intro-char-2" />
                </p>
              </div>

              <button
                onClick={finish}
                aria-label="Saltar"
                className="absolute right-3 top-3 z-20 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur transition-colors hover:bg-black/80 hover:text-white sm:right-4 sm:top-4 sm:px-3.5"
              >
                Saltar ✕
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
