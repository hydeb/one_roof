# One Roof Homes PRD v1.3 — Addendum B

## Subcontractor Agreement Template

**Date:** May 2026  
**Author:** EngSec LLC  
**Status:** Active. Companion to Addendum A (Phase 1 GC Operating Model).  
**Purpose:** Template subcontractor agreement for Phase 1-2 operations. Designed for counsel review and customization to Georgia state law before first execution.

> **IMPORTANT — NOT LEGAL ADVICE.** This document is a structured starting point reflecting the operating intent described in PRD Addendum A §3. It is **not** a finalized legal contract. Before any subcontractor signs, this template must be reviewed and adjusted by a Georgia-licensed attorney familiar with independent-contractor classification, construction services, and 1099 worker arrangements. Specific items requiring legal review are flagged inline as **[LEGAL]**.

---

## 0. How This Document Is Used

This addendum serves three purposes:

1. **Spec for Claude Code**: defines what fields the platform must capture to generate, send, sign, and store agreements (§4 below).
2. **Operating-model documentation**: codifies the commercial deal so engineering decisions stay aligned with the agreement.
3. **Legal starting point**: a structured template to bring to counsel.

The platform stores executed agreements as PDFs, with structured fields extracted into the database for operational use.

---

## 1. The Plain-Language Deal

Before the legal text, the deal in plain English (this becomes the cover page of the actual document presented to subcontractors):

**One Roof's commitment to you:**
- I'll bring you jobs. Qualified, scoped, scheduled.
- I'll handle the customer — sales, communication, scheduling, billing, disputes.
- I'll pay you a fixed dollar amount per job, agreed in advance per service.
- I'll pay you on time. Weekly, every Friday, for jobs you completed Monday through Sunday.

**Your commitment to One Roof:**
- Show up on time.
- Do quality work.
- Communicate issues immediately.
- Respect the customer — you're representing One Roof when you're on the job.
- Keep the job site clean.
- Stand behind your work.
- Wear the One Roof shirt on every job.
- Don't solicit One Roof's customers for off-platform work. Their relationship is with One Roof.

That's it. We make money together when this works.

---

## 2. Agreement Structure (Sections)

The full executable document includes the following sections. Each subsection below contains operating-model substance and **[LEGAL]** flags for counsel review.

### 2.1 Parties

- Legal name of One Roof Homes operating entity (Phase 1: the operating LLC for Savannah).
- Legal name of Subcontractor (individual or business entity).
- Effective date and term.

**[LEGAL]** — Confirm operating entity structure. Phase 1 likely a single Georgia LLC owned by EngSec LLC and the partner-operator under terms negotiated separately.

### 2.2 Scope of Engagement

- Subcontractor will perform services as specifically requested and assigned by One Roof on a job-by-job basis.
- Each assignment is a separate engagement; this Agreement does not guarantee any minimum volume of work.
- Subcontractor is not exclusive to One Roof and may perform work for other clients, provided that work does not violate §2.7 (Customer Non-Solicitation).

**[LEGAL]** — Independent-contractor classification under both federal (IRS 20-factor test) and Georgia law. The "no minimum volume + non-exclusive + own tools + own schedule" structure is essential to maintaining 1099 status. Counsel should review against the most recent DOL guidance and any Georgia-specific tests.

### 2.3 Job Assignment and Acceptance

- One Roof presents job assignments through the One Roof Pro app or by other electronic means.
- Each assignment specifies: scope of work, scheduled date and time window, customer address, agreed compensation per the applicable Rate Sheet (§2.5), and any special instructions.
- Subcontractor may accept or decline any individual assignment without penalty, except that repeated patterns of decline may result in fewer offered assignments going forward.
- Acceptance is electronic (in-app confirmation).

### 2.4 Compensation

- Compensation is a flat dollar amount per completed job, set in the applicable Rate Sheet (§2.5) for the service category.
- No percentage of customer-paid amount is owed to Subcontractor; Subcontractor is paid the agreed flat fee regardless of what One Roof charges the customer.
- Payment is made on a weekly basis, every Friday, by ACH or check, for jobs completed and customer-accepted between the prior Monday and Sunday.
- Subcontractor will receive a payment statement listing all jobs, dates, and amounts in each payout period.
- A job is considered "completed and customer-accepted" when the customer has signed off (in-app, by email confirmation, or via One Roof's quality-check call).
- Disputes affecting payment are addressed under §2.9.

**[LEGAL]** — Confirm payment terms (weekly, Friday cadence) align with Georgia wage-payment statutes. While 1099 contractors are not strictly subject to wage-and-hour law, Georgia has specific rules about timeliness of payments and what constitutes constructive employment.

### 2.5 Rate Sheet (incorporated by reference)

- A Rate Sheet specifying flat-fee compensation per service category is attached as Exhibit A.
- Rate Sheet is renegotiable on 30 days' written notice by either party.
- Mid-engagement rate changes do not affect already-accepted assignments.
- Rate Sheets are stored in the platform (`subcontractor_rate_sheet` table) and updated via written addendum to this Agreement.

### 2.6 Independent Contractor Status

- Subcontractor is an independent contractor, not an employee, agent, partner, or joint venturer of One Roof.
- Subcontractor is responsible for own tools, vehicle, transportation, and incidental expenses.
- Subcontractor is responsible for own income tax, self-employment tax, estimated quarterly payments, and any business licenses required for the trade.
- Subcontractor is not eligible for One Roof employee benefits.
- One Roof will issue a Form 1099-NEC at year end if total compensation exceeds the IRS reporting threshold.
- Subcontractor controls method, manner, and schedule of completing each assigned job, subject only to the scope, timing window, and quality standards specified in the assignment.

**[LEGAL]** — This section is the heart of independent-contractor classification. Counsel should pay particular attention to:
- Whether wearing One Roof apparel and using One Roof signage compromises classification (this risk is real and needs explicit treatment).
- Whether the platform's job assignment, scheduling, and quality requirements constitute "control" sufficient to reclassify as employment.
- Whether Georgia recognizes the federal independent-contractor framework or applies a stricter ABC test or similar.
- Recent regulatory changes (DOL has been active on this topic).

### 2.7 Customer Non-Solicitation

- Customers introduced to Subcontractor through One Roof are One Roof's customers, not Subcontractor's.
- For 12 months following the last completed job between Subcontractor and a One Roof-introduced customer, Subcontractor agrees:
  - Not to solicit work from that customer outside the One Roof platform.
  - Not to accept off-platform work from that customer that the customer initiates, without first offering to bring the work onto the One Roof platform.
  - Not to provide personal contact information to the customer.
- This restriction does not apply to:
  - Customers Subcontractor sourced independently outside of One Roof.
  - Customers with whom Subcontractor had a documented prior relationship before the effective date of this Agreement (Subcontractor must declare these in writing at onboarding).
  - Genuine emergencies where the customer cannot reach One Roof, provided Subcontractor reports the emergency work to One Roof on the same or next business day for retroactive on-platform processing.
- After the 12-month cooling-off period, the relationship reverts to organic and unrestricted.

**[LEGAL]** — Non-solicitation enforceability in Georgia. Georgia is generally restrictive-covenant-friendly under the Georgia Restrictive Covenants Act (O.C.G.A. § 13-8-50 et seq.) but specific language matters. Counsel should:
- Confirm the 12-month duration is enforceable in Georgia for service contractors.
- Confirm geographic scope (implied by "customers introduced to Subcontractor") is sufficient.
- Consider whether to add a liquidated damages clause or whether to rely on injunctive relief.
- Consider whether to add specific definitions of "solicit" to avoid ambiguity.

### 2.8 Brand Representation

- One Roof will provide Subcontractor with One Roof-branded apparel (shirts, hat) and, where applicable, vehicle signage at no charge.
- Subcontractor agrees to wear One Roof apparel on every assigned job for the duration of the customer interaction.
- Subcontractor agrees to leave a One Roof leave-behind (door hanger, business card with One Roof contact information) on every job.
- Subcontractor agrees not to use One Roof brand assets on jobs that are not assigned through One Roof.
- Apparel and brand assets remain the property of One Roof and must be returned upon termination of this Agreement.

**[LEGAL]** — As noted in §2.6, brand-representation requirements interact with independent-contractor classification. Counsel may suggest framing apparel as a "uniform requirement of the engagement" rather than evidence of employment.

### 2.9 Quality Standards and Issue Resolution

- Subcontractor agrees to perform work in accordance with applicable trade standards, manufacturer specifications (where applicable), and any specific scope provided in the job assignment.
- Subcontractor agrees to communicate issues encountered on a job (unexpected scope, access problems, safety concerns, customer disputes) to One Roof immediately.
- If a customer disputes work quality:
  - One Roof will investigate.
  - If the dispute is upheld, Subcontractor agrees to perform reasonable rework at no additional charge, OR Subcontractor agrees to a deduction from the next payout in an amount mutually agreed.
  - Disputes that cannot be resolved through the above process escalate per §2.13.
- Subcontractor agrees to a workmanship warranty of 30 days from job completion. If covered work fails within this window, Subcontractor will return to remedy at no additional charge.

**[LEGAL]** — The 30-day workmanship warranty is the subcontractor's commitment to One Roof. One Roof's customer-facing warranty is longer (1 year per PRD §9.7) and is provided by One Roof, not by the subcontractor. Counsel should confirm this two-tier warranty structure is clearly drafted.

### 2.10 Insurance

- Subcontractor agrees to maintain at all times during the term of this Agreement:
  - General Liability insurance with minimum coverage of $500,000 per occurrence (Phase 1; Branded threshold is $1M per PRD §8.1).
  - Auto Liability insurance covering any vehicle used for assigned work.
  - Workers' Compensation insurance to the extent required by Georgia law for Subcontractor's business structure.
- Subcontractor will provide a Certificate of Insurance naming One Roof as a certificate holder at onboarding and will provide updated COIs at each renewal.
- Subcontractor agrees to notify One Roof immediately of any lapse, cancellation, or material change in coverage.

**[LEGAL]** — Workers' Comp is the trickiest piece for solo subcontractors. Georgia exempts sole proprietors from WC requirements but the customer-facing exposure means One Roof should require WC waivers in writing where Subcontractor claims the exemption. Counsel to draft the waiver language.

### 2.11 Background Check (Where Required)

- For trades or assignments involving residential interior access, Subcontractor consents to a background check through a third-party FCRA-compliant provider.
- One Roof bears the cost of the background check in Phase 1 (subject to change in Phase 3 per PRD §17.7).
- Subcontractor will receive a copy of the background check results and have an opportunity to dispute inaccuracies before any adverse action.

**[LEGAL]** — FCRA compliance for background checks. The "adverse action" workflow has specific federal requirements. Counsel to confirm the platform's background-check vendor handles the FCRA pre-adverse-action notice and waiting period correctly.

### 2.12 Term and Termination

- This Agreement is effective as of the date of execution and continues until terminated.
- Either party may terminate this Agreement at any time, with or without cause, on 7 days' written notice (electronic notice via the platform constitutes written notice).
- One Roof may terminate immediately for cause, including but not limited to:
  - Material breach of this Agreement.
  - Conduct that endangers a customer or worksite.
  - Fraudulent activity.
  - Lapse in required insurance.
  - Violation of §2.7 (Customer Non-Solicitation).
- On termination:
  - Subcontractor will complete any in-progress assigned jobs unless directed otherwise.
  - Final payout will be issued on the next regular payout cycle.
  - Brand apparel and signage will be returned within 14 days.
  - §2.7 (Non-Solicitation) survives termination per its own terms.

### 2.13 Dispute Resolution

- Disputes between One Roof and Subcontractor will be addressed first through good-faith discussion.
- If unresolved within 30 days, disputes are subject to binding arbitration in Chatham County, Georgia, administered under the rules of the American Arbitration Association.
- Each party bears their own costs of arbitration; the arbitrator may award reasonable attorney's fees to the prevailing party.

**[LEGAL]** — Arbitration clause enforceability and AAA rule selection. Counsel may prefer a different administrator or different cost structure. The Chatham County venue is appropriate for Savannah-based operations.

### 2.14 General Provisions

- **Governing law**: Georgia.
- **Entire agreement**: this document plus exhibits supersedes prior agreements between the parties.
- **Amendment**: written amendment signed by both parties.
- **Severability**: standard.
- **Assignment**: One Roof may assign; Subcontractor may not assign without consent.
- **Notices**: in-platform delivery is sufficient written notice for non-termination matters; termination notices may also be sent by email.
- **Counterparts**: electronic signatures (DocuSign or equivalent) are binding.

### 2.15 Signatures

- Subcontractor signature, date, printed name, business name (if applicable).
- One Roof representative signature, date, printed name, title.

---

## 3. Exhibits

### 3.1 Exhibit A — Rate Sheet (per-Subcontractor)

Stored in `subcontractor_rate_sheet` table; rendered into the executed agreement at signing time. Format:

| Service | Subservice | Flat Rate | Unit | Notes |
|---|---|---|---|---|
| Pressure Washing | Driveway | $80 | per job | Up to 1,000 sq ft |
| Pressure Washing | House Wash | $160 | per job | Standard 2-story |
| Pressure Washing | Bundle (Drive + House) | $200 | per job | |
| Landscaping | Cleanup | $100 | per job | Up to 4 yards debris |
| ... | ... | ... | ... | ... |

The Rate Sheet is renegotiated on 30 days' written notice and re-signed as an addendum.

### 3.2 Exhibit B — Insurance Requirements Summary

(Restated from §2.10 in checklist form for easy verification at onboarding.)

### 3.3 Exhibit C — Pre-Existing Customer Declaration

A blank form for Subcontractor to declare any customers with whom they had a documented prior relationship before the effective date of this Agreement. These customers are exempt from §2.7 non-solicitation.

---

## 4. Platform Implementation Spec

For Claude Code: the platform must support the following workflows tied to this Agreement.

### 4.1 Onboarding Flow (Subcontractor)

```
1. Operator initiates: "Add new subcontractor"
2. Capture: name, business name, contact info, service categories
3. Document upload: ID, COI, W-9
4. Generate Rate Sheet (Exhibit A) by service category
5. Generate Pre-Existing Customer Declaration (Exhibit C)
6. Generate full Agreement PDF with subcontractor's specifics filled in
7. Send via DocuSign (or equivalent) for electronic signature
8. On signed: store PDF, create subcontractor_roster row with status='active'
9. Trigger: ship apparel kit to subcontractor's address
10. Trigger: schedule onboarding call with operator
```

### 4.2 Rate Sheet Renegotiation Flow

```
1. Operator or subcontractor proposes new rates
2. Generate Rate Sheet addendum
3. Send for electronic signature
4. On signed: insert new subcontractor_rate_sheet rows with effective_from = today + 30 days
5. Mark prior rates with effective_to = today + 30 days
6. Notify both parties of effective date
```

### 4.3 Termination Flow

```
1. Either party initiates termination
2. Capture: reason, immediate vs. 7-day notice
3. Identify in-progress jobs:
   - If immediate termination: reassign or cancel
   - If 7-day: complete in-progress, decline new assignments
4. Calculate final payout including all completed-and-accepted jobs
5. Generate final payout statement
6. Trigger: apparel/signage return reminder (14 days)
7. Mark subcontractor_roster status='terminated'
8. Maintain §2.7 Non-Solicitation tracking on customer records for 12 months
```

### 4.4 Dispute Tracking

```
- Customer dispute → operator investigates → outcome recorded:
  - 'no_subcontractor_fault' (One Roof handles, no payout impact)
  - 'subcontractor_rework' (subcontractor returns, no additional pay)
  - 'subcontractor_payout_deduction' (mutually agreed deduction recorded)
  - 'unresolved_escalation' (escalates per §2.13)
```

---

## 5. Open Items for Counsel

Items flagged **[LEGAL]** throughout this document, summarized:

1. Operating entity structure for Phase 1 LLC.
2. Independent-contractor classification (federal + Georgia ABC-style or other tests).
3. Brand-representation requirements vs. classification risk.
4. Wage-payment timing under Georgia law.
5. Non-solicitation duration and language under Georgia Restrictive Covenants Act.
6. Workmanship warranty two-tier structure (subcontractor 30-day vs. customer-facing 1-year).
7. Workers' Comp waivers for sole-proprietor subcontractors.
8. FCRA compliance for background checks and adverse-action workflow.
9. Arbitration administrator and cost structure.
10. The interaction between in-platform notice provisions and Georgia statutory notice requirements.

---

*End of Addendum B — Subcontractor Agreement Template*  
*Companion: ONE_ROOF_HOMES_PRD_v1.2_Addendum_A.md (Phase 1 GC Operating Model)*  
*Status: Bring to counsel before first execution. Phase 1 cannot onboard subcontractors without a counsel-reviewed version of this document.*
