"use client";

import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Story from "@/components/Story";
import ProjectWorldcast from "@/components/ProjectWorldcast";
import VideoGallery from "@/components/VideoGallery";
import Workflow from "@/components/Workflow";
import Navbar from "@/components/Navbar";
import Eyebrow from "@/components/Eyebrow";
import { VIDEOS } from "@/lib/videos";

interface Source {
  label: string;
  videoId?: string;
  startSeconds?: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

const SUGGESTIONS = [
  "¿Qué es Worldcast?",
  "¿Cómo se despliega la aplicación?",
  "¿Cómo se protege Ollama de accesos externos?",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function askAboutVideo(videoId: string) {
    setSelectedVideoId(videoId);
    document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" });
  }

  async function submitQuery(query: string) {
    if (!query || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, videoId: selectedVideoId ?? undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Ha ocurrido un error inesperado.");
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, sources: data.sources },
      ]);
    } catch {
      setError("No se pudo contactar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitQuery(input.trim());
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-950 font-sans">
      <Navbar />

      <Hero />
      <Stats />
      <Story />
      <ProjectWorldcast />
      <VideoGallery onAsk={askAboutVideo} />
      <Workflow />

      <section
        id="chat"
        className="flex min-h-screen items-center border-t border-white/10 bg-zinc-950 px-6 py-28"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
          <div className="flex flex-col gap-4 sm:max-w-2xl">
            <Eyebrow>Pruébalo</Eyebrow>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
              Pregúntale al asistente
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              IA local · datos privados. Cada respuesta se genera con Ollama y cita
              la fuente exacta (documento o minuto de vídeo) en la que se basa.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedVideoId(null)}
              className={
                selectedVideoId === null
                  ? "rounded-full bg-emerald-400 px-3.5 py-1.5 text-xs font-semibold text-zinc-950"
                  : "rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08]"
              }
            >
              Todos los vídeos
            </button>
            {VIDEOS.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVideoId(v.id)}
                className={
                  selectedVideoId === v.id
                    ? "max-w-[12rem] truncate rounded-full bg-emerald-400 px-3.5 py-1.5 text-xs font-semibold text-zinc-950"
                    : "max-w-[12rem] truncate rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08]"
                }
                title={v.title}
              >
                {v.title}
              </button>
            ))}
          </div>

          <div className="flex h-[32rem] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-5 py-3.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.5)]" />
              <span className="text-xs font-medium text-zinc-400">
                {selectedVideoId
                  ? `Preguntando sobre: ${VIDEOS.find((v) => v.id === selectedVideoId)?.title ?? selectedVideoId}`
                  : "Worldcast Intelligence · todos los vídeos"}
              </span>
            </div>

            <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
              {messages.length === 0 && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                  <p className="max-w-xs text-sm text-zinc-500">
                    Pregunta lo que quieras sobre el contenido de Worldcast.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => submitQuery(s)}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-white/[0.08]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-emerald-400 px-4 py-2.5 text-sm font-medium text-zinc-950"
                        : "max-w-[85%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-zinc-50"
                    }
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-2">
                        {m.sources.map((s, si) =>
                          s.videoId ? (
                            <div key={si} className="flex flex-col gap-1">
                              <p className="text-[11px] text-zinc-400">{s.label}</p>
                              <div className="aspect-video w-full max-w-xs overflow-hidden rounded-lg">
                                <iframe
                                  className="h-full w-full"
                                  src={`https://www.youtube.com/embed/${s.videoId}?start=${s.startSeconds ?? 0}`}
                                  title={s.label}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            </div>
                          ) : (
                            <p key={si} className="text-[11px] text-zinc-400">
                              Fuente: {s.label}
                            </p>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500" />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-start">
                  <p className="max-w-[85%] rounded-2xl rounded-bl-sm border border-red-900 bg-red-950/40 px-4 py-2.5 text-sm text-red-300">
                    {error}
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/10 p-3">
              <input
                className="flex-1 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-50 outline-none transition-shadow focus:ring-2 focus:ring-emerald-400/30"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregunta algo sobre Worldcast…"
                maxLength={2000}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-opacity disabled:opacity-40"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-zinc-600">
        Javier Navas · Worldcast Intelligence · IA 100% local
      </footer>
    </div>
  );
}
