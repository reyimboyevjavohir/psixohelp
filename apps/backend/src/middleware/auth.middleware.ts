import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { fail } from '../utils/response.js';

declare global {
  namespace Express {
    interface Request {
      auth?: { userId: string; role: 'USER' | 'ADMIN' | 'SUPERADMIN' };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json(fail('Token topilmadi'));
    return;
  }
  try {
    const token = header.replace('Bearer ', '');
    req.auth = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json(fail("Token noto'g'ri yoki muddati o'tgan"));
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const role = req.auth?.role;
  if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
    res.status(403).json(fail('Faqat admin uchun'));
    return;
  }
  next();
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.auth?.role !== 'SUPERADMIN') {
    res.status(403).json(fail('Faqat superadmin uchun'));
    return;
  }
  next();
}

export function requirePsychologist(req: Request, res: Response, next: NextFunction) {
  const role = req.auth?.role;
  if (role !== 'PSYCHOLOGIST' && role !== 'ADMIN' && role !== 'SUPERADMIN') {
    res.status(403).json(fail('Faqat psixolog uchun'));
    return;
  }
  next();
}
