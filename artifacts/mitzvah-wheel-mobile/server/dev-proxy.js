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

function proxyRequest(req, res) {
  const options = {
    hostname: "127.0.0.1",
    port: EXPO_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `127.0.0.1:${EXPO_PORT}` },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on("error", () => {
    if (!res.headersSent) {
      res.writeHead(502, { "content-type": "text/plain" });
      res.end("Expo dev server is starting up — please wait a moment and refresh.");
    }
  });

  req.pipe(proxyReq, { end: true });
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
  const proxySocket = net.connect(EXPO_PORT, "127.0.0.1", () => {
    const headers = Object.entries({ ...req.headers, host: `127.0.0.1:${EXPO_PORT}` })
      .map(([k, v]) => `${k}: ${v}`)
      .join("\r\n");
    proxySocket.write(
      `${req.method} ${req.url} HTTP/1.1\r\n${headers}\r\n\r\n`,
    );
    if (head && head.length) proxySocket.write(head);
    socket.pipe(proxySocket);
    proxySocket.pipe(socket);
  });
  proxySocket.on("error", () => socket.destroy());
  socket.on("error", () => proxySocket.destroy());
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Dev proxy on port ${PORT} → Expo on port ${EXPO_PORT}`,
  );
  if (EXPO_DEV_DOMAIN) {
    console.log(`Expo Go URL: exp://${EXPO_DEV_DOMAIN}`);
  }
});
