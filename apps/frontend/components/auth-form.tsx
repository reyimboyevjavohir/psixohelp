'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.message || 'Xatolik yuz berdi'); setLoading(false); return; }
      router.push('/profil');
      router.refresh();
    } catch {
      setError('Tarmoq xatoligi. Qaytadan urinib ko\'ring.');
      setLoading(false);
    }
  }

  return (
    <div className="card mx-auto max-w-md w-full">
      <h1 className="text-2xl font-bold mb-6">
        {mode === 'login' ? 'Hisobingizga kiring' : "Ro'yxatdan o'ting"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <>
            <div>
              <label className="label">F.I.O *</label>
              <input className="input" name="fullName" placeholder="Ism familiya" required minLength={3} />
            </div>
            <div>
              <label className="label">Username *</label>
              <input className="input" name="username" placeholder="foydalanuvchi_ism" required minLength={3}
                pattern="^[a-zA-Z0-9_]+" title="Faqat harf, raqam va _ belgisi" />
            </div>
          </>
        )}
        <div>
          <label className="label">Email *</label>
          <input className="input" name="email" type="email" placeholder="email@gmail.com" required />
        </div>
        {mode === 'register' && (
          <div>
            <label className="label">Telefon raqam</label>
            <input className="input" name="phone" placeholder="+998 90 000 00 00" />
          </div>
        )}
        <div>
          <label className="label">Parol *</label>
          <input className="input" name="password" type="password" placeholder="Kamida 6 ta belgi" required minLength={6} />
        </div>
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        <button className="btn w-full mt-2" disabled={loading}>
          {loading ? 'Yuklanmoqda...' : mode === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        {mode === 'login' ? (
          <>Akkountingiz yo'qmi? <Link href="/royxatdan-otish" className="text-sky-600 hover:underline">Ro'yxatdan o'ting</Link></>
        ) : (
          <>Allaqachon ro'yxatdansizmi? <Link href="/kirish" className="text-sky-600 hover:underline">Kiring</Link></>
        )}
      </p>
    </div>
  );
}
