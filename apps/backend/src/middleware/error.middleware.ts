import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/response.js';

export function notFoundMiddleware(_req: Request, res: Response) {
  res.status(404).json(fail("Route topilmadi"));
}

export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error('[Server xatoligi]:', error);
  const message = error instanceof Error ? error.message : 'Noma\'lum xatolik';
  res.status(500).json(fail(message));
}
