import { Request, Response } from 'express';
import { db } from '../config/db';
import { stations } from '../db/schema';
import { eq } from 'drizzle-orm';

const SIMULATOR_URL = process.env.SIMULATOR_URL || 'http://localhost:3001';
const INTERNAL_KEY  = process.env.INTERNAL_API_KEY ?? 'telcoguard-internal-secret-change-me';

const simFetch = (path: string, init?: RequestInit) =>
  fetch(`${SIMULATOR_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', 'x-internal-api-key': INTERNAL_KEY, ...init?.headers },
  });

export const getSimulatorStatus = async (_req: Request, res: Response) => {
  try {
    const response = await simFetch('/health');
    const data = await response.json() as { running?: boolean };
    res.status(200).json({ success: true, data: { running: data.running ?? false } });
  } catch {
    // Simulator down — report not running instead of 500
    res.status(200).json({ success: true, data: { running: false } });
  }
};

export const controlSimulator = async (req: Request, res: Response) => {
  try {
    const { action } = req.params;
    const response = await simFetch(`/${action}`, { method: 'POST' });
    if (!response.ok) throw new Error(`Simulator ${action} failed`);
    res.status(200).json({ success: true, message: `Simulator ${action} command sent` });
  } catch (error) {
    console.error(`[Simulator Proxy] Control Error:`, error);
    res.status(500).json({ success: false, message: 'Simülatöre ulaşılamadı. Port 3001 aktif mi?' });
  }
};

export const injectAnomaly = async (req: Request, res: Response) => {
  try {
    const body = { ...req.body };

    // Frontend sends DB UUID — simulator needs station code (e.g. 'BSC-001')
    if (body.station_id && !body.station_id.startsWith('BSC-')) {
      const station = await db.query.stations.findFirst({
        where: eq(stations.id, body.station_id),
      });
      if (!station) {
        return res.status(404).json({ success: false, message: 'İstasyon bulunamadı' });
      }
      body.station_id = station.code;
    }

    const response = await simFetch('/inject', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error('Anomaly injection failed');
    const data = await response.json();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[Simulator Proxy] Inject Error:', error);
    res.status(500).json({ success: false, message: 'Anomali enjekte edilemedi' });
  }
};
