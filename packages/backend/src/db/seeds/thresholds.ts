import { db } from '../../config/db';
import { thresholdConfigs } from '../schema';

export const seedThresholds = async () => {
  console.log('[Seed] Eşik değerleri (Thresholds) veritabanına yazılıyor...');

  await db.insert(thresholdConfigs).values([
    { metricName: 'cpuUsage', warningThreshold: '75', criticalThreshold: '90', direction: 'above', isActive: 1 },
    { metricName: 'memoryUsage', warningThreshold: '80', criticalThreshold: '95', direction: 'above', isActive: 1 },
    { metricName: 'packetLoss', warningThreshold: '5', criticalThreshold: '10', direction: 'above', isActive: 1 },
    { metricName: 'latency', warningThreshold: '50', criticalThreshold: '100', direction: 'above', isActive: 1 },
    // RSSI için değerler düştükçe sinyal kötüleşir, bu yüzden 'below' kullanıyoruz.
    { metricName: 'rssi', warningThreshold: '-80', criticalThreshold: '-90', direction: 'below', isActive: 1 },
    // Bağlı kullanıcı için iki yönlü kontrol var. Yukarı yönlü (Kapasite aşımı):
    { metricName: 'connectedUsers_high', warningThreshold: '800', criticalThreshold: '950', direction: 'above', isActive: 1 },
    // Bağlı kullanıcı için aşağı yönlü (İstasyon çöküşü / Kapsama kaybı):
    { metricName: 'connectedUsers_low', warningThreshold: '10', criticalThreshold: '0', direction: 'below', isActive: 1 },
  ]).onConflictDoNothing(); // Eğer zaten varsa hata verme, atla.

  console.log('[Seed] Eşik değerleri başarıyla eklendi.');
};