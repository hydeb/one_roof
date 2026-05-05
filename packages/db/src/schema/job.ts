import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  decimal,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './identity';
import { customer } from './customer';
import { property } from './property';
import { subcontractor_roster } from './subcontractor';

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

// THE unified job entity — replaces v1.1's separate service_request/quote/job.
// `pipeline_stage` is denormalized for fast pipeline reads; `pipeline_stage_history`
// below is the canonical analytics record.
export const job = pgTable('job', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

  pipeline_stage: pipelineStageEnum('pipeline_stage').default('new_lead').notNull(),

  lost_at: timestamp('lost_at', { withTimezone: true }),
  lost_reason: lostReasonEnum('lost_reason'),
  lost_notes: text('lost_notes'),

  customer_id: uuid('customer_id')
    .notNull()
    .references(() => customer.id),
  // Null for early-stage leads where the property hasn't been captured yet.
  property_id: uuid('property_id').references(() => property.id),

  // [{ service_key, notes, estimated_size }, ...]
  requested_services: jsonb('requested_services').default(sql`'[]'::jsonb`).notNull(),
  description: text('description'),
  initial_photos: jsonb('initial_photos').default(sql`'[]'::jsonb`).notNull(),

  source: jobSourceEnum('source').notNull(),
  source_detail: text('source_detail'),

  estimate_amount: decimal('estimate_amount', { precision: 10, scale: 2 }),
  estimate_line_items: jsonb('estimate_line_items'),
  estimate_sent_at: timestamp('estimate_sent_at', { withTimezone: true }),
  estimate_doc_id: uuid('estimate_doc_id'),
  estimate_expires_at: timestamp('estimate_expires_at', { withTimezone: true }),

  scheduled_for: timestamp('scheduled_for', { withTimezone: true }),
  scheduled_window_minutes: integer('scheduled_window_minutes'),
  deposit_amount: decimal('deposit_amount', { precision: 10, scale: 2 }),
  deposit_paid_at: timestamp('deposit_paid_at', { withTimezone: true }),

  performed_by: text('performed_by'),
  assigned_subcontractor_id: uuid('assigned_subcontractor_id').references(
    () => subcontractor_roster.id,
  ),
  subcontractor_pay_amount: decimal('subcontractor_pay_amount', { precision: 10, scale: 2 }),

  completed_at: timestamp('completed_at', { withTimezone: true }),
  invoice_amount: decimal('invoice_amount', { precision: 10, scale: 2 }),
  invoice_paid_at: timestamp('invoice_paid_at', { withTimezone: true }),
  invoice_doc_id: uuid('invoice_doc_id'),
  payment_method: text('payment_method'),
  payment_reference: text('payment_reference'),

  customer_rating: integer('customer_rating'),
  customer_review_text: text('customer_review_text'),
  // 0/1 instead of boolean for cheap partial-index targets.
  has_dispute: integer('has_dispute').default(0).notNull(),

  homedoctor_recommendation_id: uuid('homedoctor_recommendation_id'),
  homedoctor_check_id: uuid('homedoctor_check_id'),

  next_followup_at: timestamp('next_followup_at', { withTimezone: true }),
  last_activity_at: timestamp('last_activity_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  created_by_user_id: uuid('created_by_user_id').references(() => user.id),
  owner_user_id: uuid('owner_user_id').references(() => user.id),
});

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

// Append-only. Never UPDATE or DELETE — corrections happen via compensating events.
export const job_event = pgTable('job_event', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  job_id: uuid('job_id')
    .notNull()
    .references(() => job.id, { onDelete: 'cascade' }),
  event_type: jobEventTypeEnum('event_type').notNull(),
  event_data: jsonb('event_data').default(sql`'{}'::jsonb`).notNull(),
  occurred_at: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  actor_user_id: uuid('actor_user_id').references(() => user.id),
  actor_role: text('actor_role'),
});

export const pipeline_stage_history = pgTable('pipeline_stage_history', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  job_id: uuid('job_id')
    .notNull()
    .references(() => job.id, { onDelete: 'cascade' }),
  // Null for the initial transition into `new_lead`.
  from_stage: pipelineStageEnum('from_stage'),
  to_stage: pipelineStageEnum('to_stage').notNull(),
  transitioned_at: timestamp('transitioned_at', { withTimezone: true }).defaultNow().notNull(),
  transitioned_by_user_id: uuid('transitioned_by_user_id').references(() => user.id),
  // Required at the app layer when to_stage='lost'.
  reason: text('reason'),
  notes: text('notes'),
});
