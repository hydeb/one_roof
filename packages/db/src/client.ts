import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let _client: postgres.Sql | undefined;
let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;

function connectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set. See .env.example.');
  }
  return url;
}

export function getClient(): postgres.Sql {
  if (!_client) {
    _client = postgres(connectionString(), {
      max: Number(process.env.DATABASE_POOL_MAX ?? 10),
      // Postgres requires a transaction to use SET LOCAL — keep prepares so
      // withHouseholdScope queries reuse the same statement plan.
      prepare: true,
    });
  }
  return _client;
}

export function getDb() {
  if (!_db) {
    _db = drizzle(getClient(), { schema });
  }
  return _db;
}

export type Db = ReturnType<typeof getDb>;
