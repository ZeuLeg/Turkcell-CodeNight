import { db } from '../../config/db';
import { stations } from '../schema';

export const seedStations = async () => {
  console.log('[Seed] 40 adet gerçekçi istasyon veritabanına yazılıyor...');

  const realStations: (typeof stations.$inferInsert)[] = [
    // MARMARA
    { code: 'BSC-001', name: 'Levent-K1 (Turkcell HQ)', region: 'Marmara', type: 'NR_5G', capacity: 1500, latitude: '41.0772', longitude: '29.0107' },
    { code: 'BSC-002', name: 'Maslak-M3 (Plazalar)', region: 'Marmara', type: 'NR_5G', capacity: 2000, latitude: '41.1105', longitude: '29.0210' },
    { code: 'BSC-003', name: 'Kadikoy-R1 (Boğa Meydanı)', region: 'Marmara', type: 'LTE', capacity: 1200, latitude: '40.9901', longitude: '29.0289' },
    { code: 'BSC-004', name: 'Gebze-T1 (TÜBİTAK)', region: 'Marmara', type: 'LTE', capacity: 800, latitude: '40.7876', longitude: '29.4503' },
    { code: 'BSC-005', name: 'Bursa-N2 (Nilüfer)', region: 'Marmara', type: 'LTE', capacity: 950, latitude: '40.2167', longitude: '28.9333' },

    // İÇ ANADOLU
    { code: 'BSC-006', name: 'Kizilay-A1 (Merkez)', region: 'İç Anadolu', type: 'LTE', capacity: 1800, latitude: '39.9208', longitude: '32.8541' },
    { code: 'BSC-007', name: 'Cankaya-T2 (Atakule)', region: 'İç Anadolu', type: 'NR_5G', capacity: 1300, latitude: '39.8864', longitude: '32.8543' },
    { code: 'BSC-008', name: 'Eskisehir-O1 (Odunpazarı)', region: 'İç Anadolu', type: 'LTE', capacity: 750, latitude: '39.7667', longitude: '30.5256' },
    { code: 'BSC-009', name: 'Konya-S1 (Selçuklu)', region: 'İç Anadolu', type: 'LTE', capacity: 850, latitude: '37.8714', longitude: '32.4847' },
    { code: 'BSC-010', name: 'Kayseri-M1 (Erciyes)', region: 'İç Anadolu', type: 'LTE', capacity: 600, latitude: '38.7205', longitude: '35.4826' },

    // EGE
    { code: 'BSC-011', name: 'Alsancak-I1 (Liman)', region: 'Ege', type: 'NR_5G', capacity: 1400, latitude: '38.4392', longitude: '27.1410' },
    { code: 'BSC-012', name: 'Cesme-M2 (Marina)', region: 'Ege', type: 'LTE', capacity: 1100, latitude: '38.3231', longitude: '26.3056' },
    { code: 'BSC-013', name: 'Bodrum-B1 (Barlar Sokağı)', region: 'Ege', type: 'LTE', capacity: 1500, latitude: '37.0344', longitude: '27.4305' },
    { code: 'BSC-014', name: 'Manisa-S1 (OSB)', region: 'Ege', type: 'LTE', capacity: 900, latitude: '38.6191', longitude: '27.4289' },
    { code: 'BSC-015', name: 'Kusadasi-A2 (Ada)', region: 'Ege', type: 'LTE', capacity: 850, latitude: '37.8597', longitude: '27.2586' }
  ];

  // Listeyi 40'a tamamlayan döngü (Farklı iller ve ilçeler)
  const cities = [
    { n: 'Antalya-L1', r: 'Akdeniz', lat: 36.8841, lon: 30.7056 },
    { n: 'Trabzon-M3', r: 'Karadeniz', lat: 41.0027, lon: 39.7297 },
    { n: 'Erzurum-P1', r: 'Doğu Anadolu', lat: 39.9048, lon: 41.2435 },
    { n: 'Diyarbakir-S2', r: 'Güneydoğu', lat: 37.9144, lon: 40.2306 },
    { n: 'Adana-S1', r: 'Akdeniz', lat: 37.0000, lon: 35.3213 },
    { n: 'Samsun-A1', r: 'Karadeniz', lat: 41.2867, lon: 36.33 }
  ];

  for (let i = 16; i <= 40; i++) {
    const city = cities[i % cities.length];
    realStations.push({
      code: `BSC-${i.toString().padStart(3, '0')}`,
      name: `${city.n}-${i}`,
      region: city.r,
      type: i % 3 === 0 ? 'NR_5G' : 'LTE',
      capacity: 500 + (i * 20),
      latitude: (city.lat + (Math.random() - 0.5) * 0.1).toFixed(4),
      longitude: (city.lon + (Math.random() - 0.5) * 0.1).toFixed(4),
      status: 'ACTIVE'
    });
  }

  await db.insert(stations).values(realStations).onConflictDoNothing();
  console.log('✅ [Seed] 40 istasyon başarıyla eklendi.');
};