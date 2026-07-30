const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434";
const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text";
const CHAT_MODEL = process.env.OLLAMA_CHAT_MODEL ?? "llama3.1:8b";

export class OllamaError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "OllamaError";
  }
}

async function ollamaFetch(path: string, body: unknown, signal?: AbortSignal) {
  let res: Response;
  try {
    res = await fetch(`${OLLAMA_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    throw new OllamaError("No se pudo conectar con Ollama en local.", err);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new OllamaError(`Ollama respondió con error ${res.status}: ${text}`);
  }

  return res;
}

export async function embed(text: string): Promise<number[]> {
  const res = await ollamaFetch("/api/embeddings", {
    model: EMBED_MODEL,
    prompt: text,
  });
  const data = (await res.json()) as { embedding: number[] };
  return data.embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const out: number[][] = [];
  for (const text of texts) {
    out.push(await embed(text));
  }
  return out;
}

export async function chat(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  signal?: AbortSignal
): Promise<string> {
  const res = await ollamaFetch(
    "/api/chat",
    { model: CHAT_MODEL, messages, stream: false },
    signal
  );
  const data = (await res.json()) as { message: { content: string } };
  return data.message.content;
}
