import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { ok, fail } from '../utils/response.js';

export async function getMyProfile(req: Request, res: Response) {
  try {
    const userId = req.auth!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) { res.status(404).json(fail('Foydalanuvchi topilmadi')); return; }
    const psychologist = await prisma.psychologist.findFirst({ where: { userId } });
    if (!psychologist) { res.status(404).json(fail('Psixolog profili topilmadi')); return; }
    res.json(ok(psychologist));
  } catch (e) { res.status(500).json(fail('Server xatoligi')); }
}

export async function updateMySchedule(req: Request, res: Response) {
  try {
    const userId = req.auth!.userId;
    const psychologist = await prisma.psychologist.findFirst({ where: { userId } });
    if (!psychologist) { res.status(404).json(fail('Psixolog topilmadi')); return; }
    const { workStart, workEnd, workDays } = req.body;
    const availability = { workStart, workEnd, workDays };
    const updated = await prisma.psychologist.update({ where: { id: psychologist.id }, data: { availability } });
    res.json(ok(updated, 'Jadval yangilandi'));
  } catch (e) { res.status(500).json(fail('Server xatoligi')); }
}

export async function updateMyContact(req: Request, res: Response) {
  try {
    const userId = req.auth!.userId;
    const psychologist = await prisma.psychologist.findFirst({ where: { userId } });
    if (!psychologist) { res.status(404).json(fail('Psixolog topilmadi')); return; }
    const { telegram, phone, email } = req.body;
    const meta = { ...((psychologist.meta as any) ?? {}), telegram, phone, email };
    const updated = await prisma.psychologist.update({ where: { id: psychologist.id }, data: { meta } });
    res.json(ok(updated, "Bog'lanish ma'lumotlari saqlandi"));
  } catch (e) { res.status(500).json(fail('Server xatoligi')); }
}

export async function listMyAdvices(req: Request, res: Response) {
  try {
    const userId = req.auth!.userId;
    const psychologist = await prisma.psychologist.findFirst({ where: { userId } });
    if (!psychologist) { res.status(404).json(fail('Psixolog topilmadi')); return; }
    const advices = await prisma.psychologistAdvice.findMany({ where: { psychologistId: psychologist.id }, orderBy: { createdAt: 'desc' } });
    res.json(ok(advices));
  } catch (e) { res.status(500).json(fail('Server xatoligi')); }
}

export async function createMyAdvice(req: Request, res: Response) {
  try {
    const userId = req.auth!.userId;
    const psychologist = await prisma.psychologist.findFirst({ where: { userId } });
    if (!psychologist) { res.status(404).json(fail('Psixolog topilmadi')); return; }
    const { title, content, category } = req.body;
    if (!title || !content) { res.status(400).json(fail("Sarlavha va matn majburiy")); return; }
    const advice = await prisma.psychologistAdvice.create({ data: { psychologistId: psychologist.id, title, content, category } });
    res.status(201).json(ok(advice, "Tavsiya qo'shildi"));
  } catch (e) { res.status(500).json(fail('Server xatoligi')); }
}

export async function deleteMyAdvice(req: Request, res: Response) {
  try {
    const userId = req.auth!.userId;
    const psychologist = await prisma.psychologist.findFirst({ where: { userId } });
    if (!psychologist) { res.status(404).json(fail('Psixolog topilmadi')); return; }
    const advice = await prisma.psychologistAdvice.findFirst({ where: { id: req.params.id, psychologistId: psychologist.id } });
    if (!advice) { res.status(404).json(fail('Tavsiya topilmadi')); return; }
    await prisma.psychologistAdvice.delete({ where: { id: req.params.id } });
    res.json(ok(null, "O'chirildi"));
  } catch (e) { res.status(500).json(fail('Server xatoligi')); }
}
