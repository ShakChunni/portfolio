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
import { ArrowUpRight } from "lucide-react";

const p = projects.find((x) => x.slug === "tmi-sales-crm")!;

export const metadata: Metadata = {
  title: "TMI Sales Operations CRM",
  description:
    "The Sales Operations CRM I built for The Moving Image — Next.js 15, PostgreSQL, Prisma, RBAC, background jobs, and middleware-first security. Live at sales.movingimage.my.",
  alternates: { canonical: "/work/tmi-sales-crm" },
};

export default function TMISalesPage() {
  return (
    <main id="main">
      <CaseStudyHeader
        eyebrow="Commercial · CodeXGate client"
        title="TMI Sales Operations CRM"
        tagline={p.tagline}
        date={p.date}
        role={p.role}
        disclosure={p.disclosure}
        categories={p.categories}
        capabilities={p.capabilities}
        external={p.clientUrl}
        accent="accent"
      />

      <CaseSection index="§01" label="The client" title="The Moving Image — a sales team that needed its own tool.">
        <Prose>
          <p>
            The Moving Image needed a sales-operations CRM that fit how their
            teams actually work — not a generic CRM bent into shape. I built them
            a purpose-built platform that combines sales reporting, lead
            lifecycle management, and operational governance in one internal
            system. Every page is protected by middleware except login.
          </p>
        </Prose>
        <Reveal className="mt-8">
          <a
            href={p.clientUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-card px-5 py-3 text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            Open the live platform
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
          </a>
        </Reveal>
      </CaseSection>

      {/* Architecture */}
      <CaseSection index="§02" label="Architecture" title="How I structured it.">
        <Prose>
          <p>
            I split the App Router into two route groups: <strong>(auth)</strong>{" "}
            for login and <strong>(authenticated)</strong> for every protected
            page. Global layout wires a Radix theme provider, a TanStack Query
            client, an AuthProvider context for user/session state, and a
            MainContent gate that blocks rendering until hydration and auth
            checks complete. The server uses node-cron background jobs
            initialised on server start, and the client uses feature-scoped
            Zustand stores alongside React Query for server cache.
          </p>
        </Prose>
        <Reveal>
          <ArchitectureDiagram caption="System architecture — two route groups, three security layers">
{`┌──────────────────────────────────────────────────────────┐
│                Next.js 15 App Router                       │
│                                                            │
│   (auth)/login          (authenticated)/*                  │
│      └ login page         ├── home (dashboard)             │
│                           ├── goals · goal-analytics       │
│                           ├── clients · email-verification │
│                           ├── organizations                │
│                           └── admin/*                      │
│                                ├── user-management         │
│                                ├── leads-management        │
│                                ├── duplicate-checker       │
│                                ├── call-reports            │
│                                └── activity-logs           │
└───────────────────────────┬──────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────┐
│                  Middleware (src/middleware.ts)            │
│  Suspicious-path scan (block after 3) · IP rate-limit      │
│  JWT session validation · role-aware routing               │
│  LeadsManager locked to leads screens only                 │
└───────────────────────────┬──────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────┐
│              API Routes (src/app/api/...)                  │
│  auth · dashboard · goals · clients · organizations       │
│  admin/leads · admin/users · email-verification            │
│  security/sync · security/blocked-ips                      │
│  All enforce CSRF + session + role checks                  │
└───────────────────────────┬──────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────┐
│         Background Jobs (node-cron on server init)         │
│  Session cleanup (daily) · Goal reset (daily)             │
│  Security cleanup (every 2h) · Timezone: Asia/KL          │
└───────────────────────────┬──────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────┐
│              Prisma ORM → PostgreSQL                       │
│  Users · Sessions · ActivityLog · GoalTask · ContactData  │
│  RateLimit · BlockedIP · SecurityLog · EmailVerification  │
└──────────────────────────────────────────────────────────┘`}
          </ArchitectureDiagram>
        </Reveal>
        <Reveal>
          <KeyValue
            items={[
              { k: "Framework", v: "Next.js 15 App Router · TypeScript" },
              { k: "Database", v: "PostgreSQL · Prisma (pooled + direct)" },
              { k: "State", v: "Zustand + TanStack Query" },
              { k: "UI", v: "Tailwind · Radix Themes · Framer Motion" },
              { k: "Auth", v: "JWT + httpOnly session cookie" },
              { k: "Email", v: "Postmark · MillionVerifier" },
            ]}
          />
        </Reveal>
      </CaseSection>

      {/* Security architecture */}
      <CaseSection index="§03" label="Security architecture" title="Middleware-first, database-backed.">
        <Prose>
          <p>
            I designed security so middleware and the database agree. Middleware
            handles the fast checks — suspicious paths, rate limits, session
            presence, role routing. The database handles the durable checks —
            login attempt tracking, IP blocks with expiry, security logs. Cron
            jobs sync middleware state into PostgreSQL and push blocked IPs
            back to middleware, so a restart doesn't lose security state.
          </p>
        </Prose>
        <Reveal>
          <LayerStack
            layers={[
              { name: "Edge middleware", detail: "Suspicious-path scanning blocks after 3 hits. In-memory IP rate limiting. JWT session validation. Role-aware routing — LeadsManager locked to leads screens.", tone: "accent" },
              { name: "API routes", detail: "CSRF via double-submit cookie. Session validation with 2-hour refresh window. Role checks on every admin endpoint.", tone: "accent" },
              { name: "Database security", detail: "DB-level login attempt tracking (15-min window, 5 max). Temporary 1-hour IP blocks. Permanent blocks for suspicious scans. SecurityLog for forensics.", tone: "accent-warm" },
              { name: "Cron sync", detail: "security/sync persists middleware data to PostgreSQL. security/blocked-ips pushes blocks back to middleware. No security state lost on restart.", tone: "neutral" },
            ]}
          />
        </Reveal>
      </CaseSection>

      {/* Modules */}
      <CaseSection index="§04" label="Modules I shipped" title="Dashboards, leads, goals, and admin governance.">
        <Reveal>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 text-sm text-ink sm:grid-cols-2">
            {[
              "Sales dashboard — KPIs, charts, recent leads table",
              "Goal tracking — predefined + ad-hoc tasks, daily resets, analytics",
              "Lead management — assignment, distribution, PIC tracking, activity logs",
              "Clients & organizations directories with search and filtering",
              "Email verification — MillionVerifier, daily token limits, caching",
              "Admin tools — users, tasks, activity logs, call reports",
              "Lead source approval flow with history",
              "Duplicate checker — upload file, check vs database",
            ].map((c) => (
              <li key={c} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </CaseSection>

      {/* Data model */}
      <CaseSection index="§05" label="Data model" title="Users, goals, leads, and security as first-class entities.">
        <Reveal>
          <ArchitectureDiagram caption="Data model — grouped by domain">
{`Users & Auth               Goals                    Sales Reporting
├── User                   ├── GoalTask             ├── Organization
├── Session                ├── TaskAssignment       ├── Client
└── ActivityLog            ├── UserGoal             ├── mavn_monthly_report
                           └── DailyTaskSummary     └── mi_monthly_report

Leads Management           Email Verification       Security
├── ContactData            ├── EmailVerification    ├── RateLimit
├── ContactUploadBatch     │   Cache                ├── BlockedIP
├── ContactPICData         └── EmailVerification    └── SecurityLog
├── ContactActivityLog         Usage
├── LeadPromotion
├── LeadSourceChangeRequest
├── LeadSourceHistory
└── SystemSettings`}
          </ArchitectureDiagram>
        </Reveal>
      </CaseSection>

      {/* Background jobs */}
      <CaseSection index="§06" label="Background jobs" title="I run node-cron jobs on server init.">
        <Reveal>
          <KeyValue
            items={[
              { k: "Session cleanup", v: "Daily — removes expired sessions" },
              { k: "Goal reset", v: "Daily — snapshots + resets counters" },
              { k: "Security cleanup", v: "Every 2 hours — old logs + expired blocks" },
              { k: "Timezone", v: "Asia/Kuala_Lumpur (UTC+8)" },
            ]}
          />
        </Reveal>
      </CaseSection>

      {/* Deployment */}
      <CaseSection index="§07" label="Deployment" title="DigitalOcean App Platform, clean builds.">
        <Prose>
          <p>
            Production deploys from the <strong>master</strong> branch via
            DigitalOcean App Platform, with a pooled PostgreSQL connection for
            the app and a non-pooling connection for Prisma CLI. I run{" "}
            <code>npm install</code> locally before building to keep the lockfile
            in sync, and deployments are clean — fresh install and build each
            time.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection index="§08" label="Honest limits" title="What this is and isn't.">
        <Reveal>
          <Callout tone="accent-warm" label="Disclosure">
            <p>
              I show engineering decisions and transferable lessons here, not
              client-internal metrics, screenshots, or source. The live link is
              shared with the client's awareness; the platform is internal and
              login-gated.
            </p>
          </Callout>
        </Reveal>
      </CaseSection>
    </main>
  );
}
