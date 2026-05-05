# One Roof Homes — Phase 1 Sprint Plan

**Date:** May 2026  
**Status:** Build-ready  
**Target:** Operator-ready MVP in ~10 weeks  
**Companion documents:**  
- `ONE_ROOF_HOMES_PRD_v1.1.md` (base spec)  
- `ONE_ROOF_HOMES_PRD_v1.2_Addendum_A.md` (Phase 1 GC operating model — primary reference for Phase 1)  
- `ONE_ROOF_HOMES_PRD_v1.3_Addendum_B_Subcontractor_Agreement.md`  
- `ONE_ROOF_HOMES_Drizzle_Schema_Phase1.md`  
- `packages/trades/savannah_phase1.ts`

---

## Goal

By end of Phase 1, the operator can run a full week of business — lead intake through completed-job invoice — entirely in the platform. The platform must be **faster than current pen-and-paper / spreadsheet workflow**, not just feature-complete. If a flow is slower in the platform than off-platform, it's a bug, not a feature.

Launch criterion: 1 week of real Savannah operations run on the platform with 5+ jobs completed and invoiced, with the operator confirming each daily step is faster than their pre-platform workflow.

---

## Constraints

- **Single operator** in Phase 1. Multi-operator support is Phase 6.
- **Single market** (Savannah, GA).
- **Six service categories** per `savannah_phase1.ts`. Don't build for arbitrary trades.
- **No public-facing contractor profiles, no marketplace, no Stripe Connect, no in-platform customer chat.** All Phase 3+.
- **PWA-only** for Phase 1. Expo One Roof Pro begins in Phase 2.

---

## Pre-flight (Week 0, before sprint kicks off)

These are decisions/setup items the operator and EngSec need before Claude Code starts building. Do these in parallel with Sprint 0.

| Item | Owner | Output |
|---|---|---|
| Operating LLC for Savannah (Georgia) | Operator + counsel | EIN, bank account, GL insurance |
| Subcontractor Agreement legal review | Counsel | Counsel-approved Addendum B template |
| Stripe Billing account | Operator | Live Stripe account, customer portal configured |
| Twilio account + SMS-capable Savannah-area number | EngSec | Provisioned number that rings to operator |
| Vercel + Neon + Resend accounts + DNS at oneroofhomes.com | EngSec | All infrastructure provisioned |
| Initial brand kit physical inventory ordered | Partner (in-house) | 30 shirts, 50 hats, 10 truck magnet sets, 100 yard signs, 500 door hangers |
| First 3-5 candidate subcontractors identified | Operator | Names, trades, contacts |
| First 10-20 candidate customers / target neighborhoods | Operator | Door-knock route plan, FB groups list |

---

## Sprint Cadence

10 weeks, 1-week sprints. Each sprint ends with a demo to the operator. The operator's go/no-go feedback drives the next sprint.

**Definition of Done for any feature in Phase 1:**
1. Code is written, reviewed, and merged to `main`.
2. Drizzle migration is committed and run on the Neon dev branch.
3. PWA build deploys cleanly to Vercel preview.
4. Operator has used the feature on real (or realistic) data and confirmed it works.
5. Audit log entries exist for sensitive actions.
6. Tests cover the happy path plus key error cases.

---

## Sprint 0 — Foundation (Week 1)

**Theme:** monorepo, auth, deployment pipeline, schema baseline.

### Deliverables

- Turborepo monorepo bootstrapped: `apps/one-roof-web/`, `packages/db/`, `packages/auth/`, `packages/ui/`, `packages/trades/`, `packages/notifications/`, `packages/config/`.
- Next.js 15 App Router app skeleton in `apps/one-roof-web` with Tailwind v4 and shadcn/ui.
- Auth.js v5 with Drizzle adapter, magic-link email sending via Resend.
- Neon database provisioned with `dev`, `preview`, and `main` branches.
- Drizzle schema from `ONE_ROOF_HOMES_Drizzle_Schema_Phase1.md` materialized in `packages/db/schema/`.
- Initial migration generated and run.
- `packages/trades/savannah_phase1.ts` committed with the catalog and helpers.
- CI: GitHub Actions runs `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` on every PR.
- Sentry installed.
- A bare-bones `/` route with login/signup that proves end-to-end auth flow works.

### Demo

Operator can log in via magic link. They see an empty dashboard. That's it.

### Risks / Watch

- Auth.js v5 has had API churn since v4. Confirm the Drizzle adapter is current.
- Neon branching mapped to Vercel previews requires the Neon-Vercel integration; verify it's working.

---

## Sprint 1 — Customer & Property + Operator Profile (Week 2)

**Theme:** the operator can capture a new customer, add a property, and record basic info.

### Deliverables

- `(operator)/customers/` route group with list and detail views.
- "New customer" form: name, phone, email (all optional except phone), source (dropdown of `JobSource` enum), source detail (free text).
- Customer detail page: contact info, list of properties, list of jobs, notes, tags.
- Property add/edit: address with geocoding (Mapbox), property type, year built, sq ft, access notes.
- Operator settings page: profile, notification preferences, business info that appears on invoices.
- All reads enforce that the operator's role-grant is checked.
- Audit log entries for customer create / property create / customer update.

### Demo

Operator can capture a customer, add their property, and see the record. They can find it again by name or phone.

---

## Sprint 2 — The Pipeline (Week 3)

**Theme:** the six-stage pipeline as the operator's home view.

This is the most strategically important sprint. If the pipeline view doesn't feel faster than the operator's spreadsheet, fix it before moving on.

### Deliverables

- `(operator)/dashboard/` becomes the operator home page. Layout matches Image 3 (CRM Tracker):
  - Top: 6 pipeline stage cards with counts (New Lead, Contacted, Estimate Sent, Proposal/Follow Up, Booked/Scheduled, Completed/Won).
  - Main: filterable, sortable job table with columns from Image 3 (Date, Name, Phone, Service/Job, Status, Est. Value, Notes/Next Step, Follow-Up Date).
  - Right rail: Today's Priorities, This Week at a Glance, Follow-Up Reminders.
- Click a job → detail view with pipeline stage advance buttons.
- Stage advance creates a `pipeline_stage_history` row and the corresponding `job_event` row.
- Inline edit of Notes/Next Step and Follow-Up Date.
- "New Lead" quick-add form (just enough fields to capture a lead in <30 seconds: customer name, phone, service category, source).
- Pipeline filter: by stage, by source, by date range, by next-followup-date.
- Lost outcome with required reason selection.

### Demo

Operator captures 3 leads in under 90 seconds, advances them through stages, marks one as lost, sees the dashboard reflect the daily reality of their week.

### Risk / Watch

- This is where the design must earn its keep. If the pipeline view is slower than the operator's existing tool, this sprint extends. **Don't compromise the user experience here for any reason.**

---

## Sprint 3 — Quote Builder (Week 4)

**Theme:** the operator can build a quote in <2 minutes that uses the cheat-sheet starting prices and feels professional to send to a customer.

### Deliverables

- Quote builder view on a job in `new_lead` or `contacted` stage.
- Service selection from `savannah_phase1.ts` catalog: pick a category, pick a variant, accept default starter price or override.
- Bundle suggestion banner using `bundleSuggestionsFor()` — when operator adds a service, suggest the typical bundle.
- Margin warning UI using `computeMarginWarning()` when sub pay is set.
- Quote line items: each line is variant + scope notes + quantity + unit + unit price + extended price.
- Quote preview (HTML render in operator UI; PDF render server-side using `react-pdf` or similar).
- "Send Quote" action: emails customer the PDF via Resend + sends an SMS notification ("Quote ready: $XXX. View at [link]").
- Stage advances to `estimate_sent`. `estimate_sent_at`, `estimate_amount`, `estimate_doc_id` populated.
- Quote view tracks customer view (signed link with view-tracking pixel) → `estimate.viewed` event.

### Demo

Operator builds a quote for a 3-service bundle (driveway + house wash + gutter) in <2 minutes. Customer receives a clean PDF and an SMS notification. View-tracking shows when customer opens it.

---

## Sprint 4 — Pricing Cheat Sheet & Customer Acquisition Tools (Week 5)

**Theme:** the operator's daily go-to-market playbook becomes platform tooling.

### Deliverables

- `(operator)/pricing/` page rendering `buildCheatSheet()`. Sortable, searchable. Match the visual layout of Image 2 panel 1 closely.
- `(operator)/leads/door-knock/` route:
  - Map view of a target neighborhood.
  - Pick a route → generate a printable PDF with addresses, route order, and door-hanger leave-behinds.
  - Each door produces a quick "knocked, no answer" / "spoke, interested" / "spoke, not interested" / "do not contact" outcome that creates a `customer` (and possibly a `job` in `new_lead` stage).
- `(operator)/leads/facebook/` route: pre-written post templates customizable with operator's name and current promotions, with copy-to-clipboard and a "logged at" timestamp for cadence reminders.
- `(operator)/leads/network/` route: list of past customers and contacts with last-contacted timestamps and pre-drafted "ask for referral" SMS templates.
- `(operator)/leads/realtors/` route: realtor/PM contact list with referral attribution tracking.

### Demo

Operator plans a Saturday morning door-knock route, prints leave-behinds, walks the route logging outcomes on phone, comes home with 3-5 new leads in the system.

---

## Sprint 5 — Subcontractor Roster & Onboarding (Week 6)

**Theme:** the operator can add a subcontractor, capture their docs, and dispatch them work.

### Deliverables

- `(operator)/subcontractors/` route with list view.
- "Invite subcontractor" flow: capture name + phone + email + trade categories. Sends SMS invite with a link to a self-service onboarding flow.
- Subcontractor onboarding flow (mobile web):
  - Identity doc upload.
  - COI upload + expiry date capture.
  - W-9 upload.
  - Banking info entry (encrypted at rest).
  - Pre-existing customer declaration (Exhibit C).
  - Agreement preview + DocuSign signing flow.
  - On signing: status moves from `onboarding` to `active`.
  - Trigger: shipping notification to the operator to ship the apparel kit.
- Rate sheet builder: per (subcontractor, service variant) flat-fee rate sheet. Operator sets defaults; subcontractor can request renegotiation.
- Subcontractor detail view: agreement status, COI expiry warnings, rate sheet, job history (Phase 1 starts empty).

### Demo

Operator adds 2 subcontractors. Both complete onboarding. Both have rate sheets in place. Operator can see at a glance who's active and whose insurance is expiring soon.

### Risk / Watch

- DocuSign integration may take longer than expected. If it slips, fall back to a generated-PDF + manual-sign-and-upload flow for Sprint 5 and add DocuSign in Sprint 8.
- Banking encryption must work correctly. Test the encrypt/decrypt round-trip explicitly. Keys live in Vercel env, never logged.

---

## Sprint 6 — Job Execution & Subcontractor Dispatch (Week 7)

**Theme:** book a job, dispatch a subcontractor, run the job to completion.

### Deliverables

- Booking flow on a job in `proposal_followup` stage:
  - Schedule date + time window.
  - Optionally collect deposit (Stripe Billing payment intent).
  - On schedule: stage advances to `booked_scheduled`. `scheduled_for`, `scheduled_window_minutes` populated. `job.scheduled` event.
- Operator dispatch: select subcontractor from eligible roster (filtered by service category + availability).
- On assignment: `subcontractor_pay_amount` auto-populated from rate sheet. `job.subcontractor_assigned` event. SMS to subcontractor with job address, time, scope, pay amount.
- Subcontractor view (mobile web for Phase 1, no native app yet):
  - List of assigned jobs.
  - Job detail with read-only customer info: address only, no phone/email.
  - Accept / decline buttons.
  - "Message One Roof" button (SMS the operator).
  - "Mark in progress" / "Mark complete" buttons with required photos (before, in-progress, after).
- Operator can self-perform jobs (handyman/carpentry): same UI, no subcontractor assigned, photos still captured.
- On `job.completed`: stage advances to `completed_won`. `completed_at`, photos linked.

### Demo

Operator schedules a pressure-washing job, dispatches it to a subcontractor, subcontractor accepts via phone, marks complete with after-photos, operator sees completion notification.

---

## Sprint 7 — Invoicing, Payment, Payouts (Week 8)

**Theme:** money moves cleanly.

### Deliverables

- Invoice generation on `job.completed`: line items mirror the quote (with any change orders). Stripe Billing customer + invoice created.
- Customer pays via Stripe-hosted invoice page. Card, ACH, Apple/Google Pay.
- On payment: `invoice_paid_at` populated. `invoice.paid` event.
- Subcontractor payout ledger:
  - Every completed-and-paid job with an assigned subcontractor accrues to a weekly payout.
  - Friday evening: a `subcontractor_payout` row is auto-generated for each subcontractor with the prior Mon-Sun jobs.
  - Operator reviews and approves payouts.
  - Manual ACH or check execution (operator triggers from their bank); platform records reference number and marks paid.
- Subcontractor sees their pending and historical payouts in their view.
- Customer rebooking: completed customers see a "Book again" button on their invoice that creates a new job in `new_lead` with their info pre-filled.

### Demo

Job completes Tuesday → operator reviews invoice Tuesday evening → customer pays Wednesday → operator approves payout Friday → subcontractor sees paid status Saturday.

### Risk / Watch

- Stripe Billing webhook handling must be idempotent.
- Subcontractor payout amounts must reconcile exactly to the sum of `subcontractor_pay_amount` across jobs in the period. Add a reconciliation report.

---

## Sprint 8 — SMS-First Communication, Followup Automation, Marketing Assets (Week 9)

**Theme:** automate the things the operator was about to forget.

### Deliverables

- Twilio inbound SMS webhook: messages from customer phone numbers route to the appropriate `customer` and create a `message` row + `lead.message_received` event.
- Operator dashboard surfaces unread customer messages.
- Outbound SMS from operator dashboard: send templated or freeform SMS to customer; logs to `message` table.
- Follow-up automation:
  - 24 hours after estimate sent with no customer response → SMS reminder (templated, opt-out).
  - 3 days after `proposal_followup` stage entry with no movement → operator reminder.
  - 24 hours after job completion → SMS to customer asking for review.
  - 7 days after job completion → SMS asking for referral.
- Recurring service contracts: `recurring_service_contract` entity for pest, lawn, gutter quarterly. Auto-creates `new_lead` jobs at the right cadence.
- Marketing asset library: operator can request reorder of yard signs, magnets, door hangers, business cards from a self-serve page (Phase 1 fulfillment is manual; the request creates an internal ticket).

### Demo

Operator hands the platform a Tuesday morning of leads. The platform handles the followups for the rest of the week. Operator just shows up to do the work.

---

## Sprint 9 — Home Doctor Bridge + Operator Polish (Week 10)

**Theme:** integrate with Home Doctor and ship the small things that make the operator's day better.

### Deliverables

- Inbound endpoint at `/api/v1/webhooks/homedoctor` for `hd.recommendation.handoff_requested` events.
- Receiving such an event: create a `customer` (or link to existing), create a `job` at `new_lead` stage with `homedoctor_recommendation_id` and `homedoctor_check_id` populated, source = `home_doctor`.
- Outbound events on job state changes: `oneroof.recommendation.fulfillment_started`, `oneroof.recommendation.fulfilled`, `oneroof.warranty.created`. Outbox-pattern via Inngest.
- Polish backlog: every operator complaint from the prior 9 sprints gets addressed. Examples likely to surface:
  - Faster keyboard shortcuts on the pipeline view.
  - Better print layouts on door-hanger PDFs.
  - Better mobile rendering of the dashboard for the operator's phone.
  - SMS template editing.
  - Bulk follow-up actions.

### Demo

End-to-end demo: Home Doctor recommends an HVAC tune-up → handoff event creates a job in One Roof → operator dispatches a sub → job completes → completion event closes the loop in Home Doctor's timeline.

---

## Phase 1 Launch Week (Week 11)

Not really a sprint — a launch.

- 1-2 days: operator runs a real week of business on the platform with EngSec on standby for fixes.
- Daily standup focused on what's slower than off-platform; bug-fix until parity.
- End of week: operator confirms platform is faster than off-platform on every daily flow.
- If operator confirms: ship a public marketing landing page at oneroofhomes.com with the One Roof brand and the "We Handle It" promise. Phase 1 is live.
- If operator does not confirm: Sprint 10 fixes the gaps. Don't launch until the daily-faster threshold is met.

---

## Phase 1 Backlog (deferred from Phase 1, scheduled for Phase 2)

These items were considered for Phase 1 but explicitly deferred:

- Native mobile app (Phase 2).
- In-platform customer chat (Phase 2+ when volume justifies).
- Subcontractor mobile app polish (Phase 2 — mobile web is sufficient for Phase 1).
- Win/loss analytics dashboard (Phase 2).
- Multi-operator support (Phase 6).
- Public-facing contractor profiles (Phase 3).
- Branded program eligibility tracking (Phase 3).
- Stripe Connect for direct sub payouts (Phase 3 if marketplace activates).
- One Roof+ subscription tier (Phase 3).
- Property Manager pricing tier (Phase 4).

---

## Engineering Practices

- **Trunk-based dev** with PR review. Every PR triggers Vercel preview + Neon branch.
- **Ship daily** to the dev environment. Demo to operator weekly.
- **Audit log everything sensitive**: PII view, role grant, dispute decision, payout edit, agreement change. The audit log is the platform's compliance and trust foundation.
- **Idempotent webhooks**: Stripe, Twilio, DocuSign, Home Doctor events. Test idempotency explicitly.
- **EXIF strip on photo upload** at the API layer. Every photo, every time.
- **Encrypted columns**: banking details, SSN-like fields. libsodium at the app layer; keys in Vercel env. Never log decrypted values. Add a CI check that prevents accidental logging.
- **Rate-limit SMS sending** to prevent runaway loops or accidental spam.
- **Feature flags** for anything customer-facing that isn't ready: Vercel Edge Config or Statsig.
- **Branch tests on PR**: schema migrations run against the Neon branch and exercise the seed data.

---

## What Could Go Wrong

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Operator workflow not faster than spreadsheet → adoption fails | Medium | Critical | Ruthless usability focus on Sprint 2 (pipeline) and Sprint 3 (quote builder); operator demo every week |
| Subcontractor onboarding too slow → roster too small to dispatch | Medium | High | DocuSign integration on critical path; manual fallback to PDF + sign + upload |
| Independent-contractor classification challenged | Low (but high consequence) | Critical | Counsel review of Addendum B before first execution; strict adherence to the IRS framework |
| Stripe webhook delivery flakiness → invoice-paid status drift | Medium | Medium | Idempotent handlers + nightly reconciliation job |
| EXIF in customer photos exposes location | Low | Medium | Strip at upload; CI test verifies stripped output |
| SMS opt-out compliance | Medium | High | Twilio's compliance suite + STOP keyword handling + suppression list |
| Operator burnout from running the business while building it | Medium | High | Aggressive automation focus; sprint demo with explicit "what's still hurting?" question |

---

*End of Phase 1 Sprint Plan*  
*Update this document with sprint outcomes as Phase 1 progresses.*
