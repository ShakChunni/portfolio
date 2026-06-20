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

const p = projects.find((x) => x.slug === "mavn-scouting-platform")!;

export const metadata: Metadata = {
  title: "MAVN Scouting Platform",
  description:
    "The influencer discovery and campaign platform I built for MAVN Models — Apify enrichment, Instagram/TikTok sync, campaign management, and edge-middleware security. Live at scout.mavnmodels.com.",
  alternates: { canonical: "/work/mavn-scouting-platform" },
};

export default function MAVNPage() {
  return (
    <main id="main">
      <CaseStudyHeader
        eyebrow="Commercial · CodeXGate client"
        title="MAVN Scouting Platform"
        tagline={p.tagline}
        date={p.date}
        role={p.role}
        disclosure={p.disclosure}
        categories={p.categories}
        capabilities={p.capabilities}
        external={p.clientUrl}
        accent="accent-warm"
      />

      <CaseSection index="§01" label="The client" title="MAVN Models — influencer scouting at scale.">
        <Prose>
          <p>
            MAVN needed a platform for influencer discovery, data enrichment,
            campaign management, and goal tracking. I built them a Next.js 15
            platform backed by PostgreSQL + Prisma, with JWT sessions in
            httpOnly cookies and background jobs for goal resets, session
            cleanup, and campaign archiving. It integrates Apify for
            Instagram/TikTok enrichment and DigitalOcean Spaces for media
            storage.
          </p>
        </Prose>
        <Reveal className="mt-8">
          <a
            href={p.clientUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-card px-5 py-3 text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:border-accent-warm hover:text-accent-warm"
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
            I structured the platform around scouting, campaigns, and admin
            governance. Global layout wires TanStack Query providers, an
            AuthProvider with MainContent auth gating, a Radix theme, and a
            maintenance override. Session validation is database-authoritative —
            every request checks the Session table, not just the JWT — with a
            2-hour refresh window and device-consistency enforcement using
            major UA fingerprint matching.
          </p>
        </Prose>
        <Reveal>
          <ArchitectureDiagram caption="System architecture — scouting, enrichment, campaigns">
{`┌──────────────────────────────────────────────────────────┐
│                Next.js 15 App Router                       │
│   /login · /home · /advance-scouting                      │
│   /update-public-data · /tasks · /goals                   │
│   /campaigns · /campaigns/[id] · /campaigns/find-influencer│
│   /admin/* (analytics · users · activity-logs)            │
└───────────────────────────┬──────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────┐
│             Middleware (src/middleware.ts)                 │
│  Suspicious-path detection · 500 req/15min/IP rate limit   │
│  Session-aware routing · admin role gating                 │
│  RSC cache protection via Vary headers                     │
│  Blocked-IP checks via /api/security/check                 │
└───────────┬───────────────────────────────┬──────────────┘
            │                               │
┌───────────▼──────────────┐   ┌───────────▼──────────────┐
│    API Routes             │   │   Enrichment Pipeline     │
│  (src/app/api/...)        │   │                           │
│                           │   │  Apify Actors             │
│  auth · checkSession      │   │  ├── Instagram sync       │
│  influencers · scouting   │   │  └── TikTok sync          │
│  campaigns · campaign     │   │       ↓                   │
│  admin analytics          │   │  Engagement rate calc     │
│  sync/status/[jobId]      │   │  (mean + median,          │
│  custom-data-points       │   │   non-pinned posts)       │
│  webhooks (forms)         │   │       ↓                   │
│                           │   │  Related-profile          │
│                           │   │  discovery                │
│                           │   │       ↓                   │
│                           │   │  DigitalOcean Spaces      │
│                           │   │  (S3 · CDN URLs back)     │
└───────────┬──────────────┘   └───────────┬──────────────┘
            │                               │
┌───────────▼───────────────────────────────▼──────────────┐
│              Prisma ORM → PostgreSQL                       │
│  InfluencerMavn · ModelMavn · Campaign · SyncJob           │
│  User · Session · TaskPoints · GoalAssignment              │
│  RateLimit · BlockedIP · SecurityLog                       │
└──────────────────────────────────────────────────────────┘`}
          </ArchitectureDiagram>
        </Reveal>
        <Reveal>
          <KeyValue
            items={[
              { k: "Framework", v: "Next.js 15 App Router · TypeScript" },
              { k: "State", v: "Zustand + TanStack Query" },
              { k: "Enrichment", v: "Apify (Instagram + TikTok)" },
              { k: "Storage", v: "DigitalOcean Spaces (S3-compatible)" },
              { k: "Charts", v: "Nivo · Recharts · Highcharts · ApexCharts" },
              { k: "Auth", v: "JWT + httpOnly cookie · DB-authoritative sessions" },
            ]}
          />
        </Reveal>
      </CaseSection>

      {/* Enrichment pipeline architecture */}
      <CaseSection index="§03" label="Enrichment pipeline" title="Apify sync with engagement metrics.">
        <Prose>
          <p>
            I built the Instagram and TikTok sync via Apify actors. The pipeline
            runs in stages: fetch raw profile data, calculate engagement rates
            using <strong>mean</strong> and <strong>median</strong> methods over
            non-pinned posts, discover related profiles, upload media to
            DigitalOcean Spaces, and write CDN URLs back to the records. A 5-day
            sync interval is enforced per platform, and SyncJob records persist
            progress so the front-end can recover from interruption.
          </p>
        </Prose>
        <Reveal>
          <ArchitectureDiagram caption="Enrichment pipeline — from Apify to CDN">
{`  Apify Actor (Instagram/TikTok)
       │
       ▼
  Raw profile data
  (followers, posts, captions, media)
       │
       ├──► Engagement rate (mean + median)
       │    non-pinned posts only
       │
       ├──► Related profile discovery
       │    RelatedInstagramProfile
       │    InfluencerRelatedProfile
       │
       └──► Media → DigitalOcean Spaces
            (S3 upload)
                 │
                 ▼
            CDN URL written back
            to InfluencerMavn record
                 │
                 ▼
            SyncJob progress persisted
            (/api/sync/status/[jobId])`}
          </ArchitectureDiagram>
        </Reveal>
      </CaseSection>

      {/* Campaign architecture */}
      <CaseSection index="§04" label="Campaign architecture" title="Assignments, fees, and access control.">
        <Prose>
          <p>
            Campaigns carry metadata, status, budget, and archive state. I built
            sharing and access controls through{" "}
            <code>CampaignUserAccess</code>, with influencer/model assignments,
            deliverables, agreed rates, and status transitions. A daily campaign
            archiver auto-archives completed or cancelled campaigns older than a
            month.
          </p>
        </Prose>
        <Reveal>
          <ArchitectureDiagram caption="Campaign model — assignments and access">
{`Campaign
  ├── metadata (status · budget · archive state)
  │
  ├── CampaignUserAccess (sharing + access control)
  │
  ├── CampaignInfluencer
  │     ├── status (assigned · contacted · agreed · declined)
  │     ├── fee
  │     └── agreed-rates
  │
  ├── CampaignModel
  │     └── deliverables
  │
  └── Campaign archiver (cron 00:00 MYT)
        └── auto-archive completed/cancelled > 1 month`}
          </ArchitectureDiagram>
        </Reveal>
      </CaseSection>

      {/* Security */}
      <CaseSection index="§05" label="Security architecture" title="Edge middleware + database-backed enforcement.">
        <Reveal>
          <LayerStack
            layers={[
              { name: "Edge middleware", detail: "Suspicious-path detection with immediate deny + logging. General rate limiting — 500 requests / 15 min / IP. Blocked-IP checks. Session-aware routing + admin role gating. RSC cache protection via Vary headers.", tone: "accent" },
              { name: "Session lifecycle", detail: "Login creates JWT + DB session (httpOnly, sameSite=strict). Old sessions trimmed to 5 per user. checkSession validates JWT + DB + device consistency. Refresh when <2 hours remain.", tone: "accent" },
              { name: "Database security", detail: "Failed login tracking — 15-min window, 5 attempts max. Temporary 1-hour IP blocks. Permanent blocks for suspicious scans. SecurityLog for forensics.", tone: "accent-warm" },
            ]}
          />
        </Reveal>
      </CaseSection>

      {/* Background jobs */}
      <CaseSection index="§06" label="Background jobs" title="Cron on server start, Asia/Kuala_Lumpur.">
        <Reveal>
          <KeyValue
            items={[
              { k: "Session cleanup", v: "Daily 23:59 MYT — expired sessions" },
              { k: "Goal reset", v: "Daily 23:59 MYT — summaries + reset" },
              { k: "Campaign archiver", v: "Daily 00:00 MYT — old completed/cancelled" },
            ]}
          />
        </Reveal>
      </CaseSection>

      <CaseSection index="§07" label="Honest limits" title="What I show and don't show.">
        <Reveal>
          <Callout tone="accent" label="Disclosure">
            <p>
              This platform is proprietary to MAVN. I describe architecture and
              my engineering decisions, not client data, internal metrics, or
              source. The live link is login-gated and internal.
            </p>
          </Callout>
        </Reveal>
      </CaseSection>
    </main>
  );
}
