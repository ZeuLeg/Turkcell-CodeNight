import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // localhost yerine 127.0.0.1 kullanıyoruz
    url: 'postgres://telcoguard:telcoguard_password@127.0.0.1:5433/telcoguard_db',
  },
  verbose: true,
  strict: true,
});