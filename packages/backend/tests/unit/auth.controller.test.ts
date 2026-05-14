import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login } from '../../src/controllers/auth.controller';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

// Mock dependencies
vi.mock('bcryptjs');
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(() => 'mock-jwt-token')
  }
}));

const mockFindFirst = vi.fn();

vi.mock('../../src/config/db', () => ({
  db: {
    query: {
      users: {
        findFirst: (...args: any[]) => mockFindFirst(...args)
      }
    }
  }
}));

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      body: {}
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  it('should return 401 if user is not found', async () => {
    req.body = { email: 'wrong@example.com', password: 'password123' };
    mockFindFirst.mockResolvedValueOnce(null);

    await login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Geçersiz kimlik bilgileri' });
  });

  it('should return 401 if password does not match', async () => {
    req.body = { email: 'user@example.com', password: 'wrongpassword' };
    mockFindFirst.mockResolvedValueOnce({ id: 1, email: 'user@example.com', passwordHash: 'hashedpassword' });
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(false as never);

    await login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Geçersiz kimlik bilgileri' });
  });

  it('should return 200 and a token on successful login', async () => {
    req.body = { email: 'user@example.com', password: 'correctpassword' };
    mockFindFirst.mockResolvedValueOnce({ id: 1, email: 'user@example.com', passwordHash: 'hashedpassword', role: 'admin' });
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(true as never);

    await login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      token: 'mock-jwt-token',
      user: { id: 1, email: 'user@example.com', role: 'admin' }
    });
  });

  it('should return 500 on server error', async () => {
    req.body = { email: 'user@example.com', password: 'correctpassword' };
    mockFindFirst.mockRejectedValueOnce(new Error('DB connection failed'));

    await login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Sunucu hatası' });
  });
});