"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#worldcast-intelligence", label: "Proyecto" },
  { href: "#chat", label: "Demo IA" },
  { href: "#workflow", label: "Arquitectura" },
  { href: "#por-que-yo", label: "Qué puedo aportar" },
];

function MenuIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <path
        d="M3 5.5h14M3 10h14M3 14.5h14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  function openCinematicIntro() {
    setMobileOpen(false);
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

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
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

        <div className="flex items-center gap-2">
          <a
            href="/cv.pdf"
            download
            className="hidden rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08] sm:inline-flex"
          >
            Descargar CV
          </a>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            className="flex h-11 w-11 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/[0.08] sm:hidden"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="flex flex-col gap-1 border-t border-white/10 bg-zinc-950/95 px-4 py-3 backdrop-blur-md sm:hidden">
          <button
            onClick={openCinematicIntro}
            className={
              "rounded-lg px-3 py-3 text-left text-sm transition-colors " +
              (activeId === "top"
                ? "font-medium text-emerald-400"
                : "text-zinc-300 hover:bg-white/[0.05]")
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
                onClick={() => setMobileOpen(false)}
                className={
                  "rounded-lg px-3 py-3 text-sm transition-colors " +
                  (isActive
                    ? "font-medium text-emerald-400"
                    : "text-zinc-300 hover:bg-white/[0.05]")
                }
              >
                {l.label}
              </a>
            );
          })}
          <a
            href="/cv.pdf"
            download
            onClick={() => setMobileOpen(false)}
            className="mt-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.08]"
          >
            Descargar CV
          </a>
        </div>
      )}
    </nav>
  );
}
