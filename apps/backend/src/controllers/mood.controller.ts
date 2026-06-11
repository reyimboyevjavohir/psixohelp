import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { ok, fail } from '../utils/response.js';

export async function getMoodEntries(req: Request, res: Response) {
  try {
    const entries = await prisma.moodEntry.findMany({
      where: { userId: req.auth!.userId },
      orderBy: { createdAt: 'desc' },
      take: 60,
    });
    res.json(ok(entries));
  } catch (e) {
    console.error('[getMoodEntries]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function createMoodEntry(req: Request, res: Response) {
  try {
    const { moodScore, energyLevel, anxietyLevel, sleepQuality, notes, emotions } = req.body;
    if (!moodScore || !energyLevel || !anxietyLevel || !sleepQuality) {
      res.status(400).json(fail("Barcha ko'rsatkichlar kerak"));
      return;
    }
    const entry = await prisma.moodEntry.create({
      data: {
        userId: req.auth!.userId,
        moodScore: Number(moodScore),
        energyLevel: Number(energyLevel),
        anxietyLevel: Number(anxietyLevel),
        sleepQuality: Number(sleepQuality),
        notes: notes || null,
        emotions: emotions || [],
      },
    });
    res.status(201).json(ok(entry, 'Kayfiyat saqlandi'));
  } catch (e) {
    console.error('[createMoodEntry]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}
