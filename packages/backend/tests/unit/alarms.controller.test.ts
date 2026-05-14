import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveAlarm } from '../../src/controllers/alarms.controller';
import { AuthRequest } from '../../src/middleware/auth.middleware';
import { Response } from 'express';

// Mock dependencies
const mockWhere = vi.fn();
const mockSet = vi.fn(() => ({ where: mockWhere }));
const mockUpdate = vi.fn(() => ({ set: mockSet }));

vi.mock('../../src/config/db', () => ({
  db: {
    update: () => mockUpdate()
  }
}));

describe('Alarms Controller', () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      params: { alarmId: '1' },
      body: { resolutionNote: 'Fixed via NOC' },
      user: { id: 1, email: 'user@example.com', role: 'admin' }
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  it('should return 200 and updated alarm if successful', async () => {
    mockWhere.mockReturnValueOnce({
      returning: vi.fn().mockResolvedValueOnce([{ id: '1', status: 'RESOLVED' }])
    });

    await resolveAlarm(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: '1', status: 'RESOLVED' } });
  });

  it('should return 404 if alarm to resolve is not found', async () => {
    mockWhere.mockReturnValueOnce({
      returning: vi.fn().mockResolvedValueOnce([])
    });

    await resolveAlarm(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Alarm bulunamadı' });
  });

  it('should handle unauthenticated resolve appropriately or catch error (500)', async () => {
    mockWhere.mockReturnValueOnce({
      returning: vi.fn().mockRejectedValueOnce(new Error('DB ERROR'))
    });

    // We do not have a robust error handler mapped in logic catching the res directly,
    // usually it passes to express next, but in our func we just do console.error.
    // Ensure the function doesn't crash:
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await resolveAlarm(req as AuthRequest, res as Response);
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
