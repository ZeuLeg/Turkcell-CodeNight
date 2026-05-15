export type StationType = 'LTE' | 'NR_5G';
export type StationStatus = 'ACTIVE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

export interface Station {
  id: string;
  code: string;
  name: string;
  // Drizzle decimal() → string olarak döner (mode:'number' verilmedi)
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
  // Drizzle decimal() → string olarak döner
  cpuUsage: string;
  memoryUsage: string;
  packetLoss: string;
  latency: string;
  rssi: string;
  connectedUsers: number;
}

export type ThresholdDirection = 'above' | 'below';

export interface ThresholdConfig {
  id: number;
  metricName: string;
  warningValue: number;
  criticalValue: number;
  direction: ThresholdDirection;
  isActive: boolean;
}
