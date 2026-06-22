# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Rotating the GitHub token

The GitHub sync (`scripts/sync-to-github.sh`) authenticates with a personal access token stored as the `GITHUB_TOKEN` secret in Replit Secrets. PATs expire and can be revoked, so here is how to replace one quickly.

### Required token scopes

**Fine-grained PAT (recommended)** — scope it to only the `MysticMinded33_APP` / `wheel-of-mitzvot` repository:
- **Repository access**: only `Brachalicious/wheel-of-mitzvot`
- **Permissions → Contents**: Read and write

**Classic PAT (fallback)** — grant only the `repo` scope (full control of private repositories). No other scopes are needed.

### Steps to rotate

1. Go to [github.com → Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens) and generate a new token with the scopes above.
2. Copy the token value immediately (GitHub only shows it once).
3. Open your Replit project, go to **Tools → Secrets** (or the padlock icon in the sidebar).
4. Find the secret named `GITHUB_TOKEN` and update its value to the new token.
5. The next merge will pick up the new token automatically — no code changes required.
6. Revoke the old token in GitHub once you have confirmed the sync is working.
