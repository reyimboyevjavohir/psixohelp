'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = { psychologistId: string; psychologistName: string; availability: Record<string, string[]> };

export function BookingFormWrapper({ psychologistId, availability }: Props) {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mode, setMode] = useState<'video' | 'audio' | 'text'>('video');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  async function handleBook() {
    if (!date || !time) { setError("Sana va vaqtni tanlang"); return; }
    setLoading(true); setError('');
    try {
      const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ psychologistId, scheduledAt, mode, notes }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || 'Xatolik');
        if (res.status === 401) setError("Bron qilish uchun tizimga kiring");
        setLoading(false); return;
      }
      setSuccess(true);
      setTimeout(() => router.push('/profil'), 2000);
    } catch { setError("Tarmoq xatoligi"); }
    setLoading(false);
  }

  if (success) return (
    <div className="alert-success" style={{ textAlign: 'center', padding: '1.5rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>Bron yaratildi!</p>
      <p style={{ fontSize: '0.8125rem', color: 'var(--c-muted)' }}>Profilingizga yo'naltirilmoqda...</p>
    </div>
  );

  const timeSlots = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00','19:00'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {error && <div className="alert-danger" style={{ fontSize: '0.8125rem' }}>⚠️ {error}</div>}

      <div>
        <label className="label">Seans turi</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['video', 'audio', 'text'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem',
              fontWeight: 500, cursor: 'pointer', border: '1.5px solid', transition: 'all .15s',
              borderColor: mode === m ? 'var(--c-primary)' : 'var(--c-border)',
              background: mode === m ? 'var(--c-primary-l)' : 'transparent',
              color: mode === m ? 'var(--c-primary)' : 'var(--c-muted)',
            }}>
              {m === 'video' ? '📹' : m === 'audio' ? '🎙' : '💬'} {m === 'video' ? 'Video' : m === 'audio' ? 'Audio' : 'Matn'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Sana</label>
        <input type="date" className="input" min={today} value={date}
          onChange={e => { setDate(e.target.value); setTime(''); }} />
      </div>

      {date && (
        <div>
          <label className="label">Vaqt</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {timeSlots.map(t => (
              <button key={t} onClick={() => setTime(t)} style={{
                padding: '7px 4px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem',
                fontWeight: 500, cursor: 'pointer', border: '1.5px solid', transition: 'all .15s',
                borderColor: time === t ? 'var(--c-primary)' : 'var(--c-border)',
                background: time === t ? 'var(--c-primary-l)' : 'transparent',
                color: time === t ? 'var(--c-primary)' : 'var(--c-muted)',
              }}>{t}</button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="label">Izoh (ixtiyoriy)</label>
        <textarea className="input" rows={2} style={{ resize: 'none' }}
          placeholder="Asosiy muammo yoki savollaringiz..."
          value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      <button className="btn" onClick={handleBook} disabled={loading || !date || !time}
        style={{ padding: '0.75rem', fontSize: '0.9375rem' }}>
        {loading ? 'Bronlanmoqda...' : '📅 Seans bron qilish'}
      </button>
      <p style={{ fontSize: '0.75rem', color: 'var(--c-muted)', textAlign: 'center' }}>
        Bron qilish uchun <a href="/kirish" style={{ color: 'var(--c-primary)' }}>tizimga kirish</a> kerak
      </p>
    </div>
  );
}
