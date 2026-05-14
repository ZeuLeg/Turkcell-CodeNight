export type MetricName =
  | 'cpu_usage'
  | 'memory_usage'
  | 'packet_loss'
  | 'latency'
  | 'rssi'
  | 'connected_users';

export interface MetricReading {
  cpu_usage: number;
  memory_usage: number;
  packet_loss: number;
  latency: number;
  rssi: number;
  connected_users: number;
}

export interface MetricRecord extends MetricReading {
  id: number;
  station_id: string;
  timestamp: string;
}