export type AlarmSeverity = 'WARNING' | 'CRITICAL';
export type AlarmStatus = 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED';

export interface Alarm {
  id: string;
  stationId: string;
  metricName: string;
  severity: AlarmSeverity;
  status: AlarmStatus;
  message: string;
  assignedTo: string | null;
  resolutionNote: string | null;
  createdAt: string;
  resolvedAt: string | null;
  station?: {
    id: string;
    code: string;
    name: string;
    region: string;
  };
}
