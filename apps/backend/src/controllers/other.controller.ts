import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { ok, fail } from '../utils/response.js';

// ─── Kategoriyalar ───────────────────────────────────────────────────────────
export async function listCategories(_req: Request, res: Response) {
  try {
    const items = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json(ok(items));
  } catch (e) {
    console.error('[listCategories]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

// ─── Psixologlar ─────────────────────────────────────────────────────────────
export async function listPsychologists(_req: Request, res: Response) {
  try {
    const items = await prisma.psychologist.findMany({ where: { isActive: true }, orderBy: { rating: 'desc' } });
    res.json(ok(items));
  } catch (e) {
    console.error('[listPsychologists]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function getPsychologist(req: Request, res: Response) {
  try {
    const item = await prisma.psychologist.findFirst({ where: { slug: req.params.slug, isActive: true } });
    if (!item) { res.status(404).json(fail('Psixolog topilmadi')); return; }
    res.json(ok(item));
  } catch (e) {
    console.error('[getPsychologist]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

// ─── Kitoblar ────────────────────────────────────────────────────────────────
export async function listBooks(_req: Request, res: Response) {
  try {
    const items = await prisma.book.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(ok(items));
  } catch (e) {
    console.error('[listBooks]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

// ─── Resurslar ───────────────────────────────────────────────────────────────
export async function listResources(_req: Request, res: Response) {
  try {
    const items = await prisma.resource.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(ok(items));
  } catch (e) {
    console.error('[listResources]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

// ─── Profil ─────────────────────────────────────────────────────────────────
export async function updateProfile(req: Request, res: Response) {
  try {
    const { fullName, phone, avatarUrl, profile } = req.body;
    const user = await prisma.user.update({
      where: { id: req.auth!.userId },
      data: { fullName, phone, avatarUrl, profile },
      select: { id: true, fullName: true, username: true, email: true, phone: true, avatarUrl: true, profile: true, role: true },
    });
    res.json(ok(user, 'Profil yangilandi'));
  } catch (e) {
    console.error('[updateProfile]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}
