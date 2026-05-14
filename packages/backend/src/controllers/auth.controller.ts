import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Hackathon için geçici gizli anahtar
const JWT_SECRET = process.env.JWT_SECRET || 'telcoguard-super-secret-key';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Geçersiz kimlik bilgileri' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Geçersiz kimlik bilgileri' });
    }

    // Frontend'in kullanacağı JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.status(200).json({ success: true, token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('[Auth] Login Error:', error);
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
};