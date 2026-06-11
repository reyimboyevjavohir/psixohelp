'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RoyxatPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) { setError(json.message || 'Xatolik'); setLoading(false); return; }
      router.push('/profil'); router.refresh();
    } catch { setError("Tarmoq xatoligi"); setLoading(false); }
  }

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div key={key}>
      <label className="label">{label}</label>
      <input className="input" type={type} placeholder={placeholder} required={key !== 'phone'}
        value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
    </div>
  );

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1rem' }}>🌱</div>
          <h1 className="heading-serif" style={{ fontSize: '1.75rem', marginBottom: 6 }}>Ro'yxatdan o'ting</h1>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem' }}>Bepul hisob yarating</p>
        </div>
        <div className="card">
          {error && <div className="alert-danger" style={{ marginBottom: '1rem' }}>⚠️ {error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {field('fullName', 'To\'liq ism', 'text', 'Alisher Navoiy')}
            {field('username', 'Username', 'text', 'alisher99')}
            {field('email', 'Email', 'email', 'siz@email.com')}
            {field('phone', 'Telefon (ixtiyoriy)', 'tel', '+998901234567')}
            {field('password', 'Parol', 'password', 'Kamida 8 belgi')}
            <button className="btn" type="submit" disabled={loading} style={{ marginTop: 4, padding: '0.75rem' }}>
              {loading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish →'}
            </button>
          </form>
          <hr className="divider" />
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--c-muted)' }}>
            Hisob bormi? <Link href="/kirish" style={{ color: 'var(--c-primary)', fontWeight: 500 }}>Kirish</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
