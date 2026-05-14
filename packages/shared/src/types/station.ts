export type StationStatus = 'ACTIVE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
export type StationType = 'LTE' | 'NR_5G';

export interface Station {
  id: string;
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  region: string;
  type: StationType;
  capacity: number;
  status: StationStatus;
}