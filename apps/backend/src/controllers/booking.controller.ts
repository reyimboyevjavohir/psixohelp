import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { ok, fail } from '../utils/response.js';

export async function createBooking(req: Request, res: Response) {
  try {
    const { psychologistId, scheduledAt, mode, notes } = req.body;
    const date = new Date(scheduledAt);

    // Vaqt to'qnashuvi tekshiruvi (1 soat oraliq)
    const windowStart = new Date(date.getTime() - 60 * 60 * 1000);
    const windowEnd = new Date(date.getTime() + 60 * 60 * 1000);
    const conflict = await prisma.booking.findFirst({
      where: {
        psychologistId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        scheduledAt: { gte: windowStart, lte: windowEnd },
      },
    });
    if (conflict) {
      res.status(409).json(fail('Bu vaqtda psixolog band. Boshqa vaqtni tanlang.'));
      return;
    }

    // O'tgan vaqtni tekshirish
    if (date < new Date()) {
      res.status(400).json(fail("O'tib ketgan vaqtga bron qilib bo'lmaydi"));
      return;
    }

    const booking = await prisma.booking.create({
      data: { userId: req.auth!.userId, psychologistId, scheduledAt: date, mode, notes },
      include: { psychologist: true },
    });
    res.status(201).json(ok(booking, 'Bron yaratildi'));
  } catch (e) {
    console.error('[createBooking]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function myBookings(req: Request, res: Response) {
  try {
    const items = await prisma.booking.findMany({
      where: { userId: req.auth!.userId },
      include: { psychologist: true },
      orderBy: { scheduledAt: 'asc' },
    });
    res.json(ok(items));
  } catch (e) {
    console.error('[myBookings]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function cancelBooking(req: Request, res: Response) {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, userId: req.auth!.userId },
    });
    if (!booking) { res.status(404).json(fail('Bron topilmadi')); return; }
    if (booking.status === 'COMPLETED') { res.status(400).json(fail("Yakunlangan bronni bekor qilib bo'lmaydi")); return; }
    const updated = await prisma.booking.update({ where: { id: booking.id }, data: { status: 'CANCELLED' } });
    res.json(ok(updated, 'Bron bekor qilindi'));
  } catch (e) {
    console.error('[cancelBooking]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}
