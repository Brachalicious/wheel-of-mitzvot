#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --filter db push

# Sync to GitHub immediately after every merge
bash scripts/sync-to-github.sh
