import { readFileSync } from 'node:fs';
import { Pool } from '@neondatabase/serverless';

const env = readFileSync('.env.local', 'utf8');
const line = env.split('\n').find((l) => l.startsWith('DATABASE_URL='));
if (!line) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}
const connectionString = line.slice('DATABASE_URL='.length).trim();

const pool = new Pool({ connectionString });

try {
  await pool.query(readFileSync('db/schema.sql', 'utf8'));
  await pool.query(readFileSync('db/seed.sql', 'utf8'));

  const restaurants = await pool.query('SELECT * FROM restaurants');
  const reviews = await pool.query('SELECT * FROM reviews ORDER BY created_at');
  console.log('restaurants:');
  console.table(restaurants.rows);
  console.log('reviews:');
  console.table(reviews.rows);
} finally {
  await pool.end();
}
