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

// Vercel Blob-backed file storage with metadata. Photos must have EXIF
// stripped at the API layer before insert.
export const document = pgTable('document', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  document_type: documentTypeEnum('document_type').notNull(),

  blob_url: text('blob_url').notNull(),
  blob_pathname: text('blob_pathname').notNull(),
  content_type: text('content_type').notNull(),
  file_size_bytes: integer('file_size_bytes').notNull(),

  original_filename: text('original_filename'),

  // Linked entity (one of). FKs deliberately omitted to avoid cycles; insert
  // paths must verify the referenced row exists.
  customer_id: uuid('customer_id'),
  property_id: uuid('property_id'),
  subcontractor_id: uuid('subcontractor_id'),
  job_id: uuid('job_id'),

  metadata: jsonb('metadata').default(sql`'{}'::jsonb`).notNull(),

  uploaded_at: timestamp('uploaded_at', { withTimezone: true }).defaultNow().notNull(),
  uploaded_by_user_id: uuid('uploaded_by_user_id').references(() => user.id),

  deleted_at: timestamp('deleted_at', { withTimezone: true }),
});
