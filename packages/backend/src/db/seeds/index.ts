import { seedThresholds } from './thresholds';
import { seedUsers } from './users';
import { seedStations } from './stations';

async function main() {
  try {
    await seedThresholds();
    await seedUsers();
    await seedStations();
    console.log('✅ [Seed] Tüm veriler başarıyla yüklendi.');
  } catch (error) {
    console.error('❌ [Seed] Hata:', error);
  } finally {
    process.exit(0);
  }
}

main();