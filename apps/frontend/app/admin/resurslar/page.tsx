'use client';
import { useEffect, useState } from 'react';

type Resource = { id: string; title: string; type: string; description: string; url?: string; isActive: boolean };
const TYPES = ['VIDEO','ARTICLE','BOOK','GUIDE'] as const;

export default function AdminResurslarPage() {
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'VIDEO', url: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch('/api/admin/resurslar');
    const j = await res.json();
    if (j.success) setItems(j.data);
    setLoading(false);
  }

  async function toggle(id: string, current: boolean) {
    setBusy(id);
    await fetch(`/api/admin/resurslar/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !current }) });
    await fetchItems(); setBusy(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu resursni o'chirmoqchimisiz?")) return;
    setBusy(id);
    await fetch(`/api/admin/resurslar/${id}`, { method: 'DELETE' });
    await fetchItems(); setBusy(null); setMsg("Resurs o'chirildi");
  }

  async function handleSave() {
    if (!form.title) return;
    setSaving(true);
    const body = { ...form, slug: form.title.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') };
    const res = await fetch('/api/admin/resurslar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await res.json();
    if (j.success) { await fetchItems(); setShowForm(false); setForm({ title: '', description: '', type: 'VIDEO', url: '' }); setMsg("Resurs qo'shildi ✓"); }
    setSaving(false);
  }

  const typeColors: Record<string, string> = { VIDEO: '#60A5FA', ARTICLE: '#34D399', BOOK: '#EC4899', GUIDE: '#FBB024' };
  const typeIcons: Record<string, string> = { VIDEO: '🎬', ARTICLE: '📄', BOOK: '📚', GUIDE: '🗺️' };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}><div className="spinner" /></div>;

  return (
    <div className="wrap" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🎯</div>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 800 }}>Resurslar boshqaruvi</h1>
            <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem' }}>{items.length} ta resurs</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn">{showForm ? '✕ Yopish' : '+ Resurs qo\'shish'}</button>
      </div>

      {msg && <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px', padding: '10px 16px', marginBottom: '1.5rem', color: '#34D399', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>{msg}<button onClick={() => setMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button></div>}

      {showForm && (
        <div style={{ background: 'var(--c-surface)', border: '1px solid rgba(20,184,166,0.25)', borderRadius: '20px', padding: '1.75rem', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: '1.25rem', color: '#14B8A6' }}>Yangi resurs qo'shish</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div><label className="label">Nomi *</label><input className="input" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="Resurs nomi" /></div>
            <div>
              <label className="label">Turi</label>
              <select className="input" value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}>
                {TYPES.map(t => <option key={t} value={t}>{typeIcons[t]} {t}</option>)}
              </select>
            </div>
            <div><label className="label">URL (havola)</label><input className="input" value={form.url} onChange={e => setForm(p => ({...p, url: e.target.value}))} placeholder="https://..." /></div>
          </div>
          <div style={{ marginBottom: '1rem' }}><label className="label">Tavsif</label><textarea className="input" rows={2} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} style={{ resize: 'vertical', fontFamily: 'inherit' }} /></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleSave} disabled={saving || !form.title} className="btn">{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
            <button onClick={() => setShowForm(false)} className="btn-outline">Bekor qilish</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--c-muted)', background: 'var(--c-surface)', borderRadius: '20px', border: '1px solid var(--c-border)' }}>Hali resurslar yo'q.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
          {items.map(r => {
            const color = typeColors[r.type] || '#60A5FA';
            const icon = typeIcons[r.type] || '📎';
            return (
              <div key={r.id} style={{ background: 'var(--c-surface)', border: `1px solid ${r.isActive ? 'var(--c-border)' : 'rgba(248,113,113,0.2)'}`, borderRadius: '18px', padding: '1.25rem', opacity: r.isActive ? 1 : 0.7, transition: 'all 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.borderColor = color; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.borderColor = ''; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, background: `${color}18`, color, border: `1px solid ${color}25` }}>{r.type}</span>
                    <span className={`badge ${r.isActive ? 'badge-green' : 'badge-red'}`}>{r.isActive ? 'Faol' : 'Nofaol'}</span>
                  </div>
                </div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{r.title}</p>
                <p style={{ fontSize: '0.775rem', color: 'var(--c-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>{r.description?.substring(0, 80)}...</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button disabled={busy === r.id} onClick={() => toggle(r.id, r.isActive)} style={{ flex: 1, padding: '7px 10px', borderRadius: '8px', background: r.isActive ? 'rgba(248,113,113,0.1)' : 'rgba(52,211,153,0.1)', border: `1px solid ${r.isActive ? 'rgba(248,113,113,0.2)' : 'rgba(52,211,153,0.2)'}`, color: r.isActive ? '#F87171' : '#34D399', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                    {busy === r.id ? '...' : r.isActive ? 'Yashirish' : 'Faollashtirish'}
                  </button>
                  <button disabled={busy === r.id} onClick={() => handleDelete(r.id)} style={{ padding: '7px 12px', borderRadius: '8px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', color: '#F87171', cursor: 'pointer', fontSize: '0.875rem' }}>🗑</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
