import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://telcoguard:telcoguard_password@localhost:5433/telcoguard_db',
  max: 20, // Eşzamanlı bağlantı havuzu (Simülatör trafiği için önemli)
});

export const db = drizzle(pool, { schema });