import { Response } from 'express';
import { db } from '../config/db';
import { alarms } from '../db/schema';
import { and, eq, gte, lte, desc } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth.middleware';

export const resolveAlarm = async (req: AuthRequest, res: Response) => {
  try {
    const id = (req.params.alarmId ?? req.params.id) as string;
    const { resolutionNote } = req.body;
    const userId = req.user?.id;

    const updated = await db.update(alarms)
      .set({
        status: 'RESOLVED',
        resolutionNote: resolutionNote || 'NOC tarafından çözüldü.',
        resolvedAt: new Date(),
        assignedTo: userId,
      })
      .where(eq(alarms.id, id))
      .returning();

    if (!updated.length) return res.status(404).json({ success: false, message: 'Alarm bulunamadı' });
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error('[Alarms] Resolve Error:', error);
    res.status(500).json({ success: false, message: 'Alarm çözümlenemedi' });
  }
};

export const acknowledgeAlarm = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await db.update(alarms)
      .set({ status: 'ACKNOWLEDGED' })
      .where(eq(alarms.id, req.params.id as string))
      .returning();
    res.json({ success: true, data: updated[0] });
  } catch { res.status(500).json({ success: false }); }
};

export const assignAlarm = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await db.update(alarms)
      .set({ status: 'IN_PROGRESS', assignedTo: req.body.assignedTo })
      .where(eq(alarms.id, req.params.id as string))
      .returning();
    res.json({ success: true, data: updated[0] });
  } catch { res.status(500).json({ success: false }); }
};

// GET /api/v1/alarms — severity, status, station (UUID), startDate, endDate
export const getAllAlarmsFiltered = async (req: AuthRequest, res: Response) => {
  try {
    const { severity, status, station, startDate, endDate } = req.query;

    const conditions = [];
    if (severity) conditions.push(eq(alarms.severity, severity as 'WARNING' | 'CRITICAL'));
    if (status)   conditions.push(eq(alarms.status,   status   as 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED'));
    if (station)  conditions.push(eq(alarms.stationId, station as string));
    if (startDate) conditions.push(gte(alarms.createdAt, new Date(startDate as string)));
    if (endDate) {
      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(alarms.createdAt, end));
    }

    const result = await db.query.alarms.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: { station: true },
      orderBy: [desc(alarms.createdAt)],
      limit: 200,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('[Alarms] Filter Error:', error);
    res.status(500).json({ success: false, message: 'Alarmlar filtrelenemedi' });
  }
};
