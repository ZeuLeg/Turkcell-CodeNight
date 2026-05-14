import { db } from '../../config/db';
import { users } from '../schema';
import bcrypt from 'bcryptjs';

export const seedUsers = async () => {
  console.log('[Seed] Kullanıcılar veritabanına yazılıyor...');
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedFieldPassword = await bcrypt.hash('saha123', 10);

  await db.insert(users).values([
    { email: 'noc@telcoguard.com', passwordHash: hashedAdminPassword, role: 'NOC' },
    { email: 'saha@telcoguard.com', passwordHash: hashedFieldPassword, role: 'FIELD_ENGINEER' }
  ]).onConflictDoNothing();
};