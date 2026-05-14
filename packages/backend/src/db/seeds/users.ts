import { db } from '../../config/db';
import { users } from '../schema';
import bcrypt from 'bcryptjs';

export const seedUsers = async () => {
  console.log('[Seed] Kullanıcılar veritabanına yazılıyor...');

  const adminHash   = await bcrypt.hash('admin123',   10);
  const nocHash     = await bcrypt.hash('noc123',     10);
  const sahaHash    = await bcrypt.hash('saha123',    10);
  const managerHash = await bcrypt.hash('manager123', 10);

  await db.insert(users).values([
    // ── ADMIN (2 kullanıcı) ──────────────────────────────────────────
    { email: 'admin@telcoguard.com',    passwordHash: adminHash,   role: 'ADMIN' },
    { email: 'admin2@telcoguard.com',   passwordHash: adminHash,   role: 'ADMIN' },

    // ── Şebeke Yöneticisi (2 kullanıcı) ────────────────────────────
    { email: 'manager@telcoguard.com',  passwordHash: managerHash, role: 'MANAGER' },
    { email: 'manager2@telcoguard.com', passwordHash: managerHash, role: 'MANAGER' },

    // ── NOC Operatörü (2 kullanıcı) ────────────────────────────────
    { email: 'noc@telcoguard.com',      passwordHash: adminHash,   role: 'NOC' },
    { email: 'noc2@telcoguard.com',     passwordHash: nocHash,     role: 'NOC' },

    // ── Saha Mühendisi (2 kullanıcı) ───────────────────────────────
    { email: 'saha@telcoguard.com',     passwordHash: sahaHash,    role: 'FIELD_ENGINEER' },
    { email: 'saha2@telcoguard.com',    passwordHash: sahaHash,    role: 'FIELD_ENGINEER' },
  ]).onConflictDoNothing();

  console.log('[Seed] ✓ 8 kullanıcı eklendi (2×ADMIN, 2×MANAGER, 2×NOC, 2×FIELD_ENGINEER)');
};
