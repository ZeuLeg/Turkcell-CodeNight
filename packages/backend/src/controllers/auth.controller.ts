import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'telcoguard-super-secret-key';

// In-memory OTP store (simülasyon — üretimde Redis kullanılır)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await db.query.users.findFirst({ where: eq(users.email, email) });

    if (!user) return res.status(401).json({ success: false, message: 'Geçersiz kimlik bilgileri' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Geçersiz kimlik bilgileri' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
    res.status(200).json({ success: true, token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('[Auth] Login Error:', error);
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.insert(users).values({ email, passwordHash: hashedPassword, role: role || 'NOC' }).returning();
    const token = jwt.sign({ id: newUser[0].id, role: newUser[0].role }, JWT_SECRET, { expiresIn: '12h' });
    res.status(201).json({ success: true, token, data: newUser[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kayıt başarısız' });
  }
};

// POST /api/v1/auth/request-otp
// Telefon numarasına OTP gönderme simülasyonu
export const requestOtp = async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: 'Telefon numarası gerekli' });

  // Simülasyon: sabit 6 haneli kod üret
  const code = String(Math.floor(100000 + Math.random() * 900000));
  otpStore.set(phone, { code, expiresAt: Date.now() + 5 * 60 * 1000 });

  console.log(`[OTP Sim] ${phone} → ${code}`);

  // Geliştirme ortamında kodu döndür (üretimde sadece "gönderildi" denir)
  res.json({ success: true, message: 'OTP gönderildi (simülasyon)', ...(process.env.NODE_ENV !== 'production' && { otp: code }) });
};

// POST /api/v1/auth/verify-otp
export const verifyOtp = async (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ success: false, message: 'Telefon ve OTP gerekli' });

  const stored = otpStore.get(phone);
  if (!stored || Date.now() > stored.expiresAt) {
    return res.status(401).json({ success: false, message: 'OTP geçersiz veya süresi dolmuş' });
  }
  if (stored.code !== String(otp)) {
    return res.status(401).json({ success: false, message: 'Hatalı OTP kodu' });
  }

  otpStore.delete(phone);

  // Telefona göre kullanıcı bul ya da NOC demo kullanıcısı döndür
  const demoUser = await db.query.users.findFirst({ where: eq(users.email, 'noc@telcoguard.com') });
  if (!demoUser) return res.status(500).json({ success: false, message: 'Demo kullanıcı bulunamadı' });

  const token = jwt.sign({ id: demoUser.id, role: demoUser.role }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ success: true, token, user: { id: demoUser.id, email: demoUser.email, role: demoUser.role } });
};
