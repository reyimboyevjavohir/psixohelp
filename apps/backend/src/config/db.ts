import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Ulanishni tekshirish
prisma.$connect()
  .then(() => console.log('✅ PostgreSQL bazaga ulandi'))
  .catch((e) => {
    console.error('❌ PostgreSQL ulanish xatoligi:', e.message);
    console.error('💡 .env faylida DATABASE_URL ni tekshiring');
    process.exit(1);
  });

export async function disconnectDB() {
  await prisma.$disconnect();
}
