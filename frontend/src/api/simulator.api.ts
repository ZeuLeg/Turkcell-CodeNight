import { api } from './client';
import { ApiResponse } from '@/types/api.types';

export type AnomalyType = 'CPU_SPIKE' | 'USER_DROP' | 'LATENCY_BURST' | 'PACKET_STORM' | 'STATION_DOWN';

// PDF Bölüm 7.2 — backend bu snake_case formatı bekler
export interface InjectAnomalyPayload {
  station_id: string;
  anomaly_type: AnomalyType;
  duration_seconds: number;
}

export const simulatorApi = {
  start: () => api.post<ApiResponse<null>>('/api/v1/simulator/start', {}),
  stop:  () => api.post<ApiResponse<null>>('/api/v1/simulator/stop', {}),
  injectAnomaly: (payload: InjectAnomalyPayload) =>
    api.post<ApiResponse<unknown>>('/api/v1/simulator/inject-anomaly', payload),
};
