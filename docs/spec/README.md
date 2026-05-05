# One Roof Homes — Specification Index

The product specification is the **authoritative source of truth**. If code and spec disagree, the spec wins and the code gets corrected.

## Canonical reading order

Read in order. Later documents supersede earlier ones for the sections they touch — Addendum A's §0 precedence table enumerates exactly which v1.1 sections it overrides.

| # | Document | Status | Purpose |
|---|---|---|---|
| 1 | [`ONE_ROOF_HOMES_PRD_v1.1.md`](./ONE_ROOF_HOMES_PRD_v1.1.md) | Base spec | Original two-sided marketplace PRD. Resolves v1.0 open questions (Savannah pilot, take rates, brand-kit economics, dispute caps, mobile sequencing). Adds §10.4 enforcement framework. |
| 2 | [`ONE_ROOF_HOMES_PRD_v1.2_Addendum_A.md`](./ONE_ROOF_HOMES_PRD_v1.2_Addendum_A.md) | **DOMINANT for Phase 1-2** | Pivots Phase 1-2 from marketplace to General Contractor operating model. One Roof IS the contractor; subcontractors are an internal flat-fee roster the customer never sees. Marketplace concepts defer to Phase 3+. |
| 3 | [`ONE_ROOF_HOMES_PRD_v1.3_Addendum_B_Subcontractor_Agreement.md`](./ONE_ROOF_HOMES_PRD_v1.3_Addendum_B_Subcontractor_Agreement.md) | Active | Subcontractor agreement framework: flat-fee terms, anti-disintermediation, brand standards. |
| 4 | [`ONE_ROOF_HOMES_PRD_v1.4_Addendum_C.md`](./ONE_ROOF_HOMES_PRD_v1.4_Addendum_C.md) | Active | Long-term strategy and metro-asymmetric sequencing. Defines the Phase 3+ Branded graduation path that today's flat-fee subcontractors can earn into. |
| 5 | [`ONE_ROOF_HOMES_Drizzle_Schema_Phase1.md`](./ONE_ROOF_HOMES_Drizzle_Schema_Phase1.md) | Build target | Canonical Phase 1 Drizzle schema. File layout: `packages/db/schema/{identity,property,job,customer,subcontractor}.ts`. Unified `job` entity with `pipeline_stage`, plus `subcontractor_roster`, `subcontractor_rate_sheet`, `subcontractor_payout`, `pipeline_stage_history`. |
| 6 | [`ONE_ROOF_HOMES_Phase1_Sprint_Plan.md`](./ONE_ROOF_HOMES_Phase1_Sprint_Plan.md) | Active | Milestone roadmap. Launch criterion: 1 week of real Savannah ops, 5+ jobs in the pipeline. |
| — | [`ONE_ROOF_HOMES_PRD_v1.0.md`](./ONE_ROOF_HOMES_PRD_v1.0.md) | Historical | First-draft PRD. Kept for context on the open questions v1.1 closed. Do not build from v1.0. |

## Conflict resolution

When two documents disagree:

1. **Phase 1-2 work** — Addendum A wins over v1.1 for any section listed in Addendum A's §0 precedence table.
2. **Schema** — the Drizzle Schema Phase1 doc is the build target; if Addendum A's prose disagrees with the schema doc on a field, the schema doc wins (it's the result of reconciling both).
3. **Sequencing** — the Phase1 Sprint Plan is authoritative for milestone scope; if Addendum A's narrative implies something belongs in M3 but the Sprint Plan says M5, the Sprint Plan wins.
4. **Branded program, public profiles, Stripe Connect, customer subscriptions** — read v1.1 + Addendum C as the *target* state for Phase 3+. Do not build these in Phase 1-2.

## Notes

- **Addendum N** (cross-product Home Doctor integration) is referenced in the broader spec line but is not required reading until **Milestone 9**. When it lands it will live in this directory.
- **Stack and infrastructure conflicts**: Addendum A §7 says "Turborepo shared with Home Doctor" but the operative decision (Brian, 2026-05-04) is that One Roof and Home Doctor stay in separate repos with separate Vercel deploys. Cross-product integration goes over deployed APIs + an Inngest event bus, not shared source. CLAUDE.md is authoritative for this.
- **Savannah pricing seed** lives at `packages/trades/savannah_phase1.ts` (per Addendum A §2), not in the spec directory.
