import { NextRequest } from "next/server";
import { chat, embed, OllamaError } from "@/lib/ollama";
import { search } from "@/lib/vectorstore";
import { checkRateLimit } from "@/lib/ratelimit";

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

  let body: { query?: unknown };
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

  const startedAt = Date.now();

  try {
    const queryEmbedding = await embed(query);
    const relevantChunks = await search(queryEmbedding, 4);

    const context = relevantChunks.length
      ? relevantChunks.map((c) => `Fuente: ${c.source}\n${c.text}`).join("\n\n---\n\n")
      : "No hay contexto disponible.";

    const answer = await chat([
      {
        role: "system",
        content:
          "Eres el asistente de Worldcast. Responde únicamente en base al contexto proporcionado. " +
          "Si el contexto no contiene la respuesta, dilo explícitamente en lugar de inventar información.\n\n" +
          `Contexto:\n${context}`,
      },
      { role: "user", content: query },
    ]);

    console.log(
      JSON.stringify({
        type: "chat_query",
        ip,
        durationMs: Date.now() - startedAt,
        chunksUsed: relevantChunks.length,
      })
    );

    return Response.json({
      answer,
      sources: relevantChunks.map((c) => ({
        label: c.source,
        videoId: c.videoId,
        startSeconds: c.startSeconds,
      })),
    });
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
