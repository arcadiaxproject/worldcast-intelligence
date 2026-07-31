"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#worldcast-intelligence", label: "Proyecto" },
  { href: "#chat", label: "Demo IA" },
  { href: "#workflow", label: "Arquitectura" },
  { href: "#por-que-yo", label: "Qué puedo aportar" },
];

export default function Navbar() {
  const [activeId, setActiveId] = useState<string | null>(null);

  function openCinematicIntro() {
    window.dispatchEvent(new Event("open-cinematic-intro"));
  }

  useEffect(() => {
    const ids = ["top", ...LINKS.map((l) => l.href.slice(1))];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3.5">
        <a href="#top" className="text-sm font-semibold tracking-tight text-zinc-50">
          Javier Navas
        </a>

        <div className="hidden items-center gap-6 sm:flex">
          <button
            onClick={openCinematicIntro}
            className={
              "text-sm transition-colors " +
              (activeId === "top"
                ? "font-medium text-emerald-400"
                : "text-zinc-400 hover:text-zinc-50")
            }
          >
            ¿Por qué programo?
          </button>
          {LINKS.map((l) => {
            const isActive = activeId === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                className={
                  "text-sm transition-colors " +
                  (isActive ? "font-medium text-emerald-400" : "text-zinc-400 hover:text-zinc-50")
                }
              >
                {l.label}
              </a>
            );
          })}
        </div>

        <a
          href="/cv.pdf"
          download
          className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08]"
        >
          Descargar CV
        </a>
      </div>
    </nav>
  );
}
