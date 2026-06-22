#!/bin/bash
# Pushes the main branch to github.com/Brachalicious/MysticMinded33_APP.
# Uses GITHUB_TOKEN from the environment — never stored in .git/config.
# GitHub is a one-way mirror of Replit.
set -euo pipefail

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

REMOTE_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/Brachalicious/MysticMinded33_APP.git"

# Push directly via URL — tokenized URL is never written to .git/config.
# Capture git output and mask the token before printing.
OUTPUT=$(git push "$REMOTE_URL" "main:main" --force 2>&1) || {
  echo "[github-sync] Push failed:" >&2
  echo "$OUTPUT" | sed "s|x-access-token:[^@]*@|x-access-token:***@|g" >&2
  exit 1
}

echo "$OUTPUT" | sed "s|x-access-token:[^@]*@|x-access-token:***@|g"
echo "[github-sync] Pushed main → main on GitHub."
