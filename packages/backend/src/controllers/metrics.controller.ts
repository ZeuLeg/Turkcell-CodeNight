import { Request, Response } from 'express';
import { db } from '../config/db';
import { metrics } from '../db/schema';
import { checkAnomalies } from '../services/anomaly/detector';

export const insertMetric = async (req: Request, res: Response) => {
  try {
    // Tip zorlaması: stationId'nin kesinlikle tekil bir string olduğunu belirtiyoruz
    const stationId = req.params.stationId as string;

    const {
      cpuUsage,
      memoryUsage,
      packetLoss,
      latency,
      rssi,
      connectedUsers
    } = req.body;

    const newMetric = await db.insert(metrics).values({
      stationId,
      cpuUsage: String(cpuUsage), // Decimal kolonlar string bekler
      memoryUsage: String(memoryUsage),
      packetLoss: String(packetLoss),
      latency: String(latency),
      rssi: String(rssi),
      connectedUsers: Number(connectedUsers), // Integer kolon number bekler
    }).returning();

    // Veri yazıldıktan sonra motoru tetikle
    if (newMetric[0]) {
      checkAnomalies(newMetric[0]);
    }

    res.status(201).json({ success: true, data: newMetric[0] });
  } catch (error) {
    console.error('Metric insertion error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};