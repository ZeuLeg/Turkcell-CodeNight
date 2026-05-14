import { Router } from 'express';
import { db } from '../config/db';
import { users } from '../db/schema';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// GET /api/v1/users — sadece ADMIN görebilir
router.get('/', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  const allUsers = await db
    .select({
      id:   users.id,
      email: users.email,
      role:  users.role,
    })
    .from(users)
    .orderBy(users.role, users.email);

  res.json({ success: true, data: allUsers });
});

export default router;
