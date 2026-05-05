// Auth.js v5 config, role grants, requireScope guard, RLS helpers land in M3.
// Phase 1 ships the resource-token helper here so customer document views (quote,
// invoice) can be sent over SMS/email without requiring the customer to sign in.
// See docs/spec/ONE_ROOF_HOMES_PRD_v1.2_Addendum_A.md §3 (operating model) and
// CLAUDE.md §8 for the broader pattern.
export {
  buildResourceUrl,
  issueResourceToken,
  purgeExpiredResourceTokens,
  redeemResourceToken,
  revokeResourceTokens,
  type IssueArgs,
  type IssuedToken,
  type RedeemArgs,
  type RedemptionResult,
  type ResourceKind,
  type RevokeArgs,
} from './resource_tokens';
