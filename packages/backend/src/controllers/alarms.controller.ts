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
      .where(eq(alarms.id, alarmId as string))
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
// PATCH /api/v1/alarms/:id/acknowledge
export const acknowledgeAlarm = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await db.update(alarms).set({ status: 'ACKNOWLEDGED' }).where(eq(alarms.id, req.params.id as string)).returning();
    res.json({ success: true, data: updated[0] });
  } catch(e) { res.status(500).json({ success: false }); }
};

// PATCH /api/v1/alarms/:id/assign
export const assignAlarm = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await db.update(alarms).set({ status: 'IN_PROGRESS', assignedTo: req.body.assigned_to }).where(eq(alarms.id, req.params.id as string)).returning();
    res.json({ success: true, data: updated[0] });
  } catch(e) { res.status(500).json({ success: false }); }
};

// GET /api/v1/alarms (filtreleme dahil)
export const getAllAlarmsFiltered = async (req: AuthRequest, res: Response) => {
  const { severity, status, station } = req.query;
  // Basit implementation (gerçekte Drizzle 'and', 'eq' conditionları dynamic eklenebilir)
  const all = await db.query.alarms.findMany({
    with: { station: true }
  });
  // In-memory filter for speed
  const filtered = all.filter(a => {
    let match = true;
    if(severity && a.severity !== severity) match = false;
    if(status && a.status !== status) match = false;
    if(station && a.stationId !== station) match = false;
    return match;
  });
  res.json({ success: true, data: filtered });
};
