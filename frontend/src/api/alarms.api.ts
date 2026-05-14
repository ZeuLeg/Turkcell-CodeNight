import { api } from './client';
import { ApiResponse } from '@/types/api.types';
import { Alarm } from '@/types/alarm.types';

interface AlarmFilters {
  severity?: string;
  status?: string;
  station?: string;
}

export const alarmsApi = {
  getAll: (filters?: AlarmFilters) => {
    const params = new URLSearchParams();
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.station) params.append('station', filters.station);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return api.get<ApiResponse<Alarm[]>>(`/api/v1/alarms${qs}`);
  },

  acknowledge: (id: string) =>
    api.patch<ApiResponse<Alarm>>(`/api/v1/alarms/${id}/acknowledge`),

  assign: (id: string, assignedTo: string) =>
    api.patch<ApiResponse<Alarm>>(`/api/v1/alarms/${id}/assign`, { assigned_to: assignedTo }),

  resolve: (id: string, resolutionNote: string) =>
    api.patch<ApiResponse<Alarm>>(`/api/v1/alarms/${id}/resolve`, { resolutionNote }),
};
