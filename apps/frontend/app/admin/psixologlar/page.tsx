'use client';
import { useEffect, useState } from 'react';
import { Psychologist } from '@/types';

type FormState = { fullName: string; specialty: string; bio: string; experienceYears: number; price: number; avatarUrl: string };
const EMPTY: FormState = { fullName: '', specialty: '', bio: '', experienceYears: 1, price: 50000, avatarUrl: '' };

export default function AdminPsixologlarPage() {
  const [items, setItems] = useState<Psychologist[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch('/api/admin/psixologlar');
    const j = await res.json();
    if (j.success) setItems(j.data);
    setLoading(false);
  }

  async function toggle(id: string, current: boolean) {
    setBusy(id);
    await fetch(`/api/admin/psixologlar/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !current }) });
    await fetchItems(); setBusy(null);
  }

  async function verify(id: string, current: boolean) {
    setBusy(id + 'v');
    await fetch(`/api/admin/psixologlar/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isVerified: !current }) });
    await fetchItems(); setBusy(null); setMsg(current ? 'Tasdiqlash olib tashlandi' : 'Psixolog tasdiqlandi ✓');
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu psixologni o'chirmoqchimisiz?")) return;
    setBusy(id);
    await fetch(`/api/admin/psixologlar/${id}`, { method: 'DELETE' });
    await fetchItems(); setBusy(null); setMsg("Psixolog o'chirildi");
  }

  async function handleSave() {
    if (!form.fullName || !form.specialty) return;
    setSaving(true);
    const body = { ...form, slug: form.fullName.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''), languages: ['uz'], specializations: [form.specialty], availability: {}, rating: 5, reviewsCount: 0 };
    const res = await fetch('/api/admin/psixologlar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await res.json();
    if (j.success) { await fetchItems(); setShowForm(false); setForm(EMPTY); setMsg("Psixolog qo'shildi ✓"); }
    setSaving(false);
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}><div className="spinner" /></div>;

  return (
    <div className="wrap" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👨‍⚕️</div>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 800 }}>Psixologlar boshqaruvi</h1>
            <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem' }}>{items.length} ta psixolog</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn">{showForm ? '✕ Yopish' : '+ Psixolog qo\'shish'}</button>
      </div>

      {msg && <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px', padding: '10px 16px', marginBottom: '1.5rem', color: '#34D399', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>{msg}<button onClick={() => setMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button></div>}

      {showForm && (
        <div style={{ background: 'var(--c-surface)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: '20px', padding: '1.75rem', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: '1.25rem', color: '#34D399' }}>Yangi psixolog qo'shish</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div><label className="label">To'liq ism *</label><input className="input" value={form.fullName} onChange={e => setForm(p => ({...p, fullName: e.target.value}))} placeholder="Dr. Aziz Karimov" /></div>
            <div><label className="label">Mutaxassislik *</label><input className="input" value={form.specialty} onChange={e => setForm(p => ({...p, specialty: e.target.value}))} placeholder="Klinik psixolog" /></div>
            <div><label className="label">Tajriba (yil)</label><input type="number" className="input" value={form.experienceYears} onChange={e => setForm(p => ({...p, experienceYears: +e.target.value}))} /></div>
            <div><label className="label">Narx (so'm)</label><input type="number" className="input" value={form.price} onChange={e => setForm(p => ({...p, price: +e.target.value}))} /></div>
            <div><label className="label">Avatar URL</label><input className="input" value={form.avatarUrl} onChange={e => setForm(p => ({...p, avatarUrl: e.target.value}))} placeholder="https://..." /></div>
          </div>
          <div style={{ marginBottom: '1rem' }}><label className="label">Bio *</label><textarea className="input" rows={3} value={form.bio} onChange={e => setForm(p => ({...p, bio: e.target.value}))} placeholder="Psixolog haqida..." style={{ resize: 'vertical', fontFamily: 'inherit' }} /></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleSave} disabled={saving || !form.fullName || !form.specialty} className="btn">{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
            <button onClick={() => { setShowForm(false); setForm(EMPTY); }} className="btn-outline">Bekor qilish</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--c-muted)', background: 'var(--c-surface)', borderRadius: '20px', border: '1px solid var(--c-border)' }}>Hali psixologlar yo'q.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
          {items.map(p => (
            <div key={p.id} style={{ background: 'var(--c-surface)', border: `1px solid ${p.isActive ? (p.isVerified ? 'rgba(52,211,153,0.2)' : 'var(--c-border)') : 'rgba(248,113,113,0.2)'}`, borderRadius: '18px', padding: '1.25rem', opacity: p.isActive ? 1 : 0.7, transition: 'all 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: p.avatarUrl ? 'transparent' : 'linear-gradient(135deg,#34D399,#60A5FA)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                  {p.avatarUrl ? <img src={p.avatarUrl} alt={p.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👨‍⚕️'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)' }}>{p.specialty}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                <span className={`badge ${p.isActive ? 'badge-green' : 'badge-red'}`}>{p.isActive ? 'Faol' : 'Nofaol'}</span>
                <span className={`badge ${p.isVerified ? 'badge-blue' : 'badge-yellow'}`}>{p.isVerified ? '✓ Tasdiqlangan' : '⏳ Kutilmoqda'}</span>
                <span className="badge badge-purple">{p.price?.toLocaleString()} so'm</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button disabled={busy === p.id + 'v'} onClick={() => verify(p.id, p.isVerified)} style={{ flex: 1, padding: '6px 8px', borderRadius: '8px', background: p.isVerified ? 'rgba(251,176,36,0.1)' : 'rgba(52,211,153,0.1)', border: `1px solid ${p.isVerified ? 'rgba(251,176,36,0.2)' : 'rgba(52,211,153,0.2)'}`, color: p.isVerified ? '#FBB024' : '#34D399', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                  {p.isVerified ? 'Tasdiqlashni olish' : '✓ Tasdiqlash'}
                </button>
                <button disabled={busy === p.id} onClick={() => toggle(p.id, p.isActive)} style={{ padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--c-border)', color: 'var(--c-muted)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                  {busy === p.id ? '...' : p.isActive ? 'Yashirish' : 'Faollashtirish'}
                </button>
                <button disabled={busy === p.id} onClick={() => handleDelete(p.id)} style={{ padding: '6px 10px', borderRadius: '8px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', color: '#F87171', cursor: 'pointer', fontSize: '0.875rem' }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
