import { api } from './client';
import { ApiResponse } from '@/types/api.types';
import { Station, Metric } from '@/types/station.types';

export const stationsApi = {
  getAll: () =>
    api.get<ApiResponse<Station[]>>('/api/v1/stations'),

  getById: (id: string) =>
    api.get<ApiResponse<Station>>(`/api/v1/stations/${id}`),

  getMetrics: (stationId: string) =>
    api.get<ApiResponse<Metric[]>>(`/api/v1/stations/${stationId}/metrics`),

  getLatestMetric: (stationId: string) =>
    api.get<ApiResponse<Metric | null>>(`/api/v1/stations/${stationId}/metrics/latest`),
};
