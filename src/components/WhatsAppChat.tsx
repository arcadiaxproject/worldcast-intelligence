"use client";

import { useEffect, useRef, useState } from "react";
import { VIDEOS } from "@/lib/videos";
import Eyebrow from "./Eyebrow";

interface Source {
  label: string;
  videoId?: string;
  startSeconds?: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  time: string;
}

const SUGGESTIONS = [
  "¿Qué es Worldcast?",
  "¿Cómo se despliega la aplicación?",
  "¿Cómo se protege Ollama de accesos externos?",
];

const MAX_VIDEOS_IN_CHAT = 2;
const CHAT_VIDEOS = VIDEOS.slice(0, MAX_VIDEOS_IN_CHAT);
const DEFAULT_VIDEO_ID = CHAT_VIDEOS[0].id;

function now(): string {
  return new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

interface HistoryRow {
  question: string;
  answer: string;
  sources: Source[] | null;
  created_at: string;
}

function DoubleCheck() {
  return (
    <svg viewBox="0 0 16 11" fill="none" className="h-3 w-3.5 text-emerald-900/70">
      <path
        d="M1 5.5L4 8.5L9.5 1.5 M6 8.5L10.5 3 M10.5 8.5L15 3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M7.5 2.5h-5v5m10 0v-5h-5m5 15h-5v-5m-10 0v5h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M2.5 7.5h5v-5m5 5h5v-5M2.5 12.5h5v5m5-5h5v5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M3 5.5h14M7.5 5.5V4a1 1 0 011-1h3a1 1 0 011 1v1.5M8 9v6M12 9v6M4.5 5.5l.75 10.5a1 1 0 001 .9h7.5a1 1 0 001-.9l.75-10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function WhatsAppChat() {
  const [messagesByVideo, setMessagesByVideo] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string>(DEFAULT_VIDEO_ID);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedHistoryFor, setLoadedHistoryFor] = useState<Set<string>>(new Set());
  const [loadingHistory, setLoadingHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = messagesByVideo[selectedVideoId] ?? [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messagesByVideo, selectedVideoId, loading]);

  useEffect(() => {
    if (loadedHistoryFor.has(selectedVideoId)) return;
    let cancelled = false;

    (async () => {
      setLoadingHistory(true);
      try {
        const res = await fetch(`/api/chat/history?videoId=${encodeURIComponent(selectedVideoId)}`);
        const data = await res.json();
        if (cancelled || !res.ok) return;

        const history: Message[] = [];
        for (const row of (data.conversations ?? []) as HistoryRow[]) {
          history.push({ role: "user", content: row.question, time: formatTime(row.created_at) });
          history.push({
            role: "assistant",
            content: row.answer,
            sources: row.sources ?? undefined,
            time: formatTime(row.created_at),
          });
        }

        setMessagesByVideo((prev) => ({ ...prev, [selectedVideoId]: history }));
      } catch {
        // Sin historial disponible, el chat sigue funcionando igualmente.
      } finally {
        if (!cancelled) {
          setLoadingHistory(false);
          setLoadedHistoryFor((prev) => new Set(prev).add(selectedVideoId));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedVideoId, loadedHistoryFor]);

  useEffect(() => {
    if (!isFullscreen) return;

    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsFullscreen(false);
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isFullscreen]);

  async function submitQuery(query: string) {
    if (!query || loading) return;

    const videoId = selectedVideoId;

    function appendMessage(m: Message) {
      setMessagesByVideo((prev) => ({
        ...prev,
        [videoId]: [...(prev[videoId] ?? []), m],
      }));
    }

    appendMessage({ role: "user", content: query, time: now() });
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, videoId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Ha ocurrido un error inesperado.");
        return;
      }

      appendMessage({ role: "assistant", content: data.answer, sources: data.sources, time: now() });
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

  function selectVideo(videoId: string) {
    if (videoId === selectedVideoId) return;
    setSelectedVideoId(videoId);
    setError(null);
  }

  async function clearConversation() {
    if (messages.length === 0) return;
    if (!window.confirm("¿Borrar toda la conversación de este episodio? No se puede deshacer.")) {
      return;
    }

    const videoId = selectedVideoId;
    setMessagesByVideo((prev) => ({ ...prev, [videoId]: [] }));
    setError(null);

    try {
      await fetch(`/api/chat/history?videoId=${encodeURIComponent(videoId)}`, {
        method: "DELETE",
      });
    } catch {
      // El chat ya se vació en pantalla aunque falle el borrado remoto.
    }
  }

  const selectedVideo = CHAT_VIDEOS.find((v) => v.id === selectedVideoId);

  return (
    <section
      id="chat"
      className="flex min-h-screen items-center overflow-x-hidden border-t border-white/10 bg-zinc-950 px-4 py-16 sm:px-6 sm:py-28"
    >
      <div className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-6 sm:gap-8">
        <div className="flex flex-col gap-3 sm:gap-4 sm:max-w-2xl">
          <Eyebrow>Pruébalo</Eyebrow>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Pregúntale al asistente
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            IA local · datos privados. Elige un episodio y pregúntale solo sobre ese
            contenido; cada respuesta cita el minuto exacto en el que se basa.
          </p>
        </div>

        <div
          className={
            isFullscreen
              ? "fixed inset-0 z-[100] flex h-screen w-screen overflow-hidden rounded-none border-0"
              : "flex h-[75vh] max-h-[36rem] w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40 sm:h-[36rem] sm:rounded-3xl"
          }
        >
          <div className="hidden w-72 shrink-0 flex-col border-r border-white/10 bg-zinc-900 sm:flex">
            <div className="flex items-center gap-3 border-b border-white/10 bg-zinc-900 px-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-sm font-bold text-zinc-950">
                W
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-50">Worldcast</p>
                <p className="text-xs text-zinc-500">{CHAT_VIDEOS.length} episodios</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {CHAT_VIDEOS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => selectVideo(v.id)}
                  className={
                    "flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-left transition-colors " +
                    (selectedVideoId === v.id ? "bg-white/[0.06]" : "hover:bg-white/[0.03]")
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/default.jpg`}
                    alt={v.title}
                    className="h-11 w-11 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-100">{v.title}</p>
                    <p className="truncate text-xs text-zinc-500">
                      Toca para preguntar sobre este episodio
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col bg-[#0b141a]">
            <div className="flex items-center gap-3 border-b border-white/10 bg-zinc-900 px-5 py-3.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${selectedVideoId}/default.jpg`}
                alt={selectedVideo?.title ?? ""}
                className="h-9 w-9 shrink-0 rounded-full object-cover sm:hidden"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-50">
                  {selectedVideo?.title ?? "Worldcast Intelligence"}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  en línea
                </p>
              </div>

              <button
                type="button"
                onClick={clearConversation}
                disabled={messages.length === 0}
                aria-label="Borrar conversación"
                title="Borrar conversación"
                className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.08] active:bg-white/[0.12] hover:text-red-300 disabled:pointer-events-none disabled:opacity-30 sm:h-8 sm:w-8"
              >
                <TrashIcon />
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen((v) => !v)}
                aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.08] active:bg-white/[0.12] hover:text-zinc-50 sm:h-8 sm:w-8"
              >
                {isFullscreen ? <CollapseIcon /> : <ExpandIcon />}
              </button>
            </div>

            <div className="flex min-w-0 gap-2 overflow-x-auto border-b border-white/10 bg-zinc-900/60 px-3 py-2 sm:hidden">
              {CHAT_VIDEOS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => selectVideo(v.id)}
                  className={
                    "flex min-h-11 shrink-0 touch-manipulation items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-xs font-medium transition-colors active:scale-[0.97] " +
                    (selectedVideoId === v.id
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 bg-white/[0.03] text-zinc-400")
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/default.jpg`}
                    alt={v.title}
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                  <span className="max-w-[9rem] truncate">{v.title}</span>
                </button>
              ))}
            </div>

            <div
              ref={scrollRef}
              className="flex flex-1 flex-col gap-2 overflow-y-auto p-4 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] [background-size:20px_20px]"
            >
              {messages.length === 0 && loadingHistory && (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-600 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-600 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-600" />
                  </div>
                  <p className="text-xs text-zinc-500">Cargando historial…</p>
                </div>
              )}

              {messages.length === 0 && !loadingHistory && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                  <p className="max-w-xs text-sm text-zinc-500">
                    Pregunta lo que quieras sobre el episodio seleccionado.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => submitQuery(s)}
                        className="min-h-11 touch-manipulation rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs text-zinc-300 transition-colors active:scale-[0.97] active:bg-white/[0.1] hover:bg-white/[0.08]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => {
                const prev = messages[i - 1];
                const next = messages[i + 1];
                const isGroupStart = !prev || prev.role !== m.role;
                const isGroupEnd = !next || next.role !== m.role;
                const isUser = m.role === "user";

                return (
                  <div
                    key={i}
                    className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"} ${isGroupStart ? "mt-2" : "mt-0.5"}`}
                  >
                    {!isUser && (
                      <div className="h-6 w-6 shrink-0">
                        {isGroupEnd && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-zinc-950">
                            W
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className={
                        "bubble-in max-w-[75%] rounded-2xl px-3 py-2 text-[13.5px] text-zinc-50 shadow-sm sm:text-sm " +
                        (isUser
                          ? "bg-[#144d37] " + (isGroupStart ? "bubble-tail-right" : "")
                          : "bg-[#1f2c34] " + (isGroupStart ? "bubble-tail-left" : ""))
                      }
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                      {m.sources && m.sources.length > 0 && (
                        <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-2">
                          {m.sources.map((s, si) =>
                            s.videoId ? (
                              <div
                                key={si}
                                className="overflow-hidden rounded-xl border border-white/10 bg-black/20"
                              >
                                <div className="aspect-video w-full max-w-[220px] sm:max-w-xs">
                                  <iframe
                                    className="h-full w-full"
                                    src={`https://www.youtube.com/embed/${s.videoId}?start=${s.startSeconds ?? 0}`}
                                    title={s.label}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                                <p className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] text-zinc-400">
                                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                                  {s.label}
                                </p>
                              </div>
                            ) : (
                              <p
                                key={si}
                                className="flex items-center gap-1 text-[11px] text-zinc-400"
                              >
                                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                                {s.label}
                              </p>
                            )
                          )}
                        </div>
                      )}
                      <div className="mt-1 flex items-center justify-end gap-1">
                        <span className="text-[10px] text-zinc-400">{m.time}</span>
                        {isUser && <DoubleCheck />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="mt-2 flex items-end justify-start gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-zinc-950">
                    W
                  </div>
                  <div className="bubble-in bubble-tail-left flex items-center gap-1 rounded-2xl bg-[#1f2c34] px-4 py-3 shadow-sm">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500" />
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-2 flex items-end justify-start gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-300">
                    !
                  </div>
                  <p className="bubble-in bubble-tail-left max-w-[75%] rounded-2xl border border-red-900 bg-red-950/60 px-3 py-2 text-sm text-red-300 shadow-sm">
                    {error}
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-zinc-900 p-3">
              <input
                className="min-h-11 flex-1 rounded-full border border-white/10 bg-[#2a3942] px-4 py-2.5 text-base text-zinc-50 outline-none transition-shadow focus:ring-2 focus:ring-emerald-400/30 sm:text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe un mensaje…"
                maxLength={2000}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Enviar"
                className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full bg-emerald-400 text-zinc-950 transition-opacity active:scale-95 disabled:opacity-40 sm:h-10 sm:w-10"
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                  <path
                    d="M17.5 2.5L2.5 8.75l6.25 2.5m8.75-8.75L11.25 17.5l-2.5-6.25m8.75-8.75L8.75 11.25"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
