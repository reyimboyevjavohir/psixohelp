'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function KirishPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) { setError(json.message || 'Xatolik'); setLoading(false); return; }
      router.push('/profil'); router.refresh();
    } catch { setError("Tarmoq xatoligi"); setLoading(false); }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1rem' }}>🧠</div>
          <h1 className="heading-serif" style={{ fontSize: '1.75rem', marginBottom: 6 }}>Xush kelibsiz</h1>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem' }}>Hisobingizga kiring</p>
        </div>

        <div className="card">
          {error && <div className="alert-danger" style={{ marginBottom: '1rem' }}>⚠️ {error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="siz@email.com" required
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="label">Parol</label>
              <input className="input" type="password" placeholder="••••••••" required
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <button className="btn" type="submit" disabled={loading} style={{ marginTop: 4, padding: '0.75rem' }}>
              {loading ? 'Kirish...' : 'Kirish →'}
            </button>
          </form>
          <hr className="divider" />
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--c-muted)' }}>
            Hisob yo'qmi?{' '}
            <Link href="/royxatdan-otish" style={{ color: 'var(--c-primary)', fontWeight: 500 }}>Ro'yxatdan o'ting</Link>
          </p>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--c-muted)', marginTop: '1rem' }}>
          Yoki{' '}
          <Link href="/ai-tavsiyalar" style={{ color: 'var(--c-primary)' }}>AI bilan ro'yxatsiz gaplashing</Link>
        </p>
      </div>
    </div>
  );
}
