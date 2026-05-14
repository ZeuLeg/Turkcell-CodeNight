import { Response } from 'express';
import { db } from '../config/db';
import { alarms } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth.middleware';

export const resolveAlarm = async (req: AuthRequest, res: Response) => {
  try {
    const { alarmId } = req.params;
    const { resolutionNote } = req.body;
    const userId = req.user?.id; // Middleware'den geliyor

    // Alarmı bul ve durumunu RESOLVED yap
    const updatedAlarm = await db.update(alarms)
      .set({
        status: 'RESOLVED',
        resolutionNote: resolutionNote || 'NOC tarafından çözüldü.',
        resolvedAt: new Date(),
        assignedTo: userId // Çözen kişiyi kaydet
      })
      .where(eq(alarms.id, alarmId))
      .returning();

    if (!updatedAlarm.length) {
      return res.status(404).json({ success: false, message: 'Alarm bulunamadı' });
    }

    res.status(200).json({ success: true, data: updatedAlarm[0] });
  } catch (error) {
    console.error('[Alarms] Resolve Error:', error);
    res.status(500).json({ success: false, message: 'Alarm çözümlenemedi' });
  }
};