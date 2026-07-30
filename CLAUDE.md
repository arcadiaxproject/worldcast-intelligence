@AGENTS.md
# Worldcast Intelligence

### MVP para demostrar capacidades Full Stack + IA Local

## Objetivo

Desarrollar un MVP en el menor tiempo posible que permita realizar búsquedas inteligentes sobre todos los episodios de Worldcast utilizando únicamente modelos de IA ejecutados de forma local.

El objetivo no es crear un producto terminado, sino una demostración técnica que evidencie conocimientos de:

* Next.js
* React
* TypeScript
* IA Local
* RAG
* Procesamiento de vídeo
* Embeddings
* Arquitectura de aplicaciones
* UX moderna

Todo el procesamiento deberá ejecutarse localmente mediante Ollama, sin utilizar APIs de OpenAI u otros proveedores externos.

---

# Filosofía del proyecto

Este proyecto debe construirse de forma incremental.

Cada fase debe terminar con una aplicación completamente funcional antes de comenzar la siguiente.

No se debe avanzar a una nueva fase hasta validar completamente la anterior.

Cada fase debe dejar el código limpio, documentado y preparado para ampliarse.

---

# Stack Tecnológico

## Frontend

* Next.js (App Router)
* React
* TypeScript
* TailwindCSS
* GSAP (animaciones)

## Backend

Utilizar únicamente Route Handlers de Next.js.

No utilizar FastAPI.

---

## IA

Ollama

Modelos:

* qwen3:30b
* embeddinggemma

---

## Transcripción

* mlx-whisper

---

## Base de datos

Durante el MVP no utilizar PostgreSQL.

Toda la información se almacenará inicialmente en archivos JSON.

Más adelante será sencillo migrarlo.

---

## Principios

* Código limpio
* Componentes reutilizables
* Arquitectura modular
* Evitar sobreingeniería
* Preparado para crecer

---

# Arquitectura

```
Usuario

↓

Next.js

↓

API

↓

Embeddings

↓

Búsqueda semántica

↓

Qwen3

↓

Respuesta
```

---

# Estructura inicial

```
worldcast-intelligence/

app/

components/

lib/

services/

scripts/

data/

episodes/

embeddings/

transcripts/

public/

types/

utils/

```

---

# FASE 1

## Configuración del proyecto

Objetivo:

Tener una base sólida sobre la que construir.

### Tareas

* Crear proyecto Next.js
* Configurar TypeScript
* Configurar Tailwind
* Configurar ESLint
* Configurar estructura de carpetas
* Configurar alias (@/)
* Crear layout principal
* Crear tema oscuro
* Crear barra de navegación

### Resultado esperado

Aplicación funcionando con una página de inicio limpia.

---

# FASE 2

## Diseño de la interfaz

Objetivo

Crear una interfaz atractiva antes de implementar la IA.

### Debe incluir

Hero principal

Caja de búsqueda

Listado de episodios

Zona de respuesta

Footer

Animaciones suaves con GSAP

Inspiración:

* ChatGPT
* Perplexity
* Apple
* Linear

### Resultado

Una aplicación bonita aunque todavía no haga búsquedas.

---

# FASE 3

## Descarga de vídeos

Objetivo

Automatizar la descarga de episodios.

Crear un script capaz de:

* Descargar vídeos desde YouTube
* Obtener el título
* Obtener descripción
* Obtener duración
* Obtener miniatura
* Obtener ID

Guardar toda la información en:

```
data/episodes.json
```

Resultado:

Todos los episodios registrados.

---

# FASE 4

## Transcripción automática

Objetivo

Convertir todos los vídeos a texto.

Utilizar:

mlx-whisper

El script deberá:

Extraer audio

Transcribir

Guardar timestamps

Guardar texto completo

Resultado:

```
transcripts/

episode1.json

episode2.json
```

Cada archivo contendrá:

```
Título

Invitado

Timestamp

Texto
```

---

# FASE 5

## División en fragmentos

Objetivo

Preparar el texto para RAG.

Cada episodio deberá dividirse en bloques de aproximadamente:

400 palabras

Cada bloque deberá almacenar:

```ts
{
    id,
    episode,
    guest,
    videoId,
    startSeconds,
    endSeconds,
    text
}
```

Resultado:

Chunks listos para embeddings.

---

# FASE 6

## Embeddings

Objetivo

Generar embeddings de todos los fragmentos.

Modelo:

embeddinggemma

Cada chunk deberá incluir:

```ts
embedding: number[]
```

Guardar en:

```
embeddings/

episode1.json
```

---

# FASE 7

## Motor de búsqueda

Objetivo

Implementar búsqueda semántica.

Flujo

Usuario escribe

↓

Embedding de la pregunta

↓

Comparación coseno

↓

Top 5 resultados

↓

Mostrar resultados

Sin utilizar todavía Qwen.

Resultado:

El usuario ya puede buscar información.

---

# FASE 8

## Integración con Qwen

Objetivo

Generar respuestas naturales.

Flujo

Pregunta

↓

Embedding

↓

Top chunks

↓

Prompt

↓

Qwen

↓

Respuesta

La respuesta deberá citar:

* Episodio
* Invitado
* Timestamp

---

# FASE 9

## Enlaces inteligentes

Cada respuesta deberá permitir abrir el vídeo exactamente en el minuto correspondiente.

Ejemplo

```
https://youtube.com/watch?v=XXXXX&t=653s
```

---

# FASE 10

## Historial

Guardar conversaciones localmente.

Cada conversación incluirá:

* pregunta
* respuesta
* fecha

---

# FASE 11

## Mejoras visuales

Añadir:

* Skeletons
* Animaciones
* Loading
* Streaming de respuestas
* Transiciones
* Mejor UX

---

# FASE 12

## Optimización

Optimizar:

* Tiempo de búsqueda
* Caché
* Reutilización de embeddings
* Lazy loading
* Componentes

---

# FASE 13

## Calidad del código

Antes de dar el proyecto por terminado:

* Eliminar código muerto.
* Eliminar duplicidades.
* Crear componentes reutilizables.
* Revisar nombres.
* Revisar tipos.
* Revisar imports.
* Añadir comentarios donde sea necesario.
* Verificar que todo compile sin errores.

---

# Estructura de datos

```ts
interface Episode {

    id: string

    title: string

    guest: string

    youtubeId: string

    thumbnail: string

    duration: number

}
```

---

```ts
interface Chunk {

    id: string

    episode: string

    guest: string

    startSeconds: number

    endSeconds: number

    text: string

    embedding?: number[]

}
```

---

# Flujo completo

```
YouTube

↓

Descarga

↓

Whisper

↓

Texto

↓

Chunks

↓

Embeddings

↓

Pregunta

↓

Embedding

↓

Top resultados

↓

Qwen3

↓

Respuesta

↓

Usuario
```

---

# Normas para Claude Code

Durante todo el desarrollo se deberán seguir las siguientes reglas:

1. Nunca generar código duplicado.
2. Crear componentes pequeños y reutilizables.
3. Priorizar claridad frente a complejidad.
4. No instalar dependencias innecesarias.
5. Mantener una arquitectura modular.
6. Usar TypeScript estricto.
7. Tipar correctamente todas las funciones.
8. Documentar únicamente donde aporte valor.
9. Evitar soluciones temporales si existe una implementación sencilla y mantenible.
10. Antes de comenzar una nueva fase, verificar que la fase anterior funciona correctamente.
11. Si una fase requiere refactorización para soportar la siguiente, realizarla antes de avanzar.
12. Mantener siempre el proyecto en un estado ejecutable.

---

# Objetivo final

Construir un asistente inteligente capaz de responder preguntas sobre el contenido de Worldcast utilizando IA completamente local. El sistema deberá localizar los fragmentos relevantes mediante búsqueda semántica, generar respuestas fundamentadas con Qwen3 y enlazar al momento exacto del episodio correspondiente. El resultado debe transmitir la calidad de un producto profesional, con una experiencia fluida, una arquitectura sólida y una base preparada para evolucionar hacia una plataforma completa de consulta de conocimiento sobre podcasts.

# FASE 14

## Despliegue y publicación

### Objetivo

Publicar el proyecto para que cualquier usuario pueda acceder desde Internet sin exponer directamente el motor de IA.

## Arquitectura

```text
Usuario
      ↓
Dominio
      ↓
Cloudflare Tunnel
      ↓
Next.js
      ↓
API Routes
      ↓
Ollama (localhost)
      ↓
Embeddings + Datos locales
```

## Requisitos

* Mantener Ollama ejecutándose localmente.
* Mantener Next.js ejecutándose en modo producción.
* No exponer el puerto de Ollama a Internet.
* Publicar únicamente la aplicación Next.js.
* Configurar un dominio propio.

## Tareas

### Preparación

* Generar la versión de producción.
* Verificar que todo funciona correctamente.
* Optimizar el rendimiento.
* Revisar los logs.

### Publicación

* Configurar Cloudflare Tunnel.
* Asociar un dominio propio.
* Configurar HTTPS.
* Verificar el acceso desde dispositivos externos.

### Seguridad

* Implementar limitación de peticiones por IP.
* Validar el tamaño máximo de las consultas.
* Añadir protección frente a abuso.
* Gestionar errores de conexión con Ollama.
* Mostrar mensajes de estado cuando el modelo esté ocupado.

### Monitorización

* Registrar consultas y errores.
* Medir tiempos de respuesta.
* Detectar cuellos de botella.
* Analizar el uso de memoria y CPU.

## Objetivo final

Disponer de una aplicación accesible públicamente donde cualquier usuario pueda consultar el contenido de Worldcast mediante IA local, manteniendo el modelo y los datos completamente bajo nuestro control, sin depender de servicios externos de inferencia.
