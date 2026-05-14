import { Request, Response } from 'express';

// Simülatör bağımsız bir süreç olduğu için kendi portunda çalışıyor
const SIMULATOR_URL = process.env.SIMULATOR_URL || 'http://localhost:3001';

export const controlSimulator = async (req: Request, res: Response) => {
  try {
    // action: 'start' | 'stop'
    const { action } = req.params;

    const response = await fetch(`${SIMULATOR_URL}/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error(`Simulator ${action} failed`);

    res.status(200).json({ success: true, message: `Simulator ${action} command sent` });
  } catch (error) {
    console.error(`[Simulator Proxy] Control Error:`, error);
    res.status(500).json({ success: false, message: 'Simülatöre ulaşılamadı. Port 3001 aktif mi?' });
  }
};

export const injectAnomaly = async (req: Request, res: Response) => {
  try {
    // req.body örnek: { stationId: 'uuid', anomalyType: 'CPU_SPIKE' }
    const response = await fetch(`${SIMULATOR_URL}/inject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) throw new Error('Anomaly injection failed');

    const data = await response.json();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[Simulator Proxy] Inject Error:', error);
    res.status(500).json({ success: false, message: 'Anomali enjekte edilemedi' });
  }
};