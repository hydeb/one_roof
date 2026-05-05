# One Roof Homes — Product Requirements Document

**Subtitle:** End-to-End Home Services Marketplace & Trades Network  
**Company:** EngSec LLC  
**Parent Platform:** Home Doctor  
**Version:** 1.0 | May 2026  
**Status:** Draft — Ready for Claude Code ingestion  

> *"Big enough to handle it. Small enough to care."*

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Strategic Positioning](#2-strategic-positioning)
3. [Users & Personas](#3-users--personas)
4. [Value Propositions](#4-value-propositions)
5. [Product Architecture Overview](#5-product-architecture-overview)
6. [Feature Specifications — Customer Side](#6-feature-specifications--customer-side)
7. [Feature Specifications — Contractor Side](#7-feature-specifications--contractor-side)
8. [Branded Certification Program](#8-branded-certification-program)
9. [Marketplace Economics](#9-marketplace-economics)
10. [Anti-Disintermediation Strategy](#10-anti-disintermediation-strategy)
11. [Home Doctor Integration](#11-home-doctor-integration)
12. [Technical Architecture](#12-technical-architecture)
13. [Data Model](#13-data-model)
14. [Security & Compliance](#14-security--compliance)
15. [Phased Rollout](#15-phased-rollout)
16. [Success Metrics & KPIs](#16-success-metrics--kpis)
17. [Open Questions & Decisions Needed](#17-open-questions--decisions-needed)
18. [Appendix](#18-appendix)

---

## 1. Executive Summary

One Roof Homes is a two-sided platform that connects homeowners with skilled trades professionals — and gives those professionals a back office, a brand, and a lead engine they would otherwise have to assemble piecemeal. It sits alongside **Home Doctor** under the same parent company. Home Doctor surfaces what a home needs and when; One Roof Homes delivers the people and the workflow to get it done.

The product borrows from three category leaders, intentionally:

- **BBB-style trust and dispute infrastructure** — verified credentials, real complaints handled transparently, accreditation tiers that mean something.
- **LinkedIn-style professional graph for trades** — public profiles, endorsements, work history, peer connections, and continuing-education tracking.
- **TenantCloud-style property and workflow management** — for multi-property owners, landlords, and homeowners who treat their home as an asset to maintain.

The unifying brand promise is a **network effect that benefits both sides simultaneously**. A homeowner saying *"that's a One Roof plumber, so they will be great"* is the same coin as a contractor saying *"that's a One Roof customer, so this will go smoothly."* Both expectations must be earned, defended, and reinforced by the platform's operating model.

### 1.1 Strategic Position

One Roof Homes is not a lead-resale marketplace (Angi, HomeAdvisor) and it is not a thin booking layer (Thumbtack). It is closer in spirit to a **franchise network without the franchise capital requirement**: independent contractors get the operational benefits of being part of a recognized brand without giving up ownership of their books, their tools, or their customers.

The wedge is the **back-office burden**. A skilled tradesperson — Billy Harrell, Master Carpenter, 30+ years of experience — is exceptional at the trade and reluctant about everything around it: lead generation, scheduling, invoicing, accounting, taxes, insurance compliance, marketing, and dispute handling. One Roof Homes absorbs that burden in exchange for a transparent per-job margin. The pitch to the contractor is simple: *"Earn $5–$10 less per job and get your evenings and weekends back, plus the brand on your truck."*

### 1.2 Relationship to Home Doctor

Home Doctor is the home health and security operating system: digital twin of the home, AI brain, scheduling and automation, sensor monitoring. When a Home Doctor task requires a human — a leaking pipe, an aging water heater, an HVAC tune-up — that task hands off cleanly into One Roof Homes.

This PRD treats that integration as a first-class concern. Identity, household data, service history, and warranty records are shared via well-defined contracts. Each platform can stand alone, but together they form a closed loop: **Home Doctor predicts and schedules; One Roof Homes executes and reports back.**

---

## 2. Strategic Positioning

### 2.1 The Two-Sided Brand Promise

Most home-services marketplaces fail one side. They are either contractor-extractive (lead fees with no commitment to quality) or customer-extractive (take rates that crush margins and push contractors off-platform). One Roof Homes succeeds only if both sides genuinely prefer to transact through us than around us.

| Audience | Brand Promise | What it means in product |
|---|---|---|
| Homeowners | Every contractor we surface has been verified and is accountable to us, not just to themselves. | Verification badges, dispute escalation, satisfaction guarantee on Branded jobs, transparent ratings. |
| Contractors (Open) | We bring you qualified leads and we do not abuse your data. | No contact-info gating, fair lead distribution, no dark-pattern upsells, opt-in only contact sharing. |
| Contractors (Branded) | We make you part of something larger and we protect your independence. | Brand kit, jobs routed first to Branded, back-office services, dispute shielding. |
| Property Managers | One pane of glass for every door, every trade, every tenant request. | Multi-property dashboard, tenant portal, work-order workflow, recurring service contracts. |

### 2.2 The Network Effect We Are Building

Two phrases should become idiomatic among users:

- **"That's a One Roof plumber."** Said by a homeowner. Means: vetted, insured, on-time, fair price, and if anything goes wrong, the platform stands behind it.
- **"That's a One Roof customer."** Said by a contractor. Means: scope is documented up front, payment is guaranteed, expectations are realistic, and we vouch for the homeowner being a reasonable counterparty.

Both require active curation. Bad contractors must be removable. **Bad customers must also be removable** — a two-sided trust system that only flows in one direction is not trust.

### 2.3 The Anti-Disintermediation Problem

The hardest strategic problem in this product is the **second-job problem**: the customer hires a contractor through One Roof, has a great experience, and on the next job calls them directly. The contractor pockets full margin, the customer gets a small discount, and the platform gets nothing.

Our defense is not contractual — non-circumvention clauses are toothless and brand-poisoning. Our defense is **structural**. See [Section 10](#10-anti-disintermediation-strategy) for the full treatment. It is the most important section in this document.

---

## 3. Users & Personas

### 3.1 Homeowner Personas

#### Persona A — The Proactive Homeowner
Owns or occupies a single-family home. Health- and safety-minded, treats the home as a system. Will pay for a subscription that buys peace of mind. Likely entry path: Home Doctor recommends a service; One Roof Homes fulfills it. Overlaps with the Home Doctor primary persona.

#### Persona B — The Reluctant DIYer
Used to do small jobs themselves, now time-starved. Wants a trusted person, not a marketplace, but doesn't have one. **Highest churn risk**: the moment they find a contractor they trust, they will try to keep that relationship off-platform. This persona drives Section 10.

#### Persona C — The Multi-Property Owner / Small Landlord
Owns 2–10 doors. Currently uses spreadsheets, text messages, and a rolodex. TenantCloud-style features speak to them. **Highest LTV.** Recurring services (HVAC, lawn, pest, gutter) are the wedge.

#### Persona D — The Tenant
Sub-user of a multi-property owner. Submits maintenance requests, sees status, rates the experience. Does not own the household record but participates in it. Permissioned access only.

### 3.2 Contractor Personas

#### Persona E — The Master Tradesperson, Solo or Small Shop (Billy Harrell archetype)
30+ years in the trade, multi-discipline, excellent at the work. Dislikes administrative overhead but uses a smartphone. Word-of-mouth is their entire pipeline. Will join the platform if onboarding is dignified and back-office benefits are real. **This is the highest-value contractor persona** because of brand strength: a One Roof Branded Master Tradesperson is the platform's product, not merely its supply.

*Reference: Billy Harrell, Master Carpenter & Handyman — Carpentry (Exterior & Interior), Remodeling/Renovation, Painting, Concrete. Tagline: "Big enough to handle it. Small enough to care."*

#### Persona F — The Growing Trade Business (2–15 employees)
Has a truck or two, an LLC, a real website, and an aging QuickBooks file. Wants to grow without hiring more office staff. Best customer for back-office services and dispatcher-tier features.

#### Persona G — The Licensed Specialist (HVAC, electrician, plumber)
Licensed trade with regulatory overhead. Insurance and licensing verification matter most. Wants vetting handled efficiently.

#### Persona H — The Open / Non-Affiliated Contractor
Wants leads but not ready to commit to the Branded program. Listed in the directory, available to customers, without the One Roof badge. A pipeline into the Branded tier.

### 3.3 Internal Personas

- **Vetting Officer** — background, license, and insurance verification.
- **Brand Steward** — maintains certification standards, audits jobs, manages brand-kit fulfillment.
- **Dispute Handler** — owns customer/contractor escalations end-to-end.
- **Lead Operator** — monitors marketplace dynamics, lead quality, fill rates.
- **Back-Office Services Team** — bookkeeping, 1099 prep, insurance brokerage liaison.
- **Platform Admin** — system administration, RBAC, audit, security incidents.

---

## 4. Value Propositions

### 4.1 To the Homeowner

- A pre-vetted pool of contractors with verifiable licenses, insurance, and background checks.
- Clear, comparable profiles — like LinkedIn, but the resume is jobs-completed, certifications, and peer endorsements.
- Real ratings tied to real, completed jobs — no review-stuffing, no anonymous one-stars.
- Transparent quoting and scope locking before work begins. Change orders are tracked, not surprises.
- On-platform messaging, scheduling, and payment — no chasing the contractor's text thread.
- A complete maintenance record for the home that travels with the property and feeds Home Doctor.
- A **One Roof guarantee** on Branded jobs: if the work fails within the warranty window, we make it right.

### 4.2 To the Contractor

The pitch is not "more leads." Many platforms promise that and few deliver. The pitch is the **back office and the brand**.

#### 4.2.1 Back-Office Services (the real wedge)

- Lead generation handled by us — qualified, scoped, geo-matched.
- Quote-to-invoice workflow built in. No more PDFs in email.
- Payments processed via Stripe Connect. Funds typically land next business day.
- Bookkeeping integration — categorized expenses and revenue, exportable to QuickBooks or our own ledger.
- 1099 / Schedule C prep at year-end. We hand you the document; you sign it.
- Insurance brokerage relationships — GL, Workers' Comp, Bond — at group rates.
- Dispute liability handled by our team for Branded contractors; you focus on the next job.
- Continuing-education tracking and license-renewal reminders.

#### 4.2.2 Brand and Identity

- One Roof-branded apparel (shirt, hat, jacket) and vehicle decals at cost or platform-subsidized.
- Co-branded business cards (*"Billy Harrell — One Roof Certified Master Carpenter"*).
- Public profile that reads as a professional resume, not a profile in a directory.
- Endorsements from other contractors and customers, weighted in the trust score.
- *"Powered by One Roof Homes"* footer available for the contractor's own existing website.

#### 4.2.3 Network Effects

- **Co-op with other contractors**: the carpenter on a remodel hands off the electrical to a One Roof electrician without losing the customer relationship.
- Subcontractor matching for jobs outside scope.
- Mentorship pairings — a Master Tradesperson can credential apprentices through the platform.

#### 4.2.4 The Transparent Margin Pitch

If the platform takes $5–$10 per job (or a percentage equivalent), the contractor must clearly see what they got in return: leads, payment processing, bookkeeping ledger entry, brand kit allocation, dispute coverage. **We publish this breakdown on every invoice.**

### 4.3 The Combined Value Loop

The platform earns its take only if both sides feel they came out ahead. The compounding loop:

1. Customer hires a Branded contractor through One Roof Homes.
2. Contractor delivers; back office is automatic; brand kit travels with them.
3. Customer rates the job; record lands in home maintenance file.
4. Customer's home benefits compound (warranty tracking, recurring discounts, Home Doctor handoff).
5. Contractor's profile benefits compound (job history, endorsements, certifications).
6. Both sides are now structurally worse off going around the platform than through it.

---

## 5. Product Architecture Overview

Five primary surfaces plus a public directory and a Home Doctor bridge:

| Surface | Audience | Primary Purpose |
|---|---|---|
| Customer Console | Homeowners, tenants | Manage the home, request services, browse and book contractors, payments and reviews. |
| Contractor Console | Independent and Branded contractors | Manage profile, find leads, accept jobs, run jobs, invoice, bookkeeping, peer networking. |
| Public Directory | Anonymous visitors | Searchable contractor and company profiles. SEO surface. LinkedIn-for-trades public face. |
| Property Management Console | Multi-property owners, landlords | Multi-door dashboard, tenant access, recurring services, work-order workflow. |
| Admin Console | Internal staff | Vetting, brand stewardship, disputes, marketplace operations, audit and compliance. |
| Home Doctor Bridge | Both platforms | Identity SSO, household sync, service handoff, warranty and history sync. |

### 5.1 Tenancy & Identity Model

A user is one identity across the platform. They may hold one or more roles simultaneously: `customer`, `tenant`, `contractor_independent`, `contractor_branded`, `contractor_member`, `property_manager`, `internal_staff`. The role grant model is the same pattern used in Home Doctor v1.0 §9.3 and is intentionally compatible.

A homeowner who is also a part-time handyman can hold both roles — the system never forces them to choose. Switching context is a single UI affordance, not a re-login.

### 5.2 Account Hierarchies

- **Individual Homeowner** → owns one or more `Household`s → each has one or more `Property` records.
- **Property Manager** → owns one or more `Portfolio`s → contains many `Property` records → each may have a `Tenant` sub-user.
- **Independent Contractor** → solo, single `Profile`, single `ServiceArea`.
- **Contractor Company** → owns one or more `Location`s → has many `Member`s (technicians, dispatchers, owners).
- **Internal Staff** → role-scoped with audit-logged actions.

---

## 6. Feature Specifications — Customer Side

### 6.1 Onboarding & Home Profile

- Email or phone signup; OAuth via Google/Apple; magic-link option.
- Address verification via geocoding; the property is the unit of work, the household is the unit of ownership.
- Property type: SFH, condo, townhouse, multi-family, vacant lot.
- Optional Home Doctor sync prompt: *"You already have a household in Home Doctor. Link it?"*
- Initial inventory walkthrough (light): roof age, HVAC type and age, water heater, primary materials.
- Optional deeper digital twin: parcel data import, photo upload, room-by-room breakdown (handed to Home Doctor).

### 6.2 Service Request Flow

1. Customer initiates a request: free-text plus structured trade taxonomy (e.g., Plumbing → Drain → Slow drain).
2. System suggests a scope template for the trade with required photos and questions.
3. Customer picks: Branded only, Open marketplace, or Both (default: Both with Branded surfaced first).
4. System matches based on geography, availability, trade fit, and trust score.
5. Up to 3 contractors are invited to quote; customer can request more if no fit.
6. Quotes return with itemized line items, scope, and timing. Customer accepts one.
7. Booking confirmed; calendar holds placed for both sides.
8. Pre-job checklist runs (access, parking, pets, scope confirmation).
9. Job performed; in-progress photos optional but encouraged for warranty.
10. Job closed by contractor; customer signs off (with optional change-order acknowledgement).
11. Invoice generated and paid through the platform.
12. Both parties rate; review is tied to the closed job ID.

### 6.3 Browsing and Matching

- Directory browse: filter by trade, distance, rating, Branded status, availability, language, accessibility.
- Profile view: resume-style — overview, trades, certifications, recent jobs, endorsements, ratings, response time.
- Save / shortlist favorites; "My contractors" list.
- Direct message a contractor before booking (rate-limited, anti-spam, anti-poaching guardrails).

### 6.4 Payments & Invoicing

- Stripe-backed checkout: card, ACH, Apple/Google Pay.
- Deposits supported: configurable by job type and contractor tier. Default 0% for small jobs, 25% for jobs >$1,500, 50% for jobs >$5,000.
- Escrow option for large jobs: funds held until customer signoff.
- Receipts and invoices stored on the household record indefinitely.
- 1099 reporting handled at the contractor's end automatically.

### 6.5 Reviews and Ratings

- Reviews can only be submitted by the customer who paid for a closed job. No drive-by reviews.
- Ratings are multi-dimensional: quality, timeliness, communication, cleanliness, value.
- Contractors see ratings before they go fully public; can request a review of abusive ratings within 7 days.
- **Customers can also be rated by contractors.** Customer ratings are aggregated and visible to contractors during matching but are not public.
- BBB-style "complaint history" view shows formal complaints (separate from reviews) and their resolution status.

### 6.6 Service History and Maintenance Records

- Every closed job appears in the home's permanent maintenance record.
- Photo-before, photo-after, scope, parts list, warranty terms, and contractor identity all linked.
- Records are exportable as PDF for resale due diligence ("every contractor receipt, in one packet").
- Records sync to Home Doctor's home-health timeline.

### 6.7 Property Management Console (Multi-Door)

- Portfolio dashboard: doors, occupancy, last-service-date by trade, upcoming preventative work.
- Tenant portal: maintenance request submission, status, scheduling consent.
- Recurring service contracts: HVAC quarterly, lawn weekly, pest monthly.
- Per-property budgets and YTD spend by trade.
- Document vault for leases, inspection reports, warranty docs.

---

## 7. Feature Specifications — Contractor Side

### 7.1 Onboarding & Verification

1. Identity verification: government ID, real-time selfie match, optional Stripe Identity.
2. Trade declaration: which trades, license numbers per trade where applicable.
3. License verification: state-by-state lookup against issuing authority where APIs exist; manual upload + reviewer where they don't.
4. Insurance verification: Certificate of Insurance upload; carrier callback for high-tier verification.
5. Background check: third-party (Checkr or equivalent), customer-funded for Branded path.
6. Banking via Stripe Connect Express onboarding.
7. Service area: ZIP-code or radius selection; max travel preferences.
8. Profile authoring: bio, photos, work samples (with customer permission), certifications, languages.
9. Pricing model: hourly, flat-rate, custom-quote, or per-trade.
10. Optional: schedule sync to Google or Apple Calendar.

### 7.2 The LinkedIn-Style Public Profile

- **Hero section**: photo, name, headline (e.g., *"Master Carpenter & Handyman — 30+ years experience"*), location, trust badges.
- **About** prose section.
- **Trades and skills** with self-rating + endorsement count from peers and verified customers.
- **Certifications and licenses** with verified-by-One-Roof badges.
- **Work history**: previous employers and own-business years.
- **Featured jobs**: photos and short writeups (with customer consent).
- **Recommendations**: short written endorsements from customers or peers.
- **Network**: connections to other contractors (mutual).
- **Activity**: certifications earned, posts to the trades feed.

### 7.3 Lead Generation and Job Acceptance

- Inbound feed of qualified leads ordered by: Branded → tier → recency → fit.
- Each lead shows: scope, photos, customer trust score, urgency, geographic fit, expected job size.
- Accept / decline / counter-quote actions inline.
- First-response timer visible — fast response is a ranking signal.
- Lead deduplication: a single customer request fans out to a bounded set of contractors, not a free-for-all.
- Anti-cherry-picking: contractors who accept and then ghost are flagged and de-prioritized.

### 7.4 Quote → Schedule → Run → Invoice

- Quote builder with line-items, parts catalog, labor estimates, change-order workflow.
- Calendar view across all jobs; route optimization (Phase 2+).
- In-app job execution: clock in, clock out, photos, notes, parts used, signatures.
- Auto-invoicing on close. Payment terms enforced by platform.
- "Mark warranty" on parts and labor; warranty record is platform-tracked.

### 7.5 Co-op and Sub-Contracting

- Refer a job to another One Roof contractor with one click; platform handles split-payout if agreed.
- Subcontractor invitation: bring your trusted electrician onto a remodel with a fast-track verification flow.
- **Mentorship**: a Master can sponsor an apprentice; sponsorship is visible on the apprentice's profile and counts toward certifications.

### 7.6 Back-Office Services

- Bookkeeping ledger: every job in, every payout out, every fee broken down.
- Expense capture: snap a receipt, categorize, attach to a job or to general overhead.
- Mileage tracker (opt-in).
- Year-end Schedule C-ready exports; partner CPA review tier.
- 1099-K and 1099-NEC generation handled by platform.
- Insurance dashboard with renewal reminders and group-rate quotes.
- License renewal tracker tied to issuing authority data.

### 7.7 Continuing Education & Certifications

- Content library: short courses on safety, code updates, trade-specific best practices.
- Completed courses generate verifiable badges on the profile.
- Some courses are gating requirements for Branded eligibility (see §8).
- CE credits tracked for trades that require them; reportable to issuing authorities.

### 7.8 Networking Feed

- Trades-only feed where contractors can post tips, photos of finished work, and problem-solving questions.
- Connection model: mutual connection request, with optional "I have worked with this person" attestation.
- Recruitment: Branded shops can post hiring needs to the feed.

---

## 8. Branded Certification Program

The Branded program is the heart of the brand. It is the difference between "a contractor on our platform" and "a One Roof contractor." It must be earned, defensible, and revocable.

### 8.1 Eligibility Requirements

| Requirement | Threshold |
|---|---|
| Identity verification | Required, full |
| License verification | Required for licensed trades; verified against issuing authority |
| Insurance | Active GL minimum $1M per occurrence; trade-appropriate coverage |
| Background check | Clear (no relevant felonies in 7 years) |
| On-platform jobs completed | Minimum 5 closed jobs as Independent before Branded eligibility |
| Average rating | ≥ 4.6 across last 20 jobs |
| Response time | Median first-response < 4 business hours |
| Dispute rate | < 5% of closed jobs |
| Branded knowledge test | Pass written + scenario-based assessment per trade |
| Code-of-conduct attestation | Signed annually |

### 8.2 The Branded Knowledge Test

Per-trade. Two parts:

1. **Trade competency** — code knowledge, safety, common-failure diagnostic scenarios. Authored with subject-matter advisors per trade.
2. **Platform competency** — how to use the platform, customer-experience standards, dispute escalation, brand presentation, what *"Big enough to handle it. Small enough to care."* means in practice.

The test is not a hazing ritual. A 30-year master should pass the trade portion almost effortlessly. The platform portion ensures they understand how we expect them to represent the brand.

### 8.3 Brand Kit

- One Roof-branded shirts (multiple cuts, climate-appropriate options), hats, jackets, vests.
- Vehicle decals (magnetic optional, vinyl optional).
- Co-branded business cards with contractor photo and trade headline.
- Optional yard signs for active job sites.
- **Pricing**: Tier 1 Branded gets initial kit free; replacements at cost. Tier 2 Master gets quarterly refresh.

### 8.4 Certification Tiers

| Tier | Badge | Earned by |
|---|---|---|
| One Roof Verified | `VERIFIED` | Identity, license, insurance, background check passed. Open marketplace listing. |
| One Roof Branded | `BRANDED` | All of Verified + eligibility thresholds in §8.1 + passed knowledge test. |
| One Roof Master | `MASTER` | Branded + 100+ closed jobs + 4.8+ rating sustained 12 months + mentorship of ≥ 1 apprentice. |

### 8.5 Quality Audits & Mystery Shops

- Random sampling of completed Branded jobs for follow-up customer interview.
- Annual "mystery booking" — a vetted mystery shopper books a representative job.
- Photo audits of finished work.
- All audit data informs Branded standing.

### 8.6 Revocation

Branded status can be paused or revoked for: pattern of low ratings, dispute pattern, lapsed insurance or license, code-of-conduct violation, off-platform poaching of platform-sourced customers (see §10), or fraud. Revocation is escalated, documented, and appealable. A revoked Branded contractor may continue as Verified if they remain compliant.

---

## 9. Marketplace Economics

### 9.1 Revenue Streams

1. **Per-job take rate** from contractors — differentiated by tier.
2. **Customer subscription** (optional): One Roof+ for power users.
3. **Back-office services tier** for contractors — sticky monthly revenue.

### 9.2 Contractor Take Rates (pilot proposal, to be tuned)

| Tier | Take Rate | What's Included |
|---|---|---|
| Open / Independent | 3–5% or flat $5–$10/job | Lead routing, scheduling, payments, basic ledger. No brand kit. Limited dispute support. |
| Branded — Solo | 8–10% | All Open features + brand kit + back-office Lite (bookkeeping export, 1099 prep) + full dispute coverage + Branded ranking. |
| Branded — Pro (Back-Office Plus) | Mid % + monthly subscription | All Branded features + managed bookkeeping, expense automation, mileage, group-rate insurance, CPA-reviewed Schedule C. |

### 9.3 The "$5–$10 Less" Math, Made Explicit

The contractor-side pricing must be honest and comparable. The counter-cost — what it would cost them to replicate what they get — must net to greater than the take. Approximate self-procured cost per month for a working solo Branded contractor:

| Service | Approx. self-procured cost |
|---|---|
| Lead generation (paid ads, listing fees) for ~30 jobs/month | $300–$1,000+ |
| Bookkeeping (software + occasional CPA touch) | $50–$250 |
| Year-end tax prep (Schedule C, depreciation, expenses) | $300–$800/year amortized |
| Insurance brokerage time and shopping | Hours of opportunity cost |
| Branded apparel and vehicle marketing | $200–$500 setup, ~$50/mo amortized |
| Dispute legal-leaning support when needed | Variable, can be catastrophic |
| License/CE renewal tracking and admin | $0–$50/mo of opportunity cost |

**If the platform credibly delivers all of the above for a take rate that nets to less than the contractor's self-procured equivalent, the deal is sound on first principles.** The platform's job is to keep that math honest.

### 9.4 Customer Pricing

- **Free** to use the marketplace. No paywalled contractor browsing, no hidden fees on the customer side.
- **One Roof+** (optional subscription): warranty extensions, priority booking, multi-property unlock, recurring-service discounts. Pilot pricing: $9.99/mo or $79/yr.
- **Property Management tier**: per-door pricing for portfolios above 5 doors.

### 9.5 Payment Flows (Stripe Connect)

- Customer pays platform; platform splits payout to contractor minus take rate. Standard Stripe Connect destination charges with application fees.
- Escrow-style holds for large jobs implemented as delayed transfers.
- Refunds and partial refunds supported through dispute workflow.

---

## 10. Anti-Disintermediation Strategy

This section deserves disproportionate attention because it determines whether the platform survives. Every feature in this PRD should be evaluated against: **does this make it harder or easier for the relationship to leak off-platform?**

### 10.1 What We Will Not Rely On

- **Non-circumvention contracts.** Unenforceable in practice and brand-poisoning.
- **Hiding contact info forever.** Customers will demand a phone number on the day of the job, and they should have it.
- **Antagonizing either side.** The product must accept that humans form relationships. That is fine.

### 10.2 Structural Defenses

#### 10.2.1 The Back Office as Moat

If the contractor leaves the platform, they go back to chasing payments, tracking expenses, filing self-employment taxes, finding insurance, and explaining to customers why they don't have an invoice system. The back office is the most durable lock-in we can build, because it is **genuine value, not friction**.

#### 10.2.2 Liability Shifting

Branded jobs include platform-backed dispute coverage, a satisfaction guarantee, and a warranty backstop. None of that survives off-platform. A contractor who poaches a customer takes on full liability for the next interaction with no platform shield. This is communicated clearly during onboarding, not buried in the ToS.

#### 10.2.3 The Brand

The shirt, the hat, the truck decal, the business card — these are platform-issued and platform-revocable. A contractor who stops being a One Roof contractor stops representing as one. The brand creates trust on the doorstep, and that trust belongs to the network until the contractor has earned an independent reputation under their own name.

#### 10.2.4 The Home Record

The home maintenance record only exists on-platform. A homeowner selling their house with a complete *"every contractor, every receipt, every warranty"* packet has a real selling tool. That packet only exists if the work was on-platform.

#### 10.2.5 The Warranty

Warranty is platform-administered. If a water heater install fails 18 months in and the install was off-platform, the homeowner calls the contractor and hopes. If the install was on-platform, the homeowner calls the platform and the platform stands behind the resolution.

#### 10.2.6 Loyalty and Repeat-Customer Rewards

Both sides accumulate compounding value when they keep transacting on-platform. Customers earn credits and priority. Contractors earn ranking and reduced take rates over time. Off-platform jobs reset nothing because they are invisible to the system — but they do not help either side's standing.

#### 10.2.7 Detection Without Surveillance

We do not surveil contractor texts or emails. But we watch pattern signals: a contractor who consistently completes one job per customer and never sees a repeat, while peers in the same trade see strong repeat rates, is a signal worth investigating. Detection triggers a **relationship-building outreach** ("How can we help you serve repeat customers better?"), not a punishment trigger.

### 10.3 What We Will Allow

- A customer can rebook the same contractor on-platform with zero friction. "My contractors" list and rebooking are first-class flows.
- A contractor can run their own business off-platform for non-One-Roof leads they sourced themselves. Brand kit does not travel; their skills and tools are their own.
- A contractor and a customer can become friends. We do not interfere with humans being humans. We just make it irrational to take the friendship off-platform for transactions.

---

## 11. Home Doctor Integration

Home Doctor and One Roof Homes share a parent company and will share the following:

### 11.1 Identity & SSO

- Single shared identity provider; a user authenticates once and is recognized across both products.
- Roles are scoped per product but visible cross-product (a Home Doctor homeowner is automatically a One Roof homeowner if they accept the link).
- Auth.js v5 with Neon-backed session and account tables; shared JWT issuer or OIDC between the two deployments.

### 11.2 Household & Property Sync

- Household and property records are the same conceptual entity. Source of truth is whichever product the user created the property in; the other product mirrors via a sync contract.
- Sync contract is event-driven (`property.updated`) with idempotent handlers and last-writer-wins on non-conflicting fields.

### 11.3 Service Handoff (most important integration point)

When Home Doctor recommends a service (e.g., *"Your HVAC is due for a tune-up"*), the user can accept and be deep-linked into a pre-populated One Roof service request — trade selected, scope template chosen, photos and history attached, geo match underway.

- Deep link format: `oneroofhomes.com/request/new?from=homedoctor&recommendationId={id}`
- The recommendation context is preserved on the resulting `Job` record so the closed-loop signal flows back to Home Doctor (*"recommendation fulfilled"*).

### 11.4 Warranty & Maintenance History Sync

- Every closed One Roof job emits a maintenance event to Home Doctor's home-health timeline.
- Warranty terms (parts, labor, duration) become Home Doctor reminders.
- Failures detected by Home Doctor sensors within warranty window trigger an automatic warranty claim flow on One Roof.

### 11.5 Cross-Promotion

- One Roof customers without Home Doctor see a *"Track this in your home record"* prompt at job close.
- Home Doctor users without a One Roof contractor history see Branded contractors in their area on the Home Doctor service tab.

### 11.6 Division of Responsibility (scope adjustment)

Per product strategy, Home Doctor's scope narrows on service execution; it leans on One Roof for that capability.

| Capability | Home Doctor | One Roof Homes |
|---|---|---|
| Digital twin of the home | **Owner** | Consumer |
| AI predictive recommendations | **Owner** | Consumer |
| Sensor monitoring | **Owner** | — |
| Service request workflow | Hand-off | **Owner** |
| Contractor profiles & directory | — | **Owner** |
| Job execution & invoicing | — | **Owner** |
| Warranty record | Mirror (read) | **Owner** |
| Maintenance timeline UI | **Owner** | Mirror (read) |
| Recurring contracts | Reminders only | **Owner** of execution |

---

## 12. Technical Architecture

### 12.1 Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui |
| Hosting | Vercel (Pro tier; ISR + Edge for marketing/directory) |
| Database | Neon Postgres (branching for preview envs, per-PR previews) |
| ORM | Drizzle ORM with drizzle-kit migrations |
| Auth | Auth.js v5 (NextAuth) with Drizzle adapter; OAuth + magic link + WebAuthn (passkeys) |
| Payments | Stripe Connect (Express accounts for contractors, destination charges) |
| File storage | Vercel Blob (job photos, COIs, license docs); short-lived signed URLs |
| Search | Postgres FTS + trigram for v1; Algolia or Typesense if scale demands |
| Maps / geocoding | Mapbox or Google Maps (TBD by cost and feature needs) |
| Background jobs | Inngest (preferred) or QStash for scheduled and event-driven tasks |
| Notifications | Resend (email), Twilio (SMS), Web Push (PWA) |
| Real-time messaging | Pusher Channels or Ably; Server-Sent Events for status updates |
| Mobile | Phase 1: PWA-first with installable home screen. Phase 2+: Expo React Native shell |
| Monitoring | Vercel Analytics + Sentry; OpenTelemetry traces; Neon-level query logging |
| Feature flags | Vercel Edge Config or Statsig |
| Email parsing | Postmark inbound + worker (1099 docs, COI emails) |

### 12.2 Repository Layout (Turborepo monorepo, shared with Home Doctor)

```
apps/
  one-roof-web/          # Next.js — customer + contractor + property manager + admin
  one-roof-marketing/    # Next.js — public marketing + directory (separate deploy for SEO)
  home-doctor-web/       # (existing, separate deployment)

packages/
  ui/                    # shadcn/ui-based component library, theme tokens, design system
  db/                    # Drizzle schema + migrations (shared cross-product where applicable)
  auth/                  # Auth.js v5 config, role-grant logic, RLS helpers
  payments/              # Stripe Connect helpers, split-payout logic
  notifications/         # Resend / Twilio / Web Push abstractions
  search/                # Search adapters (Postgres FTS, Algolia shim)
  trades/                # Trade taxonomy, scope templates, matching scoring
  trust/                 # Background-check integration, verification, dispute scoring
  events/                # Cross-product event bus contracts and handlers
  config/                # Shared ESLint, tsconfig, Tailwind preset
```

### 12.3 Route Architecture (Next.js App Router)

```
apps/one-roof-web/app/
  (auth)/
    login/
    signup/
    verify/

  (customer)/
    home/                  # household dashboard
    properties/
    requests/              # service request flow
    jobs/                  # job tracking, signoff
    contractors/           # browse, favorites, profiles
    payments/
    history/               # maintenance records
    settings/

  (contractor)/
    dashboard/             # daily overview: leads, jobs, earnings
    profile/               # public profile editor
    leads/                 # inbound lead feed
    jobs/
      [id]/                # job detail, clock-in, photos, invoice
    schedule/
    invoicing/
    bookkeeping/
    insurance/
    learning/              # CE courses and certifications
    network/               # LinkedIn-style connections and feed
    settings/

  (property-manager)/
    portfolio/
    properties/[id]/
    tenants/
    work-orders/
    contracts/             # recurring service contracts
    reports/

  (admin)/
    vetting/
    branded/
    disputes/
    marketplace/
    audit/

  api/
    v1/
      webhooks/
        stripe/
        checkr/
        homedoctor/
```

### 12.4 RBAC and Authorization

**Roles:**
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

- Role grants are scoped: per-household, per-company, or global.
- Authorization checks live in `packages/auth/access.ts` — a single source of truth for route handlers, server actions, and background workers.
- Postgres Row-Level Security policies as a defense-in-depth layer below application checks.
- A user may hold multiple roles simultaneously; context switching is a UI concern, not a session concern.

### 12.5 Real-Time and Eventing

- Job status changes, message arrival, lead arrival, dispute updates: published to Pusher channels scoped per-user and per-job.
- Cross-product events (Home Doctor ↔ One Roof) flow through a typed event bus (`packages/events`) backed by Inngest, with at-least-once delivery and idempotent handlers.
- Outbox pattern: `event_outbox` table with Inngest worker polling, prevents dual-write inconsistency.

### 12.6 Search & Matching

- **Directory search**: Postgres FTS + trigram indexes on name, headline, trade names; geo bounding via PostGIS or `earth_distance` + `cube` extensions (Neon supports both).
- **Lead matching**: scoring function over (geo distance, trade match score, trust score, availability, response-time history, capacity heuristic, fairness modifier). Weights are config-driven and A/B-testable.
- **Fairness modifier**: prevents top contractors from monopolizing leads at the expense of newly-Branded contractors who need to build a job history.

---

## 13. Data Model

All primary keys are UUID v7. Column naming is `snake_case`. Drizzle schema lives in `packages/db/schema/`. This section is entity-level; field-level schemas live in the codebase.

### 13.1 Identity & Tenancy

```
user                     # the person; one row per real human
user_role_grant          # (user_id, role, scope_type, scope_id) — multi-role support
session                  # Auth.js sessions
account                  # Auth.js OAuth accounts
verification_token       # magic link tokens

household                # a homeowner's logical home unit; owns properties
property                 # physical address; belongs to a household or portfolio
portfolio                # property-management grouping
tenant                   # sub-user attached to a property
homedoctor_link          # pointer to Home Doctor's household_id
```

### 13.2 Contractor & Company

```
contractor_profile       # public profile: headline, bio, photos, trust_score
contractor_company       # company-level entity for non-solo contractors
contractor_member        # (user_id, company_id, role): owner | dispatcher | technician | apprentice
contractor_trade         # (contractor_id, trade_id, proficiency_self_rating, endorsement_count)
trade                    # taxonomy node: (id, name, parent_id, scope_template_id)
certification            # earned platform or external certification
license                  # (contractor_id, type, number, jurisdiction, expires_at, verified_at)
insurance_policy         # COI metadata (carrier, policy_number, coverage_amount, expires_at)
background_check         # (contractor_id, provider, status, completed_at, expires_at)
brand_kit_allocation     # per-contractor allocation of apparel and decals
branded_status           # current tier, effective_at, audit_history (jsonb)
service_area             # (contractor_id, geometry or zip list, max_travel_miles)
```

### 13.3 Service & Job

```
scope_template           # per (trade_id, sub_trade_id): required photos, questions, line-item suggestions
service_request          # customer-initiated request (property_id, trade_id, description, photos)
quote                    # contractor response to a service_request (line_items jsonb, total, eta)
job                      # accepted, scheduled, executed work
job_event                # append-only timeline: created | quoted | accepted | in_progress | 
                         #   paused | completed | disputed | cancelled | closed
change_order             # scope change during a job (requires both-party acknowledgement)
job_photo                # before/after/in-progress photos attached to a job
warranty                 # (job_id, parts_warranty_months, labor_warranty_months, notes)
invoice                  # generated at job close
payment                  # Stripe PaymentIntent record
payout                   # Stripe Transfer to contractor's Connect account
recurring_service_contract  # (property_id, trade_id, frequency, contractor_id, next_due_at)
work_order               # tenant-initiated maintenance request
```

### 13.4 Trust, Reviews, Disputes

```
review                   # multi-dimensional rating tied to a closed job (quality, timeliness, 
                         #   communication, cleanliness, value)
customer_score           # derived score per customer; visible to contractors during matching, not public
trust_score              # derived score per contractor; recomputed on job events
complaint                # formal complaint, distinct from review (BBB-style; public + resolution status)
dispute                  # open dispute case with assigned dispute_handler; links to job
endorsement              # peer or customer endorsement on a contractor_trade
```

### 13.5 Networking & Learning

```
connection               # mutual connection between two contractor_profiles
post                     # feed post (contractor_id, content, photos, trade_tags)
post_reaction            # likes/reactions on posts
course                   # learning content (title, trade_ids, ce_credits, is_branded_gating)
course_module            # sections within a course
course_completion        # (user_id, course_id, completed_at, score, badge_issued)
mentorship               # (mentor_id, apprentice_id, sponsored_at, active)
```

### 13.6 Back-Office (Contractor)

```
ledger_entry             # (contractor_id, job_id?, amount, type: payout|fee|expense, category)
expense                  # (contractor_id, amount, category, receipt_url, job_id?, date)
mileage_log              # (contractor_id, job_id?, miles, date)
tax_document             # (contractor_id, type: 1099_K|1099_NEC|Schedule_C_export, year, url)
insurance_reminder       # (contractor_id, policy_id, trigger_at, status)
license_reminder         # (contractor_id, license_id, trigger_at, status)
```

### 13.7 Cross-Product Bridge

```
recommendation_handoff   # inbound Home Doctor recommendation → service_request linkage
event_outbox             # outbound events to Home Doctor (append-only, processed by Inngest)
event_inbox              # inbound events from Home Doctor (idempotent, keyed by external_event_id)
```

---

## 14. Security & Compliance

Given the parent company's cybersecurity posture, security is a first-class deliverable. The platform handles PII (homeowners and contractors), sensitive financial data (1099s, bank details via Stripe Connect), and verification artifacts (driver's licenses, insurance certificates).

### 14.1 Threat Model (Summary)

A full TARA-style companion document will be produced separately. Summary:

| Asset | Threat | Impact | Top Mitigations |
|---|---|---|---|
| Customer PII (address, household) | Unauthorized access by other users or insiders | High | Auth.js + RBAC + RLS + audit log; least-privilege admin roles |
| Contractor identity docs (DL, verification data) | Data breach, insider misuse | High | Encrypted-at-rest; short-lived signed URLs; vendor-managed (Stripe Identity, Checkr) where possible — minimize what we hold |
| Payment data | Card-data theft | High | Stripe-tokenized only; no card data on our side; PCI SAQ-A scope |
| Bank/payout info | Account takeover | High | Stripe Connect manages; Stripe-issued sessions for changes |
| Job photos (interior of homes) | Privacy exposure | Medium | Authenticated access only; signed URLs; default deny on public sharing |
| Reviews & ratings | Manipulation, brigading | Medium | Reviews tied to closed job ID; rate-limit; abuse review queue |
| Lead routing | Lead leaks to external parties | Medium | Server-side scoring; signed lead tokens; no client trust |
| Account takeover | Phishing, credential stuffing | High | Magic link + passkeys; mandatory MFA for contractors above payout threshold; device fingerprinting; impossible-travel detection |
| Insider misuse | Admin viewing PII without cause | High | Audit log; just-in-time access elevation; reason-required prompts |

### 14.2 Data Handling

- **Encryption in transit**: TLS 1.3 enforced; HSTS preload.
- **Encryption at rest**: Neon-managed Postgres encryption; column-level encryption for sensitive fields (license numbers, partial SSN if held) via `libsodium` or `pgcrypto`, keys in Vercel env or AWS KMS.
- **PII minimization**: prefer vendor-held identity (Stripe Identity, Checkr) over storing on our side.
- **Retention policy**: closed-job records retained 7 years (tax-driven); identity verification artifacts retained per vendor policy; rejected applicant data purged after 90 days.

### 14.3 Authentication & Authorization

- Auth.js v5 with Drizzle adapter. Magic link primary; OAuth (Google, Apple); passkeys (WebAuthn) strongly preferred for contractors.
- **MFA enforced for**: contractors with active payouts, all admin roles, property managers over portfolios > 5 doors.
- Session policy: 14-day idle / 30-day absolute for customers; 24-hour idle for admin.
- Authorization centralized in `packages/auth/access.ts`; defense-in-depth via Postgres RLS.

### 14.4 Audit & Observability

- Append-only `audit_log` table for all sensitive actions: PII view, role grant, dispute decision, payout adjustment, branded status change.
- Sentry for client and server errors with PII scrubbing rules.
- OpenTelemetry traces for critical flows (payment, dispute, payout).

### 14.5 Compliance Touchpoints

- **Payments/KYC**: Stripe Connect handles KYC/AML for contractor payouts.
- **Background checks**: Checkr or equivalent — FCRA-compliant; adverse-action workflow built in.
- **Tax reporting**: 1099-K and 1099-NEC issued via Stripe and own filings; W-9 captured during onboarding.
- **Accessibility**: WCAG 2.1 AA for all customer and contractor surfaces.
- **Privacy**: CCPA/CPRA-aligned data export and deletion request workflows; no sale of personal data.
- **State licensing**: home-improvement contractor licensing varies by state; platform supports per-state license types and per-state minimum insurance thresholds; enforced at onboarding and annually.

### 14.6 Secure Development Lifecycle

- DevSecOps pipeline: Dependabot + Snyk (dependency scanning), Semgrep (SAST), trufflehog (secret scanning), Trivy (container image scanning).
- ATDD-style acceptance tests for security-relevant flows (RBAC, payout, identity verification, dispute).
- Pre-deploy checklist: schema migration review, RLS policy diff review, audit-log impact review.
- Penetration test before public launch and annually thereafter.

---

## 15. Phased Rollout

### Phase 0 — Foundation (4–6 weeks)

- Monorepo, shared packages, design system aligned to Home Doctor.
- Auth, identity, role-grant model, RLS scaffolding.
- Stripe Connect Express, basic payment flow.
- Trade taxonomy v1, scope template authoring tools (admin UI).

### Phase 1 — MVP Marketplace (8–12 weeks)

- Customer signup, household, property; service request flow; quote-to-job-to-invoice.
- Independent (Verified) contractor onboarding and profile.
- Lead routing v1, basic scoring, response-time tracking.
- Reviews and ratings, dispute v1.
- **Single-market launch**: Indiana metro (Indianapolis or Fort Wayne — TBD by §17.1).
- **Closed pilot** with a small cohort of Billy Harrell-archetype contractors before public beta.

### Phase 2 — Branded Program (6–8 weeks)

- Branded knowledge tests per major trade category.
- Brand kit fulfillment integration.
- Branded ranking signals in lead routing.
- Quality audit and mystery-shop tooling.
- Dispute coverage SLA for Branded jobs.

### Phase 3 — Back-Office Services (6–10 weeks)

- Bookkeeping ledger and expense capture.
- 1099 prep tooling, W-9 capture pipeline.
- Insurance brokerage integration (group rates).
- CPA-reviewed Schedule C subscription tier.

### Phase 4 — Property Management (6–8 weeks)

- Multi-property portfolio dashboard.
- Tenant portal, work-order workflow.
- Recurring service contracts.
- Per-portfolio budgets and reporting.

### Phase 5 — Home Doctor Deep Integration (4–6 weeks)

- Full event-bus integration (outbox/inbox, Inngest workers).
- Service handoff deep links and closed-loop recommendation feedback.
- Warranty sync into Home Doctor timeline.
- Sensor-triggered warranty claim flow.

### Phase 6+ — Expansion

- Geographic expansion (state-by-state, weighted by license-data API availability).
- Additional trade categories and certifications.
- Mobile native apps (Expo) once PWA traction validates demand.
- Hardware integrations (sensors via Home Doctor relay).

---

## 16. Success Metrics & KPIs

### 16.1 Marketplace Health

| Metric | Definition | Target (12-month) |
|---|---|---|
| Lead fill rate | % of requests producing ≥ 1 quote within 24h | ≥ 85% |
| First-response median | Time from request to first quote | ≤ 2 business hours |
| Job close rate | Quoted jobs that reach completion | ≥ 65% |
| Dispute rate | Closed jobs with formal complaints | < 3% |
| Repeat customer rate | Customers with ≥ 2 jobs in 12 months | ≥ 40% |
| Branded share of jobs | % of jobs done by Branded contractors | ≥ 50% by month 12 |

### 16.2 Contractor Health

| Metric | Definition | Target |
|---|---|---|
| Branded contractor NPS | Standard NPS, measured quarterly | ≥ 50 |
| Contractor 90-day retention | Active in platform 90 days post-onboarding | ≥ 70% |
| Average contractor monthly earnings (Branded) | Net of platform fees | ≥ regional industry benchmark |
| Off-platform leakage signal | Repeat-rate gap vs. peer cohort | Watched, not alarmed — outreach trigger |

### 16.3 Customer Health

- Customer NPS quarterly target ≥ 50.
- Activation: % of signups that submit a service request within 30 days ≥ 30%.
- Home Doctor crossover: % of One Roof customers who connect their Home Doctor household ≥ 25% by month 12.

### 16.4 Trust & Safety

- Verification SLA: median time from contractor signup to full-Verified < 5 business days.
- Dispute resolution: median resolution time < 7 business days; Branded median < 3 business days.

---

## 17. Open Questions & Decisions Needed

These are decisions to make before or during Phase 1 build-out:

1. **Initial market**: Indiana statewide, or focused metro first? *Recommended: focused metro (Indianapolis or Fort Wayne) for tighter feedback loops.*
2. **Take-rate calibration**: pilot at proposed §9.2 numbers, or adjust based on contractor sentiment in onboarding interviews?
3. **Brand-kit economics**: fully free for Branded initial kit, at-cost for replacements, or different?
4. **Dispute coverage cap**: dollar cap on platform-backed satisfaction guarantee per Branded job.
5. **Customer subscription pricing**: One Roof+ at $9.99/mo, $14.99/mo, or free tier with specific friction points?
6. **Property Manager pricing**: per-door tier breakpoints.
7. **Background check funding**: contractor-funded as part of Branded application, or platform-funded?
8. **CE content authoring**: build in-house, license, or partner with trade associations (NARI, PHCC, NECA, etc.)?
9. **Brand & marketing**: in-house design vs. external partner for first round of brand kit and apparel.
10. **Mobile strategy**: PWA-only through Phase 4, or invest in Expo native shells in Phase 3?
11. **Contractor-console branding**: short name for the contractor-side console? (e.g., *"One Roof Pro"*)
12. **Anti-disintermediation enforcement threshold**: exact wording in contractor agreement on what constitutes off-platform poaching of a platform-sourced customer, and what triggers review vs. warning vs. revocation.

---

## 18. Appendix

### 18.1 Reference Contractor — Billy Harrell

Billy Harrell, Master Carpenter & Handyman, 30+ years of experience. Multi-disciplinary across Carpentry (Exterior and Interior), Remodeling/Renovation, Painting, and Concrete. Tagline: *"Big enough to handle it. Small enough to care."*

**How a profile like Billy's renders on One Roof Homes:**

- **Headline**: Master Carpenter & Handyman — 30+ years of experience
- **Tier**: One Roof Master (after eligibility met)
- **Trades**: Carpentry-Exterior (Master), Carpentry-Interior (Master), Remodeling/Renovation (Pro), Painting (Pro), Concrete (Pro)
- **Verified**: identity, insurance, background check, references; license where state-required
- **Featured jobs**: 4–6 work samples with photos (customer-consented)
- **Endorsements**: from past customers and One Roof peer contractors
- **Tagline on profile**: *"Big enough to handle it. Small enough to care."* displayed alongside the One Roof Master badge

Capabilities captured (from brand card):

**Carpentry — Exterior**: layout/foundation/pier, conventional/post-beam framing, exterior siding and finish, A/C and generator platforms, pergolas/porches/screen rooms, wood fencing, rotten wood repair, custom outdoor furniture.

**Carpentry — Interior**: interior trim, stair treads/balusters, wood/laminate flooring, door and window install/repair, custom closets, custom cabinets, appliance installation, custom vent hoods.

**Remodeling / Renovation**: all phases of general construction and remodel, wall reconfiguration, demolition, subfloor repair/replace, roofing repair/replace.

**Painting**: interior/exterior prep and paint, wood window/door glaze and repair, pressure washing, cabinet/furniture refinishing, garage floor epoxy.

**Concrete**: storage building/shed foundations, foundation footings repair, sidewalks.

### 18.2 Trade Taxonomy (Initial, v1)

```
Plumbing
  └── Drain (slow drain, clog, clean-out)
  └── Leak (supply, drain, fixture)
  └── Water Heater (repair, replace)
  └── Fixture (install, repair)
  └── Sewer (inspection, repair)

HVAC
  └── Tune-Up / Maintenance
  └── Repair (cooling, heating)
  └── Replace (full system, component)
  └── Ductwork
  └── Air Quality

Electrical
  └── Panel (inspection, upgrade)
  └── Outlet / Switch
  └── Lighting
  └── Ceiling Fan
  └── EV Charger

Carpentry — Exterior
  └── Framing
  └── Siding and Trim
  └── Decks, Porches, Pergolas
  └── Fencing
  └── Outdoor Structures

Carpentry — Interior
  └── Trim and Molding
  └── Flooring (wood, laminate)
  └── Doors and Windows
  └── Custom Cabinets and Closets
  └── Stair Treads and Balusters

Remodeling / Renovation
  └── Kitchen Remodel
  └── Bathroom Remodel
  └── Basement Finish
  └── Room Addition
  └── General Construction

Painting
  └── Interior Painting
  └── Exterior Painting
  └── Cabinet Refinishing
  └── Pressure Washing

Concrete & Masonry
  └── Sidewalks and Driveways
  └── Foundation Work
  └── Retaining Walls
  └── Patios

Roofing
  └── Inspection
  └── Repair
  └── Full Replace
  └── Gutters

Landscaping & Lawn
  └── Mowing and Maintenance
  └── Landscaping Design
  └── Tree Service
  └── Irrigation

Pest Control
  └── Inspection
  └── Treatment
  └── Ongoing Maintenance

Cleaning
  └── Deep Clean
  └── Move-In / Move-Out
  └── Recurring

Appliance
  └── Installation
  └── Repair

Handyman / General
  └── Small Repairs (catch-all)
  └── Assembly
  └── Mounting
```

### 18.3 Glossary

| Term | Definition |
|---|---|
| Verified | Contractor with identity, license (if applicable), insurance, and background check confirmed. Open marketplace listing. |
| Branded | Verified contractor who has additionally passed the Branded knowledge test and meets all eligibility thresholds in §8.1. Carries the One Roof brand kit. |
| Master | Top-tier Branded contractor with sustained quality, volume threshold, and active mentorship of ≥ 1 apprentice. |
| Household | A homeowner's logical home unit; owns one or more Properties. |
| Property | A single physical address. |
| Portfolio | Property-management grouping of Properties under a property_manager account. |
| Job | An accepted, scheduled, executed unit of work between a customer and a contractor. |
| Lead | A `service_request` routed to a contractor for potential acceptance. |
| Scope template | Pre-authored intake template per (trade, sub-trade) with required photos and questions. |
| Disintermediation | Off-platform completion of a relationship that began on the platform. |
| Trust score | Derived score per contractor used in matching and ranking. Recomputed on job events. |
| Customer score | Derived score per homeowner. Visible to contractors during matching; not public. |
| Outbox | `event_outbox` table + Inngest worker for reliable cross-product event delivery. |
| Back-office Plus | Branded Pro subscription tier that includes managed bookkeeping, expense automation, and CPA-reviewed tax prep. |

---

*End of PRD v1.0 — One Roof Homes*  
*Next companion documents: TARA (Threat Analysis), Trade Taxonomy Detail, Drizzle Schema, Phase 1 Sprint Plan*
