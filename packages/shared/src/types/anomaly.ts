export type AnomalyType =
  | 'CPU_SPIKE'
  | 'USER_DROP'
  | 'LATENCY_BURST'
  | 'PACKET_STORM'
  | 'STATION_DOWN';

export interface InjectAnomalyRequest {
  station_id: string;
  anomaly_type: AnomalyType;
  duration_seconds: number;
}