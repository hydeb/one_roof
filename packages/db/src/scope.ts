import { sql } from 'drizzle-orm';
import type { Db } from './client';

/**
 * Run `fn` inside a transaction with `app.household_id` and `app.user_id` set
 * via SET LOCAL. The `assert_household_scope` before-insert trigger on every
 * tenant table compares `household_id` against `current_setting('app.household_id')`
 * and throws if they don't match — so any write that escapes this helper fails
 * loudly at the database boundary.
 *
 * The trigger lands in a follow-up migration; the helper is the surface every
 * tenant-touching route is expected to use today.
 */
export async function withHouseholdScope<T>(
  db: Db,
  scope: { householdId: string; userId: string | null },
  fn: (tx: Db) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.household_id', ${scope.householdId}, true)`);
    await tx.execute(
      sql`SELECT set_config('app.user_id', ${scope.userId ?? ''}, true)`,
    );
    return fn(tx as unknown as Db);
  });
}

/**
 * Same shape as `withHouseholdScope` but without a household — for operator/admin
 * actions that span households (subcontractor roster edits, payouts, audit views).
 * Sets `app.household_id` to the empty string so the trigger can distinguish
 * "intentionally global" from "forgot to scope."
 */
export async function withGlobalScope<T>(
  db: Db,
  scope: { userId: string },
  fn: (tx: Db) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.household_id', '', true)`);
    await tx.execute(sql`SELECT set_config('app.user_id', ${scope.userId}, true)`);
    return fn(tx as unknown as Db);
  });
}
