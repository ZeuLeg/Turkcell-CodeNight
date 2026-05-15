import { api } from './client';
import { ApiResponse } from '@/types/api.types';
import { Station, Metric } from '@/types/station.types';

export interface MetricPayload {
  cpuUsage: number;
  memoryUsage: number;
  packetLoss: number;
  latency: number;
  rssi: number;
  connectedUsers: number;
}

export const stationsApi = {
  getAll: () =>
    api.get<ApiResponse<Station[]>>('/api/v1/stations'),

  getById: (id: string) =>
    api.get<ApiResponse<Station>>(`/api/v1/stations/${id}`),

  getMetrics: (stationId: string, from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return api.get<ApiResponse<Metric[]>>(`/api/v1/stations/${stationId}/metrics${qs}`);
  },

  getLatestMetric: (stationId: string) =>
    api.get<ApiResponse<Metric | null>>(`/api/v1/stations/${stationId}/metrics/latest`),

  postMetric: (stationId: string, payload: MetricPayload) =>
    api.post<ApiResponse<Metric>>(`/api/v1/stations/${stationId}/metrics`, payload),
};
