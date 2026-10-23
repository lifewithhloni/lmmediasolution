import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, sep } from "node:path";

const root = normalize(process.cwd());
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const isFile = (path) => existsSync(path) && statSync(path).isFile();

createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);
  let safePath;
  try {
    safePath = normalize(join(root, decodeURIComponent(url.pathname)));
  } catch {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }
  if (safePath !== root && !safePath.startsWith(root + sep)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  // Folder URLs such as /services/ are served from /services/index.html.
  if (!url.pathname.endsWith("/") && isFile(join(safePath, "index.html"))) {
    response.writeHead(301, { Location: url.pathname + "/" + url.search });
    response.end();
    return;
  }
  const filePath = isFile(safePath) ? safePath : isFile(join(safePath, "index.html")) ? join(safePath, "index.html") : null;
  const target = filePath || join(root, "404.html");

  response.writeHead(filePath ? 200 : 404, { "Content-Type": types[extname(target)] || "application/octet-stream" });
  createReadStream(target).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`LM Media Solutions site running at http://127.0.0.1:${port}`);
});
