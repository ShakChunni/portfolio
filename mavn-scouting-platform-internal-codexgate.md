# MAVN Scouting Platform

This repository contains the full **MAVN Scouting Platform**, a Next.js 15 App Router application for influencer discovery, data enrichment, campaign management, and goal tracking. It is backed by PostgreSQL + Prisma, uses JWT sessions stored in httpOnly cookies, and includes background jobs for goal resets, session cleanup, and campaign archiving. It also integrates with Apify for Instagram/TikTok enrichment and DigitalOcean Spaces for media storage.

The document below explains the system end‑to‑end: architecture, features, data model, API surface, security posture, background jobs, and operational workflows.

---

## 1) What this application does

MAVN Scouting Platform provides:

- **Public scouting** and **advanced scouting** views with search, filters, and enrichment data
- **Update public data** workflows for editing missing/incorrect influencer data
- **Task tracking** and **goal dashboards** with predefined/ad‑hoc tasks and daily resets
- **Campaign management** with influencer/model assignments, statuses, fees, and sharing controls
- **Admin analytics** (scouting + goals), **user management**, and **activity logs**
- **Instagram + TikTok enrichment** using Apify with engagement rate calculations and related profile discovery
- **Security controls** via edge middleware, rate‑limiting, device consistency, and persistent security logs

All protected pages are gated by middleware session validation and role checks.

---

## 2) Tech stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **State:** Zustand + TanStack Query
- **UI:** Tailwind CSS + Radix Themes + Framer Motion
- **Auth:** JWT + httpOnly session cookie
- **Sync/Enrichment:** Apify (Instagram + TikTok)
- **Storage:** DigitalOcean Spaces (S3‑compatible)
- **Charts/Analytics:** Nivo, Recharts, Highcharts, ApexCharts

---

## 3) Architecture overview

### App Router structure

Core route groups:

- `/login` for authentication
- `/home` for public scouting
- `/advance-scouting` for advanced scouting
- `/update-public-data` for data edits
- `/tasks` and `/goals` for task/goal tracking
- `/campaigns` for campaign management
- `/admin/*` for analytics and administration

Global layout in [src/app/layout.tsx](src/app/layout.tsx) wires:

- `Providers` (TanStack Query)
- `AuthProvider` + `MainContent` auth gating
- `Theme` (Radix) and `PageTitle`
- `Maintenance` override when `NEXT_PUBLIC_MAINTENANCE=true`

### Authentication + authorization

- **Login** is password‑based (`/api/auth/login`) and creates a JWT session stored in DB + cookie.
- **Session validation** is database‑authoritative (`/api/auth/checkSession`) and refreshes tokens when <2 hours remain.
- **Logout** removes the session and logs the event (`/api/auth/logout`).
- **Admin access** is restricted to role `admin`, except `/admin/scouting-analytics` which also allows username `faiza` (middleware‑level exception).

### Data fetching patterns

- **Server‑side:** App Route Handlers in [src/app/api](src/app/api) using Prisma.
- **Client‑side:** React Query hooks for caching and refetching.
- **UI state:** Feature‑scoped Zustand stores in [src/lib/stores](src/lib/stores).

### Runtime tasks

Server init in [src/lib/server-init.ts](src/lib/server-init.ts) starts:

- Session cleanup cron (expired sessions)
- Goal reset cron (daily summaries + reset)
- Campaign archiver cron (auto‑archive completed/cancelled)

---

## 4) Project structure (high‑level)

```
.
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── advance-scouting/
│   │   ├── campaigns/
│   │   ├── goals/
│   │   ├── home/
│   │   ├── login/
│   │   ├── tasks/
│   │   ├── update-public-data/
│   │   └── api/
│   ├── components/
│   ├── lib/
│   └── types/
├── prisma/
│   └── migrations/
├── public/
└── scripts/
```

Key files:

- [src/app/layout.tsx](src/app/layout.tsx)
- [src/app/AuthContext.tsx](src/app/AuthContext.tsx)
- [src/app/MainContent.tsx](src/app/MainContent.tsx)
- [src/app/Maintenance.tsx](src/app/Maintenance.tsx)
- [src/app/Providers.tsx](src/app/Providers.tsx)
- [src/app/PageTitle.tsx](src/app/PageTitle.tsx)
- [src/middleware.ts](src/middleware.ts)
- [prisma/schema.prisma](prisma/schema.prisma)
- [Dockerfile](Dockerfile)
- [Dockerfile.dev](Dockerfile.dev)
- [docker-compose.yml](docker-compose.yml)

---

## 5) User‑facing pages and modules

### Scouting

- `/home` — Public scouting (search, filters, recent leads)
- `/advance-scouting` — Advanced scouting and edit flows
- `/update-public-data` — Public data updates workflow

### Tasks & goals

- `/tasks` — Task list, filters, editing, and points
- `/goals` — Goal dashboard, ad‑hoc tasks, progress tracking

### Campaigns

- `/campaigns` — Campaign list and creation
- `/campaigns/[id]` — Campaign details, influencers, sync controls
- `/campaigns/find-influencer` — Campaign‑scoped search and selection

### Admin

- `/admin/scouting-analytics` — Scouting analytics dashboards
- `/admin/goals-analytics` — Goals analytics and KPIs
- `/admin/goals-management` — Predefined task management
- `/admin/user-management` — Add/edit/archive users and permissions
- `/admin/activity-logs` — Activity log viewer

---

## 6) API surface (grouped by module)

Routes are implemented under [src/app/api](src/app/api).

### Auth & sessions

- `/api/auth/login`
- `/api/auth/checkSession`
- `/api/auth/logout`
- `/api/internal/validate-session`

### Influencers, scouting, and data

- `/api/add/influencer`
- `/api/fetch/public-data`
- `/api/fetch/oneDayData`
- `/api/fetch/influencerData`
- `/api/fetch/influencer-details`
- `/api/fetch/internal-mavn-data`
- `/api/fetch/allData`
- `/api/fetch/pics`
- `/api/search/influencer`
- `/api/search/influencerEthnicity`
- `/api/update/advanceData`
- `/api/update/oneDayData`
- `/api/update/ethnicity`

### Tasks & goals

- `/api/fetch/tasks`
- `/api/fetch/fetchPoints`
- `/api/add/adHocTask`
- `/api/add/adHocSubTask`
- `/api/update/adHocTask`
- `/api/delete/adHocTask`
- `/api/complete/adhoc-task`
- `/api/update/tasks`
- `/api/admin/pre-defined-tasks/add`
- `/api/admin/pre-defined-tasks/update`
- `/api/admin/pre-defined-tasks/delete`
- `/api/admin/pre-defined-tasks/fetch`
- `/api/admin/pre-defined-tasks/update-sort-order`
- `/api/admin/goals/seed`

### Campaigns

- `/api/campaigns`
- `/api/campaigns/[id]`
- `/api/campaigns/[id]/duplicate`
- `/api/campaigns/[id]/share`
- `/api/campaigns/access/[accessId]`
- `/api/campaigns/users`
- `/api/campaigns/[id]/influencers`
- `/api/campaigns/[id]/influencers/bulk`
- `/api/campaigns/[id]/influencers/[influencerId]/status`
- `/api/campaigns/[id]/influencers/[influencerId]/fee`
- `/api/campaigns/[id]/influencers/[influencerId]/agreed-rates`
- `/api/influencers/[id]/campaigns`
- `/api/influencers/[id]/related-models`

### Admin analytics & users

- `/api/admin/scouting-analytics/fetch`
- `/api/admin/goal-analytics/fetch`
- `/api/admin/activity-logs/fetch`
- `/api/admin/users/fetch`
- `/api/admin/users/add`
- `/api/admin/users/update`
- `/api/admin/users/archive`
- `/api/admin/users/delete`
- `/api/admin/campaigns/auto-archive`

### Sync & enrichment

- `/api/sync/instagram`
- `/api/sync/instagram/bulk`
- `/api/sync/tiktok`
- `/api/sync/tiktok/bulk`
- `/api/sync/tiktok/status`
- `/api/sync/status/[jobId]`
- `/api/sync/jobs`

### Custom data points

- `/api/custom-data-points/categories/add`
- `/api/custom-data-points/categories/fetch`
- `/api/custom-data-points/ethnicity/add`
- `/api/custom-data-points/ethnicity/fetch`
- `/api/fetch/asianEthnicity`

### Security + webhooks

- `/api/security/check`
- `/api/webhooks/influencer-form`
- `/api/webhooks/model-form`
- `/api/webhooks/talent-form`

---

## 7) Data model summary (Prisma)

Key models in [prisma/schema.prisma](prisma/schema.prisma):

### Core scouting entities

- `InfluencerMavn` — Primary influencer record, social IDs, metrics, enrichment fields
- `ModelMavn` — Model records (campaign‑assignable)
- `ActivityLog` — Audit trail for auth and system events

### Auth + sessions

- `User` — User accounts, roles, and permissions
- `Session` — Active sessions with device metadata

### Tasks & goals

- `TaskPoints` and `TaskLog` — Points and activity history
- `GoalTaskType`, `GoalTask`, `GoalSubtask` — Task definitions
- `GoalAssignment`, `UserGoalProgress`, `SubtaskProgress`, `GoalDailySummary` — Assignments and progress
- `AdHocGoalTask`, `AdHocTaskSubtaskLink` — Ad‑hoc tasks and linked subtasks

### Campaigns

- `Campaign` — Campaign metadata, status, budget, and archive state
- `CampaignUserAccess` — Sharing and access controls
- `CampaignInfluencer`, `CampaignModel` — Assignments and deliverables

### Sync + enrichment

- `SyncJob` — Persistent sync jobs and progress
- `RelatedInstagramProfile`, `InfluencerRelatedProfile`, `ModelRelatedProfile` — Related profile discovery

### Security

- `RateLimit`, `BlockedIP`, `SecurityLog` — Abuse prevention and auditing

---

## 8) Authentication & session lifecycle

### Login

1. `/api/auth/login` validates username/password.
2. JWT is created with user claims and stored in `Session` with device metadata.
3. `session` cookie is set as httpOnly, `sameSite=strict`.
4. Old sessions are trimmed to the most recent 5 per user.

### Session refresh

- `/api/auth/checkSession` validates the JWT, verifies the DB session, and refreshes when <2 hours remain.
- Device consistency is enforced using major UA fingerprint matching.

### Logout

- `/api/auth/logout` deletes the session and records an activity log.

---

## 9) Security model

### Edge middleware

- **Suspicious path detection** with immediate deny and logging.
- **General rate limiting** at 500 requests per 15 minutes per IP.
- **Blocked IP checks** via `/api/security/check`.
- **Session‑aware routing** and admin role gating.
- **RSC cache protection** using `Vary` headers on RSC requests.

### Database‑backed security

- Failed login tracking with a 15‑minute window and 5 attempts max.
- Temporary IP blocks for 1 hour after max attempts; permanent blocks for suspicious scans.
- Security events recorded in `SecurityLog`.

---

## 10) Background jobs & runtime tasks

Cron jobs are initialized on server start via [src/lib/server-init.ts](src/lib/server-init.ts).

- **Session cleanup** (daily at 23:59 MYT) — removes expired sessions.
- **Goal reset** (daily at 23:59 MYT) — writes daily summaries and resets progress.
- **Campaign archiver** (daily at 00:00 MYT) — archives completed/cancelled campaigns older than 1 month.

Timezone for all jobs is **Asia/Kuala_Lumpur**.

---

## 11) Sync & enrichment pipeline

### Apify integrations

- Instagram and TikTok sync via Apify actors.
- Engagement rates calculated using **mean** and **median** methods (non‑pinned posts only).
- 5‑day sync interval enforced by `INSTAGRAM_SYNC_INTERVAL_DAYS` and `TIKTOK_SYNC_INTERVAL_DAYS`.

### Sync job tracking

- `SyncJob` records track progress, batches, and results for frontend recovery.
- `/api/sync/jobs` and `/api/sync/status/[jobId]` provide polling data.

### Media storage

- Profile and related images are uploaded to DigitalOcean Spaces (S3‑compatible).
- CDN URLs are stored back on the influencer/model records.

---

## 12) Docker & local development

The repository ships with Docker artifacts for dev and production testing:

- Production image: [Dockerfile](Dockerfile)
- Dev image with hot‑reload: [Dockerfile.dev](Dockerfile.dev)
- Compose setup: [docker-compose.yml](docker-compose.yml)

See [DOCKER.md](DOCKER.md) for exact commands and recommended workflows.

---

## 13) Database backups & operational scripts

Scripts in [scripts](scripts) provide automated backup/restore tooling:

- `npm run db:backup` — creates a compressed `.backup` file in [backups](backups)
- `npm run db:restore` — restores a selected backup (interactive)

See [scripts/DB_BACKUP_GUIDE.md](scripts/DB_BACKUP_GUIDE.md) for prerequisites and workflows.

---

## 14) Environment variables

Commonly used variables:

- `DATABASE_URL` (Prisma datasource)
- `DATABASE_URL_NON_POOLING` (backup/restore tooling)
- `SECRET_KEY` (JWT signing)
- `NEXT_PUBLIC_MAINTENANCE` (maintenance mode toggle)
- `NEXTAUTH_URL` (used by middleware for internal calls)

Apify:

- `APIFY_API_TOKEN`
- `APIFY_ACTOR_ID` (Instagram actor)
- `APIFY_TIKTOK_ACTOR_ID`
- `INSTAGRAM_SYNC_INTERVAL_DAYS`
- `TIKTOK_SYNC_INTERVAL_DAYS`

DigitalOcean Spaces:

- `DO_SPACES_KEY`
- `DO_SPACES_SECRET`
- `DO_SPACES_REGION`
- `DO_SPACES_BUCKET`
- `DO_SPACES_ENDPOINT`
- `DO_SPACES_CDN_URL`

> Keep secrets in [.env](.env) files and never commit them.

---

## 15) CI/CD

There are **no CI/CD workflows checked into this repository** (no workflows under [.github](.github)). Current deployment and release validation is expected to be handled via local Docker builds or external CI systems.

---

## 16) License

This project is proprietary to MAVN.
