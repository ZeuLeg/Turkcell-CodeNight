import { Request, Response } from 'express';
import { db } from '../config/db';
import { stations, alarms } from '../db/schema';
import { desc } from 'drizzle-orm';

// Ayşenur'un Haritaya (Leaflet) çizeceği istasyon verileri
export const getStations = async (req: Request, res: Response) => {
  try {
    const allStations = await db.select().from(stations);
    res.status(200).json({ success: true, data: allStations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'İstasyonlar alınamadı' });
  }
};

// Frontend'de sağ panelde akacak aktif alarmlar
export const getAlarms = async (req: Request, res: Response) => {
  try {
    const activeAlarms = await db.query.alarms.findMany({
      orderBy: [desc(alarms.createdAt)],
      limit: 50, // UI şişmesin diye limitliyoruz
      with: {
        station: true // Drizzle ilişkisi: İstasyon detaylarını da joinle
      }
    });
    res.status(200).json({ success: true, data: activeAlarms });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Alarmlar alınamadı' });
  }
};