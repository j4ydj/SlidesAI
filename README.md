# SlidesAI Platform

Monorepo for the AI Slide Copilot project. Contains a Next.js web experience, Node.js API service, and shared packages for domain contracts.

## Getting Started

```bash
npx pnpm install
npx pnpm dev
```

- `apps/web`: Next.js app for the presentation studio UI.
- `apps/api`: Fastify API for orchestration, persistence, and LLM integrations.
- `packages/domain`: Shared schemas, types, and utilities.

## Scripts
- `pnpm dev`: run API and web dev servers concurrently.
- `pnpm dev:web`: run web app only.
- `pnpm dev:api`: run API service only.
- `pnpm build`: build all packages.
- `pnpm lint`: lint the entire workspace.
- `pnpm db:migrate-dev`: create or update the local SQLite schema (prisma migrate dev).
- `pnpm db:migrate`: apply committed migrations in deploy mode.
- `pnpm db:seed`: populate the database with starter brand kits, decks, and conversation history.
- `pnpm db:studio`: open Prisma Studio to inspect data.

## Requirements
- Node.js v22+
- pnpm (use `npx pnpm` or install globally via `corepack enable pnpm` if not available)

## Database & Local Data

1. Copy environment defaults and adjust as needed:

   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

   - `DATABASE_URL` defaults to `file:./dev.db` (SQLite). You can point this to Postgres when ready.
   - `USE_MOCK_ORCHESTRATOR=true` keeps the mock AI responses enabled.

2. Generate the Prisma client and run migrations:

   ```bash
   pnpm db:migrate-dev -- --name init   # first time
   pnpm db:seed                         # loads sample brand kits, decks, conversations
   ```

   > If the Prisma CLI asks to install `@prisma/client`, ensure `pnpm` is available on your PATH (e.g. `corepack enable pnpm`).

3. Start the stack:

   ```bash
   pnpm dev
   ```

   - API: http://localhost:4000
   - Web: http://localhost:3000 (dashboard and studio now load from the database with fallbacks if the API is offline)

## LLM Configuration

- Mock mode (default): `USE_MOCK_ORCHESTRATOR=true` skips external calls and uses templated replies.
- **OpenRouter (recommended to start testing)**

  ```env
  USE_MOCK_ORCHESTRATOR=false
  LLM_PROVIDER=openrouter
  LLM_API_KEY=or-...
  LLM_MODEL=openrouter/auto        # or any specific model, e.g. openrouter/mixtral-8x7b
  LLM_HTTP_REFERER=https://yourdomain.com   # Optional but encouraged
  LLM_TITLE="SlidesAI Copilot"            # Optional, shows in the OpenRouter dashboard
  ```

  You do **not** need to set `LLM_BASE_URL` unless you want to point at a proxy; we default to `https://openrouter.ai/api/v1`.

- **OpenAI example**

  ```env
  USE_MOCK_ORCHESTRATOR=false
  LLM_PROVIDER=openai
  LLM_API_KEY=sk-...
  LLM_MODEL=gpt-4o-mini
  ```

Once a live provider is configured, the conversation route will persist both sides of the dialogue. If the provider fails or times out, we automatically fall back to the deterministic mock response so the UI never blocks.

## Documentation
Strategic docs live in `docs/` (`personas`, `architecture`, `roadmap`, etc.).
