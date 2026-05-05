import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { getDb, getClient } from './client';

async function main() {
  const db = getDb();
  await migrate(db, { migrationsFolder: './migrations' });
  await getClient().end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
