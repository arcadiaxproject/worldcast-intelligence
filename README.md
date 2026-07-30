# Worldcast Intelligence

Portfolio + asistente de IA con RAG (Retrieval-Augmented Generation) que corre
**íntegramente en local**. El modelo de lenguaje, los embeddings y la base de
conocimiento (documentos y vídeos transcritos) se ejecutan con [Ollama](https://ollama.com)
en la propia máquina, sin depender de ningún proveedor de inferencia externo.

## Qué hace

- Responde preguntas en lenguaje natural sobre una base de conocimiento propia:
  documentos de texto y transcripciones de vídeos de YouTube.
- Cuando la respuesta proviene de un vídeo, cita el minuto exacto y muestra un
  reproductor embebido que arranca justo ahí.
- Todo el pipeline (embeddings, búsqueda semántica, generación de la respuesta)
  corre contra Ollama en `localhost`; solo la aplicación Next.js se expone
  públicamente.

## Arquitectura

```text
Usuario
  ↓
Next.js (UI + API Routes)
  ↓
Ollama (localhost) — modelo de chat + embeddings
  ↓
Vector store local (JSON) — documentos + transcripciones de vídeo
```

- **Frontend**: Next.js App Router + React + Tailwind CSS, animaciones con GSAP.
- **API**: Route Handler (`src/app/api/chat`) que hace RAG: genera el embedding
  de la consulta, busca los fragmentos más relevantes por similitud coseno y
  se los pasa al modelo de chat como contexto.
- **Ingesta de texto**: `scripts/ingest.ts` trocea los `.md`/`.txt` de `data/`,
  genera sus embeddings y los guarda en `data/index.json`.
- **Ingesta de vídeo**: `scripts/transcribe-videos.ts` transcribe localmente
  con [Whisper](https://github.com/openai/whisper) los vídeos de `media/videos/`,
  agrupa los segmentos en fragmentos con marca de tiempo y los guarda en
  `data/index.videos.json`.
- **Seguridad de la API**: rate limiting por IP, validación del tamaño máximo
  de las consultas, manejo explícito de errores cuando Ollama no responde.

## Requisitos previos

- [Node.js](https://nodejs.org) 20+
- [Ollama](https://ollama.com) instalado y corriendo en local, con los modelos:
  ```bash
  ollama pull nomic-embed-text
  ollama pull llama3.1:8b
  ```
- [Whisper](https://github.com/openai/whisper) (`pip install openai-whisper`) y
  `ffmpeg`, solo si vas a indexar vídeos.
- [yt-dlp](https://github.com/yt-dlp/yt-dlp), solo si vas a descargar vídeos de YouTube.

## Puesta en marcha

```bash
npm install

# Indexar los documentos de /data
npm run ingest

# (Opcional) Transcribir e indexar vídeos colocados en /media/videos
npm run ingest:videos

# Levantar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable             | Descripción                              | Por defecto                |
| -------------------- | ----------------------------------------- | --------------------------- |
| `OLLAMA_URL`          | URL del servidor de Ollama                 | `http://127.0.0.1:11434`   |
| `OLLAMA_EMBED_MODEL`  | Modelo usado para generar embeddings       | `nomic-embed-text`         |
| `OLLAMA_CHAT_MODEL`   | Modelo usado para generar respuestas       | `llama3.1:8b`               |
| `WHISPER_MODEL`       | Tamaño del modelo Whisper para transcribir | `small`                     |
| `WHISPER_BIN`         | Ruta al ejecutable de Whisper              | `whisper`                   |

## Scripts

| Comando               | Qué hace                                                    |
| ---------------------- | ------------------------------------------------------------ |
| `npm run dev`           | Arranca el servidor de desarrollo                            |
| `npm run build`         | Genera la build de producción                                |
| `npm run start`         | Sirve la build de producción                                 |
| `npm run lint`          | Ejecuta ESLint                                                |
| `npm run ingest`        | Indexa los documentos de `/data`                              |
| `npm run ingest:videos` | Transcribe (Whisper) e indexa los vídeos de `/media/videos`   |

## Estructura del proyecto

```text
src/
  app/
    api/chat/route.ts   # Endpoint RAG (rate limit, validación, llamada a Ollama)
    page.tsx            # UI: hero, proyecto, galería de vídeos, chat
  components/            # Hero, ProjectWorldcast, VideoGallery
  lib/
    ollama.ts            # Cliente HTTP para la API de Ollama
    vectorstore.ts        # Búsqueda semántica sobre el índice local
    ratelimit.ts          # Rate limiting en memoria por IP
scripts/
  ingest.ts               # Ingesta de documentos de texto
  transcribe-videos.ts     # Transcripción + ingesta de vídeos
data/                      # Documentos fuente + índices generados (gitignored)
media/videos/              # Vídeos a transcribir (gitignored)
```

## Despliegue

Pensado para desplegarse manteniendo Ollama fuera de Internet: la aplicación
Next.js es la única pieza expuesta públicamente (por ejemplo, vía Cloudflare
Tunnel o Vercel), mientras Ollama sigue escuchando solo en `localhost`.
