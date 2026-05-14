import { Request, Response } from 'express';
import { db } from '../config/db';
import { metrics } from '../db/schema';
import { checkAnomalies } from '../services/anomaly/detector';

export const insertMetric = async (req: Request, res: Response) => {
  try {
    const { stationId } = req.params;
    const {
      cpuUsage,
      memoryUsage,
      packetLoss,
      latency,
      rssi,
      connectedUsers
    } = req.body;

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

    // NOT: Anomali Tespit Motoru tetiklemesi buraya eklenecek!
    // checkAnomalies(newMetric[0]);

    // YENİ EKLENEN KISIM: Veri DB'ye yazıldıktan sonra anomali kontrolü yap (Asenkron, requesti bekletmemek için await kullanmıyoruz)
    checkAnomalies(newMetric[0]);
    res.status(201).json({ success: true, data: newMetric[0] });
  } catch (error) {
    console.error('Metric insertion error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};