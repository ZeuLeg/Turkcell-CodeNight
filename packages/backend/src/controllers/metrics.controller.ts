import { Request, Response } from 'express';
import { db } from '../config/db';
import { metrics, stations } from '../db/schema';
import { eq } from 'drizzle-orm';
import { checkAnomalies } from '../services/anomaly/detector';

export const insertMetric = async (req: Request, res: Response) => {
  try {
    let stationId = req.params.stationId as string;

    // EĞER stationId bir UUID değil de BSC-011 gibi bir kod ise, asıl ID'yi bul
    if (stationId.startsWith('BSC-')) {
      const station = await db.query.stations.findFirst({
        where: eq(stations.code, stationId),
      });

      if (!station) {
        return res.status(404).json({ success: false, message: 'Station not found' });
      }
      stationId = station.id; // Asıl UUID'ye çeviriyoruz
    }

    const {
      cpu_usage,
      memory_usage,
      packet_loss,
      latency,
      rssi,
      connected_users
    } = req.body;

    const newMetric = await db.insert(metrics).values({
      stationId,
      cpuUsage: String(cpu_usage),
      memoryUsage: String(memory_usage),
      packetLoss: String(packet_loss),
      latency: String(latency),
      rssi: String(rssi),
      connectedUsers: Number(connected_users),
    }).returning();

    if (newMetric[0]) {
      checkAnomalies(newMetric[0]);
    }

    res.status(201).json({ success: true, data: newMetric[0] });
  } catch (error) {
    console.error('Metric insertion error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
export const getStationMetrics = async (req: Request, res: Response) => {
  const stationId = req.params.stationId as string;
  const { from, to } = req.query;
  const metricsData = await db.query.metrics.findMany({
    where: eq(metrics.stationId, stationId),
    orderBy: (metrics, { desc }) => [desc(metrics.timestamp)],
    limit: 100 // Prevent loading huge amounts, but ideally use from/to
  });
  res.json({ success: true, data: metricsData });
};

export const getLatestMetric = async (req: Request, res: Response) => {
  const stationId = req.params.stationId as string;
  const latest = await db.query.metrics.findFirst({
    where: eq(metrics.stationId, stationId),
    orderBy: (metrics, { desc }) => [desc(metrics.timestamp)],
  });
  res.json({ success: true, data: latest });
};
