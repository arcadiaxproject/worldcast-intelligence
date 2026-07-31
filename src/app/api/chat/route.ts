import { NextRequest } from "next/server";
import { chat, embed, OllamaError } from "@/lib/ollama";
import { search } from "@/lib/vectorstore";
import { checkRateLimit } from "@/lib/ratelimit";
import { saveConversation } from "@/lib/supabase";

const MAX_QUERY_LENGTH = 2000;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return Response.json(
      { error: "Demasiadas peticiones. Inténtalo de nuevo en unos segundos." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)) } }
    );
  }

  let body: { query?: unknown; videoId?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Cuerpo de la petición inválido." }, { status: 400 });
  }

  const query = body.query;
  if (typeof query !== "string" || query.trim().length === 0) {
    return Response.json({ error: "El campo 'query' es obligatorio." }, { status: 400 });
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return Response.json(
      { error: `La consulta supera el máximo de ${MAX_QUERY_LENGTH} caracteres.` },
      { status: 400 }
    );
  }

  const videoId = typeof body.videoId === "string" && body.videoId.length > 0 ? body.videoId : undefined;

  const startedAt = Date.now();

  try {
    const queryEmbedding = await embed(query);
    const relevantChunks = await search(queryEmbedding, 8, videoId);

    const context = relevantChunks.length
      ? relevantChunks.map((c) => `Fuente: ${c.source}\n${c.text}`).join("\n\n---\n\n")
      : "No hay contexto disponible.";

    const scopeNote = videoId
      ? "Responde únicamente sobre el vídeo seleccionado por el usuario. "
      : "";

    const answer = await chat([
      {
        role: "system",
        content:
          `Eres el asistente de Worldcast. ${scopeNote}Responde únicamente en base al contexto proporcionado. ` +
          "El contexto que recibes ha sido recuperado mediante búsqueda semántica específicamente para esta " +
          "pregunta, así que en la gran mayoría de los casos SÍ contiene información relevante aunque no " +
          "use las mismas palabras que la pregunta: léelo con atención antes de decidir que no hay relación. " +
          "Da respuestas completas y bien desarrolladas: explica el razonamiento, añade matices o ejemplos " +
          "que aparezcan en el contexto, y organiza la respuesta en varios párrafos cuando el tema lo permita. " +
          "Evita contestar con una sola frase si el contexto da para más.\n\n" +
          "Si el contexto solo cubre el tema parcialmente, responde igualmente con lo que sí aparece, sin " +
          "quejarte de la falta de contexto ni explicar qué es lo que falta. Solo si tras leerlo con atención " +
          "el contexto no dice absolutamente nada relacionado, responde en una sola frase indicando que el " +
          "vídeo no trata ese tema. Nunca le preguntes al usuario qué prefiere ni le pidas que aclare o " +
          "reformule la pregunta: responde de forma directa y da la conversación por cerrada.\n\n" +
          `Contexto:\n${context}`,
      },
      { role: "user", content: query },
    ]);

    console.log(
      JSON.stringify({
        type: "chat_query",
        ip,
        videoId: videoId ?? null,
        durationMs: Date.now() - startedAt,
        chunksUsed: relevantChunks.length,
      })
    );

    const MAX_SOURCES_SHOWN = 3;
    const sources = relevantChunks.slice(0, MAX_SOURCES_SHOWN).map((c) => ({
      label: c.source,
      videoId: c.videoId,
      startSeconds: c.startSeconds,
    }));

    saveConversation({
      video_id: videoId ?? null,
      question: query,
      answer,
      sources,
      ip,
    });

    return Response.json({ answer, sources });
  } catch (err) {
    console.error(
      JSON.stringify({
        type: "chat_error",
        ip,
        durationMs: Date.now() - startedAt,
        error: err instanceof Error ? err.message : String(err),
      })
    );

    if (err instanceof OllamaError) {
      return Response.json(
        { error: "El motor de IA local no está disponible en este momento. Inténtalo de nuevo en breve." },
        { status: 503 }
      );
    }

    return Response.json({ error: "Error interno al procesar la consulta." }, { status: 500 });
  }
}
