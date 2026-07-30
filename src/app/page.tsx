"use client";

import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import ProjectWorldcast from "@/components/ProjectWorldcast";
import VideoGallery from "@/components/VideoGallery";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

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
        body: JSON.stringify({ query }),
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
      <Hero />
      <ProjectWorldcast />
      <VideoGallery />

      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-50 text-sm font-semibold text-black">
            W
          </div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-50">
              Worldcast Intelligence
            </h1>
            <p className="text-xs text-zinc-400">IA local · datos privados</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-6">
        <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
          {messages.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <p className="max-w-xs text-sm text-zinc-400">
                Pregunta lo que quieras sobre el contenido de Worldcast.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submitQuery(s)}
                    className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-900"
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
                    ? "max-w-[85%] rounded-2xl rounded-br-sm bg-zinc-50 px-4 py-2.5 text-sm text-black"
                    : "max-w-[85%] rounded-2xl rounded-bl-sm bg-zinc-900 px-4 py-2.5 text-sm text-zinc-50 ring-1 ring-zinc-800"
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
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-zinc-900 px-4 py-3 ring-1 ring-zinc-800">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500" />
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-start">
              <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-red-950/40 px-4 py-2.5 text-sm text-red-300 ring-1 ring-red-900">
                {error}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
          <input
            className="flex-1 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-50 outline-none transition-shadow focus:ring-2 focus:ring-white/10"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta algo sobre Worldcast…"
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-full bg-zinc-50 px-5 py-2.5 text-sm font-medium text-black transition-opacity disabled:opacity-40"
          >
            Enviar
          </button>
        </form>
      </main>
    </div>
  );
}
