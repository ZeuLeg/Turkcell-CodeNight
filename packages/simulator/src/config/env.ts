import { z } from 'zod';

// Environment schema validation
// Ortam değişkenlerinin şema doğrulaması
const envSchema = z.object({
  SIMULATOR_PORT: z.coerce.number().default(3001),
  BACKEND_URL: z.string().url().default('http://localhost:3000'),
  INTERNAL_API_KEY: z.string().min(1),
  TICK_INTERVAL_MS: z.coerce.number().default(4000),
});

export const env = envSchema.parse(process.env);