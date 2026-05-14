import { describe, it, expect, vi, beforeEach } from 'vitest';
import { controlSimulator, injectAnomaly } from '../../src/controllers/simulator.controller';
import { Request, Response } from 'express';

// fetch'i globale mock olarak atıyoruz
global.fetch = vi.fn();

describe('Simulator Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      params: {},
      body: {}
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  describe('controlSimulator', () => {
    it('should return 200 if simulator command succeeds', async () => {
      req.params = { action: 'start' };
      vi.mocked(global.fetch).mockResolvedValueOnce({ ok: true } as Response);

      await controlSimulator(req as Request, res as Response);

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/start', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Simulator start command sent' });
    });

    it('should return 500 if simulator request fails', async () => {
      req.params = { action: 'stop' };
      vi.mocked(global.fetch).mockResolvedValueOnce({ ok: false } as Response);

      await controlSimulator(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Simülatöre ulaşılamadı. Port 3001 aktif mi?' });
    });

    it('should return 500 on network error', async () => {
      req.params = { action: 'start' };
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

      await controlSimulator(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Simülatöre ulaşılamadı. Port 3001 aktif mi?' });
    });
  });

  describe('injectAnomaly', () => {
    it('should return 200 if anomaly injected successfully', async () => {
      req.body = { stationId: 'test-id', anomalyType: 'CPU_SPIKE' };
      vi.mocked(global.fetch).mockResolvedValueOnce({ 
        ok: true, 
        json: vi.fn().mockResolvedValueOnce({ injected: true }) 
      } as unknown as Response);

      await injectAnomaly(req as Request, res as Response);

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: { injected: true } });
    });

    it('should return 500 if inject response is not ok', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({ ok: false } as Response);

      await injectAnomaly(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Anomali enjekte edilemedi' });
    });

    it('should return 500 on network error', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

      await injectAnomaly(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Anomali enjekte edilemedi' });
    });
  });
});
