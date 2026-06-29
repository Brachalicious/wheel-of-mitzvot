#!/bin/bash
# Shared helper sourced by sync-to-github.sh and test-sync-failure-alert.sh.
# Do not run directly.
#
# Sends a Slack-compatible webhook notification on push failure.
# Silently skips if NOTIFY_WEBHOOK_URL is not set.
# Uses python3 to JSON-encode the message so special characters
# (double quotes, backslashes, control characters) cannot break the payload.
notify_failure() {
  local message="$1"
  if [ -z "${NOTIFY_WEBHOOK_URL:-}" ]; then
    return 0
  fi

  local payload
  payload=$(python3 - "$message" <<'PYEOF'
import sys, json

msg = sys.argv[1]
text = ":x: *GitHub sync failed* \u2014 {}\nCheck the post-merge logs for details.".format(msg)
print(json.dumps({"text": text}))
PYEOF
)

  curl -s -o /dev/null -X POST \
    -H "Content-Type: application/json" \
    -d "$payload" \
    "$NOTIFY_WEBHOOK_URL" || true
}
