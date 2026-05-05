# One Roof Homes PRD v1.2 — Addendum A

## Phase 1 Operating Model: GC/Operator with Subcontracted Labor

**Date:** May 2026  
**Author:** EngSec LLC  
**Status:** Active. Supersedes v1.1 sections where they conflict for Phase 1-2 (see §0 Precedence).  
**Companion documents:**  
- `ONE_ROOF_HOMES_PRD_v1.1.md` — base specification (Phase 3+ marketplace model preserved)  
- `HomeDoctor_PRD_v1.14_Addendum_N.md` — cross-product integration  

---

## 0. Precedence

This addendum reflects operational reality from the Savannah Phase 1 launch. Per the canonical rule that later addenda supersede earlier ones, this addendum **supersedes** v1.1 in the following:

| v1.1 Section | Topic | Status under Addendum A |
|---|---|---|
| §1.1 Strategic Position | "Franchise network without the franchise capital" | **Reframed** — Phase 1-2 is a GC operating model with subcontracted labor; the franchise/marketplace framing is preserved as the Phase 3+ evolution. |
| §4.2.4 Transparent margin pitch | Per-job take rate disclosed on every invoice | **Superseded for Phase 1-2.** Subcontractors receive flat-fee-per-job; no take-rate disclosure to customers. |
| §6.2 Service Request Flow | Customer chooses contractor from quotes | **Superseded for Phase 1-2.** Customer hires One Roof; One Roof dispatches; customer never sees subcontractor selection. |
| §7.2 LinkedIn-style public profile | Public contractor profiles | **Deferred to Phase 3.** No public contractor profiles in Phase 1-2; subcontractors are internal to One Roof's operating roster. |
| §8 Branded Certification Program | Verified → Branded → Master tiers | **Reframed as graduation path.** Phase 1-2 has only the operating roster; Branded program activates Phase 3 as the path for proven subcontractors to graduate to public marketplace participants. |
| §9.2 Contractor take rates | Percentage-based 3-10% take | **Superseded for Phase 1-2.** Flat-fee-per-job subcontractor model with target ~30% GC margin. |
| §9.4 Customer pricing | Free marketplace + One Roof+ subscription | **Modified.** Customer pricing in Phase 1-2 is per-job pricing set by One Roof; One Roof+ subscription deferred to Phase 3 when customer-facing platform features mature. |
| §10 Anti-disintermediation | Structural defenses against off-platform poaching | **Reframed.** Under the GC model, the customer never establishes the subcontractor as their direct contact. §10's defensive scaffolding becomes belt-and-suspenders for Phase 1-2; primary defense is the operating model itself. |
| §15 Phased Rollout | Phase descriptions | **Modified.** Phase 1-2 operating model and deliverables restructured around GC operations. Phase 3+ marketplace model preserved. |
| §17 Phase 0 Decisions | Take-rate calibration, brand-kit economics, etc. | **Modified.** Several decisions adjust under the GC model — see §10 Resolved Decisions below. |

What remains untouched: §11 Home Doctor Integration (the integration contracts work the same regardless of operating model), §12 Technical Architecture (stack choices unchanged), §13 Data Model (extended, not replaced — see §6 below), §14 Security & Compliance.

---

## 1. The Operating Model

### 1.1 Plain Statement

**One Roof Homes is, in Phase 1-2, a general contractor operating in Savannah, GA.** Customers hire One Roof. One Roof dispatches subcontractors to do the work. One Roof handles all customer-facing concerns — sales, scheduling, communication, payment, dispute resolution. Subcontractors are paid a flat fee per job and never own the customer relationship.

The platform exists to **automate the back office of this operating business** so one human operator can run materially more volume than they otherwise could.

### 1.2 Why This Is the Right Phase 1 Model

- **It matches operational reality.** The partner-operator is already running this model in Savannah today. The platform's job is to amplify what's working, not force a different model onto it.
- **It eliminates marketplace cold-start.** A two-sided marketplace requires liquidity on both sides simultaneously. A GC operating business requires one operator and a small subcontractor roster — achievable on day one.
- **It produces materially lower disintermediation risk.** The customer transacts with One Roof. The subcontractor shows up in One Roof apparel, drives a One Roof-branded truck, leaves a One Roof leave-behind. The customer has no reason to capture the subcontractor's name or number; the subcontractor has no incentive to break role.
- **It produces stronger unit economics on day one.** 30% GC margin on the work itself, plus bundling upside (multi-service jobs at higher tickets), with no platform Stripe Connect onboarding overhead per subcontractor.
- **The brand promise is sharper.** "I handle everything outside your home — one call, one team, one roof" is a clean consumer-facing pitch. "We match you with a vetted contractor" is the same promise every marketplace competitor makes.

### 1.3 Why the Marketplace Model Still Comes Later

Phase 3+ layers the Branded marketplace on top of the operating business. By then:
- One Roof has earned brand equity in Savannah and (Phase 6+) adjacent metros.
- A trusted roster of subcontractors has been built through repeated work.
- The strongest subcontractors are ready to graduate to public Branded contractors operating under their own name with the One Roof Branded badge.
- The platform's Phase 1-2 automation work has produced reusable infrastructure (CRM pipeline, pricing engine, dispatch logic, payment flows, customer record-keeping) that the marketplace can reuse.

The two models coexist by Phase 4: One Roof operates jobs as GC for some customers/services, and surfaces Branded contractors directly for others. Customers may not know the difference; from their perspective, both feel like One Roof.

### 1.4 Operator Profile (Phase 1)

The Phase 1 operator is a working tradesperson who is also running the business. Specifically:

- **Performs handyman / carpentry work themselves** on jobs that match their skills.
- **Sells, schedules, and dispatches** all jobs (including those subbed out).
- **Works with subcontractors** for trades outside their own bench (pressure washing, landscaping, junk removal, window/gutter cleaning, pest control).
- **Owns the customer relationship** end-to-end.

The platform must optimize for this person's daily workflow first. The contractor console (One Roof Pro) is, for Phase 1, the **operator's daily operating tool.** Other subcontractors get a much narrower view focused on their assigned jobs only (see §4.2).

---

## 2. Phase 1 Service Scope (Savannah)

The Phase 1 service set is narrower than v1.1 §18.2, matching what the operator-GC actually offers:

| Service | Self-Performed or Subbed | Pricing Band | Target Margin |
|---|---|---|---|
| Pressure Washing | Subbed (or self) | Driveway $100-200; House Wash $200-400; Bundle $250-500 | 40-50% |
| Landscaping (simple jobs) | Subbed | Cleanup $100-300; Mulch Install $300-800; Basic Maintenance $50-150 | 30-50% |
| Junk Removal | Subbed | Small Load $75-150; Half Load $200-400; Full Load $400-700 | 40-60% |
| Window & Gutter Cleaning | Subbed | Windows $100-250; Gutters $100-250; Combo $150-350 | 30-50% |
| Handyman / Carpentry / Skilled Work | Self-performed | Small Job $150-500; Medium $500-2,000; Large $2,000-10,000+ | 20-30% |
| Pest Control | Partner (recurring) | Monthly Plan $50-70; Initial Treatment $99-199 | 15-30% |

**Goal**: bundle 2-4 services per customer where possible. Higher ticket, lower per-job acquisition cost, longer customer relationship.

These price bands and target margins are the seed data for `packages/trades/savannah_phase1.ts`. They drive the quote builder's starter prices and the operator's "Pricing Cheat Sheet" view in the console (see §4.5).

### 2.1 Trade Taxonomy Adjustment for Phase 1

Phase 1 uses a flatter trade taxonomy than v1.1 §18.2. The full hierarchical taxonomy is preserved as the Phase 3+ target state but Phase 1 ships with these six service buckets only. Expansion happens by:

- **Adding services to the operator's roster** (e.g., HVAC tune-ups via partnership) as subcontractor relationships are established.
- **Refining sub-service variants** within existing buckets (e.g., Pressure Washing splits into Driveway / House / Bundle / Roof).
- **Geographic expansion** in Phase 6+ (Atlanta, Charleston) inherits the Savannah taxonomy as the base.

### 2.2 Service-Selection Logic

When a customer requests a service, the platform routes based on this priority order:

1. **Operator self-performs** if it's a Handyman/Carpentry job AND the operator has capacity within the requested window.
2. **Subcontractor dispatch** if it's a non-self-performable trade OR the operator is at capacity.
3. **Decline / waitlist** if no subcontractor is available in the requested window.

Decline is a real outcome, not a hidden one. Better to honestly tell a customer "I can do this Tuesday but not before" than to overpromise. Honest scheduling is part of the brand.

---

## 3. Subcontractor Agreement (Flat-Fee Model)

### 3.1 Commercial Terms

The subcontractor relationship is governed by a simple agreement template based on what's already working operationally:

**Our Agreement (One Roof's commitment to subcontractor):**
- Bring jobs (qualified, scoped, scheduled).
- Handle the customer relationship — sales, communication, scheduling, payment, dispute resolution.
- Pay a fixed dollar amount per job, agreed in advance per service category.
- Pay on agreed schedule (default: weekly, every Friday for jobs completed Mon-Sun).

**Subcontractor's commitment to One Roof:**
- Show up on time for assigned jobs.
- Do quality work.
- Communicate issues immediately.
- Respect the customer ("you're representing us").
- Keep the job site clean.
- Stand behind the work.
- Wear the One Roof shirt and represent the One Roof brand on the job.
- Do not solicit the customer for off-platform work (see §3.4).

### 3.2 Pricing Model

**Sell price:** set by One Roof based on the Pricing Cheat Sheet (§2 above) plus job-specific factors (size, access, urgency, materials).

**Pay rate:** flat dollar amount per job, agreed by service category. Reference example from operating materials:

```
Job sells at:     $1,000
Pay subcontractor:  $700  (negotiated flat, not a percentage)
One Roof keeps:     $300  (effectively 30% GC margin)
```

**No percentages exposed to subcontractors.** The pay rate is the deal. This eliminates pricing arguments, reduces disintermediation incentive, and matches how skilled tradespeople prefer to think about work ("am I getting paid enough for this job?" vs. "what percentage is the platform taking?").

**Pay rate negotiation:** by service category, not per-job. A pressure-washing subcontractor agrees up front to a rate sheet (e.g., $80/driveway, $160/house wash, $200/bundle). Job dispatch references the rate sheet automatically. Renegotiation happens periodically, not per-job.

### 3.3 Subcontractor Onboarding (Phase 1, Lightweight)

Phase 1 subcontractor onboarding is intentionally lighter than v1.1 §7.1:

| Requirement | Phase 1 (Subcontractor) | Phase 3+ (Branded) |
|---|---|---|
| Identity verification | Operator personally vouches; ID copy on file | Stripe Identity full verification |
| License | Required only where state mandates for the trade | Verified per v1.1 §7.1 |
| Insurance | COI required (GL minimum $500K) | GL minimum $1M per v1.1 §8.1 |
| Background check | Operator's discretion + reference checks | Required (Checkr or equivalent) |
| Banking | W-9 + ACH information | Stripe Connect Express |
| Service area | Operator's market | Self-defined per v1.1 §7.1 |
| Profile authoring | None (internal roster only) | Public LinkedIn-style profile |
| Knowledge test | None (operator vouches) | Branded knowledge test required |

The lightweight onboarding works because:
- The operator personally evaluates every subcontractor before adding them to the roster.
- Subcontractors only do work the operator has scoped and quoted.
- Liability flows through One Roof's GL insurance for customer-facing claims.
- The customer never directly evaluates the subcontractor.

### 3.4 Anti-Solicitation (Phase 1 Equivalent of §10)

Under the GC model, anti-disintermediation simplifies dramatically. The subcontractor agreement includes:

- **Customer relationship is One Roof's, not the subcontractor's.** Subcontractor agrees not to leave personal business cards, not to solicit customers for direct work, not to give out personal phone numbers for follow-up.
- **All follow-up communication routes through One Roof.** If a customer asks for a quote on a different job during a subcontractor visit, the subcontractor refers it back to One Roof.
- **12-month cooling-off** on customers introduced through One Roof, per v1.1 §10.4 — but the enforcement burden is much lower because the customer never has the subcontractor's contact info to begin with.
- **Brand assets on every job.** Subcontractors wear One Roof shirts and (where applicable) drive One Roof-decaled vehicles or place One Roof magnetic signs on their own vehicle for the duration of the visit. A leave-behind door hanger with One Roof's number is left after every job.

The escalation tiers in v1.1 §10.4 still apply for Phase 1, but in practice the operator-GC handles enforcement directly through the subcontractor relationship rather than through formal platform tooling.

---

## 4. The Operator's Console (Phase 1 One Roof Pro)

The Phase 1 contractor console is **the operator's daily operating tool.** It is designed for a single human running a service business, not for a marketplace.

### 4.1 Daily Operating View (Home)

The operator's home screen surfaces the daily operating reality. Modeled directly on the partner's existing CRM tracker (Image 3) plus operator-specific additions.

**Today's Priorities** (configurable list; defaults shown):
1. Call new leads
2. Follow up on estimates
3. Confirm scheduled jobs
4. Ask for reviews & referrals
5. Market / generate leads

**This Week at a Glance** (auto-computed):
- New Leads (count this week)
- Estimates Sent (count this week)
- Jobs Booked (count this week)
- Jobs Completed (count this week)
- Revenue Goal vs. Actual (week-to-date)

**Follow-Up Reminders** (action queue):
- Follow up within 24-48 hours on new leads
- Send estimate within 24 hours of contact
- Schedule follow-up if no reply within 3 days
- Add all jobs to calendar
- Ask for review & referral after completion

**Quick Actions**: New Lead, New Estimate, Schedule Job, Record Payment.

### 4.2 The Six-Stage Pipeline (Canonical Job Flow)

Replaces v1.1's separate lead/quote/job/invoice flows with a unified pipeline view. Every job lives somewhere on this pipeline at all times.

```
NEW LEAD (1) → CONTACTED (2) → ESTIMATE SENT (3) → PROPOSAL/FOLLOW UP (4) → BOOKED/SCHEDULED (5) → COMPLETED/WON (6)
```

Each stage has:
- Required fields to advance to next stage.
- Default time-in-stage SLAs (visual warning when exceeded).
- Single-click stage advance.
- Notes / next-step field (free text).
- Follow-up date field.

The pipeline is the **canonical job timeline**. Internally it maps to v1.1 §13.3's `job_event` append-only timeline:

| Pipeline Stage | job_event types |
|---|---|
| New Lead | `lead.created` |
| Contacted | `lead.contacted`, `lead.message_sent`, `lead.message_received` |
| Estimate Sent | `quote.sent` |
| Proposal/Follow Up | `quote.followup_sent`, `quote.viewed`, `quote.discussion` |
| Booked/Scheduled | `job.scheduled`, `job.deposit_paid` |
| Completed/Won | `job.in_progress`, `job.completed`, `invoice.sent`, `invoice.paid` |

**Lost outcomes** are first-class: any stage can transition to `LOST` with a required reason (Price, Timing, Went with competitor, No response, Other). Lost data feeds win-rate analysis.

### 4.3 Schema Adjustment for Phase 1

The v1.1 §13.3 entity set is extended, not replaced:

```
service_request   →  becomes "lead" (1)
quote             →  unchanged (3, 4)
job               →  unchanged (5, 6)
job_event         →  extended with lead-stage events
                  →  extended with subcontractor_assignment events

NEW: subcontractor_roster      # internal roster (Phase 1 substitute for contractor_profile)
NEW: subcontractor_rate_sheet  # per-(subcontractor, service) flat-fee schedule
NEW: subcontractor_payout      # weekly payout record per subcontractor
NEW: pipeline_stage_history    # explicit stage transitions for analytics
```

The `contractor_profile` table from v1.1 is **not built in Phase 1**. It activates in Phase 3 when the Branded program launches. Subcontractors live in `subcontractor_roster` only.

### 4.4 Customer-Facing Job View

Customers see a simplified, branded view:
- **Their request** ("Pressure washing, driveway + house").
- **Status** ("We're scheduling you for this Saturday between 9 AM and noon").
- **The team** ("Your One Roof technician will be in a One Roof shirt and drive a vehicle with One Roof signage").
- **Communication** (chat with One Roof, not with the subcontractor).
- **Payment** (deposit if applicable, balance due on completion).

The subcontractor's name and contact info are **not surfaced** to the customer in Phase 1. The subcontractor is an instrument of One Roof's service delivery from the customer's perspective.

### 4.5 The Pricing Cheat Sheet (Operator View)

A first-class screen in the operator console: the pricing reference table from §2 above, kept current as the operator learns. The quote builder pulls starter prices from this sheet but the operator can adjust per-job.

The cheat sheet also surfaces:
- **Bundling prompts** ("Customer requested pressure washing — typical bundle adds gutter cleaning at +$150-200").
- **Margin warnings** if a manual price falls below target margin for the service.
- **Competitive context** (Phase 2+: aggregated win/loss data on price).

### 4.6 Subcontractor Dispatch View

When the operator marks a job as needing subcontractor dispatch:
- Eligible subcontractors filtered by service + availability + rate sheet.
- One-click assignment with auto-populated pay rate from the rate sheet.
- Subcontractor receives the job with: customer address, scope, scheduled time, agreed pay rate, special instructions.
- Subcontractor's app view is read-only on customer details (no customer phone, no customer email — only address and a "message One Roof" button for issues).

### 4.7 Customer Acquisition Tools (the $5K/Month Plan, Productized)

Modeled directly on the partner's $5K/Month Plan (Image 2, panel 3). The operator's lead-generation playbook becomes built-in tooling:

**Neighborhood walk planner**:
- Input: a target neighborhood or address.
- Output: a printable route plan for door-knocking, optimized for 10-20 doors.
- Each door produces a "Knocked, no answer" or "Spoke, interested/not interested" outcome that becomes a lead record (or a "do not contact" flag).
- Door-hanger leave-behind PDF prefilled with the operator's number and area-specific service emphasis.

**Facebook Group post composer**:
- Pre-written post templates for Savannah-area Facebook groups.
- Cadence reminders ("you posted in Savannah Homeowners 6 days ago — consider re-posting").

**Past contacts / network outreach**:
- Contact list with last-contacted timestamps.
- Pre-drafted text messages for asking-for-referrals or check-in outreach.

**Realtor / property manager outreach**:
- Targeted outreach to Savannah realtors and PMs about pre-listing services and turnover work.
- Tracking of which realtors have referred customers.

These tools are **operator-facing only in Phase 1**. They become subcontractor-graduation tools in Phase 3 when subcontractors who graduate to Branded need to find their own customers.

### 4.8 Marketing Asset Library

A shared library of brand assets the operator can request:
- Yard signs (24×18) with operator's number.
- Truck signs / magnets (24×10) with operator's number and service icons.
- Door hangers / leave-behinds.
- Business cards (operator-specific).
- Co-branded social media graphics.

Phase 1 fulfillment is manual (operator emails request → One Roof produces → ships). Phase 2+ automates ordering through the console.

---

## 5. Customer-Facing Brand Promise (Phase 1)

The customer-facing promise simplifies under the GC model:

> *"One call. One team. One Roof. We handle it."*

> *"I handle everything outside your home — pressure washing, gutters, yard cleanup, small repairs and more. Instead of calling 5 different people, I handle it."*

(Both phrasings come directly from the partner's operating materials.)

### 5.1 Customer Pricing (Phase 1)

- **Per-job pricing**, no subscription tier. Free estimates standard.
- **Bundled pricing** prominent: "Combine 2 or more services and save."
- **Recurring discounts** for ongoing services (lawn, pest, gutter quarterly).
- **Free estimates** as a brand promise.

The One Roof+ subscription tier from v1.1 §9.4 is **deferred to Phase 3**. Phase 1-2 customer relationships are transactional with strong rebooking flow; subscription products require platform maturity that Phase 1 doesn't have.

### 5.2 Customer Communication

Phase 1 customer communication runs through:
- **SMS-first** (Twilio). Most Savannah customers prefer text.
- **Voice for new leads** (operator's number rings to operator's phone; eventually a routing layer).
- **Email for estimates and invoices** (Resend).
- **In-platform chat is Phase 2+** (when there's enough volume to justify pulling customers into a portal).

The simplest possible communication stack ships first. Don't force customers into a portal on day one.

---

## 6. Data Model Extensions

Adding to v1.1 §13. Existing entities preserved; new entities for Phase 1 below.

### 6.1 Subcontractor Roster

```
subcontractor_roster
  id (uuid v7)
  operator_id        # which operator this sub is rostered to (Phase 1: single operator)
  name
  trade_categories[] # which services they perform
  identity_doc_url   # ID copy
  insurance_coi_url  # current COI
  insurance_expires
  w9_url             # tax form
  banking_method     # 'ach' | 'check'
  banking_details    # encrypted blob (use libsodium)
  status             # 'active' | 'inactive' | 'on_hold'
  notes              # operator's private notes
  added_at
  added_by_user_id
```

### 6.2 Subcontractor Rate Sheet

```
subcontractor_rate_sheet
  id
  subcontractor_id
  service_id         # FK to trade taxonomy node
  rate_amount        # flat dollar amount
  rate_unit          # 'per_job' | 'per_hour' | 'per_sqft' (per_job is default)
  effective_from
  effective_to
  notes
```

### 6.3 Subcontractor Payout

```
subcontractor_payout
  id
  subcontractor_id
  period_start       # week start
  period_end         # week end
  total_amount
  job_ids[]          # jobs included in this payout
  status             # 'pending' | 'paid' | 'failed'
  paid_at
  payment_method     # 'ach' | 'check' | 'cash'
  reference_number
```

### 6.4 Pipeline Stage History

```
pipeline_stage_history
  id
  job_id             # references the unified job entity (extended below)
  from_stage         # nullable for initial entry
  to_stage           # 'new_lead' | 'contacted' | 'estimate_sent' | 
                     # 'proposal_followup' | 'booked_scheduled' | 'completed_won' | 'lost'
  transitioned_at
  transitioned_by_user_id
  reason             # required when to_stage == 'lost'
  notes
```

### 6.5 Job Entity Extension

Phase 1 collapses `service_request`, `quote`, and `job` from v1.1 §13.3 into a unified `job` entity that lives across all six pipeline stages. The previous separate entities become *views* / *projections* over this unified record:

```
job
  id
  pipeline_stage     # current stage in 6-stage pipeline
  customer_id
  property_id
  service_ids[]      # one or more services (bundling first-class)
  source             # 'door_knock' | 'facebook' | 'referral' | 'realtor_pm' | 'web' | 'phone' | 'repeat'
  source_detail      # free text, e.g., "Sarah Johnson referral"
  
  # Estimate fields (populated when reaching ESTIMATE SENT)
  estimate_amount
  estimate_line_items (jsonb)
  estimate_sent_at
  
  # Booking fields (populated when reaching BOOKED/SCHEDULED)
  scheduled_for
  scheduled_window_minutes
  deposit_amount
  deposit_paid_at
  
  # Execution fields
  assigned_subcontractor_id  # null if operator self-performs
  subcontractor_pay_amount   # from rate sheet
  
  # Completion fields
  completed_at
  invoice_amount
  invoice_paid_at
  payment_method
  
  # Loss fields
  lost_at
  lost_reason
  
  # Timestamps and ownership
  created_at
  created_by_user_id
  last_activity_at
  next_followup_at
```

The `job_event` append-only timeline from v1.1 §13.3 sits underneath this and records every change. The unified `job` row gives the operator a fast denormalized view; `job_event` gives the audit trail.

---

## 7. Revised Phase Plan

Phase 1-2 deliverables restructured around the GC operating model. Phase 3+ matches v1.1 §15 (the marketplace model layers in).

### Phase 0 — Foundation (4-6 weeks)

- Monorepo (Turborepo, shared with Home Doctor).
- Auth (Auth.js v5 with Neon + Drizzle).
- Stripe Billing for customer payments (Stripe Connect deferred to Phase 3).
- Brand identity finalized (in-house design): logo, colors, apparel design, vehicle decal templates, door hangers, yard signs. Order initial physical inventory.
- Domain and Resend setup at oneroofhomes.com.

### Phase 1 — Operator MVP (8-12 weeks)

**Goal:** the operator can run their entire daily business in the platform.

- Authentication and operator onboarding (single operator initially).
- The six-stage pipeline as the home view (§4.2).
- Customer / property records.
- Quote builder using Pricing Cheat Sheet starter prices (§4.5).
- Job execution view with subcontractor dispatch (§4.6).
- Subcontractor roster and rate sheet management.
- SMS-first customer communication (Twilio integration).
- Stripe Billing for customer invoices.
- Subcontractor payout ledger (manual ACH or check execution; ledger tracks).
- Daily Priorities, Week at a Glance, Follow-Up Reminders panels (§4.1).
- Customer acquisition playbook tooling: door-knock route planner, FB post composer, past contacts, realtor/PM tracker (§4.7).

**Launch criterion:** the operator can run a full week of business — lead intake through completed-job invoice — entirely in the platform, with the platform being faster than their current pen-and-paper / spreadsheet workflow.

### Phase 2 — Operator Polish + Subcontractor App (6-8 weeks)

- Subcontractor view (mobile-friendly, read-only on customer details, accept-or-decline assigned jobs).
- Begin Expo build for One Roof Pro (operator + subcontractor share the app, with role-scoped views).
- Marketing asset library with self-service ordering (§4.8).
- Bundled-pricing intelligence in the quote builder.
- Win/loss analytics on lost reason data.
- Recurring service contracts (for pest, lawn, gutter quarterly).
- First operator metrics dashboard for performance tracking.
- Home Doctor integration: receive `recommendation.handoff_requested` events and pre-populate leads.

### Phase 3 — Branded Marketplace Activation (8-12 weeks)

This is where v1.1's marketplace model layers on top of the operator-GC base.

- Public-facing contractor profiles (v1.1 §7.2) for the strongest subcontractors who are ready to graduate to Branded.
- Verified → Branded → Master tier system (v1.1 §8) goes live for graduating subcontractors.
- Direct-to-customer marketplace surface alongside the GC operating surface. Customer requests can route to "have One Roof handle it" OR "choose a Branded contractor directly."
- Stripe Connect onboarding for Branded contractors.
- Public reviews tied to closed jobs (v1.1 §6.5).
- Check-Verified review dimension active (per Home Doctor Addendum N §6).
- One Roof+ subscription tier launches (v1.1 §9.4).
- The operator's role evolves: still runs the GC operating business AND becomes the regional Brand Steward for the Savannah Branded program.

### Phase 4 — Property Management & Dual-Model Operation (6-8 weeks)

- Per v1.1 §15 Phase 4 Property Management features.
- Combined "Home OS" subscription tier with Home Doctor (per Addendum N §5.3).
- The two operating models — GC operating and Branded marketplace — fully coexist. Customers may not know which is fulfilling their request; both feel like One Roof.

### Phase 5 — Home Doctor Deep Integration (4-6 weeks)

- Per v1.1 §15 Phase 5.

### Phase 6+ — Geographic Expansion

- **Atlanta and Charleston** as first expansion metros (per v1.1 §15 Phase 6).
- Each new metro starts as a GC operating business with a local operator (mirroring Savannah Phase 1) and matures into the dual-model state over 12-18 months.
- The operator-GC playbook becomes the franchise/regional-operator template.

---

## 8. Economics Under the GC Model

### 8.1 Revenue Mix (Phase 1)

| Source | Approximate Phase 1 contribution |
|---|---|
| GC margin on customer jobs (target 30% blended) | 100% |
| Subscriptions | 0% (deferred to Phase 3) |
| Marketplace take rates | 0% (no marketplace yet) |
| Property Manager subscriptions | 0% (Phase 4) |

### 8.2 Operator Income Model (Phase 1)

The operator earns from:
- **Self-performed handyman/carpentry work** (~20-30% margin on these jobs at sell price).
- **GC margin on subbed work** (~30% on pressure washing, landscaping, junk, window/gutter; ~15-30% on pest).
- **Bundled multi-service tickets** (which compound margin per customer visit).

Target Phase 1 operator income: $5,000-10,000/month gross profit by month 6 of operations, scaling as roster of subcontractors expands and brand recognition compounds in Savannah.

### 8.3 Platform Economics (EngSec/Anthropic-funded Phase 1)

The platform itself does not extract a percentage from the operator-GC business in Phase 1. The platform exists to enable the operating business and to build the infrastructure that becomes the marketplace in Phase 3.

In Phase 3, when the marketplace activates, platform revenue comes from:
- v1.1 §9.2 take rates on Branded marketplace transactions.
- v1.1 §9.4 customer subscriptions (One Roof+).
- v1.1 §9.6 Property Manager subscriptions (Phase 4).
- Possibly: a small platform fee on operator-GC operations once the platform delivers ROI to the operator.

---

## 9. What This Means for Home Doctor (Cross-Reference)

The Home Doctor integration described in v1.1 §11 and Addendum N is unaffected by the Phase 1 GC model. Specifically:

- **Recommendation handoff** still works: a Home Doctor Check that requires a service hands off into a One Roof lead at the New Lead pipeline stage. The operator-GC then runs it through the pipeline like any other lead. From Home Doctor's perspective, the integration looks identical to the marketplace model.
- **Check-Verified reviews** activate in Phase 3 when Branded contractors and public reviews go live. Phase 1-2 jobs are recorded but reviews are private to the operator (used internally for subcontractor performance).
- **Portfolio entity sync** (Addendum N §4) works regardless — Phase 1 customers may be portfolio-owned or single-household.
- **Liaison Mode (Addendum N §3)** continues as Home Doctor's internal staff workflow; no overlap with One Roof's operator role.

The operator-GC role in One Roof and the Liaison role in Home Doctor are **distinct roles with distinct tooling**. The operator-GC runs an operating business; the Liaison performs Check follow-ups for Home Doctor. A single human could potentially hold both roles in Savannah Phase 1 (the operator might also be a Home Doctor Liaison for some customers), but this is an accident of small-team economics, not an architectural feature.

---

## 10. Resolved Phase 0 Decisions (Modifications to v1.1 §17)

Several of the v1.1 §17 decisions adjust under the GC model:

| §17 Decision | v1.1 Decision | Phase 1 Adjustment |
|---|---|---|
| §17.2 Take rate | 3-10% Branded | **Phase 1: flat-fee per-job to subcontractor; ~30% GC margin retained by One Roof. Phase 3+: v1.1 take rates apply.** |
| §17.3 Brand kit | Free initial / at-cost replacement | **Phase 1: One Roof provides shirts and signage to all roster subcontractors at platform cost (no charge), as a brand-presentation requirement. Phase 3+: v1.1 model applies.** |
| §17.4 Dispute coverage cap | Tiered ($500-$10K) | **Phase 1: One Roof's GL insurance + operator discretion handles disputes. The tiered platform-backed cap applies in Phase 3+ to Branded marketplace jobs.** |
| §17.5 Customer subscription | $9.99/mo One Roof+ | **Phase 1: deferred. Phase 3+: launches per v1.1 §9.4.** |
| §17.7 Background checks | Application-funded | **Phase 1: operator-discretion + reference checks. Phase 3+: Checkr-funded by Branded applicant.** |
| §17.10 Mobile | PWA → Expo | **Unchanged.** Phase 2 builds Expo One Roof Pro shared by operator and subcontractors with role-scoped views. |
| §17.11 Console name | "One Roof Pro" | **Confirmed.** Operator and subcontractor share the One Roof Pro app with role-scoped views. |
| §17.12 Anti-disintermediation | Per §10.4 framework | **Phase 1: simplified per §3.4 above. Phase 3+: full v1.1 §10.4 framework activates.** |

Decisions unchanged: §17.1 Savannah, §17.6 PM pricing (Phase 4 anyway), §17.8 trade association partnerships (Phase 3 anyway), §17.9 in-house design.

---

## 11. Summary — What Changes for Claude Code

When generating code for Phase 1-2, Claude Code should:

1. **Build the six-stage pipeline as the operator's home view**, not separate lead/quote/job/invoice flows.
2. **Use the unified `job` entity** with pipeline_stage, not the v1.1 §13.3 separate `service_request`/`quote`/`job` entities.
3. **Skip building** `contractor_profile`, public profiles, public reviews, and Stripe Connect for contractors. These activate in Phase 3.
4. **Build `subcontractor_roster`, `subcontractor_rate_sheet`, `subcontractor_payout`** as Phase 1 internal-operator-only entities.
5. **Build the customer acquisition playbook tools** (door-knock planner, FB composer, past contacts, realtor outreach) as first-class Phase 1 features.
6. **Use SMS-first communication** (Twilio); skip in-platform customer chat for Phase 1.
7. **Use Stripe Billing** for customer payments; skip Stripe Connect for Phase 1.
8. **Customer never sees subcontractor identity.** Subcontractor app is read-only on customer PII.
9. **The Pricing Cheat Sheet seed data** lives in `packages/trades/savannah_phase1.ts` and drives quote builder defaults.
10. **Brand presentation is enforced by tooling**: shirts shipped automatically when subcontractor onboards, leave-behind PDFs auto-generated per job, etc.

In Phase 3, much of v1.1 activates as written. Claude Code's job in Phase 3 is to *layer* the marketplace on top of the working Phase 1-2 operating system, not to throw it away and start over.

---

*End of Addendum A — One Roof Homes PRD v1.2*  
*Companion: ONE_ROOF_HOMES_PRD_v1.1.md (base spec, marketplace model preserved as Phase 3+ target)*  
*Companion: HomeDoctor_PRD_v1.14_Addendum_N.md (cross-product integration)*  
*Next likely addenda: B — Subcontractor Agreement legal language; C — Operator-onboarding playbook for Phase 6+ regional expansion.*
