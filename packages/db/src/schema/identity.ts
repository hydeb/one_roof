import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const roleEnum = pgEnum('role', [
  'customer',
  'tenant',
  'operator',
  'subcontractor',
  'contractor_independent',
  'contractor_branded',
  'contractor_master',
  'contractor_member',
  'property_manager',
  'admin_vetting',
  'admin_brand',
  'admin_dispute',
  'admin_marketplace',
  'admin_super',
]);

export const scopeTypeEnum = pgEnum('scope_type', [
  'global',
  'household',
  'portfolio',
  'company',
]);

export const user = pgTable('user', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').notNull().unique(),
  email_verified_at: timestamp('email_verified_at', { withTimezone: true }),
  phone: text('phone'),
  phone_verified_at: timestamp('phone_verified_at', { withTimezone: true }),
  full_name: text('full_name'),
  preferred_name: text('preferred_name'),
  avatar_url: text('avatar_url'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  mfa_enabled: boolean('mfa_enabled').default(false).notNull(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
});

export const account = pgTable(
  'account',
  {
    user_id: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
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
  },
  (t) => ({
    pk: primaryKey({ columns: [t.provider, t.provider_account_id] }),
  }),
);

export const session = pgTable('session', {
  session_token: text('session_token').primaryKey(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
});

export const verification_token = pgTable(
  'verification_token',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.identifier, t.token] }),
  }),
);

export const user_role_grant = pgTable('user_role_grant', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  role: roleEnum('role').notNull(),
  scope_type: scopeTypeEnum('scope_type').notNull(),
  scope_id: uuid('scope_id'),
  granted_at: timestamp('granted_at', { withTimezone: true }).defaultNow().notNull(),
  granted_by_user_id: uuid('granted_by_user_id').references(() => user.id),
  revoked_at: timestamp('revoked_at', { withTimezone: true }),
});
