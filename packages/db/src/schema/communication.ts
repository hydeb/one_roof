import { pgTable, uuid, text, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './identity';
import { customer } from './customer';
import { job } from './job';

export const messageChannelEnum = pgEnum('message_channel', ['sms', 'email', 'in_app', 'voice']);
export const messageDirectionEnum = pgEnum('message_direction', ['inbound', 'outbound']);

export const message = pgTable('message', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  channel: messageChannelEnum('channel').notNull(),
  direction: messageDirectionEnum('direction').notNull(),

  customer_id: uuid('customer_id').references(() => customer.id),
  job_id: uuid('job_id').references(() => job.id),
  user_id: uuid('user_id').references(() => user.id),

  body: text('body'),
  attachments: jsonb('attachments').default(sql`'[]'::jsonb`).notNull(),

  external_id: text('external_id'),
  external_status: text('external_status'),

  from_address: text('from_address'),
  to_address: text('to_address'),

  occurred_at: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
