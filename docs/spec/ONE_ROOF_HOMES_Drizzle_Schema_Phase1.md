# One Roof Homes — Drizzle Schema (Phase 1)

**Date:** May 2026  
**Status:** Phase 1 implementation reference  
**Companion to:** PRD v1.1 §13 (Data Model), Addendum A §6 (Phase 1 entity extensions)

This document is the canonical Phase 1 Drizzle schema for `packages/db/schema/`. Claude Code uses this as the implementation source of truth. Phase 3+ entities (`contractor_profile`, public `review`, etc.) are noted but **not built in Phase 1**.

---

## File Structure

```
packages/db/
├── schema/
│   ├── identity.ts       # user, session, account, role grants
│   ├── property.ts       # household, property, portfolio (shared with HD)
│   ├── job.ts            # unified job entity, job_event, pipeline_stage_history
│   ├── customer.ts       # customer (a user with customer role + property association)
│   ├── subcontractor.ts  # subcontractor_roster, rate_sheet, payout
│   ├── communication.ts  # message threads, notifications
│   ├── document.ts       # uploaded files, COIs, IDs, signed agreements
│   ├── audit.ts          # audit_log, event_outbox, event_inbox
│   └── index.ts          # re-exports
├── migrations/
└── policies/             # Postgres RLS policies
```

---

## identity.ts

```ts
import { pgTable, uuid, text, timestamp, boolean, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Roles span both products. Phase 1 uses a subset; rest preserved for Phase 3+.
export const roleEnum = pgEnum('role', [
  'customer',
  'tenant',
  'operator',                  // Phase 1: the GC operator running the business
  'subcontractor',             // Phase 1: roster member doing assigned work
  'contractor_independent',    // Phase 3+: public marketplace contractor (Verified)
  'contractor_branded',        // Phase 3+: Branded marketplace contractor
  'contractor_master',         // Phase 3+: Master tier
  'contractor_member',         // Phase 3+: employee/apprentice on a contractor company
  'property_manager',          // Phase 4+
  'admin_vetting',
  'admin_brand',
  'admin_dispute',
  'admin_marketplace',
  'admin_super',
]);

export const user = pgTable('user', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),  // upgrade to uuid v7 helper
  email: text('email').notNull().unique(),
  email_verified_at: timestamp('email_verified_at', { withTimezone: true }),
  phone: text('phone'),
  phone_verified_at: timestamp('phone_verified_at', { withTimezone: true }),
  full_name: text('full_name'),
  preferred_name: text('preferred_name'),
  avatar_url: text('avatar_url'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  // MFA
  mfa_enabled: boolean('mfa_enabled').default(false).notNull(),
  // Soft delete for GDPR/CCPA
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
});

// Auth.js v5 standard tables
export const account = pgTable('account', {
  user_id: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  provider_account_id: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: timestamp('expires_at', { withTimezone: true }),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (t) => ({
  pk: primaryKey({ columns: [t.provider, t.provider_account_id] }),
}));

export const session = pgTable('session', {
  session_token: text('session_token').primaryKey(),
  user_id: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
});

export const verification_token = pgTable('verification_token', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.identifier, t.token] }),
}));

// Multi-role support: a user holds (role, scope_type, scope_id) tuples
export const scopeTypeEnum = pgEnum('scope_type', ['global', 'household', 'portfolio', 'company']);

export const user_role_grant = pgTable('user_role_grant', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  role: roleEnum('role').notNull(),
  scope_type: scopeTypeEnum('scope_type').notNull(),
  scope_id: uuid('scope_id'),  // nullable for global scope
  granted_at: timestamp('granted_at', { withTimezone: true }).defaultNow().notNull(),
  granted_by_user_id: uuid('granted_by_user_id').references(() => user.id),
  revoked_at: timestamp('revoked_at', { withTimezone: true }),
});
```

---

## property.ts (shared with Home Doctor per Addendum N §4)

```ts
import { pgTable, uuid, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './identity';

export const propertyTypeEnum = pgEnum('property_type', [
  'single_family',
  'condo',
  'townhouse',
  'multi_family',
  'vacant_lot',
  'commercial',
]);

// Portfolio: multi-property grouping (Phase 4+ primary use, but entity exists from Phase 1)
export const portfolio = pgTable('portfolio', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  owner_user_id: uuid('owner_user_id').notNull().references(() => user.id),
  name: text('name').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Household: a homeowner's logical home unit
export const household = pgTable('household', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  owner_user_id: uuid('owner_user_id').notNull().references(() => user.id),
  portfolio_id: uuid('portfolio_id').references(() => portfolio.id),  // null = single-household
  display_name: text('display_name'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),

  // Cross-product link (Addendum N §11)
  homedoctor_household_id: uuid('homedoctor_household_id'),
});

export const property = pgTable('property', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  household_id: uuid('household_id').notNull().references(() => household.id, { onDelete: 'cascade' }),

  // Address
  address_line_1: text('address_line_1').notNull(),
  address_line_2: text('address_line_2'),
  city: text('city').notNull(),
  state: text('state').notNull(),  // 2-letter
  postal_code: text('postal_code').notNull(),
  country: text('country').default('US').notNull(),

  // Geo
  latitude: text('latitude'),   // store as text to preserve precision
  longitude: text('longitude'),

  // Type and characteristics
  property_type: propertyTypeEnum('property_type'),
  year_built: integer('year_built'),
  square_feet: integer('square_feet'),
  bedrooms: integer('bedrooms'),
  bathrooms: text('bathrooms'),  // string to allow "2.5"

  // Access notes
  access_notes: text('access_notes'),  // gate codes, dog warnings, parking
  primary_contact_user_id: uuid('primary_contact_user_id').references(() => user.id),

  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
```

---

## customer.ts

```ts
import { pgTable, uuid, text, timestamp, integer, decimal, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './identity';

// Customer record: distinct from user because some Phase 1 customers
// are captured before they create an account (door-knock leads, etc.)
export const customer = pgTable('customer', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

  // Linked user when account exists; null for unregistered leads
  user_id: uuid('user_id').references(() => user.id),

  // Captured directly when no account
  full_name: text('full_name'),
  phone: text('phone'),
  email: text('email'),

  // Aggregate scoring (visible to operator/subs during matching, never public)
  customer_score: integer('customer_score'),   // 0-100
  total_jobs_completed: integer('total_jobs_completed').default(0).notNull(),
  total_revenue: decimal('total_revenue', { precision: 12, scale: 2 }).default('0').notNull(),
  last_job_at: timestamp('last_job_at', { withTimezone: true }),
  first_job_at: timestamp('first_job_at', { withTimezone: true }),

  // Tags / preferences
  tags: jsonb('tags').default(sql`'[]'::jsonb`).notNull(),  // ['recurring_lawn', 'tybee_str', etc.]
  preferences: jsonb('preferences').default(sql`'{}'::jsonb`).notNull(),
  notes: text('notes'),  // operator's private notes

  // Source tracking
  acquisition_source: text('acquisition_source'),  // 'door_knock' | 'facebook' | etc.
  acquisition_detail: text('acquisition_detail'),
  acquired_at: timestamp('acquired_at', { withTimezone: true }).defaultNow().notNull(),

  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
```

---

## subcontractor.ts

```ts
import { pgTable, uuid, text, timestamp, decimal, jsonb, pgEnum, boolean, date } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './identity';

export const subcontractorStatusEnum = pgEnum('subcontractor_status', [
  'invited',          // invitation sent, not yet onboarded
  'onboarding',       // mid-onboarding (docs uploaded, agreement pending)
  'active',
  'inactive',         // temporarily not taking jobs
  'on_hold',          // operator-flagged, no new jobs
  'terminated',       // ended per agreement §2.12
]);

export const rateUnitEnum = pgEnum('rate_unit', [
  'per_job',          // default
  'per_hour',
  'per_sqft',
  'per_unit',         // e.g., per window cleaned
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

// The subcontractor roster: internal-only in Phase 1.
// In Phase 3+ this is augmented (not replaced) by contractor_profile for graduates.
export const subcontractor_roster = pgTable('subcontractor_roster', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

  // Optional link to a user account (subs may have a One Roof Pro app account in Phase 2)
  user_id: uuid('user_id').references(() => user.id),

  // Required identifying info
  full_name: text('full_name').notNull(),
  business_name: text('business_name'),
  phone: text('phone').notNull(),
  email: text('email'),

  // Address (for shipping apparel, mailing checks)
  mailing_address_line_1: text('mailing_address_line_1'),
  mailing_address_line_2: text('mailing_address_line_2'),
  mailing_city: text('mailing_city'),
  mailing_state: text('mailing_state'),
  mailing_postal_code: text('mailing_postal_code'),

  // Trade categories (matches services in trades package)
  trade_categories: jsonb('trade_categories').default(sql`'[]'::jsonb`).notNull(),
  // e.g. ['pressure_washing', 'landscaping_simple', 'junk_removal']

  // Documents (refs to document table)
  identity_doc_id: uuid('identity_doc_id'),
  insurance_coi_doc_id: uuid('insurance_coi_doc_id'),
  insurance_expires_at: date('insurance_expires_at'),
  w9_doc_id: uuid('w9_doc_id'),
  signed_agreement_doc_id: uuid('signed_agreement_doc_id'),
  agreement_signed_at: timestamp('agreement_signed_at', { withTimezone: true }),

  // Banking (encrypted at column level via libsodium - app responsibility)
  payment_method: paymentMethodEnum('payment_method').default('ach').notNull(),
  banking_details_encrypted: text('banking_details_encrypted'),  // ciphertext

  // Status
  status: subcontractorStatusEnum('status').default('invited').notNull(),
  status_reason: text('status_reason'),

  // Operator's private notes
  notes: text('notes'),

  // Aggregates (denormalized for fast operator-view rendering)
  total_jobs_completed: integer('total_jobs_completed').default(0).notNull(),
  total_paid: decimal('total_paid', { precision: 12, scale: 2 }).default('0').notNull(),
  last_job_at: timestamp('last_job_at', { withTimezone: true }),

  // Pre-existing customer declarations (Agreement Exhibit C)
  pre_existing_customers: jsonb('pre_existing_customers').default(sql`'[]'::jsonb`).notNull(),

  added_at: timestamp('added_at', { withTimezone: true }).defaultNow().notNull(),
  added_by_user_id: uuid('added_by_user_id').references(() => user.id),
  terminated_at: timestamp('terminated_at', { withTimezone: true }),
});

// Per-(subcontractor, service) rate sheet — Agreement Exhibit A
export const subcontractor_rate_sheet = pgTable('subcontractor_rate_sheet', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  subcontractor_id: uuid('subcontractor_id').notNull().references(() => subcontractor_roster.id),

  // Service identifier from packages/trades taxonomy (string key, e.g. 'pressure_washing.driveway')
  service_key: text('service_key').notNull(),

  // The deal
  rate_amount: decimal('rate_amount', { precision: 10, scale: 2 }).notNull(),
  rate_unit: rateUnitEnum('rate_unit').default('per_job').notNull(),

  // Constraints / notes
  scope_constraints: text('scope_constraints'),  // e.g., "Up to 1,000 sqft"
  notes: text('notes'),

  // Effective range (allows scheduled rate changes via 30-day-notice flow)
  effective_from: date('effective_from').notNull(),
  effective_to: date('effective_to'),  // null = current

  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  created_by_user_id: uuid('created_by_user_id').references(() => user.id),
});

// Weekly payout to a subcontractor
export const subcontractor_payout = pgTable('subcontractor_payout', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  subcontractor_id: uuid('subcontractor_id').notNull().references(() => subcontractor_roster.id),

  period_start: date('period_start').notNull(),  // Monday
  period_end: date('period_end').notNull(),      // Sunday

  total_amount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  job_count: integer('job_count').notNull(),

  status: payoutStatusEnum('status').default('pending').notNull(),
  payment_method: paymentMethodEnum('payment_method').notNull(),
  reference_number: text('reference_number'),  // ACH trace, check number, etc.

  paid_at: timestamp('paid_at', { withTimezone: true }),
  failed_reason: text('failed_reason'),

  // Operator's notes
  notes: text('notes'),

  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Junction: which jobs are in which payout
export const subcontractor_payout_job = pgTable('subcontractor_payout_job', {
  payout_id: uuid('payout_id').notNull().references(() => subcontractor_payout.id, { onDelete: 'cascade' }),
  job_id: uuid('job_id').notNull(),  // FK enforced in app layer to avoid cycle here
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.payout_id, t.job_id] }),
}));
```

---

## job.ts (the unified Phase 1 job entity)

```ts
import { pgTable, uuid, text, timestamp, integer, decimal, jsonb, pgEnum, date } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './identity';
import { customer } from './customer';
import { property } from './property';
import { subcontractor_roster } from './subcontractor';

// The 6-stage pipeline + LOST
export const pipelineStageEnum = pgEnum('pipeline_stage', [
  'new_lead',
  'contacted',
  'estimate_sent',
  'proposal_followup',
  'booked_scheduled',
  'completed_won',
  'lost',
]);

export const lostReasonEnum = pgEnum('lost_reason', [
  'price',
  'timing',
  'went_with_competitor',
  'no_response',
  'scope_changed',
  'other',
]);

export const jobSourceEnum = pgEnum('job_source', [
  'door_knock',
  'facebook',
  'referral',
  'realtor_pm',
  'web',
  'phone',
  'repeat',
  'home_doctor',
  'walk_in',
  'other',
]);

// THE unified job entity - replaces v1.1's separate service_request/quote/job
export const job = pgTable('job', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

  // Pipeline state (denormalized for fast queries; pipeline_stage_history is canonical)
  pipeline_stage: pipelineStageEnum('pipeline_stage').default('new_lead').notNull(),

  // Lost-state fields
  lost_at: timestamp('lost_at', { withTimezone: true }),
  lost_reason: lostReasonEnum('lost_reason'),
  lost_notes: text('lost_notes'),

  // Customer + property
  customer_id: uuid('customer_id').notNull().references(() => customer.id),
  property_id: uuid('property_id').references(() => property.id),  // null for early-stage leads

  // Service request fields
  requested_services: jsonb('requested_services').default(sql`'[]'::jsonb`).notNull(),
  // [{ service_key: 'pressure_washing.driveway', notes: '...', estimated_size: ... }]
  description: text('description'),
  initial_photos: jsonb('initial_photos').default(sql`'[]'::jsonb`).notNull(),  // doc IDs

  // Source tracking
  source: jobSourceEnum('source').notNull(),
  source_detail: text('source_detail'),

  // Estimate fields (populated when reaching ESTIMATE SENT)
  estimate_amount: decimal('estimate_amount', { precision: 10, scale: 2 }),
  estimate_line_items: jsonb('estimate_line_items'),
  estimate_sent_at: timestamp('estimate_sent_at', { withTimezone: true }),
  estimate_doc_id: uuid('estimate_doc_id'),
  estimate_expires_at: timestamp('estimate_expires_at', { withTimezone: true }),

  // Booking fields
  scheduled_for: timestamp('scheduled_for', { withTimezone: true }),
  scheduled_window_minutes: integer('scheduled_window_minutes'),  // e.g. 180 = 3hr window
  deposit_amount: decimal('deposit_amount', { precision: 10, scale: 2 }),
  deposit_paid_at: timestamp('deposit_paid_at', { withTimezone: true }),

  // Execution fields
  performed_by: text('performed_by'),  // 'operator' | 'subcontractor'
  assigned_subcontractor_id: uuid('assigned_subcontractor_id').references(() => subcontractor_roster.id),
  subcontractor_pay_amount: decimal('subcontractor_pay_amount', { precision: 10, scale: 2 }),

  // Completion fields
  completed_at: timestamp('completed_at', { withTimezone: true }),
  invoice_amount: decimal('invoice_amount', { precision: 10, scale: 2 }),
  invoice_paid_at: timestamp('invoice_paid_at', { withTimezone: true }),
  invoice_doc_id: uuid('invoice_doc_id'),
  payment_method: text('payment_method'),
  payment_reference: text('payment_reference'),

  // Quality/dispute
  customer_rating: integer('customer_rating'),  // 1-5; private to operator in Phase 1
  customer_review_text: text('customer_review_text'),
  has_dispute: integer('has_dispute').default(0).notNull(),  // bool 0/1 for index efficiency

  // Cross-product (Addendum N §11)
  homedoctor_recommendation_id: uuid('homedoctor_recommendation_id'),
  homedoctor_check_id: uuid('homedoctor_check_id'),

  // Activity tracking
  next_followup_at: timestamp('next_followup_at', { withTimezone: true }),
  last_activity_at: timestamp('last_activity_at', { withTimezone: true }).defaultNow().notNull(),

  // Ownership
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  created_by_user_id: uuid('created_by_user_id').references(() => user.id),
  owner_user_id: uuid('owner_user_id').references(() => user.id),  // operator who owns this job
});

// Append-only timeline (canonical audit trail of stage changes and events)
export const jobEventTypeEnum = pgEnum('job_event_type', [
  'lead.created',
  'lead.contacted',
  'lead.message_sent',
  'lead.message_received',
  'lead.note_added',
  'estimate.draft_started',
  'estimate.sent',
  'estimate.viewed',
  'estimate.followup_sent',
  'estimate.discussion',
  'estimate.changed',
  'job.scheduled',
  'job.rescheduled',
  'job.deposit_paid',
  'job.subcontractor_assigned',
  'job.subcontractor_unassigned',
  'job.in_progress',
  'job.paused',
  'job.completed',
  'job.cancelled',
  'invoice.sent',
  'invoice.viewed',
  'invoice.paid',
  'invoice.partial_paid',
  'review.requested',
  'review.received',
  'dispute.opened',
  'dispute.resolved',
  'lost.marked',
]);

export const job_event = pgTable('job_event', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  job_id: uuid('job_id').notNull().references(() => job.id, { onDelete: 'cascade' }),
  event_type: jobEventTypeEnum('event_type').notNull(),
  event_data: jsonb('event_data').default(sql`'{}'::jsonb`).notNull(),
  occurred_at: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  actor_user_id: uuid('actor_user_id').references(() => user.id),
  actor_role: text('actor_role'),  // 'operator' | 'subcontractor' | 'customer' | 'system'
});

// Explicit pipeline stage transitions for analytics
export const pipeline_stage_history = pgTable('pipeline_stage_history', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  job_id: uuid('job_id').notNull().references(() => job.id, { onDelete: 'cascade' }),
  from_stage: pipelineStageEnum('from_stage'),  // null for initial
  to_stage: pipelineStageEnum('to_stage').notNull(),
  transitioned_at: timestamp('transitioned_at', { withTimezone: true }).defaultNow().notNull(),
  transitioned_by_user_id: uuid('transitioned_by_user_id').references(() => user.id),
  reason: text('reason'),  // required when to_stage='lost'
  notes: text('notes'),
});
```

---

## communication.ts

```ts
import { pgTable, uuid, text, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './identity';
import { customer } from './customer';
import { job } from './job';

export const messageChannelEnum = pgEnum('message_channel', [
  'sms',
  'email',
  'in_app',
  'voice',  // call log
]);

export const messageDirectionEnum = pgEnum('message_direction', [
  'inbound',
  'outbound',
]);

// Phase 1: SMS-first via Twilio. Email via Resend. In-app deferred.
export const message = pgTable('message', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  channel: messageChannelEnum('channel').notNull(),
  direction: messageDirectionEnum('direction').notNull(),

  // Participants
  customer_id: uuid('customer_id').references(() => customer.id),
  job_id: uuid('job_id').references(() => job.id),
  user_id: uuid('user_id').references(() => user.id),  // operator/sub on the platform side

  // Content
  body: text('body'),
  attachments: jsonb('attachments').default(sql`'[]'::jsonb`).notNull(),  // doc IDs

  // External provider IDs
  external_id: text('external_id'),  // Twilio SID, Resend ID
  external_status: text('external_status'),

  // Phone numbers / addresses
  from_address: text('from_address'),
  to_address: text('to_address'),

  occurred_at: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
```

---

## document.ts

```ts
import { pgTable, uuid, text, timestamp, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './identity';

export const documentTypeEnum = pgEnum('document_type', [
  'identity_doc',
  'insurance_coi',
  'w9',
  'subcontractor_agreement',
  'rate_sheet_addendum',
  'estimate_pdf',
  'invoice_pdf',
  'job_photo_before',
  'job_photo_progress',
  'job_photo_after',
  'leave_behind_pdf',
  'other',
]);

// Vercel Blob-backed file storage with metadata
export const document = pgTable('document', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  document_type: documentTypeEnum('document_type').notNull(),

  // Vercel Blob URL
  blob_url: text('blob_url').notNull(),
  blob_pathname: text('blob_pathname').notNull(),
  content_type: text('content_type').notNull(),
  file_size_bytes: integer('file_size_bytes').notNull(),

  // Original filename for downloads
  original_filename: text('original_filename'),

  // Linked entity (one of)
  customer_id: uuid('customer_id'),
  property_id: uuid('property_id'),
  subcontractor_id: uuid('subcontractor_id'),
  job_id: uuid('job_id'),

  // Metadata (EXIF stripped from photos, etc.)
  metadata: jsonb('metadata').default(sql`'{}'::jsonb`).notNull(),

  uploaded_at: timestamp('uploaded_at', { withTimezone: true }).defaultNow().notNull(),
  uploaded_by_user_id: uuid('uploaded_by_user_id').references(() => user.id),

  // Soft delete
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
});
```

---

## audit.ts

```ts
import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './identity';

// Append-only audit log for sensitive actions
export const audit_log = pgTable('audit_log', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  actor_user_id: uuid('actor_user_id').references(() => user.id),
  action: text('action').notNull(),  // e.g., 'subcontractor.terminated', 'customer.pii_viewed'
  target_type: text('target_type'),
  target_id: uuid('target_id'),
  metadata: jsonb('metadata').default(sql`'{}'::jsonb`).notNull(),
  reason: text('reason'),  // required for some actions (admin PII view, etc.)
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  occurred_at: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
});

// Outbox for cross-product events (Addendum N §11)
export const event_outbox = pgTable('event_outbox', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  event_type: text('event_type').notNull(),
  destination: text('destination').notNull(),  // 'home_doctor' for now
  payload: jsonb('payload').notNull(),
  schema_version: text('schema_version').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  processed_at: timestamp('processed_at', { withTimezone: true }),
  processing_attempts: integer('processing_attempts').default(0).notNull(),
  last_error: text('last_error'),
});

// Inbox for events from other products
export const event_inbox = pgTable('event_inbox', {
  event_id: uuid('event_id').primaryKey(),  // upstream event ID for idempotency
  source: text('source').notNull(),
  event_type: text('event_type').notNull(),
  payload: jsonb('payload').notNull(),
  schema_version: text('schema_version').notNull(),
  received_at: timestamp('received_at', { withTimezone: true }).defaultNow().notNull(),
  processed_at: timestamp('processed_at', { withTimezone: true }),
  processing_attempts: integer('processing_attempts').default(0).notNull(),
  last_error: text('last_error'),
});
```

---

## Indexes (call out the ones that matter for Phase 1 perf)

```sql
-- Pipeline view (operator's home page, hot path)
CREATE INDEX idx_job_pipeline_stage_owner ON job (owner_user_id, pipeline_stage)
  WHERE pipeline_stage NOT IN ('completed_won', 'lost');

-- Followup queue
CREATE INDEX idx_job_next_followup ON job (next_followup_at)
  WHERE pipeline_stage NOT IN ('completed_won', 'lost') AND next_followup_at IS NOT NULL;

-- Customer history lookup
CREATE INDEX idx_job_customer_completed ON job (customer_id, completed_at DESC)
  WHERE pipeline_stage = 'completed_won';

-- Subcontractor work history
CREATE INDEX idx_job_subcontractor_completed ON job (assigned_subcontractor_id, completed_at DESC)
  WHERE pipeline_stage = 'completed_won';

-- Job event timeline lookup
CREATE INDEX idx_job_event_job_occurred ON job_event (job_id, occurred_at DESC);

-- Pipeline analytics
CREATE INDEX idx_pipeline_stage_history_job ON pipeline_stage_history (job_id, transitioned_at);
CREATE INDEX idx_pipeline_stage_history_to_stage_at ON pipeline_stage_history (to_stage, transitioned_at);

-- Geographic property lookup (for job-routing in Phase 2+)
CREATE INDEX idx_property_postal_code ON property (postal_code);

-- Cross-product event processing
CREATE INDEX idx_event_outbox_unprocessed ON event_outbox (created_at)
  WHERE processed_at IS NULL;

-- Audit queries
CREATE INDEX idx_audit_log_actor_occurred ON audit_log (actor_user_id, occurred_at DESC);
CREATE INDEX idx_audit_log_target ON audit_log (target_type, target_id, occurred_at DESC);
```

---

## RLS Policies (sketch)

```sql
-- Operator can see all jobs in their scope
CREATE POLICY operator_job_access ON job
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_role_grant
      WHERE user_id = current_setting('app.user_id')::uuid
      AND role = 'operator'
      AND scope_type = 'global'
      AND revoked_at IS NULL
    )
  );

-- Subcontractor can see only jobs assigned to them, with PII redacted
CREATE POLICY subcontractor_job_access ON job
  FOR SELECT
  USING (
    assigned_subcontractor_id IN (
      SELECT id FROM subcontractor_roster
      WHERE user_id = current_setting('app.user_id')::uuid
    )
  );

-- Customer can see only their own jobs
CREATE POLICY customer_job_access ON job
  FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM customer WHERE user_id = current_setting('app.user_id')::uuid
    )
  );

-- Subcontractor PII redaction: app-level concern, enforced via column-level grants
-- in a future migration. Phase 1 enforces via app code only.
```

---

## Notes for Claude Code

1. **Use `gen_random_uuid()` for now**; upgrade to UUID v7 helper (e.g., `uuidv7()` extension) in a Phase 1 migration once stable.
2. **Encrypt banking details** at the application layer using libsodium before insert. Keys live in Vercel env. Never log decrypted values.
3. **Strip EXIF** from all uploaded job photos at the API layer before writing to Vercel Blob.
4. **The `job` entity is the single source of truth** for the unified pipeline. Do not create separate service_request/quote tables in Phase 1.
5. **`job_event` is append-only** — never UPDATE or DELETE. All corrections happen by appending compensating events.
6. **`pipeline_stage_history`** is canonical for analytics; `job.pipeline_stage` is denormalized for fast reads.
7. **Cross-product event handlers** must be idempotent and keyed on `event_inbox.event_id`.

---

*End of Drizzle Schema (Phase 1)*  
*Source of truth for `packages/db/schema/`. Update this document when schema changes.*
