import { Request, Response } from 'express';
import { db } from '../config/db';
import { metrics } from '../db/schema';
import { checkAnomalies } from '../services/anomaly/detector';

export const insertMetric = async (req: Request, res: Response) => {
  try {
    // 1. Tip Zorlaması (Type Casting) - Express'in string[] dönme ihtimalini eziyoruz
    const stationId = req.params.stationId as string;

    // 2. Drizzle decimal kolonları için string, integer kolonları için number dönüşümü
    const cpuUsage = String(req.body.cpuUsage);
    const memoryUsage = String(req.body.memoryUsage);
    const packetLoss = String(req.body.packetLoss);
    const latency = String(req.body.latency);
    const rssi = String(req.body.rssi);
    const connectedUsers = Number(req.body.connectedUsers);

    // TODO: Zod veya Joi ile request body validasyonu eklenecek (Vakit kalırsa)

    const newMetric = await db.insert(metrics).values({
      stationId,
      cpuUsage,
      memoryUsage,
      packetLoss,
      latency,
      rssi,
      connectedUsers,
    }).returning();

    // Veri DB'ye yazıldıktan sonra anomali kontrolü yap (Asenkron)
    checkAnomalies(newMetric[0]);

    res.status(201).json({ success: true, data: newMetric[0] });
  } catch (error) {
    console.error('Metric insertion error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};