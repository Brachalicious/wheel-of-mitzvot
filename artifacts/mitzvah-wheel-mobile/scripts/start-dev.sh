#!/bin/sh
# Compute expo port as PORT + 1 so the dev proxy can sit on PORT
EXPO_PORT=$((${PORT:-3000} + 1))
export EXPO_PORT

# Start dev proxy on PORT (shows QR code to browsers, proxies Expo traffic)
node server/dev-proxy.js &
PROXY_PID=$!

# Trap signals so we clean up the proxy when the process is stopped
cleanup() {
  kill "$PROXY_PID" 2>/dev/null
  exit 0
}
trap cleanup INT TERM

# Start Expo dev server on EXPO_PORT
EXPO_PACKAGER_PROXY_URL=https://$REPLIT_EXPO_DEV_DOMAIN \
  EXPO_PUBLIC_DOMAIN=$REPLIT_DEV_DOMAIN \
  EXPO_PUBLIC_REPL_ID=$REPL_ID \
  REACT_NATIVE_PACKAGER_HOSTNAME=$REPLIT_DEV_DOMAIN \
  pnpm exec expo start --localhost --port "$EXPO_PORT"

kill "$PROXY_PID" 2>/dev/null
