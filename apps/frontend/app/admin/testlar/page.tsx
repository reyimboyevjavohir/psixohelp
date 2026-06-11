'use client';
import { useEffect, useState } from 'react';

type Test = { id: string; title: string; slug: string; description: string; durationMin: number; questionCount: number; isActive: boolean };

export default function AdminTestlarPage() {
  const [items, setItems] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', durationMin: 10, instructions: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch('/api/admin/testlar');
    const j = await res.json();
    if (j.success) setItems(j.data);
    setLoading(false);
  }

  async function toggle(id: string, current: boolean) {
    setBusy(id);
    await fetch(`/api/admin/testlar/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !current }) });
    await fetchItems(); setBusy(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu testni o'chirmoqchimisiz?")) return;
    setBusy(id);
    await fetch(`/api/admin/testlar/${id}`, { method: 'DELETE' });
    await fetchItems(); setBusy(null); setMsg("Test o'chirildi");
  }

  async function handleSave() {
    if (!form.title) return;
    setSaving(true);
    const body = { ...form, slug: form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), questionCount: 0, questions: [], resultBands: [] };
    const res = await fetch('/api/admin/testlar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await res.json();
    if (j.success) { await fetchItems(); setShowForm(false); setForm({ title: '', description: '', durationMin: 10, instructions: '' }); setMsg("Test qo'shildi ✓"); }
    setSaving(false);
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}><div className="spinner" /></div>;

  return (
    <div className="wrap" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🧪</div>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 800 }}>Testlar boshqaruvi</h1>
            <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem' }}>{items.length} ta test</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn">{showForm ? '✕ Yopish' : '+ Test qo\'shish'}</button>
      </div>

      {msg && <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px', padding: '10px 16px', marginBottom: '1.5rem', color: '#34D399', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>{msg}<button onClick={() => setMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button></div>}

      {showForm && (
        <div style={{ background: 'var(--c-surface)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '20px', padding: '1.75rem', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: '1.25rem', color: '#A78BFA' }}>Yangi test qo'shish</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div><label className="label">Test nomi *</label><input className="input" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="PHQ-9, GAD-7..." /></div>
            <div><label className="label">Tavsif</label><textarea className="input" rows={2} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} style={{ resize: 'vertical', fontFamily: 'inherit' }} /></div>
            <div><label className="label">Ko'rsatmalar</label><textarea className="input" rows={2} value={form.instructions} onChange={e => setForm(p => ({...p, instructions: e.target.value}))} style={{ resize: 'vertical', fontFamily: 'inherit' }} /></div>
            <div><label className="label">Davomiyligi (daqiqa)</label><input type="number" className="input" style={{ maxWidth: 160 }} value={form.durationMin} onChange={e => setForm(p => ({...p, durationMin: +e.target.value}))} /></div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSave} disabled={saving || !form.title} className="btn">{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
              <button onClick={() => setShowForm(false)} className="btn-outline">Bekor qilish</button>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--c-muted)', background: 'var(--c-surface)', borderRadius: '20px', border: '1px solid var(--c-border)' }}>Hali testlar yo'q.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Test nomi</th><th>Davomiyligi</th><th>Savollar</th><th>Holat</th><th>Amallar</th></tr></thead>
            <tbody>
              {items.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{t.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)', marginTop: 2 }}>{t.description?.substring(0, 60)}...</div>
                  </td>
                  <td style={{ color: 'var(--c-muted)' }}>{t.durationMin} daq</td>
                  <td><span className="badge badge-blue">{t.questionCount} ta</span></td>
                  <td><span className={`badge ${t.isActive ? 'badge-green' : 'badge-red'}`}>{t.isActive ? 'Faol' : 'Nofaol'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button disabled={busy === t.id} onClick={() => toggle(t.id, t.isActive)} style={{ padding: '5px 12px', borderRadius: '8px', background: t.isActive ? 'rgba(248,113,113,0.1)' : 'rgba(52,211,153,0.1)', border: `1px solid ${t.isActive ? 'rgba(248,113,113,0.2)' : 'rgba(52,211,153,0.2)'}`, color: t.isActive ? '#F87171' : '#34D399', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                        {busy === t.id ? '...' : t.isActive ? 'Yashirish' : 'Faollashtirish'}
                      </button>
                      <button disabled={busy === t.id} onClick={() => handleDelete(t.id)} style={{ padding: '5px 10px', borderRadius: '8px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', color: '#F87171', cursor: 'pointer', fontSize: '0.875rem' }}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
