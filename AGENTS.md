<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Project Snapshot

- Stack: Next.js App Router + TypeScript + Prisma + Upstash Redis + NextAuth + next-intl.
- Main implementation guide: [README.md](README.md).
- Architecture reference files:
  - [app/[locale]/page.tsx](app/[locale]/page.tsx)
  - [app/api/projects/route.ts](app/api/projects/route.ts)
  - [app/api/contact/route.ts](app/api/contact/route.ts)
  - [services/cache-service/index.ts](services/cache-service/index.ts)
  - [lib/auth.ts](lib/auth.ts)
  - [lib/sanitize.ts](lib/sanitize.ts)
  - [prisma/schema.prisma](prisma/schema.prisma)

## Local Commands

- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Unit/integration tests: `npm test`
- Coverage check: `npm test -- --coverage`
- E2E tests: `npx playwright test` (auto-starts web server via Playwright config)
- Prisma generate: `npx prisma generate`
- Prisma migrate (dev): `npx prisma migrate dev`
- Prisma seed: `npx prisma db seed`

## Agent Conventions

- Respect Next.js route-handler patterns already used in [app/api/projects/route.ts](app/api/projects/route.ts) and siblings.
- For write endpoints:
  - validate request payloads with Zod,
  - enforce auth when required (`getServerSession(authOptions)`),
  - sanitize user text/email where applicable (see [lib/sanitize.ts](lib/sanitize.ts)),
  - invalidate cache keys after mutations (see [services/cache-service/index.ts](services/cache-service/index.ts)).
- For read endpoints serving portfolio data, prefer cached fetches via `withCache(...)` and `CACHE_KEYS`.
- Keep shared domain types in [types/index.ts](types/index.ts).
- Preserve `@/*` import alias usage from [tsconfig.json](tsconfig.json).
- i18n changes should update both locale files: [i18n/en.json](i18n/en.json) and [i18n/es.json](i18n/es.json).

## Testing And CI Expectations

- Jest coverage threshold is 70% globally (see [jest.config.ts](jest.config.ts)).
- E2E tests and base URL behavior are defined in [playwright.config.ts](playwright.config.ts).
- CI workflows are in [.github/workflows](.github/workflows):
  - `unit-tests.yml`
  - `lint-and-format.yml`
  - `deploy-vercel.yml`
  - `docker-build.yml`
  - `dependency-audit.yml`
  - `secret-scan.yml`

## Safety Notes

- Never commit secrets from `.env`.
- Prefer `.env.local` for local execution (see setup in [README.md](README.md)).
