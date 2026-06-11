import { PrismaClient, ResourceType, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed boshlandi...');

  await prisma.refreshToken.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.testResult.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.book.deleteMany();
  await prisma.test.deleteMany();
  await prisma.psychologist.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ─── Kategoriyalar ───────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Ruhiy holat', slug: 'ruhiy-holat', description: 'Depressiya, tashvish va umumiy ruhiy holat', icon: 'Brain', sortOrder: 1 } }),
    prisma.category.create({ data: { name: 'Stress', slug: 'stress', description: 'Stress darajasi va boshqaruv', icon: 'Sparkles', sortOrder: 2 } }),
    prisma.category.create({ data: { name: 'Shaxsiyat', slug: 'shaxsiyat', description: 'Shaxsiy xususiyatlarni tahlil qilish', icon: 'Users', sortOrder: 3 } }),
    prisma.category.create({ data: { name: "O'z-o'zini anglash", slug: 'ozini-anglash', description: "O'zini hurmat qilish va ichki holat", icon: 'Target', sortOrder: 4 } }),
    prisma.category.create({ data: { name: 'Turmush tarzi', slug: 'turmush-tarzi', description: 'Uyqu, kundalik odatlar va foydali resurslar', icon: 'Moon', sortOrder: 5 } }),
  ]);
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
  console.log('✅ Kategoriyalar yaratildi');

  // ─── SUPERADMIN: Javohir_4556 ─────────────────────────────────────────────
  const superadminHash = await bcrypt.hash('Javohir@4556!', 10);
  const superadmin = await prisma.user.create({
    data: {
      fullName: 'Javohir Reyimboyev',
      username: 'Javohir_4556',
      email: 'reyimboyevjavohir4556@gmail.com',
      passwordHash: superadminHash,
      role: Role.SUPERADMIN,
      isActive: true,
      profile: {
        about: 'Platforma bosh administratori',
        city: 'Toshkent',
        interests: ['psixologiya', 'texnologiya', 'boshqaruv'],
      },
    },
  });
  console.log(`✅ SUPERADMIN yaratildi: ${superadmin.email}`);

  // ─── ADMIN ────────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('Admin@2024!', 10);
  const admin = await prisma.user.create({
    data: {
      fullName: 'Bosh Administrator',
      username: 'admin_psixologik',
      email: 'admin@psixologik.uz',
      passwordHash: adminHash,
      role: Role.ADMIN,
      isActive: true,
      profile: { about: 'Platforma administratori', city: 'Toshkent' },
    },
  });
  console.log(`✅ ADMIN yaratildi: ${admin.email}`);

  // ─── USER ─────────────────────────────────────────────────────────────────
  const userHash = await bcrypt.hash('User@2024!', 10);
  const user = await prisma.user.create({
    data: {
      fullName: 'Aziza Nazarova',
      username: 'aziza_n',
      email: 'user@psixologik.uz',
      passwordHash: userHash,
      role: Role.USER,
      isActive: true,
      profile: { city: 'Toshkent', goals: ['stressni kamaytirish', 'uyquni yaxshilash'] },
    },
  });
  console.log(`✅ USER yaratildi: ${user.email}`);

  // ─── Psixologlar ─────────────────────────────────────────────────────────
  const psychologists = await Promise.all([
    prisma.psychologist.create({
      data: {
        fullName: 'Dr. Nodira Karimova', slug: 'nodira-karimova', specialty: 'Klinik psixolog',
        bio: "Depressiya, tashvish va stress bo'yicha 15 yillik tajribaga ega mutaxassis.",
        experienceYears: 15, rating: 4.9, reviewsCount: 127, price: 150000, isActive: true,
        avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=nodira',
        languages: ["O'zbek", 'Rus', 'Ingliz'],
        specializations: ['Depressiya', 'Tashvish', 'Stress boshqaruvi'],
        availability: { weekdays: 'Dushanba-Juma', hours: '09:00-18:00', modes: ['online', 'offline'] },
      },
    }),
    prisma.psychologist.create({
      data: {
        fullName: 'Aziz Rahimov', slug: 'aziz-rahimov', specialty: 'Oila psixologi',
        bio: "Oilaviy munosabatlar, nikoh va ota-onalik bo'yicha maslahat beradi.",
        experienceYears: 10, rating: 4.8, reviewsCount: 98, price: 120000, isActive: true,
        avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=aziz',
        languages: ["O'zbek", 'Rus'],
        specializations: ['Oilaviy munosabatlar', 'Nikoh maslahati', 'Ota-onalik'],
        availability: { weekdays: 'Har kuni', hours: '10:00-20:00', modes: ['online'] },
      },
    }),
    prisma.psychologist.create({
      data: {
        fullName: 'Malika Yusupova', slug: 'malika-yusupova', specialty: 'Bolalar psixologi',
        bio: "Bolalar, o'smirlar va ota-onalar bilan ishlaydi.",
        experienceYears: 12, rating: 5.0, reviewsCount: 156, price: 130000, isActive: true,
        avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=malika',
        languages: ["O'zbek", 'Rus'],
        specializations: ['Bolalar psixologiyasi', 'Maktab moslashuvi', "O'smirlar"],
        availability: { weekdays: 'Seshanba-Shanba', hours: '08:00-17:00', modes: ['online', 'offline'] },
      },
    }),
  ]);
  console.log(`✅ ${psychologists.length} ta psixolog yaratildi`);

  // ─── Testlar ─────────────────────────────────────────────────────────────
  await prisma.test.createMany({
    data: [
      {
        title: 'Depressiya darajasini aniqlash', slug: 'depressiya', isActive: true,
        description: 'Beck inventori asosida qisqa test.',
        durationMin: 12, questionCount: 5, categoryId: catMap['ruhiy-holat'],
        instructions: 'Har savol uchun eng mos variantni tanlang.',
        questions: [
          { id: 1, text: 'Kayfiyatingiz qanday?', options: ['Yaxshi', "Ba'zan tushkun", "Ko'p tushkun", 'Doim tushkun'] },
          { id: 2, text: 'Kelajakka qarashingiz?', options: ['Ijobiy', 'Bir oz xavotirli', 'Umidsizroq', 'Butunlay umidsiz'] },
          { id: 3, text: 'Uyqu holati?', options: ['Normal', 'Biroz buzilgan', 'Yomon', 'Juda yomon'] },
          { id: 4, text: 'Ish qilish istagi?', options: ['Yaxshi', 'Biroz pasaygan', 'Ancha pasaygan', 'Umuman yo\'q'] },
          { id: 5, text: "O'zingizni baholash?", options: ['Normal', 'Tanqid kuchaygan', 'Aybdorlik kuchli', 'Juda yomon'] },
        ],
        resultBands: [
          { min: 0, max: 4, level: 'Past', summary: 'Jiddiy xavotirli belgi sezilmadi.' },
          { min: 5, max: 9, level: 'Yengil', summary: 'Yengil tushkunlik alomatlari bor.' },
          { min: 10, max: 14, level: "O'rta", summary: 'Mutaxassis bilan maslahat tavsiya etiladi.' },
          { min: 15, max: 20, level: 'Yuqori', summary: 'Tezroq professional yordam oling.' },
        ],
      },
      {
        title: 'Tashvish darajasini aniqlash', slug: 'tashvish', isActive: true,
        description: 'GAD uslubidagi qisqa test.',
        durationMin: 7, questionCount: 4, categoryId: catMap['ruhiy-holat'],
        instructions: "So'nggi ikki hafta bo'yicha javob bering.",
        questions: [
          { id: 1, text: 'Bezovtalik darajasi', options: ["Yo'q", 'Kam', "Ko'p", "Juda ko'p"] },
          { id: 2, text: 'Tinchlana olish', options: ['Oson', "Ba'zan qiyin", 'Qiyin', 'Juda qiyin'] },
          { id: 3, text: 'Xavotirli fikrlar', options: ['Kam', "Ba'zan", 'Tez-tez', 'Doim'] },
          { id: 4, text: 'Yurak urishi / tanadagi taranglik', options: ["Yo'q", 'Kam', "O'rta", 'Kuchli'] },
        ],
        resultBands: [
          { min: 0, max: 3, level: 'Past', summary: 'Tashvish darajasi past.' },
          { min: 4, max: 7, level: 'Yengil', summary: 'Yengil tashvish bor.' },
          { min: 8, max: 11, level: "O'rta", summary: 'Stressni boshqarish ishlari kerak.' },
          { min: 12, max: 16, level: 'Yuqori', summary: 'Mutaxassis bilan gaplashish tavsiya etiladi.' },
        ],
      },
      {
        title: 'Stress darajasini baholash', slug: 'stress-darajasi', isActive: true,
        description: 'Kundalik stress indikatorlari testi.',
        durationMin: 10, questionCount: 4, categoryId: catMap['stress'],
        instructions: 'Oxirgi haftadagi holatni baholang.',
        questions: [
          { id: 1, text: 'Charchash holati', options: ["Yo'q", 'Kam', "O'rta", 'Kuchli'] },
          { id: 2, text: 'Asabiylashish', options: ["Yo'q", 'Kam', "O'rta", 'Kuchli'] },
          { id: 3, text: 'Ish bosimi', options: ['Past', 'Yengil', "O'rta", 'Yuqori'] },
          { id: 4, text: 'Dam olish imkoniyati', options: ['Yetarli', 'Biroz kam', 'Kam', 'Juda kam'] },
        ],
        resultBands: [
          { min: 0, max: 3, level: 'Past', summary: 'Stress nazorat ostida.' },
          { min: 4, max: 7, level: 'Yengil', summary: 'Dam olish rejimini yaxshilang.' },
          { min: 8, max: 11, level: "O'rta", summary: 'Stressni boshqarish strategiyasi kerak.' },
          { min: 12, max: 16, level: 'Yuqori', summary: "Professional yordam foydali bo'lishi mumkin." },
        ],
      },
    ],
  });
  console.log('✅ Testlar yaratildi');

  // ─── Kitoblar ─────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.book.create({
      data: {
        title: "Stressni boshqarish qo'llanmasi", slug: 'stressni-boshqarish', isActive: true,
        author: 'Nodira Karimova', description: "Stressni kamaytirish bo'yicha amaliy usullar.",
        categoryId: catMap['stress'], coverUrl: 'https://picsum.photos/seed/book1/200/280',
        downloadUrl: 'https://example.com/stress-guide.pdf',
        contentBlocks: [{ type: 'paragraph', text: "Nafas mashqlari, kundalik reja va uyqu gigiyenasi bo'yicha maslahatlar." }],
      },
    }),
    prisma.book.create({
      data: {
        title: 'Uyqu gigiyenasi', slug: 'uyqu-gigiyenasi', isActive: true,
        author: 'Malika Yusupova', description: "Uyqu sifatini yaxshilash bo'yicha tavsiyalar.",
        categoryId: catMap['turmush-tarzi'], coverUrl: 'https://picsum.photos/seed/book2/200/280',
        contentBlocks: [{ type: 'list', items: ["Telefonni erta o'chirish", 'Kofeinni kamaytirish', 'Bir xil vaqtda uxlash'] }],
      },
    }),
  ]);
  console.log('✅ Kitoblar yaratildi');

  // ─── Resurslar ────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.resource.create({
      data: {
        title: 'Nafas mashqlari video darsi', slug: 'nafas-mashqlari-video', isActive: true,
        type: ResourceType.VIDEO, description: '5 daqiqalik nafas mashqlari.',
        categoryId: catMap['stress'], url: 'https://www.youtube.com/watch?v=tybOi4hjZFQ',
        thumbnailUrl: 'https://picsum.photos/seed/res1/400/225',
        contentBlocks: [{ type: 'steps', items: ['4 soniya nafas oling', '4 soniya ushlab turing', '6 soniya chiqaring'] }],
      },
    }),
    prisma.resource.create({
      data: {
        title: 'Tushkunlikni erta aniqlash', slug: 'depressiyani-erta-aniqlash', isActive: true,
        type: ResourceType.ARTICLE, description: "Tushkunlik alomatlari haqida ma'lumot.",
        categoryId: catMap['ruhiy-holat'], url: 'https://example.com/depression-signs',
        thumbnailUrl: 'https://picsum.photos/seed/res2/400/225',
        contentBlocks: [{ type: 'paragraph', text: "Uzoq davom etadigan tushkunlik, uyqu buzilishi va qiziqishning pasayishi muhim alomatlar." }],
      },
    }),
  ]);
  console.log('✅ Resurslar yaratildi');

  // ─── Namunali bron ────────────────────────────────────────────────────────
  await prisma.booking.create({
    data: {
      userId: user.id,
      psychologistId: psychologists[0].id,
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      mode: 'online',
      status: 'PENDING',
      notes: "Stress va uyqu bo'yicha maslahat kerak.",
    },
  });
  console.log('✅ Namunali bron yaratildi');

  console.log('\n🎉 Seed muvaffaqiyatli tugadi!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  SUPERADMIN:');
  console.log('    Email    : reyimboyevjavohir4556@gmail.com');
  console.log('    Username : Javohir_4556');
  console.log('    Parol    : Javohir@4556!');
  console.log('  ADMIN:');
  console.log('    Email    : admin@psixologik.uz');
  console.log('    Parol    : Admin@2024!');
  console.log('  USER:');
  console.log('    Email    : user@psixologik.uz');
  console.log('    Parol    : User@2024!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => { console.error('❌ Seed xatoligi:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
