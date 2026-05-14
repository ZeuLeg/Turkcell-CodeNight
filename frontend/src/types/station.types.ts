export type StationType = 'LTE' | 'NR_5G';
export type StationStatus = 'ACTIVE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

export interface Station {
  id: string;
  code: string;
  name: string;
  latitude: string;
  longitude: string;
  region: string;
  type: StationType;
  capacity: number;
  status: StationStatus;
}

export interface Metric {
  id: number;
  stationId: string;
  timestamp: string;
  cpuUsage: string;
  memoryUsage: string;
  packetLoss: string;
  latency: string;
  rssi: string;
  connectedUsers: number;
}
