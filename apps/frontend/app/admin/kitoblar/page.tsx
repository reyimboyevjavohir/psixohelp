'use client';
import { useEffect, useState } from 'react';
import { Book } from '@/types';

type FormState = { title: string; author: string; description: string; coverUrl: string; downloadUrl: string };
const EMPTY: FormState = { title: '', author: '', description: '', coverUrl: '', downloadUrl: '' };

export default function AdminKitoblarPage() {
  const [items, setItems] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch('/api/admin/kitoblar');
    const json = await res.json();
    if (json.success) setItems(json.data);
    setLoading(false);
  }

  async function toggle(id: string, current: boolean) {
    setBusy(id);
    await fetch(`/api/admin/kitoblar/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !current }) });
    await fetchItems(); setBusy(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kitobni o'chirmoqchimisiz?")) return;
    setBusy(id);
    await fetch(`/api/admin/kitoblar/${id}`, { method: 'DELETE' });
    await fetchItems(); setBusy(null); setMsg("Kitob o'chirildi");
  }

  async function handleSave() {
    if (!form.title || !form.author) return;
    setSaving(true);
    const res = await fetch('/api/admin/kitoblar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const j = await res.json();
    if (j.success) { await fetchItems(); setShowForm(false); setForm(EMPTY); setMsg("Kitob qo'shildi ✓"); }
    setSaving(false);
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}><div className="spinner" /></div>;

  return (
    <div className="wrap" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📚</div>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 800 }}>Kitoblar boshqaruvi</h1>
            <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem' }}>{items.length} ta kitob</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn">{showForm ? '✕ Yopish' : '+ Kitob qo\'shish'}</button>
      </div>

      {msg && <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px', padding: '10px 16px', marginBottom: '1.5rem', color: '#34D399', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>{msg}<button onClick={() => setMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button></div>}

      {showForm && (
        <div style={{ background: 'var(--c-surface)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '20px', padding: '1.75rem', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: '1.25rem', color: '#34D399' }}>Yangi kitob qo'shish</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {([['title','Kitob nomi *'],['author',"Muallif *"],['coverUrl','Muqova URL'],['downloadUrl',"Yuklab olish URL"]] as [keyof FormState, string][]).map(([k, l]) => (
              <div key={k}>
                <label className="label">{l}</label>
                <input className="input" value={form[k]} onChange={e => setForm(p => ({...p, [k]: e.target.value}))} placeholder={l} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label className="label">Tavsif *</label>
            <textarea className="input" rows={3} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder="Kitob haqida qisqacha..." style={{ resize: 'vertical', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleSave} disabled={saving || !form.title || !form.author} className="btn">{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
            <button onClick={() => { setShowForm(false); setForm(EMPTY); }} className="btn-outline">Bekor qilish</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--c-muted)', background: 'var(--c-surface)', borderRadius: '20px', border: '1px solid var(--c-border)' }}>Hali kitoblar yo'q. Birinchi kitob qo'shing!</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
          {items.map(b => (
            <div key={b.id} style={{ background: 'var(--c-surface)', border: `1px solid ${b.isActive ? 'var(--c-border)' : 'rgba(248,113,113,0.2)'}`, borderRadius: '18px', padding: '1.25rem', opacity: b.isActive ? 1 : 0.7, transition: 'all 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
              {b.coverUrl && <img src={b.coverUrl} alt={b.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', marginBottom: '0.875rem', background: '#0d1117' }} />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.4 }}>{b.title}</p>
                <span className={`badge ${b.isActive ? 'badge-green' : 'badge-red'}`} style={{ flexShrink: 0 }}>{b.isActive ? 'Faol' : 'Nofaol'}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--c-muted)', marginBottom: 4 }}>{b.author}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--c-muted)', lineHeight: 1.6, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{b.description}</p>
              <div style={{ display: 'flex', gap: 6 }}>
                <button disabled={busy === b.id} onClick={() => toggle(b.id, b.isActive)} style={{ flex: 1, padding: '7px 10px', borderRadius: '8px', background: b.isActive ? 'rgba(248,113,113,0.1)' : 'rgba(52,211,153,0.1)', border: `1px solid ${b.isActive ? 'rgba(248,113,113,0.2)' : 'rgba(52,211,153,0.2)'}`, color: b.isActive ? '#F87171' : '#34D399', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                  {busy === b.id ? '...' : b.isActive ? "Yashirish" : 'Faollashtirish'}
                </button>
                <button disabled={busy === b.id} onClick={() => handleDelete(b.id)} style={{ padding: '7px 12px', borderRadius: '8px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', color: '#F87171', cursor: 'pointer', fontSize: '0.875rem' }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
