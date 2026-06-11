import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';
import { ok, fail } from '../utils/response.js';

// ─── Dashboard ───────────────────────────────────────────────────────────────
export async function dashboard(_req: Request, res: Response) {
  try {
    const [users, psychologists, tests, books, resources, bookings, pendingBookings] = await Promise.all([
      prisma.user.count(),
      prisma.psychologist.count(),
      prisma.test.count(),
      prisma.book.count(),
      prisma.resource.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
    ]);
    res.json(ok({ users, psychologists, tests, books, resources, bookings, pendingBookings }));
  } catch (e) {
    console.error('[dashboard]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

// ─── Foydalanuvchilar (faqat SUPERADMIN) ─────────────────────────────────────
export async function listUsers(_req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, fullName: true, username: true, email: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(ok(users));
  } catch (e) {
    console.error('[listUsers]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function updateUserRole(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const allowedRoles = ['USER', 'ADMIN', 'SUPERADMIN'];
    if (!allowedRoles.includes(role)) { res.status(400).json(fail("Noto'g'ri rol")); return; }

    // Superadmin o'zining rolini o'zgartira olmaydi
    if (id === req.auth!.userId) { res.status(400).json(fail("O'z rolingizni o'zgartirib bo'lmaydi")); return; }

    const user = await prisma.user.update({ where: { id }, data: { role }, select: { id: true, fullName: true, email: true, role: true } });
    res.json(ok(user, 'Rol yangilandi'));
  } catch (e) {
    console.error('[updateUserRole]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function toggleUserActive(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (id === req.auth!.userId) { res.status(400).json(fail("O'z akkauntingizni o'chirib bo'lmaydi")); return; }
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) { res.status(404).json(fail('Foydalanuvchi topilmadi')); return; }
    const updated = await prisma.user.update({ where: { id }, data: { isActive: !user.isActive }, select: { id: true, fullName: true, isActive: true } });
    res.json(ok(updated, `Foydalanuvchi ${updated.isActive ? 'faollashtirildi' : 'bloklandi'}`));
  } catch (e) {
    console.error('[toggleUserActive]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function resetUserPassword(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) { res.status(400).json(fail('Parol kamida 6 ta belgi')); return; }
    const hash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id }, data: { passwordHash: hash } });
    await prisma.refreshToken.deleteMany({ where: { userId: id } });
    res.json(ok(null, 'Parol yangilandi va barcha sessiyalar yakunlandi'));
  } catch (e) {
    console.error('[resetUserPassword]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

// ─── Psixologlar ─────────────────────────────────────────────────────────────
export async function createPsychologist(req: Request, res: Response) {
  try {
    const item = await prisma.psychologist.create({ data: req.body });
    res.status(201).json(ok(item, 'Psixolog qo\'shildi'));
  } catch (e) {
    console.error('[createPsychologist]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function updatePsychologist(req: Request, res: Response) {
  try {
    const item = await prisma.psychologist.update({ where: { id: req.params.id }, data: req.body });
    res.json(ok(item, 'Psixolog yangilandi'));
  } catch (e) {
    console.error('[updatePsychologist]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function deletePsychologist(req: Request, res: Response) {
  try {
    await prisma.psychologist.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json(ok(null, "Psixolog o'chirildi"));
  } catch (e) {
    console.error('[deletePsychologist]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

// ─── Kitoblar ────────────────────────────────────────────────────────────────
export async function createBook(req: Request, res: Response) {
  try {
    const item = await prisma.book.create({ data: req.body });
    res.status(201).json(ok(item, 'Kitob qo\'shildi'));
  } catch (e) {
    console.error('[createBook]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function updateBook(req: Request, res: Response) {
  try {
    const item = await prisma.book.update({ where: { id: req.params.id }, data: req.body });
    res.json(ok(item, 'Kitob yangilandi'));
  } catch (e) {
    console.error('[updateBook]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function deleteBook(req: Request, res: Response) {
  try {
    await prisma.book.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json(ok(null, "Kitob o'chirildi"));
  } catch (e) {
    console.error('[deleteBook]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

// ─── Resurslar ───────────────────────────────────────────────────────────────
export async function createResource(req: Request, res: Response) {
  try {
    const item = await prisma.resource.create({ data: req.body });
    res.status(201).json(ok(item, 'Resurs qo\'shildi'));
  } catch (e) {
    console.error('[createResource]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function updateResource(req: Request, res: Response) {
  try {
    const item = await prisma.resource.update({ where: { id: req.params.id }, data: req.body });
    res.json(ok(item, 'Resurs yangilandi'));
  } catch (e) {
    console.error('[updateResource]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function deleteResource(req: Request, res: Response) {
  try {
    await prisma.resource.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json(ok(null, "Resurs o'chirildi"));
  } catch (e) {
    console.error('[deleteResource]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

// ─── Testlar ─────────────────────────────────────────────────────────────────
export async function createTest(req: Request, res: Response) {
  try {
    const item = await prisma.test.create({ data: req.body });
    res.status(201).json(ok(item, 'Test qo\'shildi'));
  } catch (e) {
    console.error('[createTest]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function updateTest(req: Request, res: Response) {
  try {
    const item = await prisma.test.update({ where: { id: req.params.id }, data: req.body });
    res.json(ok(item, 'Test yangilandi'));
  } catch (e) {
    console.error('[updateTest]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function deleteTest(req: Request, res: Response) {
  try {
    await prisma.test.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json(ok(null, "Test o'chirildi"));
  } catch (e) {
    console.error('[deleteTest]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

// ─── Bronlar ─────────────────────────────────────────────────────────────────
export async function listBookings(_req: Request, res: Response) {
  try {
    const items = await prisma.booking.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        psychologist: { select: { id: true, fullName: true } },
      },
      orderBy: { scheduledAt: 'desc' },
    });
    res.json(ok(items));
  } catch (e) {
    console.error('[listBookings]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function updateBookingStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (!allowed.includes(status)) { res.status(400).json(fail("Noto'g'ri status")); return; }
    const item = await prisma.booking.update({ where: { id }, data: { status } });
    res.json(ok(item, 'Status yangilandi'));
  } catch (e) {
    console.error('[updateBookingStatus]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}
