#!/bin/bash
# Continuously syncs to GitHub every 2 minutes.
# Runs as a Replit background workflow (console output type).
INTERVAL_SECONDS=120
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "[github-sync] Continuous sync started (every ${INTERVAL_SECONDS}s)."

while true; do
  if bash "${SCRIPT_DIR}/sync-to-github.sh"; then
    echo "[github-sync] $(date -u '+%Y-%m-%dT%H:%M:%SZ') OK."
  else
    echo "[github-sync] $(date -u '+%Y-%m-%dT%H:%M:%SZ') Failed — will retry next cycle." >&2
  fi
  sleep "$INTERVAL_SECONDS"
done
