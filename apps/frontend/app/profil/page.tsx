import { getTokenFromCookies } from '@/lib/server-api';

import { apiGet, getTokenFromCookies } from '@/lib/api';
import { redirect } from 'next/navigation';
import { CancelBookingButton } from './cancel-button';

type User = { id: string; fullName: string; username: string; email: string; phone?: string; role: string; avatarUrl?: string; createdAt: string };
type Booking = { id: string; scheduledAt: string; mode: string; status: string; notes?: string; psychologist: { fullName: string; specialty: string } };
type TestResult = { id: string; score: number; level: string; summary: string; createdAt: string; test: { title: string } };
type MoodEntry = { id: string; date: string; moodScore: number; energyLevel: number; anxietyLevel: number; sleepQuality: number };

const STATUS_MAP: Record<string, { label: string; badge: string }> = {
  PENDING: { label: 'Kutilmoqda', badge: 'badge-yellow' },
  CONFIRMED: { label: 'Tasdiqlandi', badge: 'badge-blue' },
  COMPLETED: { label: 'Yakunlandi', badge: 'badge-green' },
  CANCELLED: { label: 'Bekor', badge: 'badge-red' },
};

const LEVEL_BADGE: Record<string, string> = { normal: 'badge-green', mild: 'badge-yellow', moderate: 'badge-orange', severe: 'badge-red' };

export default async function ProfilPage() {
  const token = await getTokenFromCookies();
  if (!token) redirect('/kirish');

  let user: User, bookings: Booking[], results: TestResult[], moods: MoodEntry[];
  try {
    [user, bookings, results, moods] = await Promise.all([
      apiGet<User>('/auth/me', token),
      apiGet<Booking[]>('/bookings/my', token),
      apiGet<TestResult[]>('/tests/my/results', token),
      apiGet<MoodEntry[]>('/mood', token).catch(() => [] as MoodEntry[]),
    ]);
  } catch { redirect('/kirish'); }

  const roleLabel: Record<string, string> = { USER: 'Foydalanuvchi', ADMIN: 'Administrator', SUPERADMIN: 'Bosh Admin' };
  const roleBadge: Record<string, string> = { USER: 'badge-blue', ADMIN: 'badge-yellow', SUPERADMIN: 'badge-purple' };
  const avgMood = moods.length ? (moods.slice(0, 7).reduce((s, m) => s + m.moodScore, 0) / Math.min(moods.length, 7)).toFixed(1) : null;

  return (
    <div className="wrap" style={{ paddingTop: '2rem', paddingBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Profile card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-lg)', background: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#fff', fontFamily: "'DM Serif Display', serif", flexShrink: 0 }}>
              {user.fullName.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user.fullName}</h1>
              <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem' }}>@{user.username} · {user.email}</p>
              {user.phone && <p style={{ color: 'var(--c-muted)', fontSize: '0.8125rem' }}>{user.phone}</p>}
            </div>
          </div>
          <span className={`badge ${roleBadge[user.role] || 'badge-blue'}`}>{roleLabel[user.role] || user.role}</span>
        </div>

        {/* Quick stats */}
        {(bookings.length > 0 || results.length > 0 || avgMood) && (
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--c-border)', flexWrap: 'wrap' }}>
            {bookings.length > 0 && <div style={{ textAlign: 'center' }}><p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: 'var(--c-primary)' }}>{bookings.length}</p><p style={{ fontSize: '0.75rem', color: 'var(--c-muted)' }}>Bron</p></div>}
            {results.length > 0 && <div style={{ textAlign: 'center' }}><p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: 'var(--c-primary)' }}>{results.length}</p><p style={{ fontSize: '0.75rem', color: 'var(--c-muted)' }}>Test</p></div>}
            {avgMood && <div style={{ textAlign: 'center' }}><p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: 'var(--c-primary)' }}>{avgMood}/10</p><p style={{ fontSize: '0.75rem', color: 'var(--c-muted)' }}>Kayfiyat (7 kun)</p></div>}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
        {[
          { href: '/ai-tavsiyalar', icon: '🤖', label: 'AI Tavsiya' },
          { href: '/kayfiyat', icon: '📊', label: 'Kayfiyat' },
          { href: '/maslahatlar', icon: '👨‍⚕️', label: 'Psixolog' },
          { href: '/testlar', icon: '🧪', label: 'Test topshirish' },
        ].map(({ href, icon, label }) => (
          <a key={href} href={href} className="card-sm" style={{ textDecoration: 'none', textAlign: 'center', display: 'block', transition: 'all .15s' }}
            onMouseEnter={undefined}>
            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{icon}</div>
            <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--c-text)' }}>{label}</p>
          </a>
        ))}
      </div>

      {/* Bookings */}
      <div className="card">
        <h2 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          📅 Bronlarim <span className="badge badge-gray">{bookings.length}</span>
        </h2>
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--c-muted)' }}>
            <p style={{ marginBottom: '0.75rem' }}>Hali bron yo'q</p>
            <a href="/maslahatlar" className="btn-sm" style={{ textDecoration: 'none' }}>Psixolog tanlash →</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {bookings.map(b => {
              const st = STATUS_MAP[b.status] || { label: b.status, badge: 'badge-gray' };
              return (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--c-border)', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.psychologist.fullName}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--c-muted)' }}>{new Date(b.scheduledAt).toLocaleString('uz-UZ')} · {b.mode}</p>
                    {b.notes && <p style={{ fontSize: '0.78rem', color: 'var(--c-muted)', marginTop: 2, fontStyle: 'italic' }}>"{b.notes}"</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span className={`badge ${st.badge}`}>{st.label}</span>
                    {(b.status === 'PENDING' || b.status === 'CONFIRMED') && <CancelBookingButton bookingId={b.id} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Test results */}
      <div className="card">
        <h2 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          🧪 Test natijalari <span className="badge badge-gray">{results.length}</span>
        </h2>
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--c-muted)' }}>
            <p style={{ marginBottom: '0.75rem' }}>Hali test topshirilmagan</p>
            <a href="/testlar" className="btn-sm" style={{ textDecoration: 'none' }}>Testlarni ko'rish →</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {results.map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--c-border)' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.test.title}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--c-muted)', marginTop: 2 }}>{new Date(r.createdAt).toLocaleDateString('uz-UZ')}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${LEVEL_BADGE[r.level] || 'badge-gray'}`}>{r.level}</span>
                  <p style={{ fontSize: '0.78rem', color: 'var(--c-muted)', marginTop: 3 }}>{r.score} ball</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mood recent */}
      {moods.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.0625rem' }}>📊 Kayfiyat (oxirgi yozuvlar)</h2>
            <a href="/kayfiyat" style={{ fontSize: '0.8125rem', color: 'var(--c-primary)', textDecoration: 'none' }}>Barchasi →</a>
          </div>
          <div style={{ display: 'flex', gap: '0.625rem', overflowX: 'auto', paddingBottom: 4 }}>
            {moods.slice(0, 7).map(m => (
              <div key={m.id} style={{ flexShrink: 0, textAlign: 'center', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--c-border)', minWidth: 70 }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 2 }}>{m.moodScore >= 8 ? '😄' : m.moodScore >= 6 ? '🙂' : m.moodScore >= 4 ? '😐' : '😟'}</div>
                <p style={{ fontWeight: 700, color: 'var(--c-primary)', fontSize: '0.9rem' }}>{m.moodScore}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--c-muted)' }}>{new Date(m.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
