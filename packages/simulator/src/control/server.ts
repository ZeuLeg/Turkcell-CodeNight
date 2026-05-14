import express, { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import { startLoop, stopLoop, isRunning } from '../core/loop.js';
import { injectAnomaly, clearAnomaly } from '../core/state.js';

const app = express();
app.use(express.json());

// Internal API key middleware for all endpoints
// Tüm endpointler için internal API key kontrolü
app.use((req: Request, res: Response, next: NextFunction) => {
  const key = req.header('x-internal-api-key');
  if (key !== env.INTERNAL_API_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
});

app.post('/start', (req, res) => {
  startLoop();
  res.json({ running: isRunning() });
});

app.post('/stop', (req, res) => {
  stopLoop();
  res.json({ running: isRunning() });
});

const injectSchema = z.object({
  station_id: z.string(),
  anomaly_type: z.enum(['CPU_SPIKE', 'USER_DROP', 'STATION_DOWN', 'LATENCY_BURST', 'PACKET_STORM']),
  duration_seconds: z.number().int().positive().max(600),
});

app.post('/inject', (req, res) => {
  const parsed = injectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid_body', details: parsed.error.flatten() });
  }
  const { station_id, anomaly_type, duration_seconds } = parsed.data;
  injectAnomaly(station_id, anomaly_type, duration_seconds);
  res.json({ injected: true, station_id, anomaly_type, expires_in_seconds: duration_seconds });
});

app.post('/clear/:stationId', (req, res) => {
  clearAnomaly(req.params.stationId);
  res.json({ cleared: true });
});

app.get('/health', (req, res) => {
  res.json({ ok: true, running: isRunning() });
});

export function startControlServer(): void {
  app.listen(env.SIMULATOR_PORT, () => {
    console.log(`Simulator control server listening on port ${env.SIMULATOR_PORT}`);
  });
}