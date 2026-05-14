import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const JWT_SECRET         = process.env.JWT_SECRET          || 'telcoguard-super-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET  || 'telcoguard-refresh-secret-key';

function signTokens(userId: string, role: string) {
  const accessToken  = jwt.sign({ id: userId, role }, JWT_SECRET,         { expiresIn: '12h' });
  const refreshToken = jwt.sign({ id: userId, role }, JWT_REFRESH_SECRET, { expiresIn: '7d'  });
  return { accessToken, refreshToken };
}

// In-memory OTP store (simülasyon — üretimde Redis kullanılır)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await db.query.users.findFirst({ where: eq(users.email, email) });

    if (!user) return res.status(401).json({ success: false, message: 'Geçersiz kimlik bilgileri' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Geçersiz kimlik bilgileri' });

    const { accessToken, refreshToken } = signTokens(user.id, user.role);
    res.status(200).json({
      success: true,
      token: accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role },
    });
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
    const { accessToken, refreshToken } = signTokens(newUser[0].id, newUser[0].role);
    res.status(201).json({ success: true, token: accessToken, refreshToken, data: newUser[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kayıt başarısız' });
  }
};

// POST /api/v1/auth/refresh
export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token gerekli' });

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string; role: string };
    const { accessToken, refreshToken: newRefreshToken } = signTokens(decoded.id, decoded.role);
    res.json({ success: true, token: accessToken, refreshToken: newRefreshToken });
  } catch {
    res.status(401).json({ success: false, message: 'Geçersiz veya süresi dolmuş refresh token' });
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

  const { accessToken, refreshToken } = signTokens(demoUser.id, demoUser.role);
  res.json({ success: true, token: accessToken, refreshToken, user: { id: demoUser.id, email: demoUser.email, role: demoUser.role } });
};
