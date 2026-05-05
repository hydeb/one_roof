import { pgTable, uuid, text, timestamp, integer, decimal, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './identity';

// Distinct from `user` because Phase 1 customers are often captured before they
// have an account (door-knock leads, phone calls, FB inquiries).
export const customer = pgTable('customer', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

  user_id: uuid('user_id').references(() => user.id),

  full_name: text('full_name'),
  phone: text('phone'),
  email: text('email'),

  customer_score: integer('customer_score'),
  total_jobs_completed: integer('total_jobs_completed').default(0).notNull(),
  total_revenue: decimal('total_revenue', { precision: 12, scale: 2 }).default('0').notNull(),
  last_job_at: timestamp('last_job_at', { withTimezone: true }),
  first_job_at: timestamp('first_job_at', { withTimezone: true }),

  tags: jsonb('tags').default(sql`'[]'::jsonb`).notNull(),
  preferences: jsonb('preferences').default(sql`'{}'::jsonb`).notNull(),
  notes: text('notes'),

  acquisition_source: text('acquisition_source'),
  acquisition_detail: text('acquisition_detail'),
  acquired_at: timestamp('acquired_at', { withTimezone: true }).defaultNow().notNull(),

  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
