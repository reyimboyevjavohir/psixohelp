import 'dotenv/config';
import { app } from './app.js';
import { env } from './config/env.js';
import { disconnectDB } from './config/db.js';

const server = app.listen(env.PORT, () => {
  console.log(`\n🚀 PsixoHelp Backend ishga tushdi`);
  console.log(`   Port    : ${env.PORT}`);
  console.log(`   Muhit   : ${env.NODE_ENV}`);
  console.log(`   Client  : ${env.CLIENT_URL}`);
  console.log(`   Health  : http://localhost:${env.PORT}/api/health\n`);
});

async function shutdown(signal: string) {
  console.log(`\n${signal} signali qabul qilindi. Server to'xtatilmoqda...`);
  server.close(async () => {
    await disconnectDB();
    console.log('✅ Server to\'xtatildi');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});
