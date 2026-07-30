# Arquitectura de despliegue

La aplicación se publica siguiendo esta cadena:

Usuario -> Dominio propio -> Cloudflare Tunnel -> Next.js -> API Routes -> Ollama (localhost) -> Embeddings y datos locales.

## Por qué Cloudflare Tunnel

Cloudflare Tunnel permite exponer la aplicación Next.js a Internet sin abrir
puertos en el router ni exponer directamente el servidor donde corre Ollama.
Solo el proceso de Next.js recibe tráfico público; Ollama solo escucha en
localhost y nunca es alcanzable desde fuera de la máquina.

## Seguridad

- Rate limiting por IP en las rutas de la API.
- Validación del tamaño máximo de las consultas entrantes.
- Manejo explícito de errores cuando Ollama no responde o está ocupado.
