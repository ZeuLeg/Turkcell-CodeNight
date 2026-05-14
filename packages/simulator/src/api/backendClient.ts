import axios, { AxiosError } from 'axios';
import { env } from '../config/env.js';
import type { GeneratedMetric } from '../core/generator.js';

// Axios instance with default config
// Varsayılan ayarlarla axios örneği
const client = axios.create({
  baseURL: env.BACKEND_URL,
  timeout: 3000,
  headers: {
    'x-internal-api-key': env.INTERNAL_API_KEY,
  },
});

let backendAvailable = true;
let lastWarningAt = 0;

// Send a metric reading to the backend
// Backend'e bir metrik ölçümü gönder
export async function sendMetric(stationId: string, metric: GeneratedMetric): Promise<void> {
  try {
    await client.post(`/api/v1/stations/${stationId}/metrics`, metric);
    if (!backendAvailable) {
      console.log('Backend connection restored');
      backendAvailable = true;
    }
  } catch (error) {
    if (error instanceof AxiosError && (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT')) {
      const now = Date.now();
      if (backendAvailable || now - lastWarningAt > 10000) {
        console.warn(`Backend unreachable at ${env.BACKEND_URL}, will keep retrying silently`);
        lastWarningAt = now;
      }
      backendAvailable = false;
      return;
    }
    throw error;
  }
}