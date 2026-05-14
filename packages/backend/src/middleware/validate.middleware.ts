import { Request, Response, NextFunction } from 'express';

export const requireBody = (...fields: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const missing = fields.filter(f => !req.body?.[f]?.toString().trim());
    if (missing.length) {
      return res.status(400).json({ success: false, message: `Eksik veya boş alanlar: ${missing.join(', ')}` });
    }
    next();
  };
