import type { Metadata } from "next";
import { projects } from "@/lib/content";
import {
  CaseStudyHeader,
  CaseSection,
  Prose,
  Callout,
  KeyValue,
  ArchitectureDiagram,
  LayerStack,
} from "@/components/site/case-study";
import { Reveal } from "@/components/motion/reveal";

const p = projects.find((x) => x.slug === "erp-middleware-bridge")!;

export const metadata: Metadata = {
  title: "ERP Middleware Bridge",
  description:
    "The reusable ERP middleware I'm building at CodeXGate — bridging Odoo to WMS, AfterShip, Klaviyo, Zendesk, and BI with canonical Zod contracts, idempotency, and dead-letter queues. Phase 1, in progress.",
  alternates: { canonical: "/work/erp-middleware-bridge" },
};

export default function ERPMiddlewarePage() {
  return (
    <main id="main">
      <CaseStudyHeader
        eyebrow="Commercial · CodeXGate · in progress"
        title="ERP Middleware Bridge"
        tagline={p.tagline}
        date={p.date}
        role={p.role}
        status="Experimenting"
        disclosure={p.disclosure}
        categories={p.categories}
        capabilities={p.capabilities}
        accent="accent-warm"
      />

      <CaseSection index="§01" label="The shape" title="A reusable middleware, not a connector or an ERP.">
        <Prose>
          <p>
            I'm building a reusable middleware for ERP-first downstream
            integrations. Montigo / RPG is the first client context — Odoo is
            the ERP and my middleware sits between Odoo and downstream systems
            like WMS/3PL, AfterShip, freight providers, Klaviyo, Zendesk, and
            Cauldron/BI. It is deliberately <strong>not</strong> a marketplace
            connector and <strong>not</strong> a custom ERP.
          </p>
        </Prose>
        <Reveal>
          <KeyValue
            items={[
              { k: "Runtime", v: "Fastify · TypeScript" },
              { k: "Queues", v: "BullMQ · Valkey 8 (Redis-compatible)" },
              { k: "Database", v: "PostgreSQL 18 · Prisma 7" },
              { k: "Contracts", v: "Zod (versioned, canonical)" },
              { k: "Deploy", v: "DigitalOcean App Platform (API + worker)" },
              { k: "Tests", v: "337 tests across 30 files" },
            ]}
          />
        </Reveal>
      </CaseSection>

      {/* Architecture */}
      <CaseSection index="§02" label="Architecture" title="Canonical contracts at the core.">
        <Prose>
          <p>
            I designed the service around clear boundaries. The core operates on
            <strong> canonical payloads</strong> — not raw Odoo or vendor
            payloads. Adapters translate external formats into canonical
            contracts, the core processes them with idempotency and audit, and
            BullMQ workers handle background sync. Every payload is validated
            with Zod, and PII is kept out of logs and dead-letter snapshots.
          </p>
        </Prose>
        <Reveal>
          <ArchitectureDiagram caption="System architecture — canonical core, adapters in and out">
{`                    ERP boundary
                         │
           ┌─────────────▼─────────────┐
           │    adapters/erp (Odoo)     │
           │  JSON-RPC 2.0 HTTP client  │
           │  5-step parallel fetch:    │
           │  order → lines → partners  │
           │  → country codes → SKUs    │
           └─────────────┬─────────────┘
                         │ raw Odoo payload
           ┌─────────────▼─────────────┐
           │       CORE (canonical)     │
           │                             │
           │  Zod contracts (v1):        │
           │  order · fulfillment ·      │
           │  inventory · customer ·     │
           │  product · payment ·        │
           │  engagement_event           │
           │                             │
           │  Idempotency · AuditLog     │
           │  DeadLetter · SyncJob       │
           │  Tenant · ExternalRecordMap │
           └──────┬──────────────┬──────┘
                  │              │
          ┌───────▼──┐    ┌──────▼──────────┐
          │  BullMQ   │    │ adapters/        │
          │  worker   │    │ downstream       │
          │           │    │                  │
          │ retry     │    ├── WMS/3PL (mock) │
          │ policy    │    ├── AfterShip (v4) │
          │           │    ├── Klaviyo (REST) │
          │           │    ├── Zendesk (v2)   │
          │           │    └── Cauldron/BI    │
          └───────────┘    └──────────────────┘`}
          </ArchitectureDiagram>
        </Reveal>
        <Reveal>
          <LayerStack
            layers={[
              { name: "core", detail: "Canonical contracts, errors, idempotency, audit, logging, tenant logic. The core never sees raw Odoo or vendor payloads — only canonical ones.", tone: "accent" },
              { name: "adapters/erp", detail: "ERP-specific API details. Odoo comes first — real JSON-RPC 2.0 client with 5-step parallel fetch and write-back. Mock Odoo client for dev/testing with fixture JSON.", tone: "accent-warm" },
              { name: "adapters/downstream", detail: "Downstream vendor details. Real AfterShip REST v4, Klaviyo REST (revision 2024-10-15), Zendesk REST v2. Mock adapters for all four when credentials are absent.", tone: "accent-warm" },
              { name: "jobs + queues", detail: "BullMQ queue setup with retry policy and TLS support for Valkey 8. First vertical slice processor: sync_odoo_order_to_wms.", tone: "neutral" },
              { name: "api", detail: "Fastify health/readiness, job triggers, webhooks (AfterShip HMAC-SHA256), admin inspection endpoints (job status, dead-letter, adapter status).", tone: "neutral" },
            ]}
          />
        </Reveal>
      </CaseSection>

      {/* Flow */}
      <CaseSection index="§03" label="Flow" title="ERP boundary in, downstream out, and back.">
        <Reveal>
          <ArchitectureDiagram caption="Data flow — sales channels through Odoo, then middleware, then downstream">
{`Shopify / Shopee / TikTok Shop
  → Odoo native connectors
  → Odoo
  → Middleware            ← I start here
  → WMS / AfterShip / Klaviyo / Zendesk / Cauldron-BI

Downstream events
  → Middleware
  → Odoo`}
          </ArchitectureDiagram>
        </Reveal>
      </CaseSection>

      {/* First vertical slice */}
      <CaseSection index="§04" label="First vertical slice" title="Odoo order → WMS, tested end-to-end.">
        <Reveal>
          <ArchitectureDiagram caption="First PoC flow — the full path through the system">
{`  Mock Odoo sale order
       │
       ▼
  Odoo adapter
       │  (5-step parallel fetch:
       │   order → lines → partners
       │   → country codes → SKUs)
       ▼
  CanonicalOrder v1      ← Zod-validated
       │
       ▼
  SyncJob created
       │
       ▼
  IdempotencyRecord       ← same order twice = no duplicate
       │
       ▼
  BullMQ worker
       │
       ├── (valid)     → MockWmsAdapter → ExternalRecordMap → AuditLog
       │                                              → Odoo status update
       │
       ├── (invalid)   → validation failure (no downstream write)
       │
       ├── (retryable) → retry with backoff
       │
       └── (exhausted) → DeadLetterJob (PII-redacted snapshot)`}
          </ArchitectureDiagram>
        </Reveal>
        <Reveal className="mt-6">
          <Callout tone="accent-warm" label="Acceptance criteria I met">
            <ul className="mt-1 space-y-1.5">
              <li>• Same order processed twice → no duplicate downstream writes</li>
              <li>• Invalid payload fails validation</li>
              <li>• Retryable downstream failure retries</li>
              <li>• Exhausted retry creates a dead-letter job</li>
              <li>• Audit logs record lifecycle events</li>
              <li>• Mock Odoo status update called after downstream success</li>
            </ul>
          </Callout>
        </Reveal>
      </CaseSection>

      {/* Canonical contracts */}
      <CaseSection index="§05" label="Canonical contracts" title="I keep PII out of logs and dead-letters.">
        <Prose>
          <p>
            My core operates on canonical payloads, not raw Odoo or vendor
            payloads. I version seven contract families — order, fulfillment,
            inventory movement, customer, product, payment, engagement event —
            and validate every external payload with Zod. Contracts reject
            unexpected top-level fields, require non-empty identifiers, use
            uppercase ISO-like codes, and keep PII out of logs and dead-letter
            snapshots unless explicitly approved.
          </p>
        </Prose>
      </CaseSection>

      {/* Webhook infrastructure */}
      <CaseSection index="§06" label="Webhook infrastructure" title="HMAC-SHA256 verified, deduplicated.">
        <Prose>
          <p>
            I built the AfterShip webhook receiver at{" "}
            <code>POST /v1/webhooks/aftership/:tenantSlug</code> with
            HMAC-SHA256 signature verification when the secret is configured.
            Incoming events are body-validated with Zod, stored with
            deduplication, and audit-logged for received, rejected, and
            duplicate events. New events return 202 Accepted; duplicates return
            200.
          </p>
        </Prose>
      </CaseSection>

      {/* Admin endpoints */}
      <CaseSection index="§07" label="Admin endpoints" title="Inspection and recovery.">
        <Reveal>
          <KeyValue
            items={[
              { k: "Health", v: "GET /health — liveness, no auth" },
              { k: "Ready", v: "GET /ready — DB + Redis reachable" },
              { k: "Job status", v: "GET /v1/jobs/:id — per-job status" },
              { k: "Sync status", v: "GET /v1/sync-status — filterable list" },
              { k: "Dead-letter", v: "GET/POST — list, find, retry" },
              { k: "Adapter status", v: "GET /v1/adapters/status — per-tenant mode + health" },
            ]}
          />
        </Reveal>
      </CaseSection>

      {/* What's implemented */}
      <CaseSection index="§08" label="What I've implemented" title="The foundation and first slice.">
        <Reveal>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 text-sm text-ink sm:grid-cols-2">
            {[
              "Fastify skeleton + BullMQ worker entrypoint",
              "PostgreSQL 18 + Valkey 8 Docker Compose",
              "Zod env validation + health/readiness",
              "Prisma 7 schema/config/seed foundation",
              "7 canonical Zod contract families",
              "Core services: idempotency, audit, dead-letter, sync, tenant",
              "Real Odoo JSON-RPC 2.0 client",
              "Real AfterShip REST v4 adapter",
              "Real Klaviyo REST adapter (consent + dedup)",
              "Real Zendesk REST v2 adapter",
              "Mock adapters for all services",
              "AfterShip webhook route (HMAC-SHA256)",
              "Admin endpoints (jobs, dead-letter, adapters)",
              "337 tests: schemas, adapters, retry, idempotency, webhooks",
            ].map((c) => (
              <li key={c} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-warm" />
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </CaseSection>

      {/* Not yet */}
      <CaseSection index="§09" label="Not yet" title="What's still ahead.">
        <Reveal>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 text-sm text-ink sm:grid-cols-2">
            {[
              "Additional queue processors (AfterShip sync, webhook, BI export)",
              "Webhook routes for WMS, Zendesk, Klaviyo",
              "Real WMS/3PL adapter (needs Montigo WMS docs/access)",
              "Real Cauldron/BI adapter (needs Cauldron ingestion schema)",
            ].map((c) => (
              <li key={c} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-soft" />
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </CaseSection>

      <CaseSection index="§10" label="Honest status" title="Phase 1, in progress.">
        <Reveal>
          <Callout tone="accent" label="Where it stands">
            <p>
              The real HTTP clients for Odoo, AfterShip, Klaviyo, and Zendesk are
              written and ready. Connecting to Montigo's live systems needs
              credentials and confirmed field/module names — plus real product
              SKU master data, Klaviyo event conventions, Zendesk ticket
              structure, PII retention rules, and UAT sign-off. I'm not claiming
              production readiness until those land.
            </p>
          </Callout>
        </Reveal>
      </CaseSection>
    </main>
  );
}
