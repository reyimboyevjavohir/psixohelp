'use client';
import { useEffect, useState } from 'react';

type Booking = { id: string; status: string; scheduledAt: string; mode: string; notes?: string; user?: { fullName: string; email: string }; psychologist?: { fullName: string } };
const STATUS_COLORS: Record<string,string> = { PENDING: '#FBB024', CONFIRMED: '#34D399', COMPLETED: '#60A5FA', CANCELLED: '#F87171' };
const STATUS_LABELS: Record<string,string> = { PENDING: '⏳ Kutilmoqda', CONFIRMED: '✅ Tasdiqlandi', COMPLETED: '🏁 Bajarildi', CANCELLED: '❌ Bekor' };

export default function AdminBronlarPage() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch('/api/admin/bookings');
    const j = await res.json();
    if (j.success) setItems(j.data);
    setLoading(false);
  }

  async function setStatus(id: string, status: string) {
    setBusy(id);
    await fetch(`/api/admin/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    await fetchItems(); setBusy(null); setMsg(`Holat ${STATUS_LABELS[status]} ga o'zgartirildi`);
  }

  const filtered = statusFilter === 'ALL' ? items : items.filter(i => i.status === statusFilter);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}><div className="spinner" /></div>;

  return (
    <div className="wrap" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2rem' }}>
        <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(251,176,36,0.1)', border: '1px solid rgba(251,176,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📅</div>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 800 }}>Bronlar boshqaruvi</h1>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem' }}>{items.length} ta bron</p>
        </div>
      </div>

      {msg && <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px', padding: '10px 16px', marginBottom: '1.5rem', color: '#34D399', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>{msg}<button onClick={() => setMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button></div>}

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '7px 14px', borderRadius: '10px', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', outline: 'none', background: statusFilter === s ? `${STATUS_COLORS[s] || '#A78BFA'}18` : 'var(--c-surface)', border: `1.5px solid ${statusFilter === s ? STATUS_COLORS[s] || '#A78BFA' : 'var(--c-border)'}`, color: statusFilter === s ? STATUS_COLORS[s] || '#A78BFA' : 'var(--c-muted)' }}>
            {s === 'ALL' ? '📋 Barchasi' : STATUS_LABELS[s]}
            <span style={{ marginLeft: 6, opacity: 0.7 }}>({s === 'ALL' ? items.length : items.filter(i => i.status === s).length})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--c-muted)', background: 'var(--c-surface)', borderRadius: '20px', border: '1px solid var(--c-border)' }}>Bronlar yo'q.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Foydalanuvchi</th><th>Psixolog</th><th>Sana</th><th>Tur</th><th>Holat</th><th>Amallar</th></tr></thead>
            <tbody>
              {filtered.map(b => {
                const color = STATUS_COLORS[b.status] || '#A78BFA';
                return (
                  <tr key={b.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.user?.fullName ?? '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)' }}>{b.user?.email}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{b.psychologist?.fullName ?? '—'}</td>
                    <td style={{ color: 'var(--c-muted)', fontSize: '0.8rem' }}>{new Date(b.scheduledAt).toLocaleString('uz-UZ')}</td>
                    <td><span className="badge badge-blue">{b.mode}</span></td>
                    <td><span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, background: `${color}18`, color, border: `1px solid ${color}30` }}>{STATUS_LABELS[b.status]}</span></td>
                    <td>
                      {b.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button disabled={busy === b.id} onClick={() => setStatus(b.id, 'CONFIRMED')} style={{ padding: '5px 10px', borderRadius: '8px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34D399', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Tasdiqlash</button>
                          <button disabled={busy === b.id} onClick={() => setStatus(b.id, 'CANCELLED')} style={{ padding: '5px 10px', borderRadius: '8px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#F87171', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Bekor</button>
                        </div>
                      )}
                      {b.status === 'CONFIRMED' && (
                        <button disabled={busy === b.id} onClick={() => setStatus(b.id, 'COMPLETED')} style={{ padding: '5px 12px', borderRadius: '8px', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', color: '#60A5FA', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Bajarildi</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
