# JD People Hub

This repository contains the full **JD People Hub** platform used by JD Sports employees. It is a Next.js 15 App Router application backed by PostgreSQL and Prisma, with role‑based access control, MFA via email OTP, SFTP integrations, background jobs, and a JD‑branded UI. It also ships with Capacitor mobile wrappers for Android and iOS.

For formal project transfer details (client-facing + technical runbooks), see **`HANDOVER.md`**.

The document below explains the system end‑to‑end: architecture, features, data model, API surface, security posture, background jobs, and CI/CD.

---

## 1) What this application does

JD People Hub is a full HR portal for employees and administrators, providing:

- **Employee dashboard** with messages, overview cards, activity logs, and purchase summaries
- **Digital ID card** with status-aware access (Active/OnHold/Terminated)
- **Employee profile** management with approval workflow and audit trail
- **First‑time setup** flow that collects mandatory profile info and profile photo
- **Voucher management** for employee benefits (templates, categories, instances, redeem)
- **Playbook** resources and featured content
- **Purchase history** and allowance tracking (YTD discount usage, medical benefits)
- **Admin portal** for employees, cards, vouchers, reports, approvals, and settings
- **SFTP import/export** for HR data synchronization with legacy systems
- **Security** built into edge middleware and database‑level enforcement

All protected pages are gated by middleware and session validation. Auth and setup flows are fully enforced before access is granted.

---

## 2) Tech stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **State:** Zustand + TanStack Query
- **UI:** Tailwind CSS v4 + shadcn/ui + Radix + Lucide + Framer Motion
- **Auth:** JWT + httpOnly session cookie + email OTP
- **Email:** Mailgun (OTP, registration, password reset, welcome)
- **Mobile:** Capacitor (Android + iOS wrappers)
- **Image Processing:** Sharp + libheif-js (HEIC conversion)
- **Face Detection:** MediaPipe Tasks Vision

---

## 3) Architecture overview

### App Router structure

The app uses three main route groups:

- `(auth)` for login/registration flows
- `(employee)` for employee‑facing pages
- `(admin)` for admin‑facing pages

Global layout (`src/app/layout.tsx`) wires:

- `QueryClientProvider` (TanStack Query)
- `AuthProvider` (session state)
- `NotificationProvider`
- `SidebarStateRoot`
- `MainContent` (hydration + auth gating)
- `Maintenance` override when `NEXT_PUBLIC_MAINTENANCE=true`

### Authentication + authorization

- **OTP login flow** (password + OTP) via `/api/auth/login` → `/api/auth/login/verify-otp`.
- **Registration flow** uses a secure email token (hashed in DB) and password setup.
- **Password reset** uses a secure email token (hashed in DB) and post‑reset auto login.
- **Session** uses JWT stored in `session` httpOnly cookie and persisted in `Session` table.
- Session refresh is automatic if <2 hours to expiry or claims change.
- Max **5 concurrent sessions** per user; oldest session is evicted.
- Admin access requires role: `HRAdmin`, `SuperAdmin`, or `Admin`.

### Data fetching patterns

- **Server‑side**: App Route Handlers in `src/app/api/...` using Prisma.
- **Client‑side**: React Query hooks for caching and refetching.
- **UI state**: Feature‑scoped Zustand stores.

### Background jobs

Background jobs run via `node-cron` when `ENABLE_INTERNAL_CRON=true`:

- Session cleanup (daily)
- Voucher expiry cleanup (every 2 hours)
- Security maintenance (every 6 hours)
- SFTP export (11:50 PM) + SFTP import (2:00 AM)

Timezone defaults to **Asia/Kuala_Lumpur**. External cron can trigger maintenance via secured internal endpoints.

---

## 4) Project structure (high‑level)

```
.
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (employee)/
│   │   ├── (admin)/
│   │   ├── api/
│   │   ├── first-time-setup/
│   │   ├── AuthContext.tsx
│   │   ├── MainContent.tsx
│   │   ├── QueryClientProvider.tsx
│   │   ├── layout.tsx
│   │   └── middleware.ts
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── types/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── models/
│   └── uploads/
├── scripts/
├── android/
├── ios/
└── .github/workflows/
```

---

## 5) User‑facing pages and modules

### Employee area

- `/dashboard` — Employee dashboard (overview, cards, messages)
- `/id-card` — Digital ID card
- `/vouchers` — Employee vouchers and QR code display
- `/purchase-history` — Purchases + allowance usage
- `/profile` — Profile view/edit with change requests
- `/playbook` — Employee resources

### First‑time setup

- `/first-time-setup` — Required on first login to collect profile details and photo

### Admin area

- `/admin/dashboard` — Admin overview and system status
- `/admin/employees` — Employee directory + edit + upload photo
- `/admin/cards` — Card management and status controls
- `/admin/vouchers` — Voucher templates, categories, instances
- `/admin/playbook` — Playbook content management
- `/admin/approvals` — Profile change approvals
- `/admin/activity-logs` — Audit log viewer
- `/admin/reports` — Report generation + downloads
- `/admin/settings` — Global settings (profile editing + SFTP toggle)

### Auth

- `/login` — Password + OTP login
- `/register` and `/register/set-password` — First‑time registration
- `/forgot-password` + `/reset-password` — Password reset

---

## 6) API surface (grouped by module)

Routes are implemented under `src/app/api/...`.

### Auth

- `/api/auth/login`
- `/api/auth/login/verify-otp`
- `/api/auth/login/resend-otp`
- `/api/auth/register`
- `/api/auth/register/verify-token`
- `/api/auth/register/set-password`
- `/api/auth/register/resend-email`
- `/api/auth/forgot-password`
- `/api/auth/forgot-password/verify-token`
- `/api/auth/forgot-password/reset`
- `/api/auth/logout`
- `/api/auth/verify-session`

### Employee dashboard

- `/api/dashboard`
- `/api/dashboard/messages/[id]`

### Profile

- `/api/profile`
- `/api/profile/first-time-setup`
- `/api/profile/upload-photo`
- `/api/profile/delete-photo`
- `/api/profile/change-requests`
- `/api/profile/change-requests/[id]`
- `/api/profile/change-requests/cancel`
- `/api/profile/settings`

### ID card

- `/api/id-card`

### Vouchers (employee)

- `/api/vouchers`
- `/api/vouchers/[voucherCode]/redeem`
- `/api/vouchers/counts`

### Purchase transactions

- `/api/purchase-transactions`
- `/api/purchase-transactions/[transactionId]`
- `/api/purchase-transactions/config`
- `/api/purchase-transactions/stats`

### Playbook

- `/api/playbook`

### Admin: approvals + activity logs

- `/api/admin/approvals`
- `/api/admin/approvals/[id]`
- `/api/admin/approvals/stats`
- `/api/admin/activity-logs`
- `/api/admin/activity-logs/stats`

### Admin: employees

- `/api/admin/employees`
- `/api/admin/employees/[id]`
- `/api/admin/employees/stats`
- `/api/admin/employees/upload-photo`
- `/api/admin/employees/delete-photo`
- `/api/admin/employees/send-welcome-email`
- `/api/admin/employees/check-staff-card`
- `/api/admin/employees/validate-unique`
- `/api/admin/employees/[id]/benefits`
- `/api/admin/employees/[id]/vouchers`

### Admin: cards

- `/api/admin/cards`
- `/api/admin/cards/[employeeId]`
- `/api/admin/cards/stats`

### Admin: vouchers

- `/api/admin/vouchers`
- `/api/admin/vouchers/bulk`
- `/api/admin/vouchers/stats`
- `/api/admin/vouchers/upload-picture`
- `/api/admin/vouchers/delete-picture`
- `/api/admin/vouchers/categories`
- `/api/admin/vouchers/categories/[categoryId]`
- `/api/admin/vouchers/categories/bulk-reassign`
- `/api/admin/vouchers/presets`
- `/api/admin/vouchers/instances/[serialNumber]`
- `/api/admin/vouchers/[serialNumber]/status`

### Admin: playbook

- `/api/admin/playbook`
- `/api/admin/playbook/[id]`
- `/api/admin/playbook/reorder`

### Admin: reports

- `/api/admin/reports/available`
- `/api/admin/reports/downloads`
- `/api/admin/reports/generate`
- `/api/admin/reports/incomplete-profiles`
- `/api/admin/reports/insights`
- `/api/admin/reports/metrics`

### Admin: settings + system status

- `/api/admin/settings`
- `/api/admin/dashboard/stats`
- `/api/admin/dashboard/system-status`

### Admin: SFTP

- `/api/admin/sftp/connection`
- `/api/admin/sftp/sync`
- `/api/admin/sftp/sync/stream`
- `/api/admin/sftp/export`

### Security + internal ops

- `/api/security/sync`
- `/api/security/middleware-sync`
- `/api/security/blocked-ips`
- `/api/internal/maintenance`
- `/api/internal/runtime/metrics`

### Utilities

- `/api/convert-heic`
- `/api/debug/check-ip`

---

## 7) Data model summary (Prisma)

Key models in `prisma/schema.prisma`:

### Users & profile

- **User** — Employee record, profile data, role/status, first‑time setup flag
- **ProfileChangeRequest** — Pending changes requiring admin approval
- **AdminMessage** — Admin‑to‑employee messages

### Auth + sessions

- **Session** — Active sessions with JWT token and expiry
- **OTPCode** — Email OTPs with expiration and attempt tracking
- **PasswordResetToken** — Hashed reset tokens and usage tracking
- **RegistrationToken** — Hashed registration tokens and usage tracking

### Vouchers

- **VoucherTemplate** — Voucher presets (type/title)
- **VoucherCategory** — Country/year/category rules and terms
- **VoucherInstance** — Issued vouchers with serial, status, usage count

### Transactions + benefits

- **EmployeeAllowance** — YTD discount + medical/leave benefit usage
- **PurchaseTransaction** — Employee purchases linked to stores

### Playbook

- **PlaybookResource** — Employee handbook resources with ordering

### Admin + system

- **AuditLog** — Immutable audit trail of actions
- **Store** — Store metadata (country, address, barcode prefix)
- **Settings** — Global settings (profile editing, SFTP sync toggle)

### Security & monitoring

- **BlockedIP** — IP blocks (temporary/permanent)
- **RateLimit** — Persistent rate limit counters
- **SecurityLog** — Security events (login failures, suspicious paths)
- **OTPRateLimit** — Rate limiting for OTP and reset requests

### SFTP sync

- **SftpSyncHistory** — Sync/import/export history and status

---

## 8) Authentication & session lifecycle

### Login (password + OTP)

1. `/api/auth/login` validates password and sends OTP email
2. `/api/auth/login/verify-otp` validates OTP, creates session, sets cookie
3. Sessions are persisted in `Session` with browser/OS metadata

### Registration

1. `/api/auth/register` validates employee + email and sends a tokenized link
2. Token is hashed and stored in `RegistrationToken`
3. `/api/auth/register/verify-token` validates token
4. `/api/auth/register/set-password` sets password and creates session

### Password reset

1. `/api/auth/forgot-password` sends reset link (hashed token)
2. `/api/auth/forgot-password/verify-token` validates token
3. `/api/auth/forgot-password/reset` sets new password and creates session

### Session rules

- JWT stored in httpOnly cookie `session`
- Session expiration: 24 hours; refresh when <2 hours left
- Max session lifetime: 7 days
- Max concurrent sessions: 5 (oldest is evicted)

---

## 9) Security model

### Edge middleware (`src/middleware.ts`)

- In‑memory rate limiting (general + API)
- Suspicious path detection and auto‑blocking
- CSRF validation for state‑changing requests
- Session‑aware redirects and role checks
- Blocked IP sync from database

### Database‑backed security (`src/lib/securityActions.ts`)

- Persistent login attempt tracking
- OTP rate limiting
- IP blocking with expiry
- Security logs for forensic/audit

### CSRF

- Double‑submit cookie pattern (`csrf-token` cookie + `x-csrf-token` header)
- Enforced on all POST/PUT/PATCH/DELETE requests except file uploads

---

## 10) Background jobs & runtime monitoring

### Internal scheduler

Enabled by `ENABLE_INTERNAL_CRON=true` and configured with:

- `SESSION_CLEANUP_CRON`
- `VOUCHER_CLEANUP_CRON`
- `SECURITY_CLEANUP_CRON`
- `SFTP_EXPORT_CRON`
- `SFTP_SYNC_CRON`
- `SCHEDULER_TIMEZONE`

### External cron endpoints

- `/api/internal/maintenance` — Runs cleanup jobs (requires `x-cron-secret`)
- `/api/security/sync` and `/api/security/middleware-sync` — Persist middleware security state
- `/api/security/blocked-ips` — Sync blocked IPs to middleware
- `/api/internal/runtime/metrics` — Runtime + memory metrics snapshot

### Memory monitoring

Optional interval logging via `MEMORY_MONITOR_INTERVAL_MIN` with Prisma and middleware metrics.

---

## 11) SFTP import/export

SFTP is used to integrate with external HR data feeds. Supported file types:

- `staff-info`
- `branch`
- `staff-benefits`
- `staff-usage`
- `staff-transaction`
- `voucher`

Import/export is available via admin endpoints and scheduled cron jobs. SFTP sync can be toggled in `Settings` (`sftpSyncEnabled`). Export files are written to `/HRApp/HRExport/{FileType}` and import reads from `/HRApp/{FileType}`.

---

## 12) Media, uploads, and validation

- **Profile photo uploads** use image validation and HEIC conversion (`/api/convert-heic`).
- **Face detection** uses MediaPipe (short‑range model in `public/models/`).
- **Images** can be hosted via DigitalOcean Spaces (see `DO_SPACES_*` env vars).

---

## 13) CI/CD and mobile builds

### DigitalOcean App Platform (Codexgate)

The production deployment runs on **DigitalOcean App Platform** under the **Codexgate** organization. CI/CD is handled by App Platform’s Git‑based deployment pipeline:

- **Source**: Connect the GitHub repository to App Platform.
- **Build**: App Platform builds the Next.js app using the repo’s build settings (e.g., `npm install` + `npm run build`).
- **Deploy**: Successful builds are automatically deployed to the App Platform service.
- **Secrets & config**: Environment variables (database URLs, JWT secrets, Mailgun, SFTP, Spaces, cron secrets) are configured in App Platform’s environment settings.
- **Database**: PostgreSQL is hosted on DigitalOcean; `DATABASE_URL` and `DATABASE_URL_NON_POOLING` point to the managed database.

Operational notes for this project:

- If you run internal cron jobs, set `ENABLE_INTERNAL_CRON=true`. Otherwise, keep it `false` and use external cron to hit the secured maintenance endpoints.
- Ensure `NEXT_PUBLIC_MAINTENANCE` is set appropriately to toggle maintenance mode.

### Mobile builds (GitHub Actions)

GitHub Actions provides manual workflows for mobile builds:

Current native version alignment:

- Android: `versionName=1.0.6`, `versionCode=6`
- iOS: `MARKETING_VERSION=1.0.6`, `CURRENT_PROJECT_VERSION=6`
- Web/package: `package.json version=1.0.6`

### Android (Build APK)

- Workflow: `.github/workflows/build-android.yml`
- Runs on `ubuntu-latest`, Node 22, Java 21
- Executes `npx cap sync android` and Gradle build
- Debug builds upload a testable `.apk` artifact
- Release builds require signing secrets and upload:
  - Signed release `.apk`
  - Play Store ready `.aab`
- Required release secrets:
  - `ANDROID_KEYSTORE_BASE64`
  - `ANDROID_KEYSTORE_PASSWORD`
  - `ANDROID_KEY_ALIAS`
  - `ANDROID_KEY_PASSWORD`

### iOS (Simulator build)

- Workflow: `.github/workflows/build-ios.yml`
- Runs on `macos-14` with Xcode 15.2
- Executes `npx cap sync ios`
- Removes incompatible iOS implementations of `@capacitor/splash-screen` and `@capacitor/status-bar` for build stability with Capacitor 8
- Builds simulator `.app` and uploads a zipped artifact

### iOS (Device build / IPA)

- Workflow: `.github/workflows/build-ios-device.yml`
- Runs on `macos-14` with Xcode 15.2
- Uses Fastlane Match for code signing
- Builds signed `.ipa` for physical devices and App Store
- Supports three build types:
  - **Development**: For testing on registered devices
  - **Ad-Hoc**: For internal distribution (up to 100 devices)
  - **App Store**: For TestFlight and App Store submission

> ⚠️ **Note:** The device build requires Apple Developer Program membership and additional setup. See section 14 below for complete setup instructions.

---

## 14) iOS Device Build Setup (IPA)

This section guides you through setting up the iOS device build workflow for producing signed `.ipa` files.

### Prerequisites

Before you can build iOS apps for physical devices or the App Store, you need:

1. **Apple Developer Program membership** ($99/year) - [developer.apple.com/programs](https://developer.apple.com/programs/)
2. **A private GitHub repository** for storing certificates (Fastlane Match)
3. **GitHub Secrets** configured in this repository

### Step 1: Apple Developer Account Setup

1. Enroll in the Apple Developer Program at [developer.apple.com/programs/enroll](https://developer.apple.com/programs/enroll/)
2. Once approved, note your **Team ID**:
   - Go to [developer.apple.com/account](https://developer.apple.com/account/)
   - Click "Membership" in the sidebar
   - Your Team ID is displayed (10-character alphanumeric)

3. Register the app identifier:
   - Go to Certificates, Identifiers & Profiles → Identifiers
   - Click "+" to add a new identifier
   - Select "App IDs" → "App"
   - Bundle ID: `com.jdsports.peoplehub`
   - Enable any required capabilities (Push Notifications, etc.)

### Step 2: Create App Store Connect API Key

For automated builds, create an API key:

1. Go to [appstoreconnect.apple.com/access/api](https://appstoreconnect.apple.com/access/api)
2. Click "+" to generate a new key
3. Name: `GitHub Actions CI`
4. Access: `App Manager` or `Admin`
5. Download the `.p8` file (you can only download it once!)
6. Note the **Key ID** and **Issuer ID**

### Step 3: Set Up Fastlane Match

Fastlane Match stores your certificates and provisioning profiles in a private Git repository, making them easy to share across team members and CI systems.

1. **Create a private GitHub repository** for certificates:
   - Repository name: `jd-people-hub-certificates` (or similar)
   - Must be **private**
   - Keep it empty (no README, no .gitignore)

2. **Create a Personal Access Token (PAT)** for repository access:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `repo` scope
   - Copy the token (you'll need it for secrets)

3. **Generate base64 authorization** for the token:
   ```bash
   echo -n "your_github_username:your_personal_access_token" | base64
   ```
   Copy the output for `MATCH_GIT_BASIC_AUTHORIZATION`.

4. **Initialize Fastlane Match locally** (one-time setup):
   ```bash
   cd ios/App
   fastlane match init
   # Select "git" as storage
   # Enter your certificate repository URL
   ```

5. **Generate certificates and profiles**:
   ```bash
   # For development builds
   fastlane match development --app_identifier com.jdsports.peoplehub

   # For ad-hoc distribution
   fastlane match adhoc --app_identifier com.jdsports.peoplehub

   # For App Store distribution
   fastlane match appstore --app_identifier com.jdsports.peoplehub
   ```

   You'll be prompted to:
   - Sign in to your Apple Developer account
   - Create a passphrase to encrypt certificates (save this for `MATCH_PASSWORD`)

### Step 4: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret.

Add the following secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `APPLE_TEAM_ID` | Your Apple Developer Team ID | `ABCD1234XY` |
| `MATCH_GIT_URL` | HTTPS URL to your certificate repository | `https://github.com/your-org/jd-people-hub-certificates.git` |
| `MATCH_PASSWORD` | Passphrase you created during Match setup | (your passphrase) |
| `MATCH_GIT_BASIC_AUTHORIZATION` | Base64-encoded `username:token` | (from step 3.3) |
| `KEYCHAIN_PASSWORD` | Password for CI keychain (any secure string) | `ci_keychain_password_123` |

**Optional secrets for App Store Connect API** (for automated TestFlight upload):

| Secret Name | Description |
|-------------|-------------|
| `APP_STORE_CONNECT_API_KEY_ID` | Key ID from App Store Connect |
| `APP_STORE_CONNECT_API_ISSUER_ID` | Issuer ID from App Store Connect |
| `APP_STORE_CONNECT_API_KEY` | Contents of the `.p8` file |

### Step 5: Run the Build

1. Go to **Actions** tab in GitHub
2. Select **"Build iOS Device App (IPA)"** workflow
3. Click **"Run workflow"**
4. Select build type:
   - `development` - For testing on registered devices
   - `adhoc` - For internal distribution
   - `appstore` - For App Store/TestFlight

5. Download the `.ipa` artifact once the build completes

### Step 6: Distribute the IPA

**Development builds:**
- Install via Xcode: Window → Devices and Simulators → Drag IPA to device
- Or use Apple Configurator 2

**Ad-Hoc builds:**
- Use services like [Diawi](https://www.diawi.com/), Firebase App Distribution, or Microsoft AppCenter
- Share the installation link with testers

**App Store builds:**
- Upload using Transporter app (macOS App Store)
- Or use command line:
  ```bash
  xcrun altool --upload-app -f JDPeopleHub-*.ipa -t ios -u YOUR_APPLE_ID -p @keychain:APP_SPECIFIC_PASSWORD
  ```

### Troubleshooting

**"No matching provisioning profile found"**
- Run `fastlane match [type] --force` to regenerate profiles
- Ensure the bundle ID matches exactly: `com.jdsports.peoplehub`

**"Code signing error"**
- Verify `APPLE_TEAM_ID` is correct
- Check that certificates aren't expired in Apple Developer portal

**"Match repository access denied"**
- Regenerate the Personal Access Token
- Verify the base64 encoding is correct
- Ensure the token has `repo` scope

## 15) Environment variables

Commonly used variables (see `.env`):

- `DATABASE_URL`, `DATABASE_URL_NON_POOLING`
- `SECRET_KEY`, `CRON_SECRET`
- `NEXTAUTH_URL`, `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_MAINTENANCE`
- `ENABLE_INTERNAL_CRON`, `SESSION_CLEANUP_CRON`, `VOUCHER_CLEANUP_CRON`, `SECURITY_CLEANUP_CRON`, `EMPLOYEE_TERMINATE_CRON`
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `MAILGUN_SENDER_EMAIL`
- `EMAIL_LOGO_URL`
- `SFTP_HOST`, `SFTP_PORT`, `SFTP_USERNAME`, `SFTP_PASSWORD`, `SFTP_BASE_PATH`, `SFTP_MOCK_MODE`, `SFTP_SKIP_SYNCED_FILES`
- `DO_SPACES_ACCESS_KEY_ID`, `DO_SPACES_SECRET_ACCESS_KEY`, `DO_SPACES_REGION`, `DO_SPACES_BUCKET`, `DO_SPACES_ENDPOINT`, `DO_SPACES_CDN_URL`
- `DISABLE_MIDDLEWARE_RATE_LIMIT`, `LOAD_TEST_BYPASS_TOKEN`
- `LOAD_TEST_TARGET_BASE_URL`, `LOAD_TEST_RUN_ID`, `LOAD_TEST_SESSION_COUNT`, `LOAD_TEST_USE_EXISTING_SESSIONS`
- `MEMORY_MONITOR_INTERVAL_MIN`
- `CAPACITOR_SERVER_URL`

Notes:

- `SFTP_EXPORT_CRON` and `SFTP_SYNC_CRON` are currently fixed in code (`src/lib/backgroundScheduler.ts`) rather than env-configured.
- Script toggles used by one-off scripts: `CONFIRM`, `SKIP_SFTP`, `VERBOSE`.

> Keep secrets in `.env` and never commit them.

---

## 16) Operational scripts

Scripts in `scripts/` provide admin utilities such as:

- Full SFTP + imported-data reset (`clear-sftp-data.ts`)
- Employee reset for re-sync (`reset-employees-for-sftp-resync.ts`)
- Voucher cleanup and birthday visibility fix
- SFTP processed file unprocessing/cleanup
- Benefit category migration and voucher preset seeding
- Token reset and welcome-email flag reset
- iOS icon generation utility

Prisma CLI utilities are available via:

- `npm run db:generate`
- `npm run db:push`
- `npm run db:seed`
- `npm run db:studio`

> Some npm scripts currently reference files that do not exist; see `HANDOVER.md` section “Known gaps / cleanup items” before relying on all package scripts.

---

## 17) License

This project is proprietary to JD Sports Fashion Plc.

---

Built for JD Sports employees and HR administrators.
