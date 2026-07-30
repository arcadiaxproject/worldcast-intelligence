import { readFile } from "node:fs/promises";
import path from "node:path";

export interface Chunk {
  id: string;
  source: string;
  text: string;
  embedding: number[];
  videoId?: string;
  startSeconds?: number;
}

const TEXT_STORE_PATH = path.join(process.cwd(), "data", "index.json");
const VIDEO_STORE_PATH = path.join(process.cwd(), "data", "index.videos.json");

let cache: Chunk[] | null = null;

async function readChunks(filePath: string): Promise<Chunk[]> {
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as Chunk[];
  } catch {
    return [];
  }
}

export async function loadIndex(): Promise<Chunk[]> {
  if (cache) return cache;
  const [textChunks, videoChunks] = await Promise.all([
    readChunks(TEXT_STORE_PATH),
    readChunks(VIDEO_STORE_PATH),
  ]);
  cache = [...textChunks, ...videoChunks];
  return cache;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function search(
  queryEmbedding: number[],
  topK = 4,
  videoId?: string
): Promise<Chunk[]> {
  const index = await loadIndex();
  const pool = videoId ? index.filter((c) => c.videoId === videoId) : index;

  return pool
    .map((chunk) => ({ chunk, score: cosineSimilarity(queryEmbedding, chunk.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((r) => r.chunk);
}

export async function listVideoIds(): Promise<string[]> {
  const index = await loadIndex();
  const ids = new Set<string>();
  for (const chunk of index) {
    if (chunk.videoId) ids.add(chunk.videoId);
  }
  return Array.from(ids);
}
