import { seedThresholds } from './thresholds';
import { seedUsers } from './users';
import { seedStations } from './stations';
import { seedAlarms } from './alarms';
import { seedMetrics } from './metrics';

async function main() {
  try {
    await seedThresholds();
    await seedUsers();
    await seedStations();
    await seedAlarms();
    await seedMetrics();
    console.log('✅ [Seed] Tüm veriler başarıyla yüklendi.');
  } catch (error) {
    console.error('❌ [Seed] Hata:', error);
  } finally {
    process.exit(0);
  }
}

main();