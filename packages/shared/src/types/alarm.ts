export type AlarmSeverity = 'WARNING' | 'CRITICAL';
export type AlarmStatus = 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED';

export interface Alarm {
  id: string;
  station_id: string;
  metric_name: string;
  severity: AlarmSeverity;
  status: AlarmStatus;
  message: string;
  assigned_to: string | null;
  resolution_note: string | null;
  created_at: string;
  resolved_at: string | null;
}