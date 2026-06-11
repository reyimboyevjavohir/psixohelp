export type Role = 'USER' | 'ADMIN' | 'SUPERADMIN';

export type User = {
  id: string; fullName: string; username: string; email: string;
  phone?: string; avatarUrl?: string; role: Role; isActive: boolean; createdAt: string; profile?: unknown;
};

export type Psychologist = {
  id: string; slug: string; fullName: string; specialty: string; bio: string;
  experienceYears: number; rating: number; reviewsCount: number; price: number;
  avatarUrl?: string; languages: string[]; specializations: string[];
  availability: Record<string, string[]>; approaches?: string[]; isActive: boolean; isVerified: boolean;
};

export type Booking = {
  id: string; userId: string; psychologistId: string; scheduledAt: string;
  mode: string; notes?: string; status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: string; createdAt: string;
  user: { fullName: string; email: string };
  psychologist: { fullName: string; specialty: string };
};

export type Test = {
  id: string; slug: string; title: string; description: string;
  durationMin: number; questionCount: number; isActive: boolean;
  category: { id: string; name: string }; questions: Question[];
  instructions: string; resultBands: ResultBand[];
};

export type Question = {
  id: string; text: string; options: { value: number; label: string }[];
};

export type ResultBand = {
  min: number; max: number; level: string; label: string; description: string; recommendation: string;
};

export type TestResult = {
  id: string; score: number; level: string; summary: string; details: { recommendation?: string };
  createdAt: string; test: { title: string; slug: string };
};

export type Book = {
  id: string; slug: string; title: string; author: string; description: string;
  coverUrl?: string; downloadUrl?: string; isActive: boolean;
  category: { id: string; name: string };
};

export type Resource = {
  id: string; slug: string; title: string; type: 'BOOK' | 'ARTICLE' | 'VIDEO' | 'GUIDE';
  description: string; url?: string; thumbnailUrl?: string; isActive: boolean;
  category: { id: string; name: string };
};

export type MoodEntry = {
  id: string; date: string; moodScore: number; energyLevel: number;
  anxietyLevel: number; sleepQuality: number; notes?: string; emotions?: string[];
};

export type Category = { id: string; name: string; slug: string; description: string; icon?: string };
