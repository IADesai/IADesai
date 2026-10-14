#!/usr/bin/env node
"use strict";
// Minimal static server for previewing docs/ locally, mirroring GitHub Pages
// (index.html for "/", 404.html for missing files). Usage: npm run preview [port]
const http = require("http");
const fs = require("fs");
const path = require("path");

const DOCS = path.resolve(__dirname, "..", "docs");
const PORT = Number(process.argv[2]) || 8080;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

http
  .createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      res.writeHead(400).end("Bad request");
      return;
    }
    let file = path.join(DOCS, pathname);
    if (!file.startsWith(DOCS)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    // GitHub Pages matches file names case-insensitively on some setups; be strict here so
    // broken casing is caught locally rather than in production.
    const exists = fs.existsSync(file) && fs.readdirSync(path.dirname(file)).includes(path.basename(file));
    const status = exists ? 200 : 404;
    if (!exists) file = path.join(DOCS, "404.html");
    res.writeHead(status, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`Previewing docs/ at http://localhost:${PORT}  (Ctrl+C to stop)`));
