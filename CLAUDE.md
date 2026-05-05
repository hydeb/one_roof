# CLAUDE.md

> Repository guide for Claude Code. Read this file at the start of every session before touching code.

## 1. What this project is

**One Roof Homes — a General Contractor operating in Savannah, GA.** One Roof IS the contractor. The customer calls one number, gets one estimate, signs one agreement, pays one invoice. Behind the scenes, an internal flat-fee subcontractor roster covers trades the operator doesn't self-perform. Subcontractors are never customer-facing.

This is the **Phase 1-2** product. The Phase 3+ target is the two-sided marketplace described in PRD v1.1 — Branded program, public profiles, Stripe Connect, customer subscriptions — but that is not what we are building today.

**Why the GC pivot:** matches operational reality (the Savannah operator already runs this model), eliminates marketplace cold-start, lower disintermediation risk (customer never has the subcontractor's contact), 30% GC margin from day one, sharper brand pitch.

**Customer-facing pitch (Phase 1):** *"One call. One team. One Roof. We handle it."*
**Tagline (preserved from v1.1, used Phase 1 → forever):** *"Big enough to handle it. Small enough to care."*
**Phone:** 912-521-5676

**Sister product:** Home Doctor (separate repo at `/Users/brianhyde/homedoctor/`). Home Doctor predicts and schedules; One Roof Homes executes and reports back. Cross-product integration is over deployed APIs + an Inngest event bus, **not shared source**.

**Primary consumers of this codebase:** EngSec engineering team (currently: Brian + Claude Code).

## 2. Canonical specification

The spec is the authoritative source of truth. If the spec and this file ever disagree, the spec wins and this file gets corrected.

Specs live at [`docs/spec/`](./docs/spec/README.md). Read that README first — it has the full canonical reading order and the conflict-resolution rules. Short version:

1. `ONE_ROOF_HOMES_PRD_v1.1.md` — base spec
2. `ONE_ROOF_HOMES_PRD_v1.2_Addendum_A.md` — **DOMINANT for Phase 1-2.** Pivots us from marketplace to GC operating model. Its §0 precedence table enumerates exactly which v1.1 sections it overrides.
3. `ONE_ROOF_HOMES_PRD_v1.3_Addendum_B_Subcontractor_Agreement.md`
4. `ONE_ROOF_HOMES_PRD_v1.4_Addendum_C.md` — long-term strategy, Branded graduation path
5. `ONE_ROOF_HOMES_Drizzle_Schema_Phase1.md` — build target for the database
6. `ONE_ROOF_HOMES_Phase1_Sprint_Plan.md` — milestone roadmap

The most important sections to internalize for Phase 1-2 work:
- **Addendum A §0** (precedence table) — which v1.1 sections still apply and which are overridden
- **Addendum A §2** (Phase 1 service scope) — six service buckets, pricing bands, target margins, seeded in `packages/trades/savannah_phase1.ts`
- **Addendum A §3** (operating model) — operator, subcontractor, customer flow; §3.4 simplifies anti-disintermediation for Phase 1
- **Addendum A §6** (entity model) — unified `job` entity with `pipeline_stage`; replaces v1.1's separate `service_request`/`quote`/`job`
- **v1.1 §10 + §10.4** — anti-disintermediation as design constraint (still applies, simplified for Phase 1)
- **v1.1 §14** — security and compliance baseline (still applies in full)

**Read v1.1 §8 (Branded program), §9 (marketplace economics), §11 (Home Doctor integration), §12.4 (11-role list), §18.2 (hierarchical taxonomy) as Phase 3+ targets.** Do not build from them in Phase 1-2.

## 3. Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | Next.js 15 (App Router), React 19, Tailwind v4, shadcn/ui | `typedRoutes: true` — every `<Link href>` must resolve to a real route |
| Mutations | Server Actions preferred; REST `/api/v1/*` when needed for SMS callbacks / partner parity | |
| Data fetching | Server components for reads; TanStack Query on client where interactivity requires it | |
| DB | Neon Postgres, branching per feature | |
| ORM | Drizzle ORM + drizzle-kit | Migrations in `packages/db/migrations` |
| Auth | Auth.js v5 — magic link primary, Google + Apple OAuth, WebAuthn for the operator | TOTP MFA for admin; resource-token magic links for customer document access (no account required) |
| Payments | **Stripe Billing** (Phase 1) | Stripe Connect activates Phase 3 for Branded payouts |
| Background jobs | Inngest | Cron + event-driven; outbox pattern for cross-product events |
| File storage | Vercel Blob | Photos re-encoded server-side, EXIF stripped |
| Real-time | Pusher Channels (when added) | Per-user and per-job scoped channels |
| Search | Postgres FTS + trigram + earthdistance | |
| Email | Resend | Documents (PDFs), magic-link delivery |
| SMS | Twilio | Phase-1 default for short-form customer comms — *SMS-first, not SMS-only* |
| Maps | Mapbox | |
| Background checks | Checkr (FCRA-compliant) | Subcontractor onboarding |
| Observability | Sentry + Vercel Analytics + PostHog | |

Deploy target: Vercel. Neon branches map to Vercel preview deployments.

## 4. Monorepo layout

pnpm workspaces (not Turborepo — mirrors Home Doctor's pattern; supersedes Addendum A §7's residual v1.1 wording).

```
apps/
  web/                       # Next.js — operator console + customer document views + admin
    src/
      app/
        (marketing)/         # public site (landing, /for-pros, about, privacy, terms)
        (auth)/              # operator + admin sign in (no customer signup in Phase 1)
        (operator)/          # operator console — daily driver
        (customer)/          # quote/invoice views via resource token (no account)
        (admin)/             # /admin/* — role-gated
        api/v1/              # REST endpoints (Twilio webhooks, Stripe webhooks, Inngest)
      lib/                   # auth guard, server-side helpers
      components/            # app-specific components
    middleware.ts            # role enforcement + tenancy

packages/
  db/                        # Drizzle schema + migrations + seed
  shared/                    # zod schemas, TS types, domain constants
  ui/                        # shared component library (shadcn-based)
  auth/                      # Auth.js v5 config, role-grant logic, resource-token helpers
  trades/                    # Savannah Phase 1 taxonomy + pricing seed
  # added in later milestones as needed:
  # payments/                # Stripe Billing helpers (Phase 1); Connect added Phase 3
  # notifications/           # Resend / Twilio abstractions
  # events/                  # Cross-product event bus contracts
```

Customer-facing surfaces in Phase 1 are minimal by design: a customer interacts with One Roof primarily by phone, SMS, and email. The web surface is an operator console plus token-gated quote/invoice views. **No customer signup in Phase 1.**

## 5. Running locally

```bash
# Prereqs: Node 20+, pnpm, Docker (for Postgres in dev), Inngest CLI (when added)
pnpm install
pnpm db:setup             # spins up local Postgres on :5433, runs migrations
pnpm dev                  # Next.js
```

Local Postgres listens on **port 5433** (5432 is reserved for Home Doctor's dev DB if both run concurrently).

Environment variables documented in `.env.example`. Secrets never commit.

## 6. Tenant scoping — USE IT ON EVERY QUERY (when added in Milestone 2)

Every table holding customer data has a `household_id` (or `portfolio_id` for property-manager scope) or a traceable ancestor to one. Every query touching customer data must be scoped to the authenticated principal's allowed scope.

Canonical helper: `packages/db/src/scope.ts` → `withHouseholdScope(db, householdId)`.

Belt-and-suspenders: every tenant table will have a before-insert trigger (`assert_household_scope`) that verifies `household_id` matches `current_setting('app.household_id')`. If that throws, you forgot to wrap the write in `withHouseholdScope()`. Mirrors Home Doctor's pattern exactly.

## 7. Role guard — USE IT ON EVERY ROUTE (when added in Milestone 3)

Canonical helper: `apps/web/src/lib/auth/guard.ts` → `requireScope(request, options)`.

Default deny. No route is public unless it's in the `(marketing)` segment, on a `(customer)` resource-token route, or explicitly flagged `public: true`.

**Phase 1 roles** (Addendum A §3.3 — narrow set):

```
customer        # operator-created; user_id nullable; accesses documents via resource tokens
operator        # the human running the show; full read/write across all jobs
subcontractor   # internal roster member; read-only on customer PII (Addendum A §3.4)
admin           # EngSec staff; vetting, dispute, audit
```

A user may hold multiple roles simultaneously; context switching is a UI concern, not a session concern. The 11-role list from v1.1 §12.4 (independent / branded / master / company member / property manager / brand-vetting / etc.) activates in **Phase 3** when the marketplace surface lights up.

## 8. Resource tokens — for customer document access without an account

Customers do not log in in Phase 1. They receive estimates and invoices via SMS or email, each containing a signed magic link to a server-rendered view scoped to that single resource (one quote, one invoice).

Canonical helper: `packages/auth/resource_tokens.ts` (Milestone 2). Stored in the Auth.js `verification_token` table, 24-48hr expiry, every issuance and redemption written to `audit_log`.

This is how anti-disintermediation interacts with Phase 1 UX: the customer never gets a portal that exposes other contacts or other contractors — just the one document they were sent.

## 9. Encryption envelope — USE IT FOR RESTRICTED FIELDS

Restricted fields (subcontractor license numbers, partial SSN if held, banking metadata beyond what Stripe holds) are envelope-encrypted at rest. Pattern mirrors Home Doctor's `packages/shared/src/crypto/envelope.ts` exactly.

PII minimization: prefer vendor-held identity (Stripe Identity, Checkr) over storing on our side.

## 10. Anti-disintermediation as a design constraint

This is the strategic crux of the product (PRD v1.1 §10). **In Phase 1 the framework simplifies dramatically** (Addendum A §3.4): the customer transacts only with One Roof, never sees the subcontractor's identity, and the subcontractor wears One Roof apparel and leaves One Roof leave-behinds with no personal cards. There is no marketplace surface to leak from.

The structural defenses still in scope for Phase 1:
- **Single point of contact** — customer's phone book has one number (912-521-5676), not five
- **Single brand on the truck** — subcontractors wear One Roof apparel; no personal trade cards
- **Single contract** — customer signs a One Roof agreement; subcontractor signs a separate One Roof subcontractor agreement (Addendum B); the two never reference each other
- **Liability shifting** — One Roof carries the warranty and the dispute coverage; subcontractor recourse is through One Roof, not through the customer

Phase 3+ activates the full v1.1 §10.4 framework (12-month cooling-off, Soft → Egregious tiered responses, repeat-rate cohort detection). Build hooks for it; don't build the surface yet.

## 11. Inclusive household UX

Per Home Doctor's CLAUDE.md §23 (Addendum M §138), customer-facing UI is designed for households as multi-person entities from MVP onward. The eight principles apply equally to One Roof and will be carried into the customer surface when household features land. Summary:

1. Onboarding is multi-person from minute one.
2. No "primary user" or "owner" framing in customer-facing UI (internal `household_role` exists for permissions only).
3. Activity attribution is by name, not role.
4. Approval flows route to all eligible household members in parallel.
5. Notification preferences are per-person, not per-household.
6. No gendered defaults in copy.
7. Permissions framed as symmetrical capabilities.
8. Onboarding-completion patterns acknowledge shared work.

## 12. Coding style

- TypeScript strict everywhere. No `any` without an ESLint-disable comment explaining why.
- Functions over classes. Pure where possible.
- Zod schemas at every I/O boundary (HTTP, DB, Stripe webhook, Twilio webhook, external integrations). Parse, don't assume.
- Errors propagate as typed `Result` or throw — pick one per subsystem and be consistent.
- Prefer Server Components; add `'use client'` only when interactivity demands it.
- Never use localStorage/sessionStorage in user-facing code — Auth.js handles session, component state handles the rest.
- Imports use the `@/…` path alias for cross-package references; relative only within a file's own directory.

## 13. Security baseline — non-negotiable

- TLS everywhere. HSTS with preload in production.
- Argon2id for password hashing (if/when password auth is added; magic link + OAuth + passkeys preferred).
- TOTP MFA enforced for admin roles; MFA required for the operator role.
- Rate limit auth, webhook, resource-token, and AI endpoints at the edge middleware.
- CSRF double-submit on cookie-authenticated mutations.
- File uploads: MIME sniffing + extension enforcement, virus scan, server-side re-encode, EXIF strip.
- Secrets via environment only, per-environment. No secrets in source, no secrets in commit messages.
- Every admin sensitive read writes `audit_log`. Step-up reauth within 5 minutes for PII reveal.
- Resource-token issuance and redemption always written to `audit_log`.

## 14. Working with specs

When starting a new feature:

1. Locate the relevant spec section(s) — start with Addendum A's §0 precedence table for Phase 1-2 work. Note the spec version and section numbers in the PR description.
2. If the spec is ambiguous, resolve with a short ADR in `docs/adr/` before building.
3. If the spec is wrong, propose a spec amendment in the same PR that fixes the code.
4. Never build beyond the current phase without an ADR. Scope creep is how MVPs die. The Phase 1 launch criterion is *one week of real Savannah ops with 5+ jobs in the pipeline* — every line of code should serve that.

## 15. What I (Brian) care about

- Honest tradeoff analysis over hedged recommendations.
- Security baked in, not bolted on — the platform's credibility is partially EngSec's credibility.
- Cost-conscious choices; prefer self-hosted or OSS where it doesn't compromise quality.
- Short, clear code > clever code. Future-me and Claude Code both have to read it.
- Push back when you think I'm wrong. Flag risks explicitly. Surface the unsexy work (audit logs, migration safety, test coverage) as first-class.

## 16. Current phase

**Phase 0 → Phase 1 transition.** Per `docs/spec/ONE_ROOF_HOMES_Phase1_Sprint_Plan.md`.

Done (Milestone 1 — committed):
- pnpm-workspaces monorepo skeleton (`apps/web`, `packages/{db,shared,ui,auth}`)
- Next.js 15 + React 19 + Tailwind v4 scaffolding with `typedRoutes: true`
- Marketing landing page (GC pitch), `/for-pros` subcontractor recruitment, about/privacy/terms stubs
- CLAUDE.md, .env.example, docker-compose for local Postgres on :5433
- Full spec set under `docs/spec/`

In progress (Milestone 2):
- Drizzle schema per `docs/spec/ONE_ROOF_HOMES_Drizzle_Schema_Phase1.md`: `packages/db/schema/{identity,property,job,customer,subcontractor}.ts`
- `withHouseholdScope` tenant helper + `assert_household_scope` triggers
- `requireScope` role guard
- Append-only `audit_log` table
- `packages/auth/resource_tokens.ts` — signed magic-link tokens for customer quote/invoice access via `verification_token` table

Up next (Milestones 3-8):
- Auth.js v5 wiring (operator + admin magic link via Resend)
- Operator console: pipeline view, daily priorities, follow-up reminders
- Quote builder + estimate PDF (Resend delivery)
- Job/invoice + Stripe Billing
- Subcontractor roster + dispatch + payout ledger
- Twilio SMS — outbound short-form, inbound webhook, conversation thread

Phase 1 launch criterion: **1 week of real Savannah ops, 5+ jobs in the pipeline.**

Explicitly **out of scope until Phase 3+**:
- Public contractor directory (`/contractors`)
- Customer self-signup
- Branded certification program (Verified → Branded → Master tiers)
- Brand kit fulfillment
- Contractor public profiles
- Stripe Connect (replaced by Stripe Billing in Phase 1)
- Customer subscriptions
- 11-role RBAC matrix from v1.1 §12.4
- Hierarchical trade taxonomy from v1.1 §18.2 (Phase 1 uses the 6-bucket Savannah seed)
- Property Manager portfolio dashboard, tenant portal, recurring contracts (Phase 4)
- Customer Expo native app (Phase 4 dev → Phase 5 ship)
- Home Doctor deep integration — event bus, warranty sync, sensor-triggered claims (Milestone 9 / Phase 5; cross-product Addendum N)

## 17. Session checklist

Before starting work in a Claude Code session:

- [ ] Pull latest.
- [ ] Read the PR description and linked spec section.
- [ ] Check `docs/adr/` for recent decisions affecting the area you're touching.
- [ ] Run tests locally once to confirm green baseline.
- [ ] If touching a migration, branch Neon.

After finishing work:

- [ ] All tests green (including authz matrix when it exists).
- [ ] `drizzle-kit check` clean (when DB is wired).
- [ ] No `any`, no `// TODO` without an issue link, no commented-out code.
- [ ] Security-relevant changes noted in PR description.
- [ ] Spec references cited in PR description (cite Addendum A section numbers explicitly when relevant).

---

*Keep this file current. When the codebase evolves past what's described here, update this file in the same PR that makes the change.*
