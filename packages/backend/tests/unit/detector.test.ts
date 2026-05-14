import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkAnomalies } from '../../src/services/anomaly/detector';

const mockSelect = vi.fn();
const mockFindFirstAlarm = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();

vi.mock('../../src/config/db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: mockSelect
      })
    }),
    query: {
      alarms: {
        findFirst: (...args: any[]) => mockFindFirstAlarm(...args)
      }
    },
    insert: vi.fn(() => ({
      values: mockInsert
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: mockUpdate
      }))
    }))
  }
}));

describe('Anomaly Detector Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do nothing if there are no thresholds', async () => {
    mockSelect.mockResolvedValueOnce([]);
    await checkAnomalies({ stationId: 1, currentCpu: 50 });
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('should insert a WARNING alarm if metric is above warning threshold', async () => {
    mockSelect.mockResolvedValueOnce([
      { metricName: 'currentCpu', warningThreshold: 70, criticalThreshold: 90, direction: 'above', isActive: 1 }
    ]);
    mockFindFirstAlarm.mockResolvedValueOnce(null);

    await checkAnomalies({ stationId: 1, currentCpu: 80 });

    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockInsert.mock.calls[0][0].severity).toBe('WARNING');
  });

  it('should insert a CRITICAL alarm if metric is above critical threshold', async () => {
    mockSelect.mockResolvedValueOnce([
      { metricName: 'connectedUsers_high', warningThreshold: 1000, criticalThreshold: 2000, direction: 'above', isActive: 1 }
    ]);
    mockFindFirstAlarm.mockResolvedValueOnce(null);

    await checkAnomalies({ stationId: 1, connectedUsers: 2500 });

    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockInsert.mock.calls[0][0].severity).toBe('CRITICAL');
  });

  it('should insert a WARNING alarm if metric is below warning threshold (below direction)', async () => {
    mockSelect.mockResolvedValueOnce([
      { metricName: 'connectedUsers_low', warningThreshold: 100, criticalThreshold: 50, direction: 'below', isActive: 1 }
    ]);
    mockFindFirstAlarm.mockResolvedValueOnce(null);

    await checkAnomalies({ stationId: 1, connectedUsers: 80 });

    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockInsert.mock.calls[0][0].severity).toBe('WARNING');
  });

  it('should upgrade to CRITICAL if a WARNING alarm already exists', async () => {
    mockSelect.mockResolvedValueOnce([
      { metricName: 'currentCpu', warningThreshold: 70, criticalThreshold: 90, direction: 'above', isActive: 1 }
    ]);
    // Simulate an existing warning alarm
    mockFindFirstAlarm.mockResolvedValueOnce({ id: 1, severity: 'WARNING' });

    await checkAnomalies({ stationId: 1, currentCpu: 95 });

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('should safely catch and ignore errors', async () => {
    mockSelect.mockRejectedValueOnce(new Error('DB failure'));
    
    // Test should not crash
    await expect(checkAnomalies({ stationId: 1, currentCpu: 50 })).resolves.not.toThrow();
  });
});
