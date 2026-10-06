import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function sql(text: string, params: (string | number)[] = []) {
  const result = await pool.query(text, params);
  return result.rows;
}
