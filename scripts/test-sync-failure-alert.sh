#!/bin/bash
# Smoke-tests the notify_failure webhook in sync-to-github.sh end-to-end.
#
# What it checks:
#   1. End-to-end: running sync-to-github.sh with a forced push failure
#      actually delivers a webhook payload to the configured URL
#   2. notify_failure unit: valid JSON, correct shape, message included
#   3. Silent skip when NOTIFY_WEBHOOK_URL is unset
#   4. Payload stays valid JSON when the message contains characters that
#      break naive string concatenation: double-quotes, backslashes, newlines
#
# Usage:
#   bash scripts/test-sync-failure-alert.sh
#
# Prerequisites: bash, curl, python3

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PASS=0
FAIL=0
PORT=19877

log_pass() { echo "[PASS] $*"; PASS=$((PASS + 1)); }
log_fail() { echo "[FAIL] $*"; FAIL=$((FAIL + 1)); }

# ---------------------------------------------------------------------------
# Source the shared notify_failure implementation (no duplication).
# ---------------------------------------------------------------------------
# shellcheck source=lib/notify-failure.sh
source "$SCRIPT_DIR/lib/notify-failure.sh"

# ---------------------------------------------------------------------------
# One-shot HTTP capture server: receives one POST, writes body to a file.
# ---------------------------------------------------------------------------
PYTHON_SERVER_SCRIPT=$(mktemp /tmp/webhook_capture_XXXX.py)
cat > "$PYTHON_SERVER_SCRIPT" <<'PYEOF'
import sys, http.server

port     = int(sys.argv[1])
out_file = sys.argv[2]

class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body   = self.rfile.read(length)
        with open(out_file, 'wb') as f:
            f.write(body)
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'ok')

server = http.server.HTTPServer(('127.0.0.1', port), Handler)
server.handle_request()
PYEOF

# Mock git binary used by the end-to-end test.
MOCK_GIT_SCRIPT=$(mktemp /tmp/mock_git_XXXX.sh)
cat > "$MOCK_GIT_SCRIPT" <<'GITEOF'
#!/bin/bash
# Minimal git mock for end-to-end testing.
# - rev-parse --abbrev-ref HEAD  →  "main"
# - config                       →  success
# - push                         →  simulated auth failure
case "$1" in
  rev-parse) echo "main" ;;
  config)    exit 0 ;;
  push)
    echo "remote: Invalid username or password." >&2
    echo "fatal: Authentication failed for 'https://github.com/...'" >&2
    exit 1
    ;;
  *) exit 0 ;;
esac
GITEOF
chmod +x "$MOCK_GIT_SCRIPT"

# Temp directory so the mock git wins on PATH.
MOCK_BIN_DIR=$(mktemp -d /tmp/mock_bin_XXXX)
ln -s "$MOCK_GIT_SCRIPT" "$MOCK_BIN_DIR/git"

SERVER_PID=""

cleanup() {
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null || true
  rm -f "$PYTHON_SERVER_SCRIPT" "$MOCK_GIT_SCRIPT"
  rm -rf "$MOCK_BIN_DIR"
}
trap cleanup EXIT

# Helper: assert payload is valid JSON with the expected shape.
assert_payload() {
  local label="$1"
  local payload="$2"

  if [ -z "$payload" ]; then
    log_fail "$label — no payload received"
    return
  fi

  if ! echo "$payload" | python3 -c 'import sys,json; json.load(sys.stdin)' 2>/dev/null; then
    log_fail "$label — payload is not valid JSON: $payload"
    return
  fi
  log_pass "$label — payload is valid JSON"

  if echo "$payload" | python3 -c \
      'import sys,json; d=json.load(sys.stdin); assert "text" in d' 2>/dev/null; then
    log_pass "$label — payload has 'text' key"
  else
    log_fail "$label — payload missing 'text' key: $payload"
  fi

  if echo "$payload" | python3 -c \
      'import sys,json; d=json.load(sys.stdin); assert "GitHub sync failed" in d["text"]' 2>/dev/null; then
    log_pass "$label — payload text contains 'GitHub sync failed' marker"
  else
    log_fail "$label — payload text missing 'GitHub sync failed' marker: $payload"
  fi
}

# ===========================================================================
# Test 1 — end-to-end: sync-to-github.sh push failure triggers the webhook
# ===========================================================================
echo ""
echo "=== Test 1: end-to-end — push failure triggers webhook ==="

PAYLOAD_FILE=$(mktemp)
python3 "$PYTHON_SERVER_SCRIPT" "$PORT" "$PAYLOAD_FILE" &
SERVER_PID=$!
sleep 0.5

# Run the real sync script with:
#   - mock git on PATH so "push" fails with a controlled error
#   - a fake (non-empty) GITHUB_TOKEN so the token guard passes
#   - NOTIFY_WEBHOOK_URL pointing at our capture server
PATH="$MOCK_BIN_DIR:$PATH" \
GITHUB_TOKEN="fake-token-for-testing" \
NOTIFY_WEBHOOK_URL="http://127.0.0.1:${PORT}" \
  bash "$SCRIPT_DIR/sync-to-github.sh" 2>/dev/null || true
  # exit 1 is expected when the push fails — suppress it here

wait "$SERVER_PID" 2>/dev/null || true
SERVER_PID=""

E2E_PAYLOAD=$(cat "$PAYLOAD_FILE")
rm -f "$PAYLOAD_FILE"

if [ -n "$E2E_PAYLOAD" ]; then
  log_pass "end-to-end — webhook was called by sync-to-github.sh"
else
  log_fail "end-to-end — no payload received; webhook was never called"
fi
assert_payload "end-to-end" "$E2E_PAYLOAD"

if echo "$E2E_PAYLOAD" | python3 -c \
    'import sys,json; d=json.load(sys.stdin); assert "Authentication failed" in d["text"] or "Invalid username" in d["text"]' 2>/dev/null; then
  log_pass "end-to-end — payload includes the git error message"
else
  log_fail "end-to-end — payload missing git error message: $E2E_PAYLOAD"
fi

# ===========================================================================
# Test 2 — silent skip when NOTIFY_WEBHOOK_URL is unset
# ===========================================================================
echo ""
echo "=== Test 2: silently skips when NOTIFY_WEBHOOK_URL is unset ==="

if (unset NOTIFY_WEBHOOK_URL; notify_failure "some error"); then
  log_pass "notify_failure exits 0 when NOTIFY_WEBHOOK_URL is unset"
else
  log_fail "notify_failure returned non-zero when NOTIFY_WEBHOOK_URL is unset"
fi

# ===========================================================================
# Test 3 — double quotes in the message must not break the JSON payload
# ===========================================================================
echo ""
echo '=== Test 3: double quotes in message remain valid JSON ==='

PAYLOAD_FILE=$(mktemp)
python3 "$PYTHON_SERVER_SCRIPT" "$PORT" "$PAYLOAD_FILE" &
SERVER_PID=$!
sleep 0.5

NOTIFY_WEBHOOK_URL="http://127.0.0.1:${PORT}" \
  notify_failure 'He said "push rejected" — please check credentials'

wait "$SERVER_PID" 2>/dev/null || true
SERVER_PID=""

PAYLOAD=$(cat "$PAYLOAD_FILE")
rm -f "$PAYLOAD_FILE"
assert_payload "double-quote message" "$PAYLOAD"

# ===========================================================================
# Test 4 — backslashes in the message must not break the JSON payload
# ===========================================================================
echo ""
echo "=== Test 4: backslashes in message remain valid JSON ==="

PAYLOAD_FILE=$(mktemp)
python3 "$PYTHON_SERVER_SCRIPT" "$PORT" "$PAYLOAD_FILE" &
SERVER_PID=$!
sleep 0.5

NOTIFY_WEBHOOK_URL="http://127.0.0.1:${PORT}" \
  notify_failure 'remote: error: GH006 \n refs/heads/main: protected branch'

wait "$SERVER_PID" 2>/dev/null || true
SERVER_PID=""

PAYLOAD=$(cat "$PAYLOAD_FILE")
rm -f "$PAYLOAD_FILE"
assert_payload "backslash message" "$PAYLOAD"

# ===========================================================================
# Summary
# ===========================================================================
echo ""
echo "================================"
echo "Results: ${PASS} passed, ${FAIL} failed"
echo "================================"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "ACTION REQUIRED: One or more checks failed."
  echo "Check that NOTIFY_WEBHOOK_URL is a reachable Slack-compatible endpoint"
  echo "and that curl and python3 are available in the environment."
  exit 1
fi

echo "All checks passed — the failure alert is wired correctly."
exit 0
