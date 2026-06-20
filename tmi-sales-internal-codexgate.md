TMI Sales Operations CRM
=================================================

This repository contains the full **Sales Operations CRM** used by The Moving Image. It is a Next.js 15 App Router application with a PostgreSQL database, Prisma ORM, role-based access control, background jobs, and a rich front‑end experience.

The document below explains how the system works end‑to‑end: architecture, features, data model, API surface, security posture, background jobs, and operational notes.

---

## 1) What this application does

The app provides a purpose‑built Sales Operations CRM for internal teams, combining sales reporting, lead lifecycle management, and operational governance:

- **Sales dashboard** with KPIs, charts, and a recent leads table
- **Goal tracking** (predefined and ad‑hoc tasks) with daily resets and analytics
- **Lead management** (assignment, distribution, PIC tracking, activity logs)
- **Clients and Organizations** directories with search and filtering
- **Email verification** (MillionVerifier integration) with daily token limits and caching
- **Admin tools** for user management, task management, activity logs, and call reports
- **Security** built into middleware and API routes (rate limiting, IP blocking, session validation, CSRF)

This is an internal system; all pages are protected by middleware except login.

---

## 2) Tech stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **State:** Zustand + TanStack Query
- **UI:** Tailwind CSS + Radix Themes + Lucide icons + Framer Motion
- **Auth:** JWT + httpOnly session cookie
- **Email:** Postmark (notification emails)
- **Email verification:** MillionVerifier (single + bulk API)

---

## 3) Architecture overview

### App Router structure

The app uses Next.js App Router with two primary route groups:

- `(auth)` for login
- `(authenticated)` for all protected pages

Global layout is defined in `src/app/layout.tsx` and provides:

- Theme provider (Radix)
- QueryClient (TanStack Query)
- AuthProvider context for user and session state
- `MainContent` to gate rendering during hydration and auth checks

### Authentication + authorization

- JWT is issued on login and stored in a **httpOnly** `session` cookie
- Middleware validates the JWT and enforces redirects and role rules
- Session info is persisted in PostgreSQL (`Session` table) for server‑side checks
- Users can have role values such as `admin`, `manager`, `salesperson`, `LeadsManager`
- The `LeadsManager` role is strictly limited to leads management screens

### Data fetching patterns

- **Server-side:** API routes in `src/app/api/...` using Prisma
- **Client-side:** React Query hooks for caching and refetching
- **UI state:** Zustand stores per feature module

### Background jobs

Background jobs run via `node-cron` and are initialized in `initializeServer()`:

- Session cleanup (daily)
- Goal reset (daily)
- Security cleanup (every 2 hours)

These are initialized in `src/app/layout.tsx` and can also be triggered via `/api/init` in production.

---

## 4) Project structure (high‑level)

```
.
├── src/
│   ├── app/
│   │   ├── (auth)/login
│   │   ├── (authenticated)/
│   │   │   ├── home/
│   │   │   ├── goals/
│   │   │   ├── goal-analytics/
│   │   │   ├── clients/
│   │   │   │   └── email-verification/
│   │   │   ├── organizations/
│   │   │   └── admin/
│   │   │       ├── activity-logs/
│   │   │       ├── call-reports/
│   │   │       ├── goals-management/
│   │   │       ├── leads-management/
│   │   │       │   └── duplicate-checker/
│   │   │       └── user-management/
│   │   ├── api/
│   │   ├── AuthContext.tsx
│   │   ├── MainContent.tsx
│   │   ├── layout.tsx
│   │   └── middleware.ts
│   ├── components/
│   ├── hooks/
│   └── lib/
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
├── scripts/
├── public/
└── docker-compose.yml / Dockerfile(s)
```

---

## 5) User‑facing pages and modules

### Core dashboards

- **/home** — Sales dashboard with charts, KPIs, filters, and recent leads table
- **/goals** — Daily goal tracking for predefined and ad‑hoc tasks
- **/goal-analytics** — Analytics by PIC and task type with charts and tables

### Directory

- **/clients** — Client directory with search and PIC filtering
- **/clients/email-verification** — Email verification UI with streaming results and token usage
- **/organizations** — Organization directory with search and PIC filtering

### Admin area

- **/admin/activity-logs** — Full audit/activity log viewer with filters
- **/admin/user-management** — Create/edit/archive/delete users and manage org/role assignments
- **/admin/goals-management** — Manage goal templates and assignments
- **/admin/leads-management** — Lead database operations, filtering, assignment, and edits
- **/admin/leads-management/duplicate-checker** — Upload file and check duplicates vs DB
- **/admin/call-reports** — Call report table

### Authentication

- **/login** — Login form with rate‑limit and block feedback

---

## 6) API surface (grouped by module)

Below are the main API route groups. The routes are implemented in `src/app/api/...`.

### Auth

- `POST /api/auth/login` — Login and create session
- `GET /api/auth/verify-session` — Validate/refresh session
- `POST /api/auth/logout` — Logout and session cleanup

### Dashboard data

- `/api/dashboard/charts`
- `/api/dashboard/table`
- `/api/fetch/dashboard-data`
- `/api/fetch/fetchTableDataInitial`
- `/api/fetch/fetchFilteredData`
- `/api/fetch/fetchPreviousData`

### Goals

- `/api/fetch/tasks`
- `/api/update/tasks`
- `/api/add/adHocTask`
- `/api/complete/adhoc-task`
- `/api/delete/adHocTask`
- `/api/update/adHocTask`

### Goal analytics

- `/api/goal-analytics/fetch`

### Clients & Organizations

- `/api/clients`
- `/api/clients/search`
- `/api/clients/edit`
- `/api/organizations`
- `/api/organizations/search`
- `/api/organizations/edit`

### Email verification

- `POST /api/clients/emails/bulk-verify` — Bulk or streaming email verification
- `POST /api/clients/emails/usage` — Daily token usage

### Leads management (Admin)

- `/api/admin/leads/fetch`
- `/api/admin/leads/add`
- `/api/admin/leads/add-new`
- `/api/admin/leads/edit`
- `/api/admin/leads/assign`
- `/api/admin/leads/unassign`
- `/api/admin/leads/merge`
- `/api/admin/leads/overwrite`
- `/api/admin/leads/promote`
- `/api/admin/leads/organizations`
- `/api/admin/leads/check-duplicates`
- `/api/admin/leads/fetch-ids`
- `/api/admin/leads/activity`
- `/api/admin/leads/export`
- `/api/admin/leads/settings`

### Admin users

- `/api/admin/users/fetch`
- `/api/admin/users/add`
- `/api/admin/users/update`
- `/api/admin/users/update-with-manager`
- `/api/admin/users/archive`
- `/api/admin/users/delete`

### Admin tasks (predefined)

- `/api/admin/pre-defined-tasks/add`
- `/api/admin/pre-defined-tasks/update`
- `/api/admin/pre-defined-tasks/delete`
- `/api/admin/pre-defined-tasks/fetch`
- `/api/admin/pre-defined-tasks/update-sort-order`

### Activity logs

- `/api/admin/activity-logs/fetch`
- `/api/admin/activity-logs/fetch-expanded`

### Lead source approvals

- `/api/lead-source-approvals`
- `/api/lead-source-approvals/[id]/approve`
- `/api/lead-source-approvals/[id]/reject`
- `/api/lead-source-approvals/history/[clientId]`

### Security & system

- `/api/security/sync`
- `/api/security/middleware-sync`
- `/api/security/blocked-ips`
- `/api/init`

---

## 7) Data model summary (Prisma)

Key models in `prisma/schema.prisma` and how they are used:

### Users & auth

- **User** — Core user profile; role, organizations, manages
- **Session** — Active sessions with device fingerprint and expiry
- **ActivityLog** — User activity and audit trail

### Goals

- **GoalTask** — Task templates and ad‑hoc task definitions
- **TaskAssignment** — Per‑user task targets and reset rules
- **UserGoal** — Per‑user task progress
- **DailyTaskSummary** — Daily snapshots for analytics

### Sales reporting

- **Organization** — Core account entity
- **Client** — Contacts linked to organizations
- **mavn_monthly_report** — MAVN reporting data
- **mi_monthly_report** — Moving Image reporting data
- **DeletedData** — Records of removed data

### Leads management

- **ContactData** — Lead records and assignment metadata
- **ContactUploadBatch** — Tracks CSV/file uploads
- **ContactPICData** — Per‑PIC status, notes, priority, follow‑ups
- **ContactActivityLog** — Lead activity audit trail
- **LeadPromotion** — Track promotions from leads to reports
- **SystemSettings** — Feature toggles / admin settings

### Lead source approval flow

- **LeadSourceChangeRequest** — Pending approval requests
- **LeadSourceHistory** — History of lead source changes

### Email verification

- **EmailVerificationCache** — Cached verification results
- **EmailVerificationUsage** — Per‑user daily token usage

### Security & abuse prevention

- **RateLimit** — DB-level login rate limits
- **BlockedIP** — Blocked IPs with expiry and details
- **SecurityLog** — Security audit log entries

---

## 8) Security model

### Middleware (`src/middleware.ts`)

- Suspicious path scanning (blocks after 3 hits)
- In-memory IP rate limiting
- Session validation via JWT
- Role-aware routing rules

### API security

- DB-level login attempt tracking and IP blocking
- CSRF protection via double-submit cookie pattern
- Session validation with refresh window (2 hours)

### Cron-backed security sync

- `/api/security/sync` and `/api/security/middleware-sync` persist middleware data into PostgreSQL
- `/api/security/blocked-ips` provides current blocks to sync back to middleware

---

## 9) Email integrations

### Postmark (transactional)

- Delete/inactive lead notifications
- Goal tracking reminders

### MillionVerifier

- Batch verification with caching
- Daily token limits stored in `EmailVerificationUsage`
- Real‑time streaming of verification results for the UI

---

## 10) Background jobs

These jobs run via `node-cron` and are initialized by `initializeServer()`:

- **Session cleanup** — Removes expired sessions nightly
- **Goal reset** — Snapshots daily task data and resets counters nightly
- **Security cleanup** — Removes old logs and expired blocks every 2 hours

All tasks use **Asia/Kuala_Lumpur (UTC+8)** for time consistency.

---

## 11) Environment variables

The following environment variables are referenced in code:

- `DIGITAL_OCEAN_URL` — PostgreSQL connection string (Prisma datasource)
- `SECRET_KEY` — JWT signing key
- `CRON_SECRET` — Shared secret for security sync endpoints
- `POSTMARK_API_TOKEN` — Postmark API token
- `MILLION_VERIFIER_API_KEY` — MillionVerifier API key
- `NEXT_PUBLIC_API_URL` — Axios base URL override (defaults to `/api`)
- `NEXT_PUBLIC_MAINTENANCE` — When set to `true`, shows maintenance page

> Keep secrets in `.env.*` files and never commit them.

---

## 12) Operational scripts

Scripts in `scripts/` are for one‑off ops and migrations:

- `addUser.js` — Create a user via Prisma + bcrypt
- `migrate-contact-pic-data.js` — Migrate legacy contact notes/status to `ContactPICData`
- `migrate-lead-sources.js` — Copy organization lead sources to clients without one

### Prisma

- Prisma schema: `prisma/schema.prisma`
- Migrations live in `prisma/migrations/`
- Seed entrypoint: `prisma/seed.js`

---

## 13) Docker & local runs

Docker assets are provided for production and dev workflows:

- `Dockerfile` — production build
- `Dockerfile.dev` — hot-reload dev container
- `docker-compose.yml` — run the app in prod-like and dev containers
- `DOCKER.md` — full workflow and notes

---

## 14) Notable implementation details

### AuthContext

- `AuthContext` manages client auth state, session checks, and PIC caching
- Uses TanStack Query (`usePicUsers`) for PIC data and caching

### QueryClient configuration

- Aggressive cache cleanup and conservative refetching to reduce memory pressure

### Maintenance mode

- If `NEXT_PUBLIC_MAINTENANCE` is `true`, the full app is replaced by `Maintenance` component

### AuditLogger

- `src/lib/auditLogger.ts` references an `AuditLog` model that does not exist in Prisma schema
- Current implementation logs warnings only and does not persist audit entries

---

## 15) Data assets

- `db_backups/` contains legacy backups and CSVs (excluded from Docker builds)
- `public/` holds static assets (logos, user profile images, favicons)

---

## 16) Handover checklist (recommended)

- Review all environment variables and rotate secrets if needed
- Confirm cron jobs are running in production runtime
- Validate security sync endpoints are called by your cron provider
- Review current roles and user assignments in Admin → User Management
- Verify email verification token limits and usage tracking
- Confirm database migrations are aligned with production schema

---

## 17) Where to look for each feature

- **Auth & middleware:** `src/app/AuthContext.tsx`, `src/middleware.ts`, `src/app/api/auth/*`
- **Sales dashboard:** `src/app/(authenticated)/home/*`
- **Goals & analytics:** `src/app/(authenticated)/goals/*`, `src/app/(authenticated)/goal-analytics/*`
- **Leads management:** `src/app/(authenticated)/admin/leads-management/*`, `src/app/api/admin/leads/*`
- **Duplicate checker:** `src/app/(authenticated)/admin/leads-management/duplicate-checker/*`
- **Email verification:** `src/app/(authenticated)/clients/email-verification/*`, `src/app/api/clients/emails/*`
- **Admin tools:** `src/app/(authenticated)/admin/*`, `src/app/api/admin/*`
- **Security:** `src/app/api/security/*`, `src/lib/securityActions.ts`, `src/lib/securityConfig.ts`

---

## 18) Build & deployment notes (current setup)

- **Build toolchain:** `package.json` uses `next build --turbopack` and `next start` for production runtime.
- **Local install requirement:** Always run `npm install` locally before building to keep `package-lock.json` in sync.
- **Deployment approach:** Deployments are clean (fresh install and build each time).

### Database & pooling (DigitalOcean)

- **Primary database:** `defaultdb` (DigitalOcean Managed PostgreSQL)
- **Pooling connection:** `sales-dashboard-pool` via the pooled connection string
- **Non‑pooling connection:** Use the direct connection string for admin tasks or Prisma CLI that requires non‑pooling

These values are configured in .env and used by Prisma via `DIGITAL_OCEAN_URL` (pooling) and `DIGITAL_OCEAN_URL_NON_POOLING` (direct).

---

## 19) CI/CD & branching

### Branches

- **development** — Active development branch
- **master** — Production branch connected to DigitalOcean App Platform

### CI/CD pipeline

- **Production deploys:** DigitalOcean App Platform is connected to the `master` branch and deploys from it.
- **CI config in repo:** No dedicated CI configuration is present in this repository (no GitHub Actions/GitLab CI files). Deployments are driven by the App Platform integration.
