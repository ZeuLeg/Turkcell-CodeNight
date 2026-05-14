// Temporary hardcoded station list until backend provides them
// Backend istasyon listesini sağlayana kadar geçici sabit liste
import type { Station } from '@telcoguard/shared';

export const stations: Station[] = [
  // MARMARA
  { id: 's-001', code: 'BSC-001', name: 'Levent-K1',      latitude: 41.0772, longitude: 29.0107, region: 'Marmara',      type: 'NR_5G', capacity: 1500, status: 'ACTIVE' },
  { id: 's-002', code: 'BSC-002', name: 'Maslak-M3',      latitude: 41.1105, longitude: 29.0210, region: 'Marmara',      type: 'NR_5G', capacity: 2000, status: 'ACTIVE' },
  { id: 's-003', code: 'BSC-003', name: 'Kadikoy-R1',     latitude: 40.9901, longitude: 29.0289, region: 'Marmara',      type: 'LTE',   capacity: 1200, status: 'ACTIVE' },
  { id: 's-004', code: 'BSC-004', name: 'Gebze-T1',       latitude: 40.7876, longitude: 29.4503, region: 'Marmara',      type: 'LTE',   capacity:  800, status: 'ACTIVE' },
  { id: 's-005', code: 'BSC-005', name: 'Bursa-N2',       latitude: 40.2167, longitude: 28.9333, region: 'Marmara',      type: 'LTE',   capacity:  950, status: 'ACTIVE' },

  // İÇ ANADOLU
  { id: 's-006', code: 'BSC-006', name: 'Kizilay-A1',     latitude: 39.9208, longitude: 32.8541, region: 'İç Anadolu',  type: 'LTE',   capacity: 1800, status: 'ACTIVE' },
  { id: 's-007', code: 'BSC-007', name: 'Cankaya-T2',     latitude: 39.8864, longitude: 32.8543, region: 'İç Anadolu',  type: 'NR_5G', capacity: 1300, status: 'ACTIVE' },
  { id: 's-008', code: 'BSC-008', name: 'Eskisehir-O1',   latitude: 39.7667, longitude: 30.5256, region: 'İç Anadolu',  type: 'LTE',   capacity:  750, status: 'ACTIVE' },
  { id: 's-009', code: 'BSC-009', name: 'Konya-S1',       latitude: 37.8714, longitude: 32.4847, region: 'İç Anadolu',  type: 'LTE',   capacity:  850, status: 'ACTIVE' },
  { id: 's-010', code: 'BSC-010', name: 'Kayseri-M1',     latitude: 38.7205, longitude: 35.4826, region: 'İç Anadolu',  type: 'LTE',   capacity:  600, status: 'ACTIVE' },

  // EGE
  { id: 's-011', code: 'BSC-011', name: 'Alsancak-I1',    latitude: 38.4392, longitude: 27.1410, region: 'Ege',          type: 'NR_5G', capacity: 1400, status: 'ACTIVE' },
  { id: 's-012', code: 'BSC-012', name: 'Cesme-M2',       latitude: 38.3231, longitude: 26.3056, region: 'Ege',          type: 'LTE',   capacity: 1100, status: 'ACTIVE' },
  { id: 's-013', code: 'BSC-013', name: 'Bodrum-B1',      latitude: 37.0344, longitude: 27.4305, region: 'Ege',          type: 'LTE',   capacity: 1500, status: 'ACTIVE' },
  { id: 's-014', code: 'BSC-014', name: 'Manisa-S1',      latitude: 38.6191, longitude: 27.4289, region: 'Ege',          type: 'LTE',   capacity:  900, status: 'ACTIVE' },
  { id: 's-015', code: 'BSC-015', name: 'Kusadasi-A2',    latitude: 37.8597, longitude: 27.2586, region: 'Ege',          type: 'LTE',   capacity:  850, status: 'ACTIVE' },

  // AKDENİZ
  { id: 's-016', code: 'BSC-016', name: 'Antalya-L1',     latitude: 36.8969, longitude: 30.7133, region: 'Akdeniz',      type: 'NR_5G', capacity: 1600, status: 'ACTIVE' },
  { id: 's-017', code: 'BSC-017', name: 'Mersin-Y1',      latitude: 36.8000, longitude: 34.6333, region: 'Akdeniz',      type: 'LTE',   capacity: 1100, status: 'ACTIVE' },
  { id: 's-018', code: 'BSC-018', name: 'Adana-S2',       latitude: 37.0000, longitude: 35.3213, region: 'Akdeniz',      type: 'NR_5G', capacity: 1400, status: 'ACTIVE' },
  { id: 's-019', code: 'BSC-019', name: 'Alanya-T1',      latitude: 36.5442, longitude: 31.9994, region: 'Akdeniz',      type: 'LTE',   capacity:  900, status: 'ACTIVE' },
  { id: 's-020', code: 'BSC-020', name: 'Hatay-A1',       latitude: 36.4018, longitude: 36.3498, region: 'Akdeniz',      type: 'LTE',   capacity:  700, status: 'ACTIVE' },

  // KARADENİZ
  { id: 's-021', code: 'BSC-021', name: 'Trabzon-K1',     latitude: 41.0015, longitude: 39.7178, region: 'Karadeniz',    type: 'NR_5G', capacity: 1200, status: 'ACTIVE' },
  { id: 's-022', code: 'BSC-022', name: 'Samsun-A2',      latitude: 41.2867, longitude: 36.3300, region: 'Karadeniz',    type: 'LTE',   capacity: 1000, status: 'ACTIVE' },
  { id: 's-023', code: 'BSC-023', name: 'Rize-C1',        latitude: 41.0201, longitude: 40.5234, region: 'Karadeniz',    type: 'LTE',   capacity:  600, status: 'ACTIVE' },
  { id: 's-024', code: 'BSC-024', name: 'Ordu-U1',        latitude: 40.9862, longitude: 37.8797, region: 'Karadeniz',    type: 'LTE',   capacity:  700, status: 'ACTIVE' },
  { id: 's-025', code: 'BSC-025', name: 'Zonguldak-E1',   latitude: 41.4564, longitude: 31.7987, region: 'Karadeniz',    type: 'LTE',   capacity:  650, status: 'ACTIVE' },

  // GÜNEYDOĞU ANADOLU
  { id: 's-026', code: 'BSC-026', name: 'Gaziantep-S1',   latitude: 37.0662, longitude: 37.3833, region: 'Güneydoğu',   type: 'NR_5G', capacity: 1500, status: 'ACTIVE' },
  { id: 's-027', code: 'BSC-027', name: 'Diyarbakir-B1',  latitude: 37.9144, longitude: 40.2306, region: 'Güneydoğu',   type: 'LTE',   capacity: 1100, status: 'ACTIVE' },
  { id: 's-028', code: 'BSC-028', name: 'Sanliurfa-H1',   latitude: 37.1591, longitude: 38.7969, region: 'Güneydoğu',   type: 'LTE',   capacity:  900, status: 'ACTIVE' },
  { id: 's-029', code: 'BSC-029', name: 'Mardin-K1',      latitude: 37.3212, longitude: 40.7245, region: 'Güneydoğu',   type: 'LTE',   capacity:  600, status: 'ACTIVE' },
  { id: 's-030', code: 'BSC-030', name: 'Adiyaman-T1',    latitude: 37.7648, longitude: 38.2786, region: 'Güneydoğu',   type: 'LTE',   capacity:  500, status: 'ACTIVE' },

  // DOĞU ANADOLU
  { id: 's-031', code: 'BSC-031', name: 'Erzurum-O1',     latitude: 39.9055, longitude: 41.2658, region: 'Doğu Anadolu', type: 'LTE',   capacity:  800, status: 'ACTIVE' },
  { id: 's-032', code: 'BSC-032', name: 'Van-E1',         latitude: 38.4891, longitude: 43.4089, region: 'Doğu Anadolu', type: 'LTE',   capacity:  700, status: 'ACTIVE' },
  { id: 's-033', code: 'BSC-033', name: 'Malatya-B1',     latitude: 38.3552, longitude: 38.3095, region: 'Doğu Anadolu', type: 'NR_5G', capacity: 1000, status: 'ACTIVE' },
  { id: 's-034', code: 'BSC-034', name: 'Elazig-H1',      latitude: 38.6810, longitude: 39.2264, region: 'Doğu Anadolu', type: 'LTE',   capacity:  750, status: 'ACTIVE' },
  { id: 's-035', code: 'BSC-035', name: 'Kars-C1',        latitude: 40.6013, longitude: 43.0975, region: 'Doğu Anadolu', type: 'LTE',   capacity:  400, status: 'ACTIVE' },

  // İÇ ANADOLU EK
  { id: 's-036', code: 'BSC-036', name: 'Sivas-K1',       latitude: 39.7477, longitude: 37.0179, region: 'İç Anadolu',  type: 'LTE',   capacity:  700, status: 'ACTIVE' },
  { id: 's-037', code: 'BSC-037', name: 'Nigde-B1',       latitude: 37.9667, longitude: 34.6833, region: 'İç Anadolu',  type: 'LTE',   capacity:  500, status: 'ACTIVE' },

  // EGE EK
  { id: 's-038', code: 'BSC-038', name: 'Denizli-P1',     latitude: 37.7765, longitude: 29.0864, region: 'Ege',          type: 'LTE',   capacity:  850, status: 'ACTIVE' },
  { id: 's-039', code: 'BSC-039', name: 'Aydin-E1',       latitude: 37.8444, longitude: 27.8458, region: 'Ege',          type: 'LTE',   capacity:  750, status: 'ACTIVE' },

  // MARMARA EK
  { id: 's-040', code: 'BSC-040', name: 'Tekirdag-M1',    latitude: 40.9833, longitude: 27.5167, region: 'Marmara',      type: 'NR_5G', capacity:  900, status: 'ACTIVE' },
];
