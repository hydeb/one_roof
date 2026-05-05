# CLAUDE.md

> Repository guide for Claude Code. Read this file at the start of every session before touching code.

## 1. What this project is

One Roof Homes is a two-sided home services marketplace and trades professional network. Homeowners get a vetted pool of contractors and a complete home maintenance record; contractors get the back office (lead gen, scheduling, invoicing, bookkeeping, 1099s, insurance, dispute handling) and a brand they can carry on the truck.

**Positioning:** End-to-End Home Services Marketplace & Trades Network. Not a lead-resale marketplace (Angi/HomeAdvisor). Not a thin booking layer (Thumbtack). Closer to a *franchise network without the franchise capital requirement*.

**Brand promise (both sides simultaneously):**
- *"That's a One Roof plumber"* — said by a homeowner. Means vetted, insured, on-time, fair price, platform stands behind it.
- *"That's a One Roof customer"* — said by a contractor. Means scope is documented, payment is guaranteed, expectations are realistic.

**Tagline:** *Big enough to handle it. Small enough to care.*

**Sister product:** Home Doctor (separate repo at `/Users/brianhyde/homedoctor/`). Home Doctor predicts and schedules; One Roof Homes executes and reports back. Cross-product integration is over deployed APIs + an Inngest event bus, not shared source.

**Primary consumers of this codebase:** EngSec engineering team (currently: Brian + Claude Code).

## 2. Canonical specification

The product specification is the **authoritative source of truth**. If the spec and this file ever disagree, the spec wins and this file gets corrected.

Specs live in the repo root:

1. `ONE_ROOF_HOMES_PRD_v1.0.md` — original PRD
2. `ONE_ROOF_HOMES_PRD_v1.1.md` — **current canonical version**; resolves the v1.0 open questions in §17 (Savannah pilot, take rates, brand-kit economics, dispute caps, mobile sequencing, etc.) and adds §10.4 enforcement framework

When spec sections conflict, v1.1 supersedes v1.0.

The most important sections to internalize:
- **§10 Anti-Disintermediation Strategy** (and §10.4 Enforcement Framework) — the most important strategic section. Every feature should be evaluated against: *does this make it harder or easier for the relationship to leak off-platform?*
- **§8 Branded Certification Program** — Verified → Branded → Master tiers, eligibility, revocation
- **§9 Marketplace Economics** — take rates, customer pricing, property-manager pricing, satisfaction guarantee
- **§11 Home Doctor Integration** — division of responsibility table, service handoff deep links
- **§12 Technical Architecture** — stack, route layout, RBAC roles
- **§13 Data Model** — entity catalog (field-level lives in the codebase)
- **§14 Security & Compliance** — non-negotiable baseline
- **§18.2 Trade Taxonomy** — initial v1 taxonomy

## 3. Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | Next.js 15 (App Router), React 19, Tailwind v4, shadcn/ui | |
| Mutations | Server Actions preferred; REST `/api/v1/*` for mobile + partner parity | |
| Data fetching | TanStack Query on client; server components for reads where possible | |
| DB | Neon Postgres, branching per feature | |
| ORM | Drizzle ORM + drizzle-kit | Migrations in `packages/db/migrations` |
| Auth | Auth.js v5 (magic link primary, Google + Apple OAuth, WebAuthn for contractors) | TOTP MFA required for staff/admin; MFA enforced for contractors with active payouts |
| Payments | Stripe Connect Express (destination charges with application fees) | |
| Background jobs | Inngest | Cron + event-driven; outbox pattern for cross-product events |
| File storage | Vercel Blob | Photos re-encoded server-side to strip EXIF |
| Real-time | Pusher Channels | Per-user and per-job scoped channels |
| Search | Postgres FTS + trigram + earthdistance for v1 | Algolia/Typesense if scale demands |
| Email | Resend | |
| SMS | Twilio (Phase 2) | |
| Maps | Mapbox (default) | |
| Background checks | Checkr (FCRA-compliant) | |
| Observability | Sentry + Vercel Analytics + PostHog | |

Deploy target: Vercel. Neon branches map to Vercel preview deployments.

## 4. Monorepo layout

```
apps/
  web/                     # Next.js — customer + contractor + property manager + admin all here
    src/
      app/
        (marketing)/       # public site (landing, about, directory)
        (auth)/            # sign in, sign up, verify
        (customer)/        # homeowner surface
        (contractor)/      # contractor surface — "One Roof Pro" branding
        (property-manager)/ # multi-door portfolio surface
        (admin)/           # /admin/* — role-gated internal staff
        api/v1/            # REST endpoints (mobile-ready)
      lib/                 # auth guard, server-side helpers
      components/          # app-specific components
    middleware.ts          # role enforcement + tenancy

packages/
  db/                      # Drizzle schema + migrations + seed
  shared/                  # zod schemas, TS types, domain constants
  ui/                      # shared component library (shadcn-based)
  auth/                    # Auth.js v5 config, role-grant logic, RLS helpers
  # added in later milestones as needed:
  # payments/              # Stripe Connect helpers, split-payout logic
  # notifications/         # Resend / Twilio / Web Push abstractions
  # search/                # Search adapters
  # trades/                # Trade taxonomy, scope templates, matching scoring
  # trust/                 # Background-check integration, dispute scoring
  # events/                # Cross-product event bus contracts
```

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

Every table holding customer data has a `household_id` (or `portfolio_id` for property-manager scope) or a traceable ancestor to one. Every query touching customer data must be scoped to the authenticated user's household(s).

Canonical helper: `packages/db/src/scope.ts` → `withHouseholdScope(db, householdId)`.

Belt-and-suspenders: every tenant table will have a before-insert trigger (`assert_household_scope`) that verifies `household_id` matches `current_setting('app.household_id')`. If that throws, you forgot to wrap the write in `withHouseholdScope()`. Mirrors Home Doctor's pattern exactly.

## 7. Role guard — USE IT ON EVERY ROUTE (when added in Milestone 3)

Canonical helper: `apps/web/src/lib/auth/guard.ts` → `requireScope(request, options)`.

Default deny. No route is public unless it's in the `(marketing)` segment or explicitly flagged `public: true`.

Roles (per PRD §12.4):
```
customer
tenant
contractor_independent
contractor_branded
contractor_master
contractor_member            # employee/apprentice on a contractor_company
property_manager
admin_vetting
admin_brand
admin_dispute
admin_marketplace
admin_super
```

A user may hold multiple roles simultaneously; context switching is a UI concern, not a session concern.

## 8. Encryption envelope — USE IT FOR RESTRICTED FIELDS

Restricted fields (license numbers, partial SSN if held, banking metadata beyond what Stripe holds) are envelope-encrypted at rest. Pattern mirrors Home Doctor's `packages/shared/src/crypto/envelope.ts` exactly.

PII minimization: prefer vendor-held identity (Stripe Identity, Checkr) over storing on our side.

## 9. Anti-disintermediation as a design constraint

This is the strategic crux of the product (PRD §10). For every feature you write, ask: *does this make off-platform leakage easier or harder?* The structural defenses are:
- **Back office as moat** — bookkeeping, 1099 prep, insurance brokerage, payment processing
- **Liability shifting** — platform-backed dispute coverage and warranty are on-platform-only
- **The brand** — apparel, decals, business cards are platform-issued and platform-revocable
- **The home record** — maintenance record exists only on-platform; resale-packet PDF is the customer-facing manifestation
- **Warranty** — platform-administered; off-platform jobs have no backstop
- **Loyalty/repeat rewards** — both sides accumulate value by transacting on-platform
- **Detection without surveillance** — pattern signals (repeat-rate gap vs. peer cohort) trigger relationship-building outreach, never message-reading

Enforcement framework codified in §10.4: 12-month cooling-off window for platform-sourced customers; tiered Soft → Moderate → Strong → Severe → Egregious responses.

## 10. Inclusive household UX

Per Home Doctor's CLAUDE.md §23 (Addendum M §138), customer-facing UI is designed for households as multi-person entities from MVP onward. The eight principles apply equally to One Roof and will be carried into the customer surface when household features land. Summary:

1. Onboarding is multi-person from minute one.
2. No "primary user" or "owner" framing in customer-facing UI (internal `household_role` exists for permissions only).
3. Activity attribution is by name, not role.
4. Approval flows route to all eligible household members in parallel.
5. Notification preferences are per-person, not per-household.
6. No gendered defaults in copy.
7. Permissions framed as symmetrical capabilities.
8. Onboarding-completion patterns acknowledge shared work.

## 11. Coding style

- TypeScript strict everywhere. No `any` without an ESLint-disable comment explaining why.
- Functions over classes. Pure where possible.
- Zod schemas at every I/O boundary (HTTP, DB, Stripe webhook, external integrations). Parse, don't assume.
- Errors propagate as typed `Result` or throw — pick one per subsystem and be consistent.
- Prefer Server Components; add `'use client'` only when interactivity demands it.
- Never use localStorage/sessionStorage in user-facing code — Auth.js handles session, component state handles the rest.
- Imports use the `@/…` path alias for cross-package references; relative only within a file's own directory.

## 12. Security baseline — non-negotiable

- TLS everywhere. HSTS with preload in production.
- Argon2id for password hashing (if/when password auth is added; magic link + OAuth + passkeys preferred).
- TOTP MFA enforced for staff/admin roles; MFA required for contractors with active payouts.
- Rate limit auth, scan, webhook, and AI endpoints at the edge middleware.
- CSRF double-submit on cookie-authenticated mutations.
- File uploads: MIME sniffing + extension enforcement, virus scan, server-side re-encode, EXIF strip.
- Secrets via environment only, per-environment. No secrets in source, no secrets in commit messages.
- Every admin sensitive read writes `audit_log`. Step-up reauth within 5 minutes for PII reveal.

## 13. Working with specs

When starting a new feature:

1. Locate the relevant spec section(s). Note the spec version and section numbers in the PR description.
2. If the spec is ambiguous, resolve with a short ADR in `docs/adr/` before building.
3. If the spec is wrong, propose a spec amendment in the same PR that fixes the code.
4. Never build beyond the spec's scope for the current phase without an ADR. Scope creep is how MVPs die.

## 14. What I (Brian) care about

- Honest tradeoff analysis over hedged recommendations.
- Security baked in, not bolted on — the platform's credibility is partially EngSec's credibility.
- Cost-conscious choices; prefer self-hosted or OSS where it doesn't compromise quality.
- Short, clear code > clever code. Future-me and Claude Code both have to read it.
- Push back when you think I'm wrong. Flag risks explicitly. Surface the unsexy work (audit logs, migration safety, test coverage) as first-class.

## 15. Current phase

**Phase 0 (Foundation).** Per PRD v1.1 §15.

In progress / done:
- Monorepo skeleton (pnpm workspaces, apps/web, packages/{db,shared,ui,auth})
- CLAUDE.md, .env.example, docker-compose for local Postgres
- Marketing landing page

Up next (Phase 0 milestones):
- DB foundation: identity tables (`user`, `user_role_grant`, sessions), tenancy primitives (`household`, `property`, `portfolio`, `tenant`), audit_log, `withHouseholdScope` helper, `requireScope` guard, RLS policies
- Auth.js v5 wiring: magic link via Resend, Google OAuth, login/signup/verify routes
- Trade taxonomy + scope templates (PRD §18.2 seed; admin authoring UI)
- Stripe Connect Express stub (env wiring, webhook receiver)

After Phase 0: **Phase 1 MVP marketplace** in Savannah, GA — customer signup → property → service request → quote → job → invoice → review; Verified contractor onboarding + profile; lead routing v1; PWA-first.

**Initial market: Savannah, GA metro** (PRD v1.1 §17.1) — coordinated with the Home Doctor Savannah pilot.

Explicitly **out of scope until later**:
- Branded knowledge tests (Phase 2)
- Brand kit fulfillment (Phase 2)
- Back-office services — bookkeeping ledger, expense capture, 1099 prep, insurance brokerage, CPA-reviewed Schedule C (Phase 3)
- One Roof Pro Expo native app (Phase 2 dev → Phase 3 ship)
- Property Management portfolio dashboard, tenant portal, recurring contracts (Phase 4)
- Customer Expo native app (Phase 4 dev → Phase 5 ship)
- Home Doctor deep integration (event bus, warranty sync, sensor-triggered claims) (Phase 5)

## 16. Session checklist

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
- [ ] Spec references cited in PR description.

---

*Keep this file current. When the codebase evolves past what's described here, update this file in the same PR that makes the change.*
