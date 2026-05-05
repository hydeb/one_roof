import { randomBytes, createHash } from 'node:crypto';
import { and, eq, gt, lt } from 'drizzle-orm';
import {
  type Db,
  schema as dbSchema,
} from '@oneroof/db';

/**
 * Resource tokens — signed scoped magic links for customer access to a single
 * resource (one quote, one invoice, etc.) without an account.
 *
 * Storage: piggybacks on the Auth.js `verification_token` table.
 *   identifier = `${kind}:${resourceId}`
 *   token      = sha256(secret)  // never store the raw secret
 *   expires    = now + ttlHours
 *
 * URL shape: `/r/{kind}/{resourceId}/{secret}` so the route handler can pass
 * (kind, resourceId, secret) directly to redeemResourceToken — lookups hit the
 * (identifier, token) primary key.
 *
 * Secrets are 32 random bytes encoded as URL-safe base64 (~43 chars). High
 * entropy means a single SHA-256 is sufficient at rest; bcrypt/argon2 would be
 * overkill and slow. (Not the case for low-entropy secrets like passwords.)
 *
 * Issuance and redemption both write `audit_log` rows so we can answer
 * "who clicked which quote when" forever.
 */

export type ResourceKind = 'quote' | 'invoice';

export interface IssueArgs {
  kind: ResourceKind;
  resourceId: string;
  issuedByUserId: string;
  recipientChannel: 'sms' | 'email';
  recipientAddress: string;
  /** Defaults to 24; clamped to [1, 48] per Phase 1 policy. */
  ttlHours?: number;
}

export interface IssuedToken {
  /** Raw secret. Embed in the URL once; never logged or stored as-is. */
  secret: string;
  /** `${kind}:${resourceId}` — what was stored as `verification_token.identifier`. */
  identifier: string;
  expiresAt: Date;
}

export interface RedeemArgs {
  kind: ResourceKind;
  resourceId: string;
  secret: string;
  ip?: string | null;
  userAgent?: string | null;
}

export type RedemptionResult =
  | { ok: true; kind: ResourceKind; resourceId: string; expiresAt: Date }
  | { ok: false; reason: 'not_found' | 'expired' };

const DEFAULT_TTL_HOURS = 24;
const MAX_TTL_HOURS = 48;

function hashSecret(secret: string): string {
  return createHash('sha256').update(secret).digest('hex');
}

function makeIdentifier(kind: ResourceKind, resourceId: string): string {
  return `${kind}:${resourceId}`;
}

export async function issueResourceToken(db: Db, args: IssueArgs): Promise<IssuedToken> {
  const ttlHours = Math.min(Math.max(args.ttlHours ?? DEFAULT_TTL_HOURS, 1), MAX_TTL_HOURS);
  const secret = randomBytes(32).toString('base64url');
  const tokenHash = hashSecret(secret);
  const identifier = makeIdentifier(args.kind, args.resourceId);
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

  await db.transaction(async (tx) => {
    await tx.insert(dbSchema.verification_token).values({
      identifier,
      token: tokenHash,
      expires: expiresAt,
    });

    await tx.insert(dbSchema.audit_log).values({
      actor_user_id: args.issuedByUserId,
      action: `resource_token.${args.kind}.issued`,
      target_type: args.kind,
      target_id: args.resourceId,
      metadata: {
        recipient_channel: args.recipientChannel,
        recipient_address: args.recipientAddress,
        ttl_hours: ttlHours,
        expires_at: expiresAt.toISOString(),
      },
    });
  });

  return { secret, identifier, expiresAt };
}

export async function redeemResourceToken(
  db: Db,
  args: RedeemArgs,
): Promise<RedemptionResult> {
  const identifier = makeIdentifier(args.kind, args.resourceId);
  const tokenHash = hashSecret(args.secret);

  const rows = await db
    .select({ expires: dbSchema.verification_token.expires })
    .from(dbSchema.verification_token)
    .where(
      and(
        eq(dbSchema.verification_token.identifier, identifier),
        eq(dbSchema.verification_token.token, tokenHash),
      ),
    )
    .limit(1);

  const row = rows[0];
  if (!row) {
    await db.insert(dbSchema.audit_log).values({
      action: `resource_token.${args.kind}.redeem_not_found`,
      target_type: args.kind,
      target_id: args.resourceId,
      metadata: {},
      ip_address: args.ip ?? null,
      user_agent: args.userAgent ?? null,
    });
    return { ok: false, reason: 'not_found' };
  }

  if (row.expires.getTime() <= Date.now()) {
    await db.insert(dbSchema.audit_log).values({
      action: `resource_token.${args.kind}.redeem_expired`,
      target_type: args.kind,
      target_id: args.resourceId,
      metadata: { expired_at: row.expires.toISOString() },
      ip_address: args.ip ?? null,
      user_agent: args.userAgent ?? null,
    });
    return { ok: false, reason: 'expired' };
  }

  await db.insert(dbSchema.audit_log).values({
    action: `resource_token.${args.kind}.redeemed`,
    target_type: args.kind,
    target_id: args.resourceId,
    metadata: {},
    ip_address: args.ip ?? null,
    user_agent: args.userAgent ?? null,
  });

  return { ok: true, kind: args.kind, resourceId: args.resourceId, expiresAt: row.expires };
}

export interface RevokeArgs {
  kind: ResourceKind;
  resourceId: string;
  reason: string;
  revokedByUserId: string;
}

/** Revokes every outstanding token for a given resource. */
export async function revokeResourceTokens(
  db: Db,
  args: RevokeArgs,
): Promise<{ revokedCount: number }> {
  const identifier = makeIdentifier(args.kind, args.resourceId);
  const result = await db
    .delete(dbSchema.verification_token)
    .where(eq(dbSchema.verification_token.identifier, identifier))
    .returning({ token: dbSchema.verification_token.token });

  await db.insert(dbSchema.audit_log).values({
    actor_user_id: args.revokedByUserId,
    action: `resource_token.${args.kind}.revoked`,
    target_type: args.kind,
    target_id: args.resourceId,
    reason: args.reason,
    metadata: { revoked_count: result.length },
  });

  return { revokedCount: result.length };
}

/** Best-effort GC. Run from an Inngest cron once that wiring lands. */
export async function purgeExpiredResourceTokens(db: Db): Promise<number> {
  const result = await db
    .delete(dbSchema.verification_token)
    .where(lt(dbSchema.verification_token.expires, new Date()))
    .returning({ token: dbSchema.verification_token.token });
  return result.length;
}

/** Convenience: build a relative URL from an issued token. */
export function buildResourceUrl(kind: ResourceKind, resourceId: string, secret: string): string {
  return `/r/${kind}/${encodeURIComponent(resourceId)}/${secret}`;
}

// Re-export so consumers can pull the kind union from one place.
export { gt };
