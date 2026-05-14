import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStations, getAlarms } from '../../src/controllers/dashboard.controller';
import { Request, Response } from 'express';

// Mock dependencies
const mockSelect = vi.fn();
const mockFindMany = vi.fn();

vi.mock('../../src/config/db', () => ({
  db: {
    select: vi.fn(() => ({
      from: mockSelect
    })),
    query: {
      alarms: {
        findMany: (...args: any[]) => mockFindMany(...args)
      }
    }
  }
}));

describe('Dashboard Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  describe('getStations', () => {
    it('should return 200 and a list of stations', async () => {
      mockSelect.mockResolvedValueOnce([{ id: 1, name: 'Station 1' }]);

      await getStations(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: 1, name: 'Station 1' }] });
    });

    it('should return 500 on db error', async () => {
      mockSelect.mockRejectedValueOnce(new Error('DB connection failed'));

      await getStations(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'İstasyonlar alınamadı' });
    });
  });

  describe('getAlarms', () => {
    it('should return 200 and a list of alarms', async () => {
      mockFindMany.mockResolvedValueOnce([{ id: 1, severity: 'WARNING' }]);

      await getAlarms(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: 1, severity: 'WARNING' }] });
    });

    it('should return 500 on db error', async () => {
      mockFindMany.mockRejectedValueOnce(new Error('DB connection failed'));

      await getAlarms(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Alarmlar alınamadı' });
    });
  });
});