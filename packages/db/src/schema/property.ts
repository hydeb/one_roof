import { pgTable, uuid, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
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

export const portfolio = pgTable('portfolio', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  owner_user_id: uuid('owner_user_id')
    .notNull()
    .references(() => user.id),
  name: text('name').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const household = pgTable('household', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  owner_user_id: uuid('owner_user_id')
    .notNull()
    .references(() => user.id),
  portfolio_id: uuid('portfolio_id').references(() => portfolio.id),
  display_name: text('display_name'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),

  // Cross-product link (Addendum N §11) — populated when a Home Doctor household
  // refers a job over the event bus.
  homedoctor_household_id: uuid('homedoctor_household_id'),
});

export const property = pgTable('property', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  household_id: uuid('household_id')
    .notNull()
    .references(() => household.id, { onDelete: 'cascade' }),

  address_line_1: text('address_line_1').notNull(),
  address_line_2: text('address_line_2'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  postal_code: text('postal_code').notNull(),
  country: text('country').default('US').notNull(),

  // Stored as text to preserve precision across languages/runtimes.
  latitude: text('latitude'),
  longitude: text('longitude'),

  property_type: propertyTypeEnum('property_type'),
  year_built: integer('year_built'),
  square_feet: integer('square_feet'),
  bedrooms: integer('bedrooms'),
  // Text to allow "2.5".
  bathrooms: text('bathrooms'),

  access_notes: text('access_notes'),
  primary_contact_user_id: uuid('primary_contact_user_id').references(() => user.id),

  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
