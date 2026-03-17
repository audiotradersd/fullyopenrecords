# Fully Open Records CMS

Cloudflare-native monorepo for the Fully Open Records public site, admin CMS, and edge API.

## Stack

- Next.js 14 + React + TypeScript + Tailwind
- Cloudflare Workers + Hono
- Cloudflare D1 + Drizzle ORM
- Cloudflare R2
- JWT auth
- Stripe Checkout

## Monorepo

```text
apps/
  web        Public-facing site
  cms        Admin dashboard
packages/
  api        Shared API contracts and client helpers
  db         Drizzle schema, migrations, seed data
  ui         Shared UI primitives
workers/
  api        Hono API worker
infra/
  migrations SQL snapshots and bootstrap notes
```

## Setup

1. Install `pnpm`.
2. Run `pnpm install`.
3. Copy `.env.example` values into local environment files.
4. Run `pnpm migrate`.
5. Run `pnpm seed`.
6. Start apps with `pnpm dev:web`, `pnpm dev:cms`, and `pnpm dev:api`.

## Radio

- Citrus3 can remain the broadcast backend.
- Set `RADIO_STREAM_URL` to the Citrus3 HLS or Icecast stream.
- Set `RADIO_METADATA_URL` to a Citrus3-compatible metadata JSON endpoint if available.
- Set `RADIO_EMBED_URL` only as a fallback when a hosted embed is still needed.
- The custom player UI lives in `apps/web/components/RadioPlayer.tsx`.

## Environment

See `.env.example` for required keys.

## Deployment

- `apps/web` deploys to Cloudflare Pages with a Next.js adapter build.
- `apps/cms` deploys to Cloudflare Pages with a Next.js adapter build.
- `workers/api` deploys to Cloudflare Workers through Wrangler.
- GitHub Actions in `.github/workflows/ci.yml` run lint, typecheck, and builds.
- Bind the D1 database and R2 bucket in `workers/api/wrangler.toml`.
- Mirror the API URL into the Pages app environment as `NEXT_PUBLIC_API_URL`.

## Notes

- Seed data is included to provide a usable first deployment.
- `packages/db/src/scripts/squarespace-migrate.ts` is an optional migration scaffold for Squarespace exports.
- The current worker includes fallback seed-backed content for local-first development before D1 is fully wired.
