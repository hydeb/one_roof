import { pgTable, uuid, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './identity';

// Append-only. Sensitive admin reads, resource-token issuance/redemption,
// subcontractor lifecycle changes, etc. all land here.
export const audit_log = pgTable('audit_log', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  actor_user_id: uuid('actor_user_id').references(() => user.id),
  action: text('action').notNull(),
  target_type: text('target_type'),
  target_id: uuid('target_id'),
  metadata: jsonb('metadata').default(sql`'{}'::jsonb`).notNull(),
  reason: text('reason'),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  occurred_at: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
});

// Cross-product event bus (Addendum N §11).
export const event_outbox = pgTable('event_outbox', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  event_type: text('event_type').notNull(),
  destination: text('destination').notNull(),
  payload: jsonb('payload').notNull(),
  schema_version: text('schema_version').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  processed_at: timestamp('processed_at', { withTimezone: true }),
  processing_attempts: integer('processing_attempts').default(0).notNull(),
  last_error: text('last_error'),
});

export const event_inbox = pgTable('event_inbox', {
  // Upstream event ID — primary key for idempotency.
  event_id: uuid('event_id').primaryKey(),
  source: text('source').notNull(),
  event_type: text('event_type').notNull(),
  payload: jsonb('payload').notNull(),
  schema_version: text('schema_version').notNull(),
  received_at: timestamp('received_at', { withTimezone: true }).defaultNow().notNull(),
  processed_at: timestamp('processed_at', { withTimezone: true }),
  processing_attempts: integer('processing_attempts').default(0).notNull(),
  last_error: text('last_error'),
});
