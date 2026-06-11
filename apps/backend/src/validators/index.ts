import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(3, 'Ism kamida 3 ta belgi'),
  username: z.string().min(3, 'Username kamida 3 ta belgi').regex(/^[a-zA-Z0-9_]+$/, 'Username faqat harf, raqam va _ dan iborat bo\'lishi kerak'),
  email: z.string().email('Email noto\'g\'ri'),
  password: z.string().min(6, 'Parol kamida 6 ta belgi'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email noto\'g\'ri'),
  password: z.string().min(1, 'Parol kiriting'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token kerak'),
});

export const createBookingSchema = z.object({
  psychologistId: z.string().min(1),
  scheduledAt: z.string().datetime({ message: 'Vaqt formati noto\'g\'ri (ISO 8601)' }),
  mode: z.enum(['online', 'offline', 'chat']),
  notes: z.string().max(500).optional(),
});

export const upsertPsychologistSchema = z.object({
  fullName: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug faqat kichik harf, raqam va tire'),
  specialty: z.string().min(3),
  bio: z.string().min(10),
  experienceYears: z.number().int().min(1),
  price: z.number().int().min(0),
  avatarUrl: z.string().url().optional(),
  languages: z.array(z.string()).min(1),
  specializations: z.array(z.string()).min(1),
  availability: z.record(z.any()),
  isActive: z.boolean().optional(),
});

export const upsertBookSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  author: z.string().min(3),
  description: z.string().min(10),
  categoryId: z.string().min(1),
  coverUrl: z.string().optional(),
  downloadUrl: z.string().optional(),
  contentBlocks: z.array(z.any()).optional(),
  isActive: z.boolean().optional(),
});

export const upsertResourceSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  type: z.enum(['BOOK', 'ARTICLE', 'VIDEO', 'GUIDE']),
  description: z.string().min(10),
  categoryId: z.string().min(1),
  url: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  contentBlocks: z.array(z.any()).optional(),
  isActive: z.boolean().optional(),
});

export const upsertTestSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  durationMin: z.number().int().min(1),
  questionCount: z.number().int().min(1),
  categoryId: z.string().min(1),
  instructions: z.string().min(5),
  questions: z.array(z.any()).min(1),
  resultBands: z.array(z.any()).min(1),
  isActive: z.boolean().optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum(['USER', 'PSYCHOLOGIST', 'ADMIN', 'SUPERADMIN']),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Parol kamida 6 ta belgi'),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(3).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  profile: z.record(z.any()).optional(),
});
