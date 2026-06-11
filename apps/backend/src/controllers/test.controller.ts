import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { ok, fail } from '../utils/response.js';

export async function listTests(_req: Request, res: Response) {
  try {
    const items = await prisma.test.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(ok(items));
  } catch (e) {
    console.error('[listTests]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function getTest(req: Request, res: Response) {
  try {
    const item = await prisma.test.findFirst({
      where: { slug: req.params.slug, isActive: true },
      include: { category: true },
    });
    if (!item) { res.status(404).json(fail('Test topilmadi')); return; }
    res.json(ok(item));
  } catch (e) {
    console.error('[getTest]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function submitTest(req: Request, res: Response) {
  try {
    const test = await prisma.test.findFirst({ where: { slug: req.params.slug, isActive: true } });
    if (!test) { res.status(404).json(fail('Test topilmadi')); return; }

    const answers = req.body.answers as unknown[];
    const questions = test.questions as Array<{ id: number; options: string[] }>;

    // Javoblar validatsiyasi
    if (!Array.isArray(answers) || answers.length !== questions.length) {
      res.status(400).json(fail(`${questions.length} ta javob kerak`));
      return;
    }

    const validatedAnswers: number[] = [];
    for (let i = 0; i < answers.length; i++) {
      const a = Number(answers[i]);
      const maxIdx = questions[i].options.length - 1;
      if (!Number.isInteger(a) || a < 0 || a > maxIdx) {
        res.status(400).json(fail(`${i + 1}-savol javobi noto'g'ri (0-${maxIdx} oralig'ida bo'lishi kerak)`));
        return;
      }
      validatedAnswers.push(a);
    }

    const score = validatedAnswers.reduce((sum, v) => sum + v, 0);
    const bands = test.resultBands as Array<{ min: number; max: number; level: string; summary: string }>;
    const matched = bands.find((b) => score >= b.min && score <= b.max) || bands[bands.length - 1];

    const result = await prisma.testResult.create({
      data: {
        userId: req.auth!.userId,
        testId: test.id,
        score,
        level: matched.level,
        summary: matched.summary,
        details: { answers: validatedAnswers },
      },
    });
    res.status(201).json(ok(result, 'Test natijasi saqlandi'));
  } catch (e) {
    console.error('[submitTest]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}

export async function myResults(req: Request, res: Response) {
  try {
    const items = await prisma.testResult.findMany({
      where: { userId: req.auth!.userId },
      include: { test: { select: { title: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(ok(items));
  } catch (e) {
    console.error('[myResults]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}
