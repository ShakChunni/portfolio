# ERP Middleware Bridge

Reusable middleware for ERP-first downstream integrations.

Montigo / RPG is the first client context. For phase 1, Odoo is the ERP and the middleware sits between Odoo and downstream systems such as WMS/3PL, AfterShip, freight providers, Klaviyo, Zendesk, and Cauldron/BI.

This project is not a marketplace connector and not a custom ERP.

## Current Status

Implemented so far:

- Planning baseline in `PLAN.md`.
- TypeScript/Fastify service skeleton.
- Worker entrypoint with BullMQ processor registration.
- PostgreSQL 18 and Valkey 8 Docker Compose definition (matches DigitalOcean production).
- Zod environment validation.
- Health and readiness endpoints.
- Prisma 7 schema/config/seed foundation.
- Initial integration database migration.
- Canonical Zod contracts for the first payload families.
- Core services: idempotency, audit log, dead-letter, sync job, tenant, external record map.
- **Real Odoo JSON-RPC 2.0 HTTP client**: 5-step parallel fetch (order → lines → partners → country codes → SKUs), write-back, chatter messages.
- Mock Odoo client for development and testing with fixture JSON.
- Mock WMS adapter with deterministic failure modes.
- Mock Cauldron/BI adapter for order, fulfillment, customer, and event export.
- **Real AfterShip REST v4 adapter**: create/update tracking with carrier slug mapping, health check.
- **Real Klaviyo REST adapter** (revision `2024-10-15`): profile upsert with marketing consent, event tracking with deduplication.
- **Real Zendesk REST v2 adapter**: ticket create/update, webhook mapper, health check.
- Mock adapters for all four services for local/test use without credentials.
- BullMQ queue setup with retry policy and TLS support for Valkey 8.
- First vertical slice processor: `sync_odoo_order_to_wms`.
- AfterShip webhook route with HMAC-SHA256 signature verification.
- Webhook event service with deduplication.
- Admin inspection endpoints: job status, sync-status, dead-letter listing/find/retry, adapter status.
- Integration tests for idempotency, dead-letter, sync jobs, and admin route auth.
- Unit tests for env validation, health, canonical schemas, retry policy, redaction, and webhook signatures.

Not implemented yet:

- Additional queue processors (AfterShip sync, webhook processing, BI export).
- Webhook routes for WMS, Zendesk, Klaviyo.
- Real WMS/3PL adapter (requires Montigo WMS docs/access).
- Real Cauldron/BI adapter (requires Cauldron ingestion schema).

## Confirmed Phase 1 Scope

Sales channels are expected to flow into Odoo through Odoo native connectors:

```text
Shopify / Shopee / TikTok Shop
  -> Odoo native connectors
  -> Odoo
```

Middleware starts at the ERP boundary:

```text
Odoo
  -> Middleware
  -> Downstream systems
```

Inbound downstream events flow back through middleware:

```text
Downstream systems
  -> Middleware
  -> Odoo
```

## Explicit Non-Scope

Do not build these in phase 1 unless the scope changes explicitly:

- Direct Shopify integration.
- Direct Shopee integration.
- Direct TikTok Shop integration.
- Replacement marketplace connectors.
- A full ERP.
- Odoo custom modules.
- HR, payroll, POS, procurement, or full accounting modules.
- AI matching or autonomous agent features before reliable sync exists.

## Architecture

The service is designed around clear boundaries:

- `core`: canonical contracts, errors, idempotency, audit, logging, tenant logic.
- `adapters/erp`: ERP-specific API details. Odoo comes first.
- `adapters/downstream`: downstream vendor details. Mock adapters come first where credentials/docs are missing.
- `jobs` and `queues`: background sync orchestration.
- `api`: health, job triggers, webhooks, admin inspection endpoints.
- `db`: Prisma client and persistence helpers.

The core should operate on canonical payloads, not raw Odoo or vendor payloads.

## Canonical Contracts

Current canonical schemas live in `src/core/canonical/`:

- `canonical.order.v1`
- `canonical.fulfillment.v1`
- `canonical.inventory_movement.v1`
- `canonical.customer.v1`
- `canonical.product.v1`
- `canonical.payment.v1`
- `canonical.engagement_event.v1`

Rules:

- Validate all external or adapter-produced payloads with Zod.
- Keep contracts versioned.
- Reject unexpected top-level fields.
- Require non-empty identifiers and required strings.
- Use uppercase ISO-like currency and country codes.
- Keep PII out of logs and dead-letter snapshots unless explicitly approved later.

## Database

This project uses PostgreSQL with Prisma 7.

Important Prisma 7 rules used here:

- `prisma/schema.prisma` uses `provider = "prisma-client"`.
- Generated client output is `src/generated/prisma`.
- `src/generated/` is ignored and regenerated locally.
- `schema.prisma` does not contain a datasource URL.
- CLI datasource configuration lives in `prisma.config.ts`.
- Runtime Prisma access uses `@prisma/adapter-pg`.
- Do not use `datasourceUrl` in `PrismaClient`.

Domain entities:

- `Tenant`
- `TenantCredentialReference`
- `IntegrationAdapter`
- `CanonicalEvent`
- `SyncJob`
- `IdempotencyRecord`
- `DeadLetterJob`
- `AuditLog`
- `WebhookEvent`
- `ExternalRecordMap`

## Environment

Copy `.env.example` to `.env` for local work.

Required now:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://middleware:middleware@localhost:5432/erp_middleware
REDIS_URL=redis://localhost:6379
ADMIN_API_KEY=local-dev-key
```

Optional integration values stay blank until credentials are available:

```env
ODOO_BASE_URL=
ODOO_DATABASE=
ODOO_USERNAME=
ODOO_API_KEY=
ODOO_API_MODE=json2

AFTERSHIP_API_KEY=
AFTERSHIP_API_VERSION=2026-01
AFTERSHIP_WEBHOOK_SECRET=

KLAVIYO_API_KEY=

ZENDESK_SUBDOMAIN=
ZENDESK_EMAIL=
ZENDESK_API_TOKEN=

CAULDRON_API_BASE_URL=
CAULDRON_API_KEY=
```

Never commit real `.env` files or real client credentials.

## Local Setup

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npm run prisma:generate
```

Start local infrastructure after Docker is installed:

```bash
docker compose up -d
```

Apply migrations:

```bash
npm run prisma:migrate
```

Seed demo tenant/adapters:

```bash
npm run prisma:seed
```

Start the API server:

```bash
npm run dev
```

Start the worker:

```bash
npm run worker:dev
```

## Health Checks

Health endpoint:

```bash
curl http://127.0.0.1:3000/health
```

Readiness endpoint:

```bash
curl http://127.0.0.1:3000/ready
```

`/ready` requires reachable PostgreSQL and Redis.

## Verification

Run checks sequentially:

```bash
npx prisma validate
npm run prisma:generate
npm run typecheck
npm run lint
npm test
```

Do not run `npm run typecheck` and `npm test` in parallel unless the Prisma client has already been generated. Both scripts may trigger Prisma generation, and concurrent writes to `src/generated/prisma` can fail.

## Scripts

- `npm run dev`: generate Prisma client and start Fastify in watch mode.
- `npm run worker:dev`: generate Prisma client and start worker placeholder in watch mode.
- `npm run build`: generate Prisma client and compile TypeScript.
- `npm run start`: run compiled server.
- `npm run worker`: run compiled worker.
- `npm run typecheck`: generate Prisma client and run `tsc --noEmit`.
- `npm run lint`: run ESLint.
- `npm test`: generate Prisma client and run Vitest.
- `npm run prisma:generate`: generate Prisma client.
- `npm run prisma:migrate`: run Prisma migrate dev.
- `npm run prisma:seed`: run Prisma seed configured in `prisma.config.ts`.

## First Vertical Slice

The first PoC flow is implemented and tested:

```text
Mock Odoo sale order
  -> Odoo adapter
  -> CanonicalOrder v1
  -> SyncJob
  -> IdempotencyRecord
  -> BullMQ worker
  -> MockWmsAdapter
  -> ExternalRecordMap
  -> AuditLog
  -> Mock Odoo downstream status update
```

Acceptance criteria met:

- Same order processed twice does not create duplicate downstream writes.
- Invalid payload fails validation.
- Retryable downstream failure retries.
- Exhausted retry creates a dead-letter job.
- Audit logs record lifecycle events.
- Mock Odoo status update is called after downstream success.
- Integration tests cover all processor paths.

## Webhook Infrastructure

AfterShip webhook route is available at:

```text
POST /v1/webhooks/aftership/:tenantSlug
```

Features:

- HMAC-SHA256 signature verification when `AFTERSHIP_WEBHOOK_SECRET` is configured.
- Body validation with Zod.
- Webhook event storage with deduplication.
- Audit logging for received, rejected, and duplicate events.
- Returns 202 Accepted for new events, 200 for duplicates.

## Deployment (DigitalOcean App Platform)

The app is designed for DigitalOcean App Platform with two components:

| Component | Type | Run Command |
|---|---|---|
| API server | Web Service | `node dist/server.js` |
| BullMQ worker | Worker | `node dist/worker.js` |

Build command (both components): `npm ci && npm run build`

Pre-deploy job: `node_modules/.bin/prisma migrate deploy`

Required managed infrastructure:
- **PostgreSQL 18** (Data Services → Managed Databases)
- **Valkey 8** (Data Services → Managed Databases — Redis-compatible, use `rediss://` URL)

Required environment variables in App Platform:

```
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:25060/dbname?sslmode=require
REDIS_URL=rediss://default:pass@host:25061
ADMIN_API_KEY=<generate with openssl rand -hex 32>
```

After first deploy, run the seed once via the App Platform console:

```bash
npm run prisma:seed
```

## Adapter Modes

Each adapter auto-selects live or mock mode based on environment variables:

| Adapter | Live mode trigger | Fallback |
|---|---|---|
| Odoo | `ODOO_BASE_URL` + `ODOO_API_KEY` set | Mock (fixture JSON) |
| AfterShip | `AFTERSHIP_API_KEY` set | Mock |
| Klaviyo | `KLAVIYO_API_KEY` set | Mock |
| Zendesk | `ZENDESK_SUBDOMAIN` + `ZENDESK_EMAIL` + `ZENDESK_API_TOKEN` set | Mock |
| WMS | Not yet — always mock | Mock |
| Cauldron/BI | Not yet — always mock | Mock |

Check adapter status at any time:

```bash
curl -H "x-admin-api-key: $ADMIN_API_KEY" https://your-app/v1/adapters/status
```

## Testing

337 tests across 30 test files covering:

- Canonical schema validation (7 contract families).
- Odoo sale order mapping.
- Mock WMS adapter behavior.
- Retry policy and error classification.
- Idempotency key generation.
- PII redaction.
- Idempotency service (duplicate detection, lock management).
- Dead-letter service (creation, PII redaction, upsert, list, mark states).
- Sync job service (creation, list, filter, mark pending).
- Processor integration (happy path, idempotency, validation failure, retry, dead-letter).
- Webhook signature verification (HMAC-SHA256).
- Webhook event service (store, dedup, status transitions).
- Admin routes (auth guard, list/find/retry, sync-status filters, adapter status).

## Admin Endpoints

All admin endpoints require `x-admin-api-key` header and are prefixed with `/v1`.

| Method | Path                                 | Description                                                                                                                                      |
| ------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GET`  | `/health`                            | Process liveness. No auth.                                                                                                                       |
| `GET`  | `/ready`                             | Readiness (DB + Redis). No auth.                                                                                                                 |
| `POST` | `/v1/jobs/sync-odoo-order-to-wms`    | Dev trigger for the first vertical slice.                                                                                                        |
| `GET`  | `/v1/jobs/:id`                       | Per-job status by id.                                                                                                                            |
| `GET`  | `/v1/sync-status`                    | List sync jobs with filters (`tenantSlug`, `status`, `jobType`, `sourceRecordId`, `sourceSystem`, `targetSystem`, `traceId`, `limit`, `offset`). |
| `GET`  | `/v1/dead-letter`                    | List dead-letter jobs with filters (`tenantSlug`, `adapterName`, `jobType`, `manualRetryStatus`, `sourceRecordId`, `limit`, `offset`).           |
| `GET`  | `/v1/dead-letter/:id`                | Fetch a single dead-letter record by id.                                                                                                         |
| `POST` | `/v1/dead-letter/:id/retry`          | Re-enqueue a dead-letter job. Body: `{ "notes"?: string }`. Returns `409` if already `REQUEUED`, `RESOLVED`, or `IGNORED`.                       |
| `GET`  | `/v1/adapters/status`                | Per-tenant adapter mode + health report. Optional `?tenantSlug=`.                                                                                |
| `POST` | `/v1/webhooks/aftership/:tenantSlug` | AfterShip webhook receiver with HMAC-SHA256 signature verification when secret is configured.                                                    |

## What Requires Montigo Credentials

The real HTTP clients are written and ready. Connecting to Montigo's live systems requires:

| System | What's needed |
|---|---|
| Odoo | `ODOO_BASE_URL`, `ODOO_DATABASE`, `ODOO_USERNAME`, `ODOO_API_KEY` (from Settings → API Keys) |
| AfterShip | `AFTERSHIP_API_KEY`, `AFTERSHIP_WEBHOOK_SECRET` |
| Klaviyo | `KLAVIYO_API_KEY` |
| Zendesk | `ZENDESK_SUBDOMAIN`, `ZENDESK_EMAIL`, `ZENDESK_API_TOKEN` |
| WMS/3PL | API docs or file format from Montigo's 3PL partner |
| Cauldron/BI | `CAULDRON_API_BASE_URL`, `CAULDRON_API_KEY`, ingestion schema |

Additionally required before production:

- Confirmed Odoo version and any custom field/module names.
- Real product/SKU master data for mapping.
- Montigo's Klaviyo event naming conventions and consent rules.
- Zendesk ticket structure and customer mapping rules.
- Current manual workflow samples and exception rules.
- PII retention/security requirements.
- UAT sign-off.

## Security Notes

- Secrets only through environment variables or a future secrets manager.
- Store credential references only; do not store secret values in database rows.
- Do not log raw PII.
- Redact payload snapshots before dead-letter persistence.
- Verify webhook signatures when supported.
- Use least-privilege vendor credentials.
