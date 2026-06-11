import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../config/db.js';
import { signAccessToken } from '../utils/jwt.js';
import { ok, fail } from '../utils/response.js';

const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 kun

async function createRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(48).toString('hex');
  await prisma.refreshToken.create({
    data: { token, userId, expiresAt: new Date(Date.now() + REFRESH_TTL_MS) },
  });
  return token;
}

export async function register(req: Request, res: Response) {
  try {
    const { fullName, username, email, password, phone } = req.body;

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) { res.status(409).json(fail("Bu email allaqachon ro'yxatdan o'tgan")); return; }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) { res.status(409).json(fail('Bu username band')); return; }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { fullName, username, email, phone, passwordHash },
    });

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = await createRefreshToken(user.id);

    res.status(201).json(ok(
      {
        accessToken,
        refreshToken,
        user: { id: user.id, fullName: user.fullName, username: user.username, email: user.email, role: user.role },
      },
      "Ro'yxatdan o'tildi"
    ));
  } catch (e) {
    console.error('[register]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) { res.status(401).json(fail("Login yoki parol noto'g'ri")); return; }
    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) { res.status(401).json(fail("Login yoki parol noto'g'ri")); return; }

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = await createRefreshToken(user.id);

    res.json(ok({
      accessToken,
      refreshToken,
      user: { id: user.id, fullName: user.fullName, username: user.username, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
    }, 'Kirish muvaffaqiyatli'));
  } catch (e) {
    console.error('[login]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) { res.status(400).json(fail('Refresh token kerak')); return; }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await prisma.refreshToken.delete({ where: { id: stored.id } });
      res.status(401).json(fail('Refresh token eskirgan, qayta kiring'));
      return;
    }
    if (!stored.user.isActive) {
      res.status(401).json(fail('Akkaunt bloklangan'));
      return;
    }
    const accessToken = signAccessToken({ userId: stored.user.id, role: stored.user.role });
    res.json(ok({ accessToken }, 'Token yangilandi'));
  } catch (e) {
    console.error('[refresh]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    res.json(ok(null, 'Chiqish muvaffaqiyatli'));
  } catch (e) {
    console.error('[logout]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function me(req: Request, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth!.userId },
      select: {
        id: true, fullName: true, username: true, email: true,
        phone: true, avatarUrl: true, role: true, profile: true,
        createdAt: true, isActive: true,
      },
    });
    if (!user) { res.status(404).json(fail('Foydalanuvchi topilmadi')); return; }
    res.json(ok(user));
  } catch (e) {
    console.error('[me]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}
