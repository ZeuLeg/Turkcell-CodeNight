// Temporary hardcoded station list until backend provides them
// Backend istasyon listesini sağlayana kadar geçici sabit liste
import type { Station } from '@telcoguard/shared';

export const stations: Station[] = [
  { id: 's-001', code: 'BSC-001', name: 'Levent-K1', latitude: 41.0789, longitude: 29.0094, region: 'Marmara', type: 'NR_5G', capacity: 1000, status: 'ACTIVE' },
  { id: 's-002', code: 'BSC-002', name: 'Kadikoy-M3', latitude: 40.9907, longitude: 29.0294, region: 'Marmara', type: 'LTE', capacity: 800, status: 'ACTIVE' },
  { id: 's-003', code: 'BSC-003', name: 'Taksim-A2', latitude: 41.0370, longitude: 28.9857, region: 'Marmara', type: 'NR_5G', capacity: 1200, status: 'ACTIVE' },
  { id: 's-004', code: 'BSC-004', name: 'Besiktas-B1', latitude: 41.0422, longitude: 29.0083, region: 'Marmara', type: 'LTE', capacity: 800, status: 'ACTIVE' },
  { id: 's-005', code: 'BSC-005', name: 'Sisli-S2', latitude: 41.0602, longitude: 28.9876, region: 'Marmara', type: 'NR_5G', capacity: 1000, status: 'ACTIVE' },
  { id: 's-006', code: 'BSC-006', name: 'Uskudar-U1', latitude: 41.0226, longitude: 29.0152, region: 'Marmara', type: 'LTE', capacity: 700, status: 'ACTIVE' },
  { id: 's-007', code: 'BSC-007', name: 'Bakirkoy-K2', latitude: 40.9789, longitude: 28.8722, region: 'Marmara', type: 'NR_5G', capacity: 1100, status: 'ACTIVE' },
  { id: 's-008', code: 'BSC-008', name: 'Atasehir-A3', latitude: 40.9923, longitude: 29.1244, region: 'Marmara', type: 'LTE', capacity: 900, status: 'ACTIVE' },
  { id: 's-009', code: 'BSC-009', name: 'Maltepe-M1', latitude: 40.9351, longitude: 29.1551, region: 'Marmara', type: 'NR_5G', capacity: 1000, status: 'ACTIVE' },
  { id: 's-010', code: 'BSC-010', name: 'Pendik-P2', latitude: 40.8754, longitude: 29.2331, region: 'Marmara', type: 'LTE', capacity: 800, status: 'ACTIVE' },
  { id: 's-011', code: 'BSC-011', name: 'Sariyer-S3', latitude: 41.1668, longitude: 29.0571, region: 'Marmara', type: 'NR_5G', capacity: 900, status: 'ACTIVE' },
  { id: 's-012', code: 'BSC-012', name: 'Eyup-E1', latitude: 41.0476, longitude: 28.9337, region: 'Marmara', type: 'LTE', capacity: 700, status: 'ACTIVE' },
  { id: 's-013', code: 'BSC-013', name: 'Fatih-F2', latitude: 41.0186, longitude: 28.9497, region: 'Marmara', type: 'NR_5G', capacity: 1100, status: 'ACTIVE' },
  { id: 's-014', code: 'BSC-014', name: 'Beyoglu-B3', latitude: 41.0369, longitude: 28.9774, region: 'Marmara', type: 'LTE', capacity: 800, status: 'ACTIVE' },
  { id: 's-015', code: 'BSC-015', name: 'Kartal-K3', latitude: 40.9059, longitude: 29.1717, region: 'Marmara', type: 'NR_5G', capacity: 1000, status: 'ACTIVE' },
];