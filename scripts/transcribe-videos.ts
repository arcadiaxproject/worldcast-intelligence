import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { embed } from "../src/lib/ollama";
import type { Chunk } from "../src/lib/vectorstore";

const VIDEOS_DIR = path.join(process.cwd(), "media", "videos");
const OUT_PATH = path.join(process.cwd(), "data", "index.videos.json");
const WHISPER_MODEL = process.env.WHISPER_MODEL ?? "small";
const WHISPER_BIN = process.env.WHISPER_BIN ?? "whisper";
const VIDEO_EXTENSIONS = [".mp4", ".mp3", ".wav", ".m4a", ".webm", ".mkv"];

const CHUNK_MAX_CHARS = 600;
const CHUNK_MAX_SECONDS = 45;

interface WhisperSegment {
  start: number;
  end: number;
  text: string;
}

function transcribe(filePath: string, workDir: string): WhisperSegment[] {
  console.log(`Transcribiendo ${path.basename(filePath)} con Whisper (${WHISPER_MODEL})...`);

  execFileSync(
    WHISPER_BIN,
    [filePath, "--model", WHISPER_MODEL, "--output_format", "json", "--output_dir", workDir],
    { stdio: "inherit" }
  );

  const jsonName = `${path.parse(filePath).name}.json`;
  const raw = readFileSync(path.join(workDir, jsonName), "utf-8");
  const data = JSON.parse(raw) as { segments: WhisperSegment[] };
  return data.segments;
}

function chunkSegments(segments: WhisperSegment[]): { start: number; text: string }[] {
  const chunks: { start: number; text: string }[] = [];
  let current = { start: segments[0]?.start ?? 0, text: "" };

  for (const seg of segments) {
    const candidate = current.text ? `${current.text} ${seg.text.trim()}` : seg.text.trim();
    const durationSoFar = seg.end - current.start;

    if (current.text && (candidate.length > CHUNK_MAX_CHARS || durationSoFar > CHUNK_MAX_SECONDS)) {
      chunks.push(current);
      current = { start: seg.start, text: seg.text.trim() };
    } else {
      current.text = candidate;
    }
  }
  if (current.text) chunks.push(current);
  return chunks;
}

async function main() {
  let files: string[];
  try {
    files = readdirSync(VIDEOS_DIR).filter((f) =>
      VIDEO_EXTENSIONS.includes(path.extname(f).toLowerCase())
    );
  } catch {
    console.error(`No existe el directorio ${VIDEOS_DIR}. Crea media/videos/ y añade los vídeos.`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error(`No se encontraron vídeos en ${VIDEOS_DIR}`);
    process.exit(1);
  }

  const workDir = mkdtempSync(path.join(tmpdir(), "whisper-"));
  const chunks: Chunk[] = [];

  try {
    for (const file of files) {
      const videoId = path.parse(file).name;
      const filePath = path.join(VIDEOS_DIR, file);
      const segments = transcribe(filePath, workDir);
      const videoChunks = chunkSegments(segments);

      console.log(`  -> ${videoChunks.length} fragmento(s) para ${videoId}`);

      for (let i = 0; i < videoChunks.length; i++) {
        const { start, text } = videoChunks[i];
        const embedding = await embed(text);
        chunks.push({
          id: `video-${videoId}-${i}`,
          source: `Vídeo ${videoId} (min ${Math.floor(start / 60)}:${String(Math.floor(start % 60)).padStart(2, "0")})`,
          text,
          embedding,
          videoId,
          startSeconds: Math.floor(start),
        });
      }
    }
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }

  writeFileSync(OUT_PATH, JSON.stringify(chunks, null, 2), "utf-8");
  console.log(`Índice de vídeos generado con ${chunks.length} fragmentos en ${OUT_PATH}`);
}

main().catch((err) => {
  console.error("Fallo la transcripción/ingesta de vídeos:", err);
  process.exit(1);
});
