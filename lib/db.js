import { neon } from '@neondatabase/serverless';
import { defaultContent } from './defaultContent';
import { setAtPath } from './objectPath';

const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS content (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL
    )
  `;
}

export async function getContent() {
  await ensureTable();
  const rows = await sql`SELECT data FROM content WHERE id = 'main'`;
  if (rows.length === 0) {
    await sql`INSERT INTO content (id, data) VALUES ('main', ${JSON.stringify(defaultContent)})`;
    return defaultContent;
  }
  return rows[0].data;
}

export async function setContentAtPath(path, value) {
  await ensureTable();
  const current = await getContent();
  const next = setAtPath(current, path, value);
  await sql`UPDATE content SET data = ${JSON.stringify(next)} WHERE id = 'main'`;
  return next;
}
