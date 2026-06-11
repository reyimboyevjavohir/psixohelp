import dotenv from 'dotenv';
dotenv.config();

function required(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Muhit o'zgaruvchisi topilmadi: ${key}`);
  return v;
}

export const env = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  DATABASE_URL: required('DATABASE_URL'),
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
};
