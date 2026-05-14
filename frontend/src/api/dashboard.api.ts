import { api } from './client';
import { ApiResponse } from '@/types/api.types';
import { Station } from '@/types/station.types';
import { Alarm } from '@/types/alarm.types';

export interface DashboardSummary {
  totalStations: number;
  activeAlarms: number;
  criticalAlarms: number;
  offlineStations: number;
}

export interface RegionStation {
  id: string;
  code: string;
  name: string;
  type: string;
  status: 'ACTIVE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  alarmCount: number;
}

export interface RegionSummary {
  name: string;
  stationCount: number;
  healthScore: number;
  totalAlarms: number;
  criticalAlarms: number;
  stations: RegionStation[];
}

export const dashboardApi = {
  getSummary: () =>
    api.get<ApiResponse<DashboardSummary>>('/api/v1/dashboard/summary'),

  getStations: () =>
    api.get<ApiResponse<Station[]>>('/api/v1/dashboard/stations'),

  getRecentAlarms: () =>
    api.get<ApiResponse<Alarm[]>>('/api/v1/dashboard/alarms'),

  getRegions: () =>
    api.get<ApiResponse<RegionSummary[]>>('/api/v1/dashboard/regions'),
};
