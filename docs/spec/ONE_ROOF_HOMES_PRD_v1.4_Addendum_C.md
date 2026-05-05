# One Roof Homes PRD v1.4 — Addendum C

## Long-Term Strategy & Metro-Asymmetric Sequencing

**Date:** May 2026  
**Author:** EngSec LLC  
**Status:** Active. Strategic context for Phase 1+ decisions.  
**Purpose:** Codify the long-term vision so that Phase 1-2 architectural choices are made against the right horizon. Without this document, Phase 1 risks being optimized as a destination rather than as a starting point.  
**Companion documents:**  
- `ONE_ROOF_HOMES_PRD_v1.1.md` — base spec (Phase 3+ marketplace target preserved)  
- `ONE_ROOF_HOMES_PRD_v1.2_Addendum_A.md` — Phase 1-2 GC operating model  
- `ONE_ROOF_HOMES_PRD_v1.3_Addendum_B_Subcontractor_Agreement.md` — contract template  

---

## 0. Precedence

This addendum **does not supersede** earlier documents on tactical Phase 1-2 questions. Addendum A remains the dominant model for Phase 1-2 build choices.

What Addendum C does is **resolve a strategic ambiguity** in the spec chain that affects how Phase 1-2 architecture is written: are we building a permanent GC operating business (in which case marketplace features are wasted scaffolding), or are we building toward a marketplace business (in which case the Phase 1 GC model is a starting point, not the destination)?

The answer is **the second, with metro-by-metro asymmetry**. This addendum codifies that.

---

## 1. The Long-Term Vision in One Paragraph

One Roof Homes is, at scale, a **multi-metro home-services platform that operates two complementary models simultaneously**: an operator-led GC operating business that delivers a "we handle it" experience under the One Roof brand, and a Branded contractor marketplace that surfaces vetted independent contractors operating under their own names with the One Roof Branded badge. Different metros enter the platform through different paths — home markets via GC, expansion markets via marketplace — but every mature metro eventually supports both. The two models compound on each other: GC operations build brand and accumulate review/performance data; the marketplace scales capital-efficiently using that brand and data.

---

## 2. Why Both Models, Not One

The choice between "pure GC" and "pure marketplace" is a false binary. Each, alone, has a structural weakness the other resolves.

### 2.1 Why pure GC fails at scale

Replicating the Savannah operator-GC model in 20 metros requires 20 partner-operators with deep local knowledge, each running their own operating business under the One Roof brand. This is functionally a franchising business. Franchising can be successful, but it has real properties:

- Growth is bounded by the rate of finding qualified operators.
- Each operator requires capital, training, and ongoing brand support.
- Brand consistency across operators is hard.
- Operator turnover is a real risk that compounds over time.
- The unit economics are operating-business economics, not platform economics.

### 2.2 Why pure marketplace fails at cold-start

Two-sided marketplaces require liquidity on both sides simultaneously. Without a brand to anchor the customer side, contractor recruitment is structurally harder than recruitment into a known brand. Most home-services marketplaces (Angi, HomeAdvisor, Thumbtack, Porch) sit in an uncomfortable middle: they couldn't bootstrap the trust the GC model bootstraps naturally, so they pivoted to lead-resale models that contractors and customers both dislike.

### 2.3 Why both works

The combined model uses each model's strength to bootstrap the other:

- **GC operations build trust.** Customers experience One Roof as a known entity that handled a job well. That brand experience radiates outward — to friends, to neighbors, to the same customer's friends in adjacent metros.
- **GC operations build operational learnings.** What's a Branded contractor really? What standards does the test enforce? What's the actual workmanship warranty experience? Every Phase 1-2 month accumulates ground-truth answers to these questions.
- **GC operations build review and performance data.** When the marketplace activates, contractors recruited into the Branded program see real customer review data and Check-Verified evidence (per Addendum N). That's a recruitment advantage no greenfield marketplace has.
- **The marketplace scales capital-efficiently.** Once the brand is established and the operating playbook exists, expanding a marketplace to a new metro requires recruiting contractors into a known brand — much easier than recruiting them into a new platform.
- **Both models compound in mature metros.** A mature metro with both an operator-GC and a Branded marketplace serves more customers, more deeply, than either alone.

---

## 3. Metro-Asymmetric Sequencing

Different metros enter the platform through different paths.

### 3.1 The two entry paths

**Path A — Operator-Led (Home Market Pattern):**
- A partner-operator runs a GC operating business in the metro.
- Phase 1-2 builds the operating business and accumulates data.
- Phase 3-4 layers a marketplace on top, using the brand the GC built.
- Phase 5+ both models coexist.

**Path B — Marketplace-First (Expansion Market Pattern):**
- No partner-operator in the metro.
- Marketplace launches leveraging brand built in adjacent metros, technology built in Phase 1-2, and Branded standards calibrated against actual operations.
- Local operators may be added later if/when right partners are found.

### 3.2 Why Savannah is Path A

- The partner-operator is already running this business in Savannah.
- The brand needs to be earned somewhere first; earning it as a known operator-led service is more credible than earning it as a marketplace.
- The disintermediation problem in v1.1 §10 is most acute in the operator's home market and is structurally solved by the GC model.
- The platform team gets to build with a deeply engaged Phase 1 customer (the operator).

### 3.3 Why Atlanta and Charleston are Path B (when they activate)

By the time Phase 6+ expansion happens to Atlanta and Charleston:

- The One Roof brand has earned recognition in Georgia.
- The Branded program standards have been calibrated against real Savannah subs.
- The platform has been pressure-tested.
- Real review and Check-Verified performance data exists as third-party evidence contractors can be evaluated against.
- The operating playbook from Savannah informs how local operators (when found later) onboard into expansion metros.

Recruiting Branded contractors into Atlanta is dramatically easier under those conditions than it would have been if Atlanta launched as a greenfield marketplace.

### 3.4 Future home markets

If a partner-operator emerges for a future metro who matches the Savannah operator profile, that metro can launch as Path A even if it would otherwise have been Path B. The pattern is a default, not a constraint. Path A is preferred when the right operator exists; Path B is the fallback that ensures geographic growth doesn't depend on operator availability.

---

## 4. Implications for Phase 1-2 Architecture

This is the part that Phase 1 build choices must respect.

### 4.1 Build for Phase 1, but reserve namespace for Phase 3

Per the canonical Phase 1 schema (`ONE_ROOF_HOMES_Drizzle_Schema_Phase1.md`):

- **Build now:** `subcontractor_roster`, `subcontractor_rate_sheet`, `subcontractor_payout`, the unified `job` entity, the 6-stage pipeline.
- **Don't build now, but reserve role/scope namespace for them:** `contractor_profile`, public `review`, `branded_status`, `contractor_company`, `contractor_member`, `contractor_trade`, `license`, `insurance_policy`, `background_check`, `endorsement`, `connection`, `post`.

The roles enum already includes `contractor_independent`, `contractor_branded`, `contractor_master`, `contractor_member`, `property_manager` — none of these are granted in Phase 1, but their existence in the schema means Phase 3 activates without an enum migration.

### 4.2 Capture marketplace-relevant data from day one

Even though no marketplace exists in Phase 1, Phase 1 jobs should capture data that the marketplace will need when it activates:

- **Subcontractor performance**: every closed job has photos, customer satisfaction signal (private rating, even if not public), workmanship-warranty events, on-time arrival, communication quality.
- **Customer review prompts**: Phase 1 customers are asked for ratings via SMS post-job. The ratings are private to the operator in Phase 1 but the data structure is review-shaped.
- **Subcontractor performance trend**: on-time rate, completion rate, dispute rate, customer-rating average — all computed from job data, all accumulating.

When Phase 3 activates the public marketplace, the strongest Phase 1 subcontractors graduate into Branded contractors with months of real performance data backing their public profiles. That's a recruitment and retention advantage no greenfield marketplace has.

### 4.3 Don't build public-facing marketplace features in Phase 1

Even though the data is being captured, **no public-facing marketplace surface ships in Phase 1.** Specifically:

- No public contractor directory.
- No public reviews.
- No public Branded badges.
- No "Find a Contractor" route.
- No contractor profile pages.

Phase 1 customers transact entirely through the operator. The marketplace surface activates in Phase 3+ and Phase 6+ on a per-metro basis.

### 4.4 The one architectural decision that matters most

When a Phase 1 subcontractor graduates to Branded in Phase 3, the transition should be **purely additive**:

- Their `subcontractor_roster` row stays. They remain a roster member for Savannah GC operations.
- A new `contractor_profile` row is created and linked to the same `user_id`.
- Their job history (already accumulated in `job`, `job_event`, `pipeline_stage_history`) becomes their public Branded performance record.
- Their Phase 1 ratings become their initial public review base.
- Their Branded badge appears on their public profile.

This means **don't put public-facing fields on `subcontractor_roster`**. Keep that table internal-operational. Public-facing data lives on the (Phase 3) `contractor_profile` table that augments, not replaces, the roster relationship. This is already the structure in the Phase 1 Drizzle schema.

---

## 5. Implications for Phase 2

Phase 2 (per `ONE_ROOF_HOMES_Phase1_Sprint_Plan.md`) is currently scoped as "Operator Polish + Subcontractor App." Under the metro-asymmetric vision, **Phase 2 also includes marketplace-prep work that lays the groundwork for Phase 3 activation in expansion metros.**

The Phase 2 expansion is roughly:

- **Marketing site** at oneroofhomes.com that talks about the Branded program (without yet activating marketplace flows). This is the recruitment funnel for Atlanta-area Branded contractors before the marketplace itself launches.
- **Branded knowledge tests** authored per major trade. Drafted with subject-matter advisors. Stored in the trades package.
- **Insurance brokerage relationships** established with carriers for group-rate Branded contractor coverage.
- **Trade association partnerships** initiated (NARI, PHCC, NECA, ACCA, NRCA) for Phase 3 CE content.
- **Brand-kit fulfillment** scaled — Phase 1 ships kits manually; Phase 2 establishes a vendor relationship and process for kit-ship-on-Branded-eligibility.

This work runs in parallel with operator-polish work and is done by EngSec/ops staff, not by the partner-operator. The partner stays focused on Savannah operations. The platform team builds the marketplace foundation.

This is the practical answer to the "who runs the marketplace ops?" question: in Phase 2, marketplace ops are EngSec ops staff, not the partner. By Phase 3 launch in Atlanta, those ops staff have authored standards, recruited initial Branded contractors, and built the infrastructure the marketplace runs on.

---

## 6. Implications for Phase 3

Phase 3 (per Sprint Plan) is currently "Branded Marketplace Activation." Under the metro-asymmetric vision, Phase 3 has two distinct scopes:

**Phase 3 in Savannah:**
- Strongest Phase 1 subcontractors are invited to graduate to Branded.
- Their public profiles activate. Customers can choose "have One Roof handle it" OR "choose a Branded contractor directly."
- The operator's role evolves to include Brand Steward responsibilities for Savannah.

**Phase 3 in Atlanta (or whichever metro is the first expansion target):**
- The marketplace launches as the primary entry point. There may not be a local operator at all.
- Atlanta-area contractors recruited during Phase 2 marketplace-prep work activate as Branded contractors.
- Customers in Atlanta interact with One Roof primarily through the marketplace, not through an operator.
- If/when a local Atlanta operator is found later, GC operations layer on (Path A → Path B convergence).

This dual-scope Phase 3 is the strategic moment when the platform's two models begin coexisting.

---

## 7. Implications for the Operator's Role

The partner-operator's role evolves significantly across phases. This is worth being explicit about because it's a meaningful career arc and decision point.

| Phase | Operator's Role |
|---|---|
| 1-2 | GC operator running the Savannah business. Daily customer-facing operations. |
| 3 | GC operator + Brand Steward for Savannah Branded program. Less customer-facing time, more program-quality time. |
| 4 | Brand Steward for Savannah; reduced GC operations as Branded contractors absorb more direct work; potentially regional advisor as Atlanta launches. |
| 6+ | Regional Operations lead. The Savannah playbook becomes the template for any future Path-A markets. The operator's role is platform-strategic rather than operational. |

This evolution should be discussed explicitly. Compensation and equity structure should reflect the trajectory, not just the Phase 1 reality.

---

## 8. Implications for Geographic Expansion Sequence

Per v1.1 §15 Phase 6+: Atlanta and Charleston are the natural first expansion metros. Under metro-asymmetric sequencing, the choice between them depends on:

- **Atlanta**: larger market, more contractor supply, longer recruitment ramp, higher payoff. Probably the primary first-expansion target.
- **Charleston**: smaller market, similar housing profile to Savannah, easier brand crossover from Savannah customer recommendations, faster ramp. Possibly a Path-A candidate if a Charleston-area operator-partner emerges.

Neither needs to be decided in Phase 1. The decision is made when Phase 5 wraps and Phase 6 planning begins, against the actual data of how Savannah is operating.

Phase 1 architectural choices should support either sequence.

---

## 9. The Test for Future Strategic Decisions

When a future strategic decision has to be made (e.g., "should we add an HVAC service category in Phase 2?", "should we accept a Branded contractor before Phase 3?", "should we launch in Charleston before Atlanta?"), this addendum provides the test framework:

1. **Does it serve the long-term dual-model vision?** Yes/no.
2. **Is it appropriate to the metro's entry path (A or B)?** A decision that's right for Savannah may be wrong for Atlanta and vice versa.
3. **Does it preserve Phase 1 architectural forward-compatibility?** A decision that requires schema migrations later is more expensive than it appears.
4. **Does it respect the operator's bandwidth?** The operator is a finite resource. Decisions that increase his workload need to be evaluated against operator burnout risk.
5. **Does it produce data that the marketplace will need later?** Phase 1-2 decisions that capture marketplace-relevant data are higher leverage than ones that don't.

These five questions resolve most strategic ambiguities without needing fresh first-principles thinking each time.

---

## 10. What This Means for Claude Code

If Claude Code is reading this addendum mid-build, the takeaway is:

1. **You are building Phase 1 (GC operating model) per Addendum A.** Don't deviate.
2. **The reason is metro-asymmetric sequencing**, not "the marketplace was the wrong idea." Marketplace activates in Phase 3+ on a per-metro basis.
3. **Build forward-compatibility for Phase 3.** Reserve role/scope namespace. Use the unified `subcontractor_roster` + future `contractor_profile` augmentation pattern. Capture marketplace-relevant data even when not surfacing it.
4. **Don't build public-facing marketplace features in Phase 1.** No public directory, no public profiles, no public reviews, no Branded badges, no "Find a Contractor" route. All Phase 3+.
5. **Phase 2's scope expands modestly** to include marketing-site work that supports Phase 3 contractor recruitment in expansion metros. This is mostly content and forms, not architecture.

The architecture you're building in Milestone 2 onward is the foundation for both the Phase 1 operating business and the Phase 3+ marketplace. Get the foundations right; the marketplace ships when its time comes.

---

*End of Addendum C — One Roof Homes PRD v1.4*  
*Companion: ONE_ROOF_HOMES_PRD_v1.1.md (base spec, Phase 3+ marketplace target preserved as written)*  
*Companion: ONE_ROOF_HOMES_PRD_v1.2_Addendum_A.md (Phase 1-2 dominant model)*  
*This addendum should be read after A and before any major strategic decisions.*
