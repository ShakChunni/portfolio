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

const p = projects.find((x) => x.slug === "jd-people-hub")!;

export const metadata: Metadata = {
  title: "JD People Hub",
  description:
    "The HR portal I built for JD Sports employees — digital ID cards, vouchers, MFA via email OTP, SFTP HR-data sync, and Capacitor Android/iOS apps. Live at peoplehub.jdsportssea.com.",
  alternates: { canonical: "/work/jd-people-hub" },
};

export default function JDPeopleHubPage() {
  return (
    <main id="main">
      <CaseStudyHeader
        eyebrow="Commercial · CodeXGate client"
        title="JD People Hub"
        tagline={p.tagline}
        date={p.date}
        role={p.role}
        disclosure={p.disclosure}
        categories={p.categories}
        capabilities={p.capabilities}
        external={p.clientUrl}
        accent="accent"
      />

      <CaseSection index="§01" label="The client" title="JD Sports — an HR portal for every employee.">
        <Prose>
          <p>
            JD Sports needed a full HR portal for employees and administrators.
            I built JD People Hub on Next.js 15 App Router with PostgreSQL and
            Prisma — role-based access, MFA via email OTP, SFTP integrations,
            background jobs, and a JD-branded UI. It ships with Capacitor mobile
            wrappers for Android and iOS, so it's a web and native app in one
            codebase.
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
      <CaseSection index="§02" label="Architecture" title="Three route groups, one codebase, web + mobile.">
        <Prose>
          <p>
            I split the app into three route groups: <strong>(auth)</strong> for
            login/registration, <strong>(employee)</strong> for employee pages,
            and <strong>(admin)</strong> for admin pages. Global layout wires
            TanStack Query, an AuthProvider for session state, a
            NotificationProvider, a SidebarStateRoot, and a MainContent gate
            for hydration + auth. The same codebase wraps into Capacitor for
            Android and iOS — one app, three platforms.
          </p>
        </Prose>
        <Reveal>
          <ArchitectureDiagram caption="System architecture — three route groups + Capacitor mobile">
{`┌──────────────────────────────────────────────────────────┐
│            Next.js 15 App Router · Tailwind v4             │
│                                                            │
│   (auth)              (employee)         (admin)           │
│   ├── login            ├── dashboard      ├── dashboard     │
│   ├── register         ├── id-card        ├── employees     │
│   ├── forgot-pw        ├── vouchers       ├── cards         │
│   └── reset-pw         ├── purchases      ├── vouchers      │
│                        ├── profile        ├── approvals     │
│                        └── playbook       ├── reports       │
│                          first-time-setup   ├── activity    │
│                                             ├── playbook    │
│                                             └── settings    │
└───────────────┬───────────────────────────┬───────────────┘
                │                           │
┌───────────────▼──────────┐   ┌───────────▼──────────────┐
│   Capacitor wrappers      │   │   Middleware (edge)       │
│   ├── Android (APK/AAB)   │   │  Rate-limit · suspicious  │
│   └── iOS (IPA)           │   │  paths · CSRF · session   │
│       ↕ GitHub Actions    │   │  · role checks · blocked  │
│         builds            │   │  IP sync from DB          │
└───────────────────────────┘   └───────────┬──────────────┘
                                            │
┌───────────────────────────────────────────▼──────────────┐
│                    API Routes                             │
│  auth (OTP) · dashboard · profile · id-card · vouchers    │
│  purchase-transactions · playbook · admin/* · SFTP        │
│  security/sync · internal/maintenance · convert-heic      │
└───────────────────────────┬──────────────────────────────┘
                            │
┌───────────┬───────────────▼───────────────┬──────────────┐
│ Mailgun   │   Prisma → PostgreSQL          │ SFTP Server  │
│ (OTP,     │   User · Session · OTPCode     │ (HR data     │
│  reg,     │   VoucherTemplate · VoucherIns │  import/     │
│  reset,   │   PurchaseTransaction          │  export)     │
│  welcome) │   BlockedIP · SecurityLog      │              │
│           │   SftpSyncHistory              │              │
│           │   MediaPipe face detection     │              │
└───────────┴────────────────────────────────┴──────────────┘`}
          </ArchitectureDiagram>
        </Reveal>
        <Reveal>
          <KeyValue
            items={[
              { k: "Framework", v: "Next.js 15 App Router · TypeScript" },
              { k: "UI", v: "Tailwind v4 · shadcn/ui · Radix · Framer Motion" },
              { k: "Auth", v: "JWT + httpOnly cookie + email OTP" },
              { k: "Email", v: "Mailgun (OTP, registration, reset, welcome)" },
              { k: "Mobile", v: "Capacitor (Android + iOS wrappers)" },
              { k: "Image", v: "Sharp + libheif · MediaPipe face detection" },
            ]}
          />
        </Reveal>
      </CaseSection>

      {/* Auth architecture */}
      <CaseSection index="§03" label="Auth architecture" title="Password + OTP, with strict session rules.">
        <Reveal>
          <ArchitectureDiagram caption="Authentication lifecycle — login, registration, reset">
{`LOGIN                    REGISTER                 RESET
  │                        │                        │
  ▼                        ▼                        ▼
POST /api/auth/login   POST /api/auth/register  POST /forgot-password
  │                        │                        │
  │ validate password      │ validate employee      │ send reset link
  │                        │ + email                │ (hashed token in DB)
  ▼                        ▼                        ▼
send OTP email         send tokenized link       verify-token
  │                        │                        │
  ▼                        ▼                        ▼
verify-otp             verify-token              reset (set new password)
  │                        │                        │
  ▼                        ▼                        ▼
create session         set-password              create session
  │                        │                        │
  ▼                        ▼                        ▼
Session table          Session table             Session table
(httpOnly cookie)      (httpOnly cookie)         (httpOnly cookie)

Session rules: 24h expiry · refresh <2h · max 7d · max 5 concurrent`}
          </ArchitectureDiagram>
        </Reveal>
      </CaseSection>

      {/* SFTP architecture */}
      <CaseSection index="§04" label="SFTP sync" title="HR data in and out, on a schedule.">
        <Prose>
          <p>
            I integrated SFTP for HR-data synchronisation with legacy systems —
            staff-info, branch, staff-benefits, staff-usage, staff-transaction,
            and voucher file types. Exports write to{" "}
            <code>/HRApp/HRExport/&#123;FileType&#125;</code> and imports read
            from <code>/HRApp/&#123;FileType&#125;</code>. Admins can toggle
            SFTP sync in Settings, and I run scheduled export (11:50 PM) and
            import (2:00 AM) jobs.
          </p>
        </Prose>
        <Reveal>
          <ArchitectureDiagram caption="SFTP data flow — scheduled import and export">
{`  SFTP Server
  ├── /HRApp/staff-info        ──►  IMPORT (2:00 AM)
  ├── /HRApp/branch                  │
  ├── /HRApp/staff-benefits          ▼
  ├── /HRApp/staff-usage         PostgreSQL
  ├── /HRApp/staff-transaction   (User · Store ·
  └── /HRApp/voucher              Voucher · Allowance)
                                       │
                                       ▼
  SFTP Server                     EXPORT (11:50 PM)
  ├── /HRApp/HRExport/             │
  │   staff-info                   ▼
  │   staff-benefits            SFTP Server
  │   staff-usage               /HRApp/HRExport/*
  │   staff-transaction
  │   voucher
  └── ...`}
          </ArchitectureDiagram>
        </Reveal>
      </CaseSection>

      {/* Security */}
      <CaseSection index="§05" label="Security architecture" title="Edge + database, double-submit CSRF.">
        <Reveal>
          <LayerStack
            layers={[
              { name: "Edge middleware", detail: "In-memory rate limiting (general + API). Suspicious-path detection + auto-blocking. CSRF validation for state-changing requests. Session-aware redirects + role checks (HRAdmin/SuperAdmin/Admin). Blocked-IP sync from database.", tone: "accent" },
              { name: "API routes", detail: "CSRF via double-submit cookie (csrf-token cookie + x-csrf-token header). Enforced on all POST/PUT/PATCH/DELETE except file uploads. Session validation with refresh.", tone: "accent" },
              { name: "Database security", detail: "Persistent login-attempt tracking. OTP rate limiting. IP blocking with expiry. SecurityLog + OTPRateLimit for forensics.", tone: "accent-warm" },
            ]}
          />
        </Reveal>
      </CaseSection>

      {/* Mobile architecture */}
      <CaseSection index="§06" label="Mobile architecture" title="Capacitor + GitHub Actions CI/CD.">
        <Prose>
          <p>
            I wrapped the web app in Capacitor for Android and iOS. GitHub
            Actions workflows build a debug APK, a signed release APK + Play
            Store AAB, an iOS simulator build, and — with Fastlane Match for
            code signing — a signed IPA for development, ad-hoc, and App Store
            distribution. Native versions stay aligned at 1.0.6 across Android,
            iOS, and the web package.
          </p>
        </Prose>
        <Reveal>
          <ArchitectureDiagram caption="Mobile build pipeline — GitHub Actions">
{`  GitHub Actions
  │
  ├── build-android.yml
  │     ├── npx cap sync android
  │     ├── Gradle build
  │     ├── debug → .apk artifact
  │     └── release → signed .apk + .aab
  │         (requires keystore secrets)
  │
  ├── build-ios.yml (simulator)
  │     ├── npx cap sync ios
  │     ├── remove incompatible plugins
  │     └── simulator .app → zipped artifact
  │
  └── build-ios-device.yml (IPA)
        ├── Fastlane Match (code signing)
        ├── build types: development · adhoc · appstore
        └── signed .ipa → TestFlight / App Store`}
          </ArchitectureDiagram>
        </Reveal>
      </CaseSection>

      {/* Deployment */}
      <CaseSection index="§07" label="Deployment" title="DigitalOcean App Platform under the CodeXGate org.">
        <Prose>
          <p>
            Production runs on DigitalOcean App Platform — Git-based CI/CD from
            the GitHub repo, with PostgreSQL on DigitalOcean managed databases.
            Secrets (database URLs, JWT, Mailgun, SFTP, Spaces, cron) live in
            App Platform's environment settings. Internal cron is opt-in via{" "}
            <code>ENABLE_INTERNAL_CRON</code>; otherwise external cron hits
            secured maintenance endpoints.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection index="§08" label="Honest limits" title="What I show and don't show.">
        <Reveal>
          <Callout tone="accent-warm" label="Disclosure">
            <p>
              This platform is proprietary to JD Sports Fashion Plc. I describe
              my architecture and engineering decisions — not real employee
              data, internal metrics, or source. The live link is for employees
              and is login-gated.
            </p>
          </Callout>
        </Reveal>
      </CaseSection>
    </main>
  );
}
