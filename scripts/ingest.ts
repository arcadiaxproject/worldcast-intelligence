import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { embed } from "../src/lib/ollama";
import type { Chunk } from "../src/lib/vectorstore";

const DATA_DIR = path.join(process.cwd(), "data");
const OUT_PATH = path.join(DATA_DIR, "index.json");
const CHUNK_SIZE = 800;

function chunkText(text: string, size: number): string[] {
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    if ((current + "\n\n" + para).length > size && current) {
      chunks.push(current);
      current = para;
    } else {
      current = current ? `${current}\n\n${para}` : para;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function main() {
  const files = (await readdir(DATA_DIR)).filter(
    (f) => f.endsWith(".md") || f.endsWith(".txt")
  );

  if (files.length === 0) {
    console.error(`No se encontraron documentos .md/.txt en ${DATA_DIR}`);
    process.exit(1);
  }

  const chunks: Chunk[] = [];

  for (const file of files) {
    const fullPath = path.join(DATA_DIR, file);
    const content = await readFile(fullPath, "utf-8");
    const parts = chunkText(content, CHUNK_SIZE);

    console.log(`Procesando ${file}: ${parts.length} fragmento(s)`);

    for (let i = 0; i < parts.length; i++) {
      const embedding = await embed(parts[i]);
      chunks.push({
        id: `${file}-${i}`,
        source: file,
        text: parts[i],
        embedding,
      });
    }
  }

  await writeFile(OUT_PATH, JSON.stringify(chunks, null, 2), "utf-8");
  console.log(`Índice generado con ${chunks.length} fragmentos en ${OUT_PATH}`);
}

main().catch((err) => {
  console.error("Fallo la ingesta:", err);
  process.exit(1);
});
