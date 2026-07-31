import http from "node:http";

const TARGET_HOST = "127.0.0.1";
const TARGET_PORT = Number(process.env.OLLAMA_PORT ?? 11434);
const PROXY_PORT = Number(process.env.PROXY_PORT ?? 11500);

const server = http.createServer((req, res) => {
  const options = {
    hostname: TARGET_HOST,
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `localhost:${TARGET_PORT}` },
  };

  const upstream = http.request(options, (upstreamRes) => {
    res.writeHead(upstreamRes.statusCode ?? 502, upstreamRes.headers);
    upstreamRes.pipe(res);
  });

  upstream.on("error", (err) => {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "upstream_unreachable", detail: String(err) }));
  });

  req.pipe(upstream);
});

server.listen(PROXY_PORT, () => {
  console.log(`Proxy escuchando en http://127.0.0.1:${PROXY_PORT} -> localhost:${TARGET_PORT} (Host corregido)`);
});
