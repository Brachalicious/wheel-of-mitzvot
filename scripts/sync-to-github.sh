#!/bin/bash
# Pushes the main branch to github.com/Brachalicious/wheel-of-mitzvot.
# Uses GITHUB_TOKEN from the environment — never stored in .git/config.
# GitHub is a one-way mirror of Replit.
#
# On push failure, sends a Slack-compatible webhook notification if
# NOTIFY_WEBHOOK_URL is set in the environment.
set -euo pipefail

# Send a failure notification via webhook (Slack-compatible format).
# Silently skips if NOTIFY_WEBHOOK_URL is not set.
notify_failure() {
  local message="$1"
  if [ -z "${NOTIFY_WEBHOOK_URL:-}" ]; then
    return 0
  fi

  local payload
  payload=$(printf '{"text":":x: *GitHub sync failed* — %s\nCheck the post-merge logs for details."}' "$message")

  curl -s -o /dev/null -X POST \
    -H "Content-Type: application/json" \
    -d "$payload" \
    "$NOTIFY_WEBHOOK_URL" || true
}

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "[github-sync] GITHUB_TOKEN not set — skipping."
  exit 0
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Hard gate: only push from main. Any other branch (task branches, detached
# HEAD) is skipped to prevent accidentally overwriting GitHub main.
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "[github-sync] Not on main (current: ${CURRENT_BRANCH}) — skipping push."
  exit 0
fi

git config user.email "replit-agent@replit.com"
git config user.name "Replit Agent"

REMOTE_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/Brachalicious/wheel-of-mitzvot.git"

# Push directly via URL — tokenized URL is never written to .git/config.
# Capture git output and mask the token before printing.
OUTPUT=$(git push "$REMOTE_URL" "main:main" --force 2>&1) || {
  MASKED_OUTPUT=$(echo "$OUTPUT" | sed "s|x-access-token:[^@]*@|x-access-token:***@|g")
  echo "[github-sync] Push failed:" >&2
  echo "$MASKED_OUTPUT" >&2
  notify_failure "$(echo "$MASKED_OUTPUT" | head -3 | tr '\n' ' ')"
  exit 1
}

echo "$OUTPUT" | sed "s|x-access-token:[^@]*@|x-access-token:***@|g"
echo "[github-sync] Pushed main → main on GitHub."
