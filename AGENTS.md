# Repository Guidelines

These guidelines are written to help AI assistants make safe, consistent changes to this Next.js 15 (App Router) frontend.

## Agent Guardrails (Read First)

- Prefer small, scoped changes; avoid drive-by refactors and style-only churn.
- Before creating new code, search for an existing pattern/component/hook/service and extend it.
- Do not edit generated or build output (e.g. `.next/`) or mass-update lockfiles unless explicitly required.
- Do not add new dependencies unless the change clearly requires it; prefer existing libraries already in `package.json`.
- Keep TypeScript strictness intact (`tsconfig.json` is `strict: true`). Avoid `any` unless there is no practical typed alternative.
- When changing API calls, reuse the existing Axios clients and error-handling conventions in `src/lib/client.ts`.
- If a change touches user-facing copy, update i18n messages under `messages/` and follow the “i18n” section below.

## Project Structure & Module Organization

- `src/app/`: Next.js App Router routes, layouts, and route-specific components.
	- Locale routing lives under `src/app/[locale]/` and is managed by `next-intl`.
	- Prefer colocating route-only UI under the route segment (e.g. `_components/`).
- `src/components/`: reusable UI.
	- `src/components/ui/`: shadcn/ui primitives.
	- `src/components/shared/`: shared app-level components.
- `src/services/`: backend API wrappers, grouped by domain (e.g. `src/services/dictionary/`).
	- Each domain typically has `*.api.ts` files and an `index.ts` barrel export.
- `src/lib/`: shared client utilities (Axios clients, helpers).
- `src/contexts/`, `src/stores/`: providers and Zustand/global state.
- `messages/`: translations for `next-intl`.
	- `messages/en.json`, `messages/vi.json` and per-feature files under `messages/en/` and `messages/vi/`.
- `public/`: static assets.

## Environment & Runtime Configuration

- Frontend API base URL:
	- `NEXT_PUBLIC_DJANGO_SERVER_URL` (see `.env.example`) is used by `src/lib/client.ts`.
- Next.js proxy/rewrites:
	- `next.config.ts` also supports `NEXT_PUBLIC_DJANGO_SERVER_URL_DEFAULT` to build rewrite targets.
- Server-side Axios (only if used):
	- `DJANGO_SERVER_URL` is used by `serverAxios` in `src/lib/client.ts`.
- WebSocket/app URL:
	- Some WS logic derives from `NEXT_PUBLIC_APP_URL` (fallback `http://localhost:3000`).

Never commit secrets; prefer `.env.local` for local overrides.

## Build, Lint, and Formatting

- Install: `pnpm install`.
- Dev server: `pnpm dev`
- Production build: `pnpm build`
- Start prod: `pnpm start`
- Lint: `pnpm lint`
- Format: `pnpm format`

Pre-commit hooks run `lint-staged` (Prettier + ESLint fix) on changed files.

## Coding Style & Conventions

- Formatting is enforced by Prettier (`.prettierrc`): 2 spaces, single quotes, 100 char print width.
- Import order is enforced by `@trivago/prettier-plugin-sort-imports` and Tailwind class sorting by `prettier-plugin-tailwindcss`.
- Use the path alias `@/*` (maps to `src/*`).
- Keep App Router conventions:
	- Server components by default; add `'use client'` only when needed.
	- Prefer putting providers into `src/app/providers.tsx` (already exists).

## API / Data Access Conventions

- Prefer domain APIs under `src/services/<domain>/`.
- Prefer using `apiClient` from `src/lib/client.ts` for authenticated requests.
	- It already sets `withCredentials` and includes token refresh behavior.
	- Errors may be thrown as either backend payloads or a typed `{ type, message }` object for network/unknown failures.
- Keep request/response types explicit in `*.api.ts` functions.

## i18n (next-intl)

- Routing is defined in `src/i18n/routing.ts` and middleware in `src/middleware.ts`.
- Message loading happens in `src/i18n/request.ts`.
- Each message JSON file should use a unique top-level namespace key to avoid collisions.
	- `src/utils/i18n-util.ts` warns in dev when namespaces collide.
- When adding a new feature namespace:
	- Add `messages/en/<feature>.json` and `messages/vi/<feature>.json`.
	- Update `src/i18n/request.ts` to import and merge the new namespace.

## PR / Commit Expectations

- Follow Conventional Commits as defined in `.github/commit-instructions.md`.
- Keep changes focused; avoid unrelated formatting or dependency churn.
- Call out any required env var changes in the PR description.