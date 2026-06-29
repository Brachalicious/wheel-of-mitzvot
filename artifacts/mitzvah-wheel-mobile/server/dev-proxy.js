/**
 * Dev proxy for the Expo mobile app.
 *
 * Listens on PORT (the port Replit exposes to the preview pane and to
 * REPLIT_EXPO_DEV_DOMAIN). Forwards all traffic to the actual Expo dev
 * server running on EXPO_PORT (PORT + 1 by default).
 *
 * Special case: GET / without an expo-platform header from a browser
 * (Accept: text/html) → serve a QR-code landing page so the user can
 * scan it with Expo Go instead of seeing the web build in the iframe.
 *
 * Zero external dependencies — uses only Node.js built-ins.
 */

const http = require("http");
const net = require("net");
const fs = require("fs");
const path = require("path");

const PORT = parseInt(process.env.PORT || "3000", 10);
const EXPO_PORT = parseInt(process.env.EXPO_PORT || String(PORT + 1), 10);
const EXPO_DEV_DOMAIN = process.env.REPLIT_EXPO_DEV_DOMAIN || "";
const TEMPLATE_PATH = path.resolve(
  __dirname,
  "templates",
  "dev-landing.html",
);

/** Total time (ms) to keep retrying before giving up. */
const RETRY_WINDOW_MS = 10_000;
/** Initial retry delay (ms); doubles each attempt. */
const RETRY_BASE_MS = 200;
/** Max single retry delay (ms). */
const RETRY_MAX_MS = 2_000;

function getAppName() {
  try {
    const appJson = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "..", "app.json"), "utf-8"),
    );
    return appJson.expo?.name || "Mobile App";
  } catch {
    return "Mobile App";
  }
}

const appName = getAppName();
const landingTemplate = fs.readFileSync(TEMPLATE_PATH, "utf-8");

function serveLandingPage(req, res) {
  const expUrl = `exp://${EXPO_DEV_DOMAIN}`;
  const expsUrl = `exps://${EXPO_DEV_DOMAIN}`;
  const html = landingTemplate
    .replace(/APP_NAME_PLACEHOLDER/g, appName)
    .replace(/EXP_URL_PLACEHOLDER/g, expUrl)
    .replace(/EXPS_URL_PLACEHOLDER/g, expsUrl);
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(html);
}

/**
 * Collect all chunks from a readable stream into a single Buffer.
 */
function bufferStream(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

/**
 * Attempt a single proxy pass using the already-buffered body.
 * Resolves to true if the response was handled, rejects with the error
 * if the upstream connection failed (ECONNREFUSED / ECONNRESET / etc.).
 */
function attemptProxy(req, res, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "127.0.0.1",
      port: EXPO_PORT,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: `127.0.0.1:${EXPO_PORT}`,
        "content-length": body.length,
      },
    };

    const proxyReq = http.request(options, (proxyRes) => {
      if (!res.headersSent) {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      }
      resolve(true);
    });

    proxyReq.on("error", (err) => {
      reject(err);
    });

    proxyReq.end(body);
  });
}

/**
 * Sleep for `ms` milliseconds.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function proxyRequest(req, res) {
  let body;
  try {
    body = await bufferStream(req);
  } catch {
    if (!res.headersSent) {
      res.writeHead(500, { "content-type": "text/plain" });
      res.end("Failed to read request body.");
    }
    return;
  }

  const deadline = Date.now() + RETRY_WINDOW_MS;
  let delay = RETRY_BASE_MS;
  let lastErr;

  while (Date.now() < deadline) {
    try {
      await attemptProxy(req, res, body);
      return;
    } catch (err) {
      lastErr = err;
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      const wait = Math.min(delay, remaining, RETRY_MAX_MS);
      await sleep(wait);
      delay = Math.min(delay * 2, RETRY_MAX_MS);
    }
  }

  if (!res.headersSent) {
    const retryAfter = Math.ceil(RETRY_WINDOW_MS / 1000);
    res.writeHead(503, {
      "content-type": "text/plain",
      "retry-after": String(retryAfter),
    });
    res.end(
      "Expo dev server is still starting up — Expo Go will retry automatically.",
    );
  }
}

/**
 * Attempt to connect a TCP socket to the Expo server, retrying with
 * exponential back-off until the deadline.
 */
function connectWithRetry(deadline, delay) {
  return new Promise((resolve, reject) => {
    function attempt() {
      const socket = net.connect(EXPO_PORT, "127.0.0.1");
      socket.once("connect", () => resolve(socket));
      socket.once("error", (err) => {
        socket.destroy();
        const remaining = deadline - Date.now();
        if (remaining <= 0) {
          reject(err);
          return;
        }
        const wait = Math.min(delay, remaining, RETRY_MAX_MS);
        delay = Math.min(delay * 2, RETRY_MAX_MS);
        setTimeout(attempt, wait);
      });
    }
    attempt();
  });
}

const server = http.createServer((req, res) => {
  const pathname = (req.url || "/").split("?")[0];
  const accept = req.headers["accept"] || "";
  const expoPlatform = req.headers["expo-platform"];

  if (
    pathname === "/" &&
    !expoPlatform &&
    accept.includes("text/html")
  ) {
    return serveLandingPage(req, res);
  }

  proxyRequest(req, res);
});

server.on("upgrade", (req, socket, head) => {
  const deadline = Date.now() + RETRY_WINDOW_MS;

  connectWithRetry(deadline, RETRY_BASE_MS)
    .then((proxySocket) => {
      const headers = Object.entries({
        ...req.headers,
        host: `127.0.0.1:${EXPO_PORT}`,
      })
        .map(([k, v]) => `${k}: ${v}`)
        .join("\r\n");
      proxySocket.write(
        `${req.method} ${req.url} HTTP/1.1\r\n${headers}\r\n\r\n`,
      );
      if (head && head.length) proxySocket.write(head);
      socket.pipe(proxySocket);
      proxySocket.pipe(socket);
      proxySocket.on("error", () => socket.destroy());
      socket.on("error", () => proxySocket.destroy());
    })
    .catch(() => socket.destroy());
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Dev proxy on port ${PORT} → Expo on port ${EXPO_PORT}`,
  );
  if (EXPO_DEV_DOMAIN) {
    console.log(`Expo Go URL: exp://${EXPO_DEV_DOMAIN}`);
  }
});
