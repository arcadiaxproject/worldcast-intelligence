# Worldcast Intelligence

Portfolio + asistente de IA con RAG (Retrieval-Augmented Generation) que corre
**íntegramente en local**. El modelo de lenguaje, los embeddings y la base de
conocimiento (vídeos transcritos) se ejecutan con [Ollama](https://ollama.com)
en la propia máquina, sin depender de ningún proveedor de inferencia externo.

**Demo en producción:** https://worldcast-intelligence.vercel.app

> ⚠️ **Aviso importante sobre el chat en producción**
>
> El resto de la web (Hero, proyecto, arquitectura, CV, etc.) funciona siempre,
> esté donde esté desplegada. El **chat es distinto**: para que responda de
> verdad, la API de Vercel necesita alcanzar un Ollama que corre en un PC
> personal, expuesto mediante un túnel (ngrok). Eso significa que el chat
> **solo funciona si, en ese momento, el PC está encendido, Ollama está
> corriendo y el túnel sigue activo**.
>
> Si el PC se apaga, se suspende, pierde conexión a internet, o el túnel se
> cae, el chat responderá con un error 503 ("El motor de IA local no está
> disponible en este momento") aunque el resto de la página siga funcionando
> con normalidad. Es una consecuencia intencional de la arquitectura del
> proyecto (la IA nunca se expone directamente ni corre en un servidor de
> terceros), no un fallo de la aplicación.

## Qué hace

- Responde preguntas en lenguaje natural sobre vídeos de YouTube ya
  transcritos e indexados, seleccionables desde un chat estilo WhatsApp Web.
- Cada conversación se guarda por vídeo en Supabase y se recupera al volver a
  abrir el chat; también se puede borrar por completo desde la propia UI.
- Cuando la respuesta proviene de un vídeo, cita el minuto exacto y muestra un
  reproductor embebido que arranca justo ahí.
- Incluye una intro cinematográfica en el Hero: vídeo con audio activado por
  el usuario, texto animado con GSAP y scroll automático al terminar.
- Todo el pipeline (embeddings, búsqueda semántica, generación de la
  respuesta) corre contra Ollama; solo la aplicación Next.js (y, opcionalmente,
  un túnel hacia Ollama) se expone públicamente.

## Arquitectura

```text
Usuario
  ↓
Next.js (UI + API Routes) — desplegado en Vercel
  ↓
Ollama (PC local) — modelo de chat + embeddings
  ↓                    ↑ expuesto vía túnel (ngrok) solo cuando hace falta
Vector store (JSON) — transcripciones de vídeo
  ↓
Supabase — historial de conversaciones por vídeo
```

- **Frontend**: Next.js App Router + React + Tailwind CSS, animaciones con GSAP.
- **API**: Route Handler (`src/app/api/chat`) que hace RAG: genera el embedding
  de la consulta, busca los fragmentos más relevantes por similitud coseno
  (filtrando por el vídeo seleccionado) y se los pasa al modelo de chat como
  contexto.
- **Historial**: `src/app/api/chat/history` guarda y recupera cada
  conversación en Supabase (tabla `conversations`, ver `supabase/schema.sql`),
  con opción de borrado completo por vídeo.
- **Ingesta de texto**: `scripts/ingest.ts` trocea los `.md`/`.txt` de `data/`,
  genera sus embeddings y los guarda en `data/index.json`.
- **Ingesta de vídeo**: `scripts/transcribe-videos.ts` transcribe localmente
  con [Whisper](https://github.com/openai/whisper) los vídeos de `media/videos/`,
  agrupa los segmentos en fragmentos con marca de tiempo y los guarda en
  `data/index.videos.json`. Ambos índices se versionan en el repo para que
  Vercel tenga datos sobre los que buscar sin tener que correr Whisper/Ollama
  durante el build.
- **Corrección de cabecera Host**: `scripts/ollama-host-proxy.mjs` — Ollama
  rechaza con 403 cualquier petición cuyo `Host` no sea `localhost` (protección
  anti DNS-rebinding, independiente de `OLLAMA_ORIGINS`). Este proxy reescribe
  el `Host` antes de reenviar a Ollama, imprescindible para poder exponerlo
  detrás de un túnel.
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
  `ffmpeg`, solo si vas a indexar vídeos nuevos.
- [yt-dlp](https://github.com/yt-dlp/yt-dlp), solo si vas a descargar vídeos de YouTube.
- Una cuenta de [Supabase](https://supabase.com), solo si quieres persistir el
  historial de conversaciones (opcional: sin ella, el chat funciona igual,
  simplemente no recuerda conversaciones anteriores).

## Puesta en marcha

```bash
npm install

# (Opcional) Indexar documentos de texto adicionales en /data
npm run ingest

# (Opcional) Transcribir e indexar vídeos colocados en /media/videos
npm run ingest:videos

# Levantar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Exponer Ollama para un despliegue como Vercel

Si despliegas la web en un sitio distinto a donde corre Ollama (como Vercel),
Ollama tiene que ser alcanzable públicamente:

```bash
# 1. Arranca el proxy que corrige la cabecera Host
node scripts/ollama-host-proxy.mjs

# 2. Expón el proxy (no Ollama directamente) con un túnel, p. ej. ngrok
ngrok http 11500

# 3. Configura la URL pública resultante como OLLAMA_URL en las variables
#    de entorno de Vercel, y redespliega
```

Mientras el PC, Ollama, el proxy y el túnel no estén todos activos a la vez,
el chat en producción no podrá responder (ver el aviso al principio de este README).

## Variables de entorno

| Variable                              | Descripción                              | Por defecto                |
| -------------------------------------- | ----------------------------------------- | --------------------------- |
| `OLLAMA_URL`                           | URL del servidor de Ollama (o su túnel)    | `http://127.0.0.1:11434`   |
| `OLLAMA_EMBED_MODEL`                   | Modelo usado para generar embeddings       | `nomic-embed-text`         |
| `OLLAMA_CHAT_MODEL`                    | Modelo usado para generar respuestas       | `llama3.1:8b`               |
| `WHISPER_MODEL`                        | Tamaño del modelo Whisper para transcribir | `small`                     |
| `WHISPER_BIN`                          | Ruta al ejecutable de Whisper              | `whisper`                   |
| `NEXT_PUBLIC_SUPABASE_URL`             | URL del proyecto de Supabase               | —                            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave pública (anon) de Supabase           | —                            |

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
    api/chat/route.ts          # Endpoint RAG (rate limit, validación, llamada a Ollama)
    api/chat/history/route.ts   # Historial de conversaciones (GET/DELETE) en Supabase
    page.tsx                    # Composición de la página
  components/
    Hero.tsx                    # Sección de bienvenida + panel animado
    CinematicIntro.tsx           # Intro cinematográfica con vídeo y GSAP
    ProjectWorldcast.tsx         # Sección "Worldcast Intelligence"
    Workflow.tsx                 # "El workflow, paso a paso" (scroll-scrubbed)
    WhatsAppChat.tsx             # Chat estilo WhatsApp Web
    WhyJoin.tsx                  # Cierre "¿Por qué contratarme?"
    Navbar.tsx                   # Navbar con scrollspy y menú móvil
  lib/
    ollama.ts                    # Cliente HTTP para la API de Ollama
    vectorstore.ts                # Búsqueda semántica sobre el índice local
    supabase.ts                   # Cliente de Supabase + guardado de conversaciones
    ratelimit.ts                  # Rate limiting en memoria por IP
    videos.ts                     # Lista de vídeos indexados
scripts/
  ingest.ts                       # Ingesta de documentos de texto
  transcribe-videos.ts             # Transcripción + ingesta de vídeos
  ollama-host-proxy.mjs            # Corrige la cabecera Host para poder tunelizar Ollama
supabase/
  schema.sql                       # Tabla `conversations` + políticas RLS
data/                              # Documentos fuente + índices generados (versionados)
media/videos/                      # Vídeos a transcribir (gitignored)
```

## Despliegue

La aplicación Next.js está desplegada en Vercel. Ollama se mantiene fuera de
Internet salvo cuando se expone puntualmente mediante un túnel para que el
chat funcione en producción (ver sección anterior). El resto de la web no
depende de esa disponibilidad y funciona siempre.
