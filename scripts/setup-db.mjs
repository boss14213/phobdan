import pg from 'pg';
import fs from 'node:fs';

const { Client } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:p9VhfN1Cf5yF3mLi@db.iehjluoectexvopuiaom.supabase.co:5432/postgres';

async function main() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL!');

    const sql = fs.readFileSync('supabase-schema.sql', 'utf8');
    await client.query(sql);
    console.log('Schema executed successfully!');

    const res = await client.query('SELECT count(*) FROM checkpoints');
    console.log(`Active checkpoints in database: ${res.rows[0].count}`);

    await client.end();
  } catch (err) {
    console.error('Error:', err.message);
    try { await client.end(); } catch (e) {}
  }
}

main();
