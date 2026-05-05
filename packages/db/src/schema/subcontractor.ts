import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  decimal,
  jsonb,
  pgEnum,
  date,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './identity';

export const subcontractorStatusEnum = pgEnum('subcontractor_status', [
  'invited',
  'onboarding',
  'active',
  'inactive',
  'on_hold',
  'terminated',
]);

export const rateUnitEnum = pgEnum('rate_unit', [
  'per_job',
  'per_hour',
  'per_sqft',
  'per_unit',
]);

export const payoutStatusEnum = pgEnum('payout_status', [
  'pending',
  'processing',
  'paid',
  'failed',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'ach',
  'check',
  'cash',
  'zelle',
  'venmo',
]);

// Internal-only roster in Phase 1. Augmented (not replaced) by `contractor_profile`
// in Phase 3+ when subs graduate into the Branded program.
export const subcontractor_roster = pgTable('subcontractor_roster', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

  user_id: uuid('user_id').references(() => user.id),

  full_name: text('full_name').notNull(),
  business_name: text('business_name'),
  phone: text('phone').notNull(),
  email: text('email'),

  mailing_address_line_1: text('mailing_address_line_1'),
  mailing_address_line_2: text('mailing_address_line_2'),
  mailing_city: text('mailing_city'),
  mailing_state: text('mailing_state'),
  mailing_postal_code: text('mailing_postal_code'),

  // Trade keys from packages/trades, e.g. ['pressure_washing', 'landscaping'].
  trade_categories: jsonb('trade_categories').default(sql`'[]'::jsonb`).notNull(),

  identity_doc_id: uuid('identity_doc_id'),
  insurance_coi_doc_id: uuid('insurance_coi_doc_id'),
  insurance_expires_at: date('insurance_expires_at'),
  w9_doc_id: uuid('w9_doc_id'),
  signed_agreement_doc_id: uuid('signed_agreement_doc_id'),
  agreement_signed_at: timestamp('agreement_signed_at', { withTimezone: true }),

  payment_method: paymentMethodEnum('payment_method').default('ach').notNull(),
  // Envelope-encrypted at the app layer (libsodium); never log decrypted.
  banking_details_encrypted: text('banking_details_encrypted'),

  status: subcontractorStatusEnum('status').default('invited').notNull(),
  status_reason: text('status_reason'),

  notes: text('notes'),

  total_jobs_completed: integer('total_jobs_completed').default(0).notNull(),
  total_paid: decimal('total_paid', { precision: 12, scale: 2 }).default('0').notNull(),
  last_job_at: timestamp('last_job_at', { withTimezone: true }),

  // Agreement Exhibit C declarations.
  pre_existing_customers: jsonb('pre_existing_customers').default(sql`'[]'::jsonb`).notNull(),

  added_at: timestamp('added_at', { withTimezone: true }).defaultNow().notNull(),
  added_by_user_id: uuid('added_by_user_id').references(() => user.id),
  terminated_at: timestamp('terminated_at', { withTimezone: true }),
});

export const subcontractor_rate_sheet = pgTable('subcontractor_rate_sheet', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  subcontractor_id: uuid('subcontractor_id')
    .notNull()
    .references(() => subcontractor_roster.id),

  // Service identifier from packages/trades (e.g. 'pressure_washing.driveway').
  service_key: text('service_key').notNull(),

  rate_amount: decimal('rate_amount', { precision: 10, scale: 2 }).notNull(),
  rate_unit: rateUnitEnum('rate_unit').default('per_job').notNull(),

  scope_constraints: text('scope_constraints'),
  notes: text('notes'),

  // effective_to is null while a row is current. Schedule changes via
  // 30-day-notice flow by inserting a new row and closing the prior one.
  effective_from: date('effective_from').notNull(),
  effective_to: date('effective_to'),

  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  created_by_user_id: uuid('created_by_user_id').references(() => user.id),
});

export const subcontractor_payout = pgTable('subcontractor_payout', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  subcontractor_id: uuid('subcontractor_id')
    .notNull()
    .references(() => subcontractor_roster.id),

  period_start: date('period_start').notNull(),
  period_end: date('period_end').notNull(),

  total_amount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  job_count: integer('job_count').notNull(),

  status: payoutStatusEnum('status').default('pending').notNull(),
  payment_method: paymentMethodEnum('payment_method').notNull(),
  reference_number: text('reference_number'),

  paid_at: timestamp('paid_at', { withTimezone: true }),
  failed_reason: text('failed_reason'),

  notes: text('notes'),

  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// FK on job_id is enforced in the app layer to avoid a circular import between
// subcontractor.ts and job.ts. Insert paths must verify the job exists.
export const subcontractor_payout_job = pgTable(
  'subcontractor_payout_job',
  {
    payout_id: uuid('payout_id')
      .notNull()
      .references(() => subcontractor_payout.id, { onDelete: 'cascade' }),
    job_id: uuid('job_id').notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.payout_id, t.job_id] }),
  }),
);
