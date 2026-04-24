# LockerWise — Phase 1 Grounded Plan

> **For any Claude Code / agentic session working in this repo: read this file first.**
> It is the single source of truth for Phase 1 scope, stack assumptions, decisions already made, execution order, and conventions. If something in this file contradicts an earlier message or a prior commit's language, **this file wins** and should be updated.

---

## 1. How to use this document

- Every new Claude Code session: read top-to-bottom before proposing any change.
- Before starting any task, confirm the item number (e.g. `A2.0`, `B5`) against §6 (scope) and §7 (order).
- When a task completes, update §13 (completion log) and mark the item ✅.
- When a decision is revised, update the relevant section and add a one-line note in §14 (decision log). Do not delete old decisions — strike through and date them.
- Do not preempt Phase 1.5 or Phase 2 work (§12). Flag it as out of scope in a PR description.

---

## 2. Project context

**Product:** LockerWise — a locker rental management SaaS for universities, K-12 schools, corporate offices, gyms, and coworking spaces.

**Current actors:** Admin, Staff, Public (unauthenticated). Locker holders (employees/students) do not log in — everything about them is entered by Staff.

**Strategic direction (high level):**
- Phase 1 (this plan): foundational schema, security, audit, workflow fixes on the existing Mongo stack.
- Phase 1.5 (planned, separate project): MongoDB → Postgres migration. Must happen before Phase 2.
- Phase 2: bulk operations (auto-assign, annual rollover), buildings/maps UI, holder self-service, payments, reporting. Targets the education segment.
- Phase 3: SSO, multi-tenancy, generalized rentals UI, i18n, enterprise integrations.

---

## 3. Stack (verified — do not re-assume)

| Layer | Reality | Notes |
|---|---|---|
| Frontend framework | **React 18 + Vite** (SPA) | **Not** Next.js. No App Router, no SSR, no `/app` dir. |
| Routing | All routes declared in `frontend/src/App.jsx` | No split router files. |
| Components | ~45 page-level components flat in `frontend/src/components/` + `ui/` primitives | |
| State | `AuthProvider`, `AdminProvider`, `LockerProvider`, `ThemeProvider`, `ShellMetaContext` | |
| Styling | Tailwind (`frontend/tailwind.config.js`) | |
| Backend | **Express 4** (single service, `backend/app.js`) | |
| ORM / DB | **MongoDB + Mongoose 8** | No Prisma, no Supabase, no SQL. |
| Auth | JWT in `localStorage`, Bearer token, `verifyUser.js` middleware, `TokenChecker.jsx` on frontend | No refresh tokens, no httpOnly cookies. |
| Scheduled jobs | 3× `node-cron` jobs in `app.js` | **Uses server-local TZ** — see C10. |
| Hosting | **Railway** (single service; Express serves `frontend/dist`) | Stray `frontend/vercel.json` — unused, candidate for removal. |
| Tests | **None exist.** No Jest, no Vitest, no `__tests__`, no test script. | Scaffolded in D0. |
| Migrations | **None exist.** Mongoose has no built-in migrations. | Tooling installed in A0. |

---

## 4. Decisions (locked for Phase 1)

1. **Database: MongoDB stays for Phase 1.** All SQL terminology in prior scope docs (tables, foreign keys, joins, enums) translates to Mongoose equivalents: collections, refs (ObjectId), `populate`/aggregation, string-enum validators, `migrate-mongo` scripts. Postgres migration is Phase 1.5, a separate project.
2. **Migration runner: `migrate-mongo`.** Installed and configured in A0. Every schema change goes through it. `migrations/` directory committed. An `npm run migrate:up` script runs pending migrations.
3. **Test framework: Vitest + Supertest.** Scaffolded in D0 *before* A1, with one example test per layer (controller, route, model). Every PR from A1 onward must include tests. Coverage target: 70% on modified files.
4. **PR batching (see §8).** Tightly-coupled items combine into single PRs. Solo-operator-friendly. ~15 PRs total instead of 24.
5. **A2.0 inserted:** Extract `Assignment` from the `Locker` document as a prerequisite. The current `Locker` model conflates inventory and active-rental state (embedded `employeeName`, `CostToEmployee`, `StartDate`, `EndDate`, etc.). A2.0 runs after A1, before A2. Blocks A2, A3, A4-for-assignments, C4, C5.
6. **Audit collection renamed `audit_events`** (not `audit_log`) to avoid confusion with the existing `History` collection. `History` = rental activity log, 3-month retention. `audit_events` = mutation trail of admin/staff actions. Separate collections, separate retention policies.
7. **A4 ships with a fallback shim.** New capability-check middleware; if the capability table is not populated for a role, fall back to the legacy role-string check. Routes migrate incrementally. Shim removed at end of A4.
8. **Cron job TZ cleanup = C10** (new item), runs after A1/A2 land.
9. **Feature flags required for:** A4 (capabilities), B5 (2FA), C3a (refresh tokens). Env-variable-driven for Phase 1; DB-backed flag system is a later improvement.
10. **Staging: new Railway service** + MongoDB Atlas free-tier cluster. Separate env vars. Part of D2.
11. **`PHASE1_GROUNDED_PLAN.md` (this file) is committed at repo root** and updated as Phase 1 progresses.

---

## 5. Conventions & constraints (every PR)

- **Branch per PR:** name as `phase1-<item>-<short-slug>` (e.g. `phase1-a1-hierarchy`). Never commit to `main` directly, **except** for these specific rubber-stamp items at the user's explicit direction:
  - **C9** (done) — dead-code removal.
  - **C3b** — form-draft persistence, localStorage only, no schema.
  - **C10** — cron job TZ cleanup, pure code edit.
  - **D2** — staging env config file, doc-centric.
  - **A5.1** — enforce required refs after A5, mechanical.
  - Doc-only updates to **D3** (API reference) that land outside another item's PR.

  All other items ship via a PR on their item branch.
- **Deep-review items** — these require line-by-line human review before merge regardless of size, and cannot be rubber-stamped: **A4** (capabilities), **B5** (TOTP 2FA), **B6+B7** (soft-delete + typed-confirm), **C3a** (refresh tokens).
- **Feature-flagged items** — **A4, B5, C3a** ship with their env flag defaulted to `false`. The user flips the flag to `true` manually after validating in prod; the agent never enables a flag.
- **One PR per item (or batched pair per §8).** Title format: `[A2.0] Extract Assignment from Locker`. PR body includes: files changed, migration commands to run, manual test steps, changelog line, open questions.
- **Two-step migrations.** Never drop a field/collection in the same migration that removes references. Pattern: add new → migrate data → deploy → remove old in a later migration.
- **Every new collection gets** `_id`, `createdAt`, `updatedAt`, `deletedAt` (for soft-delete) — use Mongoose `timestamps: true`.
- **Money** stored as integers in the smallest currency unit (cents/paise).
- **Timestamps** stored as UTC. Display conversion is a frontend concern.
- **Never log** passwords, full JWTs, OTP secrets, 2FA secrets. Truncate tokens to first 8 chars in logs.
- **Before any destructive change** (drop collection, remove field, change API shape, install a paid third-party service, install a >5MB dependency): propose in the PR description and wait for approval.
- **No silent refactors of unrelated code.** If a change surfaces a separate issue, file it as a follow-up, don't fold it in.
- **Tests accompany every PR from A1 onward.** No "I'll add tests later."
- **API changes update the API reference (D3) in the same PR.** Not deferred.

---

## 6. Phase 1 scope

### Group A — Schema & architecture

| ID | Item | Depends on | Feature flag |
|---|---|---|---|
| **A0** | Install `migrate-mongo`, commit `migrations/` folder, add `npm run migrate:up` / `:down` / `:status` scripts | — | No |
| **A1** | Building → Floor/Wing → Zone → Locker hierarchy. Drop global unique index on `lockerNumber`; replace with compound unique on `(building_id, lockerNumber)`. Migrate existing lockers into a default Building/Floor. | A0 | No |
| **A2.0** | **(NEW)** Extract `Assignment` collection from `Locker` document. Move `employeeName`, `employeeEmail`, `CostToEmployee`, `Duration`, `StartDate`, `EndDate`, `expiresOn` off `Locker`. Leave a transitional read path during migration. | A0 | No |
| **A2** | Create `Holder` collection (id, name, email, phone, externalId, metadata). Replace free-text holder fields on `Assignment` with `holderId` ref. Dedupe by email — watch for collisions with existing `User` emails (different collection, but keep logically distinct). | A2.0 | No |
| **A3** | Shared lockers: many-to-many `Holder` ↔ `Assignment`. One active Assignment can have multiple Holders. | A2 | No |
| **A4** | Capability-based permissions. New collections: `capabilities`, `role_capabilities`. Seed with current Admin / Staff capability sets. New `requireCapability(cap)` middleware. Fallback shim to legacy `verifyToken([roles])` during rollout. Migrate routes incrementally. Remove shim at end. | A2.0 | **Yes** |
| **A5** | Generalize `Locker` → `RentableAsset` via Mongoose discriminators. `assetType` enum: `locker` (only type in Phase 1), placeholder shape for `lock`/`equipment`/`parking`/`room`. **No UI for other types in Phase 1.** | A1, A2.0 | No |
| **A5.1** | **(NEW)** Enforce required `buildingId` and `floorId` on the Locker/RentableAsset schema. Update all Locker-creation sites in controllers to set refs explicitly. Remove the A1-transitional pre-save `console.warn`. Rubber-stamp per §5 — mechanical, no user-facing change. | A5 | No |

### Group B — Security & audit

| ID | Item | Depends on | Feature flag |
|---|---|---|---|
| **B1** | `audit_events` collection: `actorId, actorRole, action, entityType, entityId, beforeJson, afterJson, ipAddress, userAgent, createdAt`. Middleware writes on all mutations. | A4 | No |
| **B2** | Audit viewer UI — three tabs (By Staff / By Admin / Per Asset), all reading from `audit_events` with different filters. Admin-only. | B1 | No |
| **B3** | `login_events` collection. Log IP, best-effort geo (via IP lookup service — pick one, document it), user-agent on all login attempts (success + failure). | — | No |
| **B4** | Rate limiting on `/user/login`: 5 attempts per 15 min per IP, exponential backoff, account lockout after 10 failed attempts in 1 hour. Use `express-rate-limit` + a store. | B3 | No |
| **B5** | TOTP-based 2FA. **Before starting: read `models/OTP.js` and decide if it is reusable or if 2FA gets its own collection (`totp_secrets`).** Required for Admin, optional for Staff. Use `otplib`. Encrypt stored secret. | A4 | **Yes** |
| **B6** | Soft-delete via `deletedAt` column on `Locker` (→ `RentableAsset` after A5), `Holder`, `User` (staff), `Issue`, `Assignment`. Global query filter `{ deletedAt: null }` by default. 30-day restore admin UI. **Also converts all unique indexes introduced in A1 (`buildings.name`, `floors.(buildingId, name)`, `zones.(floorId, name)`, `lockers.(buildingId, LockerNumber)`) to use `partialFilterExpression: { deletedAt: null }` so soft-deleted rows do not block new inserts with the same natural key.** | A1, A2.0, A2 | No |
| **B7** | Typed-confirm UI pattern on destructive actions: user types the entity identifier or `DELETE` before the button enables. Applies to delete locker, bulk ops, clear history. | B6 | No |

### Group C — Workflow fixes

| ID | Item | Depends on | Feature flag |
|---|---|---|---|
| **C9** | Delete `/testing` route and `Testing.jsx`. Remove from sidebar and any references. | — | No |
| **C1** | Unify Reset + Cancel into `POST /asset/returnAsset` with `rotateCombination: boolean` flag. Update both frontend flows. Deprecate old endpoints with a grace period. | A2.0 | No |
| **C2** | Split `/locker_management` (ledger, read-heavy, both roles) from `/locker_operations` (task flows — assign/renew/cancel, Staff only). Move toolbar actions off the ledger. | C1 | No |
| **C3a** | Refresh-token flow: short-lived access token (15 min) + long-lived refresh token (7 days, httpOnly cookie). Silent re-auth on 401. | — | **Yes** |
| **C3b** | Form-draft persistence: save in-progress form state to `localStorage` keyed by route. Restore on mount. Clear on submit or explicit discard. | — | No |
| **C4** | Price snapshot on `Assignment`. At renewal, show both original and current price; Staff picks which applies. Default-behavior setting. | A2.0 | No |
| **C5** | Soft-reservation on locker pick. When Staff selects a locker in `/available_lockers`, mark `reservedBySessionId` with 5-min TTL. Release on submit/cancel/timeout/logout. | A2.0, A1 | No |
| **C6** | Holder lookup before new assignment. Search by email/externalId. Match → prefill + confirm. No match → create new `Holder`. | A2 | No |
| **C7** | Convert `Issue.comment` (single string) to `issue_comments` append-only collection: `issueId, authorId, body, createdAt`. Thread UI. Deprecate `PUT /issue/updateComment` (don't silently rewrite it). | — | No |
| **C8** | Email notifications on issue status transitions (In Action, Resolved). Use existing mail sender. | C7 | No |
| **C10** | **(NEW)** Cron job TZ audit. Existing jobs use `new Date().setHours(0,0,0,0)` — operates in server-local TZ, not UTC. Rewrite to explicit UTC. | A1, A2 | No |

### Group D — Quality & ops (cross-cutting)

| ID | Item | Depends on | Feature flag |
|---|---|---|---|
| **D0** | Scaffold Vitest + Supertest. One example test per layer (controller, route, model). `npm test` script. CI config stub. | — | No |
| **D0.5** | Scaffold frontend tests (Vitest + jsdom + Testing Library). Deferred from D0 — starts immediately before whichever of C2 or C7 begins first. | D0 | No |
| **D2** | Staging environment: new Railway service + MongoDB Atlas free-tier cluster. Separate env vars file. Document in `README.md`. | — | No |
| **D3** | API documentation — OpenAPI spec or Markdown reference. **Written as each endpoint lands, not deferred.** Each PR touching an endpoint updates D3. | continuous | No |
| **D1** | Enforce 70% coverage target on modified files via CI check. | D0 + all tests from each PR | No |

---

## 7. Execution order

```
D0  →  A0  →  C9  →  A1 ∥ A2.0  →  A2 + A3  →  A4  →
B1  →  B2  →  B3 + B4  →  B5  →  B6 + B7  →
C1 + C2  →  C3a  →  C4  →  C5  →  C6  →  C7 + C8  →
A5  →  A5.1  →  C3b  →  C10  →  D2  →  D1
```

- `D3` runs continuously, woven into every endpoint-touching PR.
- `∥` = can run in parallel on separate branches; they don't block each other.
- `A5` is deliberately last in Group A — highest blast radius (rename storm), zero Phase-1 UI impact, gated by all preceding schema work so we only rename once.

---

## 8. PR batching

| Batched PR | Reason |
|---|---|
| **A2 + A3** | Shared migration; M2M depends on `Holder` existing. |
| **B3 + B4** | Both modify login flow in `authController`. |
| **B6 + B7** | Typed-confirm is the UI layer on top of soft-delete. |
| **C1 + C2** | Split follows unify; touches the same operation surface. |
| **C7 + C8** | Thread model + status emails both mutate issue flow. |

All other items are one-item-one-PR. `B5`, `C3a`, `C3b` stay separate (isolated blast radius).

---

## 9. Feature-flagged items

All three ship behind environment-variable flags. Deploy with flag off → enable for own account → enable for pilot client → enable globally. Rollback = flip flag off, no redeploy.

| Item | Env var | Default |
|---|---|---|
| A4 — capability permissions | `FEATURE_CAPABILITY_AUTH` | `false` |
| B5 — 2FA | `FEATURE_2FA` | `false` |
| C3a — refresh tokens | `FEATURE_REFRESH_TOKENS` | `false` |

When any of these is `false`, the legacy path must still work. Flag removal happens in a dedicated cleanup PR after stable rollout.

---

## 10. Per-task workflow

1. User says "start <item>" (e.g. "start A2.0").
2. Agent reads this file. Confirms item is next per §7 or explains why a different order is justified.
3. Agent inspects the current code relevant to the item.
4. Agent proposes a plan: schema changes, files to modify, migration approach, test plan, rollback strategy. **Agent waits for approval before writing code.**
5. On approval: implement, write tests, update API docs (§6 D3), open PR in the correct group branch.
6. PR description includes: files changed, migration commands, manual test steps, changelog line, open questions.
7. On merge: update §13 (completion log) with the item marked ✅, date, and PR link.

**Agent must ask before:**
- Dropping any collection, field, or index.
- Changing a public API response shape.
- Installing a paid third-party service.
- Installing a dependency larger than ~5MB.
- Rewriting code outside the item's stated scope.

---

## 11. Items to verify mid-flight

- **Before B5:** read `backend/models/OTP.js`. Decide: reuse for 2FA or create separate `totp_secrets` collection? Document decision in the B5 PR.
- **Before A2:** confirm no email collisions between `Holder` (new) and `User` (existing Admin/Staff accounts). They are logically distinct but share email as an identifier — worth an explicit check.
- **Before A4:** enumerate every `verifyToken([...])` call and every `<ProtectedRoutes allowedRoles="...">` in the codebase. The migration surface is the list.
- **Before C1:** confirm both Reset and Cancel currently hit `POST /locker/cancelLocker`. If the backend already has divergent behavior, unifying the endpoint is riskier than the spec suggests.
- **Before C3a:** audit every frontend `axios` (or `fetch`) call site. Refresh-token silent re-auth needs a single interceptor, not N patched callsites.
- **During A5:** watch for any code path that assumes `Locker` by name (controller names, route names, collection name in queries). Discriminator model keeps Mongoose happy but doesn't rename existing code.

---

## 12. Out of Phase 1 — do not preempt

These belong to Phase 1.5, Phase 2, or Phase 3. If an agent sees a natural place to add one while doing Phase 1 work, **file it as a follow-up issue, don't fold it in.**

- Postgres migration (Phase 1.5)
- Auto-assign / bulk-assign / annual rollover (Phase 2)
- Maps upload + pin placement UI (Phase 2)
- Holder self-service portal / magic-link login (Phase 2)
- Stripe / payments (Phase 2)
- Printable reports / Avery labels (Phase 2)
- Bulk notifications to holders (Phase 2)
- SSO / SCIM (Phase 3)
- Multi-tenancy (Phase 3)
- Non-locker rental types UI (Phase 3 — schema placeholder only in A5)
- i18n beyond infrastructure (Phase 3)
- Access-card / smart-device integrations (Phase 3+)

---

## 13. Completion log

Update as items merge.

| ID | Status | PR | Date | Notes |
|---|---|---|---|---|
| D0 | ✅ | #1 | 2026-04-24 | Merged to main |
| D0.5 | ☐ | — | — | Deferred — starts before C2 or C7 |
| A0 | ✅ | #2 | 2026-04-24 | Merged to main |
| C9 | ✅ | direct-to-main | 2026-04-24 | Rubber-stamp per §5 carve-out; also folded in `verify:migrations` npm alias |
| A1 | 🔄 in-progress | (PR link TBD) | 2026-04-24 | Branch `phase1-a1-hierarchy` |
| A2.0 | ☐ | — | — | — |
| A2+A3 | ☐ | — | — | — |
| A4 | ☐ | — | — | Fallback shim; feature flag |
| B1 | ☐ | — | — | — |
| B2 | ☐ | — | — | — |
| B3+B4 | ☐ | — | — | — |
| B5 | ☐ | — | — | Feature flag; check OTP.js reuse |
| B6+B7 | ☐ | — | — | — |
| C1+C2 | ☐ | — | — | — |
| C3a | ☐ | — | — | Feature flag |
| C4 | ☐ | — | — | — |
| C5 | ☐ | — | — | — |
| C6 | ☐ | — | — | — |
| C7+C8 | ☐ | — | — | — |
| A5 | ☐ | — | — | — |
| A5.1 | ☐ | — | — | Enforce required `buildingId`/`floorId`; rubber-stamp after A5 |
| C3b | ☐ | — | — | — |
| C10 | ☐ | — | — | — |
| D2 | ☐ | — | — | — |
| D1 | ☐ | — | — | — |
| D3 | continuous | — | — | Every endpoint PR |

---

## 14. Decision log

| Date | Decision | Rationale |
|---|---|---|
| 2026-04-24 | Stay on MongoDB for Phase 1; Postgres is Phase 1.5 | Mid-Phase-1 DB migration doubles scope and risks data loss. Phase 2 is the pain threshold. |
| 2026-04-24 | `migrate-mongo` as migration runner | Standard, maintained, matches Mongoose stack. |
| 2026-04-24 | Vitest + Supertest, not Jest | Matches Vite frontend, shares config, faster. |
| 2026-04-24 | Batch ~15 PRs, not strict 24 | Solo-operator review load; tightly-coupled items share migrations. |
| 2026-04-24 | Insert A2.0 (extract Assignment) before A2 | Locker model conflates inventory + rental state; without extraction, A2/A3/A4/C4/C5 re-touch same fields. |
| 2026-04-24 | Rename audit collection to `audit_events` | Avoid namespace collision with existing `History` collection (different purpose, different retention). |
| 2026-04-24 | A4 ships with role-string fallback shim | Replacing every `verifyToken([...])` at once is too wide; incremental with shim is safer. |
| 2026-04-24 | Add C10 (cron TZ audit) | Existing jobs use server-local time despite claiming UTC; UTC-everywhere rule requires fix. |
| 2026-04-24 | Feature-flag A4, B5, C3a | High-blast-radius auth and permission changes need kill-switch rollback. |
| 2026-04-24 | Staging = new Railway service + Atlas free tier | No staging exists today; cheapest insurance against prod outages. |
| 2026-04-24 | D0: Option A — split `app.js` into `createApp.js` (pure factory) + `server.js` (bootstrap: `dbConnect`, cron, `listen`) | Option B (mocking cron/dbConnect) gets fragile per side effect added; factory pattern is the long-term shape and ~5 lines of config. |
| 2026-04-24 | D0: Husky pre-push hook runs `npm test` from repo root | Single hook, single script invocation. Installed at root because `.git` is at repo root in this monorepo. |
| 2026-04-24 | D0.5 added — frontend test scaffold deferred until before C2 or C7 | A1–A4 are backend-only; scaffolding jsdom + Testing Library before they're needed is YAGNI. |
| 2026-04-24 | Branch-per-PR replaces branch-per-group (§5) — name as `phase1-<item>-<short-slug>` | Group-scoped branches don't match GitHub's one-branch-one-PR flow; item-scoped branches rebase cleanly and each PR has an unambiguous home. |
| 2026-04-24 | A0: migrations verified against `mongodb-memory-server` via `backend/scripts/verifyMigrations.js`, never prod | Memory-server works on any machine including CI, needs no local Mongo install, and eliminates the "accidentally wrote to prod's `migrations_changelog`" footgun. Reused by every Phase 1 migration PR. |
| 2026-04-24 | §5 rubber-stamp carve-out: trivial items (C9, doc-only D3) may push direct to main at user's direction | Full PR + branch + review overhead for a 5-line dead-code removal is ceremony without value. Schema/auth/security/infra always stay on the PR path — this carve-out is narrow by design. |
| 2026-04-24 | `npm run verify:migrations` is the canonical verification invocation (replaces raw `node scripts/verifyMigrations.js`) | Single source of truth; survives path changes; discoverable via `npm run` listing. README and all future migration PRs reference the npm script form. |
| 2026-04-24 | §5 tightened — rubber-stamp items enumerated by ID (C3b, C10, D2, A5.1, doc-only D3); deep-review items named (A4, B5, B6+B7, C3a); feature flags (A4, B5, C3a) default false, user flips manually | Vibes-based "rubber-stamp tier" was ambiguous; explicit lists prevent drift; deep-review naming ensures auth/permission/soft-delete changes never get fast-tracked. |
| 2026-04-24 | A5.1 added — enforce required `buildingId`/`floorId` on Locker once A5 lands, plus update creation sites | A1 makes refs optional to avoid pulling every Locker-creation controller into this PR; A5.1 closes the loop mechanically after A5's rename settles. |
| 2026-04-24 | B6 scope extended — convert all A1 unique indexes to `partialFilterExpression: { deletedAt: null }` | Soft-deleted rows holding a unique natural key (e.g. a disabled Building's name) would otherwise block new inserts with the same name; B6 is the right place since it owns soft-delete semantics. |

---

## 15. References

- Prior Phase 1 scope (SQL-flavored, superseded by this file): initial setup prompt.
- Phase 2 / Phase 3 feature lists: roadmap docs (not in repo).
- Competitor feature parity notes: roadmap docs (not in repo).
