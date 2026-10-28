// serve.mjs — dependency-free static server for the offline boot test.
// usage: node tools/serve.mjs <port> [document-root]
//
// Binds 127.0.0.1 only. Document root defaults to the repo root, so the
// capture's absolute paths (/assets/..., /game) resolve exactly as served.
// Directory indexes: /x/ -> x/index.html, / -> index.html. Clean URLs such as
// /game resolve through the directory index too. A missing file is an honest
// 404 — never an index.html SPA fallback, which would fake a 200.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const port = Number(process.argv[2]);
const docRoot = path.resolve(process.argv[3] || root);

if (!port) {
  console.error("usage: node tools/serve.mjs <port> [document-root]");
  process.exit(2);
}

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".wasm": "application/wasm",
  ".gz": "application/gzip",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".bin": "application/octet-stream",
  ".dat": "application/octet-stream",
  ".hdr": "application/octet-stream",
  ".ktx2": "image/ktx2",
};

function send(res, status, body, type, head) {
  res.writeHead(status, { "Content-Type": type || "text/plain; charset=utf-8" });
  res.end(head ? undefined : body);
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
  } catch {
    console.log(`400 ${req.url}`);
    return send(res, 400, "Bad request");
  }

  // Path-traversal guard: resolve against docRoot and require containment.
  const rel = path.normalize(pathname).replace(/^([/\\])+/, "");
  const target = path.resolve(docRoot, rel);
  if (target !== docRoot && !target.startsWith(docRoot + path.sep)) {
    console.log(`403 ${pathname}`);
    return send(res, 403, "Forbidden");
  }

  fs.stat(target, (err, st) => {
    let file = target;
    if (!err && st.isDirectory()) file = path.join(target, "index.html");

    fs.readFile(file, (rerr, data) => {
      if (rerr) {
        console.log(`404 ${pathname}`);
        return send(res, 404, "Not found");
      }
      const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
      console.log(`200 ${pathname} (${data.length} bytes)`);
      send(res, 200, data, type, req.method === "HEAD");
    });
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`serving ${docRoot} on http://127.0.0.1:${port}/`);
});
