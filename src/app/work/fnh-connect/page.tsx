import type { Metadata } from "next";
import { projects } from "@/lib/content";
import {
  CaseStudyHeader,
  CaseSection,
  Prose,
  Callout,
  ArchitectureDiagram,
  LayerStack,
} from "@/components/site/case-study";
import { Reveal } from "@/components/motion/reveal";

const p = projects.find((x) => x.slug === "fnh-connect")!;

export const metadata: Metadata = {
  title: "FNH Connect",
  description:
    "FNH Connect — the healthcare operations platform I rebuilt around traceability. Next.js 15, React 19, Prisma and PostgreSQL, with role-based access, audit trails, and defence-in-depth security.",
  alternates: { canonical: "/work/fnh-connect" },
};

export default function FNHConnectPage() {
  return (
    <main id="main">
      <CaseStudyHeader
        eyebrow="Personal engineering case study"
        title="Rebuilding a hospital operations system around traceability"
        tagline={p.tagline}
        date={p.date}
        role={p.role}
        disclosure={p.disclosure}
        categories={p.categories}
        capabilities={p.capabilities}
        repo={p.repo}
        accent="accent"
      />

      {/* The question */}
      <CaseSection index="§01" label="The question" title="Why wasn't the first system enough?">
        <Prose>
          <p>
            The first generation — <strong>Feroza Accounts Management</strong> —
            was a working departmental tool. It handled patient fee
            calculations, expenditure evidence, pathology selection, income
            views, sessions and an admin dashboard, built with Node.js, SQL,
            HTML, JavaScript and CSS. It did its job. But as the operation grew,
            the absence of a unified domain model started to cost: financial
            flows were editable totals rather than auditable ledgers, department
            workflows lived alongside patient identity without clear
            separation, and there was no consistent security boundary.
          </p>
          <p>
            FNH Connect is my answer to a single question:{" "}
            <strong>what changes when I rebuild a hospital operations system
            around traceability instead of convenience?</strong> Every later
            decision — domain modelling, payment allocation, sessions, roles,
            logs — follows from that.
          </p>
        </Prose>
      </CaseSection>

      {/* Architecture */}
      <CaseSection index="§02" label="Architecture" title="How I structured the system.">
        <Prose>
          <p>
            I built FNH Connect with the Next.js 15 App Router as the
            foundation. Every request passes through a middleware boundary that
            enforces authentication and suspicious-path detection before it
            reaches route handlers. Route handlers delegate to a service layer
            where the domain logic lives — patient identity, department
            workflows, payment allocation, cash ledgers — and the service layer
            talks to Prisma, which models the PostgreSQL schema. The client
            uses React Query for caching and Zustand for feature-scoped UI
            state, with Radix UI components on top of Tailwind.
          </p>
        </Prose>
        <Reveal>
          <ArchitectureDiagram caption="System architecture — request flow from client to database">
{`┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                       │
│  React 19 · Tailwind · Radix UI · React Query · Zustand  │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────┐
│              Next.js Middleware (Edge)                    │
│  Auth check · suspicious-path scan · IP rate-limiting    │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│           Route Handlers (App Router API)                 │
│  Input validation · CSRF · role/ownership checks         │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│              Service Layer (Domain Logic)                 │
│  Patient identity · department workflows · payments      │
│  Cash ledgers · shifts · reconciliation · audit          │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│            Prisma 6 ORM · TypeScript types                │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                   PostgreSQL                              │
│  Patients · accounts · charges · payments · shifts       │
│  Cash ledgers · roles · sessions · security logs         │
└─────────────────────────────────────────────────────────┘`}
          </ArchitectureDiagram>
        </Reveal>
        <Reveal>
          <LayerStack
            layers={[
              { name: "Edge boundary", detail: "Middleware — JWT session validation, suspicious-path detection, IP rate limiting. Rejects bad requests before they reach the app.", tone: "accent" },
              { name: "API boundary", detail: "Route handlers — input validation (Zod/Joi), CSRF double-submit, role and ownership checks. The boundary that separates transport from domain.", tone: "accent" },
              { name: "Domain layer", detail: "Service-layer domain logic — patient identity, department workflows, payment allocation, cash movement ledgers, shifts, reconciliation. Where the invariants live.", tone: "accent-warm" },
              { name: "Persistence", detail: "Prisma 6 + PostgreSQL — typed schema, migrations, audit/repair/cleanup scripts. Bangladesh-time-zone-aware reporting.", tone: "neutral" },
              { name: "Client state", detail: "React Query for server cache + Zustand for feature-scoped UI state. Radix UI + Tailwind for the interface.", tone: "neutral" },
            ]}
          />
        </Reveal>
      </CaseSection>

      {/* Domain model */}
      <CaseSection index="§03" label="Domain model" title="A unified model with service boundaries.">
        <Prose>
          <p>
            My move from Feroza Accounts to FNH Connect is structural, not
            cosmetic. Central patient identities are separated from
            department-specific workflows. Patient accounts, service charges,
            payments, payment allocation, shifts and cash movement ledgers are
            first-class entities — each one a thing I can audit rather than a
            field I can edit.
          </p>
        </Prose>
        <Reveal>
          <ArchitectureDiagram caption="Domain model — entities and their relationships">
{`Patient (central identity)
  │
  ├──┬── PatientAccount
  │  │     └── ServiceCharge ── Payment
  │  │                            └── PaymentAllocation
  │  │                                  └── linked to StaffShift
  │  │
  │  ├── DepartmentWorkflow
  │  │     ├── GeneralAdmission
  │  │     ├── InfertilityService
  │  │     └── PathologyService
  │  │
  │  └── CashMovementLedger (immutable entries)
  │
  ├── Staff / Roles (RBAC)
  │     ├── Admin
  │     ├── Manager
  │     └── Operator
  │
  └── AuditTrail
        ├── LoginAttempts
        ├── SecurityLogs
        └── ActivityLogs`}
          </ArchitectureDiagram>
        </Reveal>
      </CaseSection>

      {/* Key decision */}
      <CaseSection index="§04" label="Key decision" title="Cash reconciliation as an audit trail, not a total.">
        <Prose>
          <p>
            My defining decision was to model cash movement as a ledger of
            linked, immutable entries rather than an editable number. Every
            payment links to a staff shift and an allocation ledger. The
            invariants prevent cash movement from becoming an editable total —
            a refund is a new allocation entry, not a subtraction from the
            original. Reconciliation becomes a query, not a write.
          </p>
          <p>
            This is harder to build and harder to misuse. It's the same instinct
            that drives my research work downstream:{" "}
            <strong>I structure the data so the wrong thing is hard to do by
            accident.</strong>
          </p>
        </Prose>
        <Reveal>
          <ArchitectureDiagram caption="Payment lifecycle — every entry is immutable and linked">
{`  [Payment created]
       │
       ▼
  PaymentAllocation ←── linked to ──→ StaffShift
       │
       ├── (normal)   → CashMovementLedger entry (credit)
       │
       ├── (refund)   → NEW CashMovementLedger entry (debit)
       │                 NOT a mutation of the original
       │
       └── (reconcile) → READ-ONLY query across ledger entries
                          Sum of credits + debits = reconciled total`}
          </ArchitectureDiagram>
        </Reveal>
      </CaseSection>

      {/* Security architecture */}
      <CaseSection index="§05" label="Security architecture" title="Defence-in-depth, not a layer at the end.">
        <Prose>
          <p>
            Security in FNH Connect isn't a layer I added at the end —
            middleware, server validation, sessions, CSRF, roles and logs work
            together as a single boundary. Each layer trusts the one below it
            but validates independently. If one layer fails, the next one
            catches the problem.
          </p>
        </Prose>
        <Reveal>
          <LayerStack
            layers={[
              { name: "Layer 1 — Edge middleware", detail: "JWT session validation. Suspicious-path detection blocks after 3 hits. In-memory IP rate limiting. Session-aware redirects.", tone: "accent" },
              { name: "Layer 2 — API routes", detail: "Input validation (Zod/Joi) rejects bad input. CSRF via double-submit cookie. Role checks gate admin areas. Ownership checks prevent cross-user access.", tone: "accent" },
              { name: "Layer 3 — Service layer", detail: "Business-rule invariants enforced in domain logic. Cash movement can't become an editable total. Refund creates a new entry, never mutates the original.", tone: "accent-warm" },
              { name: "Layer 4 — Database", detail: "DB-backed sessions with HTTP-only cookies and JWT tokens. Role-based access at the data level. Login-attempt, security and activity logs for post-hoc audit.", tone: "neutral" },
            ]}
          />
        </Reveal>
        <Reveal className="mt-6">
          <Callout tone="accent" label="My security primitives, verified from the repository">
            <ul className="mt-1 space-y-1.5">
              <li>• Database-backed sessions with HTTP-only cookies and JWT-backed tokens</li>
              <li>• CSRF protection and rate limiting</li>
              <li>• Role-based access and ownership checks</li>
              <li>• Suspicious-path detection and blocked-IP handling</li>
              <li>• Login-attempt, security, and activity logs</li>
              <li>• Joi/Zod-style validation at the boundary</li>
            </ul>
          </Callout>
        </Reveal>
      </CaseSection>

      {/* Failure modes */}
      <CaseSection index="§06" label="Failure modes" title="What can go wrong, and how I detect it.">
        <Prose>
          <p>
            Real data migrations are audited and made reversible — repair,
            audit, migration, seed and cleanup scripts exist because production
            data is never clean on arrival. The logs are my detection
            mechanism: a suspicious path, a blocked IP, a failed login attempt,
            or a cash movement that breaks an invariant all leave a trace.
          </p>
        </Prose>
      </CaseSection>

      {/* Limitations */}
      <CaseSection index="§07" label="Limitations" title="What my evidence doesn't prove.">
        <Reveal>
          <Callout tone="accent-warm" label="Honest disclosure">
            <p>
              FNH Connect is live and in active operational use at Feroza
              Nursing Home — I keep specific operational metrics and live-system
              claims in conversation rather than on this page. The public
              repository shows the production code, but reports no CI/CD
              workflow files and doesn't identify a comprehensive automated
              test suite, so I don't claim mature CI/CD or extensive test
              coverage here.
            </p>
          </Callout>
        </Reveal>
      </CaseSection>

      {/* Privacy */}
      <CaseSection index="§08" label="Privacy" title="Synthetic data only.">
        <Reveal>
          <Callout tone="ink" label="My privacy requirement">
            <p>
              I never show real patient data, credentials, <code>.env</code>{" "}
              files, phone numbers, diagnoses, invoices, staff identities,
              database exports or screenshots with real records. Any demo or
              screenshot uses synthetic identities and data.
            </p>
          </Callout>
        </Reveal>
      </CaseSection>

      {/* Next step */}
      <CaseSection index="§09" label="Next step" title="A falsifiable engineering milestone.">
        <Prose>
          <p>
            My next honest milestone is a documented test boundary around the
            payment-allocation and refund invariants — proving, with an
            automated check, that a refund can't silently alter the original
            ledger entry. That's the same shape as a held-out evaluation in my
            BdSL research: the claim becomes credible only when it survives a
            test designed to break it.
          </p>
        </Prose>
      </CaseSection>
    </main>
  );
}
