'use client';
import { useEffect, useState } from 'react';

type Profile = { id: string; fullName: string; specialty: string; bio: string; phone?: string; availability: any; isActive: boolean; isVerified: boolean; price: number };

export default function PsixologPanel() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tab, setTab] = useState<'overview'|'advice'|'schedule'|'contact'>('overview');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Advice state
  const [adviceTitle, setAdviceTitle] = useState('');
  const [adviceContent, setAdviceContent] = useState('');
  const [adviceCategory, setAdviceCategory] = useState('');
  const [advices, setAdvices] = useState<any[]>([]);
  const [adviceBusy, setAdviceBusy] = useState(false);

  // Schedule state
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('18:00');
  const [workDays, setWorkDays] = useState<number[]>([1,2,3,4,5]);
  const [schedBusy, setSchedBusy] = useState(false);

  // Contact state
  const [telegram, setTelegram] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contactBusy, setContactBusy] = useState(false);

  useEffect(() => {
    fetch('/api/psixolog/profile').then(r => r.json()).then(j => {
      if (j.success) setProfile(j.data);
      setLoading(false);
    }).catch(() => setLoading(false));
    fetch('/api/psixolog/advices').then(r => r.json()).then(j => { if (j.success) setAdvices(j.data || []); });
  }, []);

  async function submitAdvice() {
    if (!adviceTitle || !adviceContent) return;
    setAdviceBusy(true);
    const res = await fetch('/api/psixolog/advices', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ title: adviceTitle, content: adviceContent, category: adviceCategory }) });
    const j = await res.json();
    if (j.success) { setAdvices(prev => [j.data, ...prev]); setAdviceTitle(''); setAdviceContent(''); setAdviceCategory(''); setMsg('Tavsiya qo\'shildi ✓'); }
    setAdviceBusy(false);
  }

  async function deleteAdvice(id: string) {
    await fetch(`/api/psixolog/advices/${id}`, { method: 'DELETE' });
    setAdvices(prev => prev.filter(a => a.id !== id));
    setMsg('O\'chirildi');
  }

  async function saveSchedule() {
    setSchedBusy(true);
    const res = await fetch('/api/psixolog/schedule', { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ workStart, workEnd, workDays }) });
    const j = await res.json();
    if (j.success) setMsg('Ish vaqti saqlandi ✓');
    setSchedBusy(false);
  }

  async function saveContact() {
    setContactBusy(true);
    const res = await fetch('/api/psixolog/contact', { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ telegram, phone, email }) });
    const j = await res.json();
    if (j.success) setMsg('Ma\'lumotlar saqlandi ✓');
    setContactBusy(false);
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}><div className="spinner" /></div>;

  const days = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
  const tabs = [
    { key: 'overview', label: '📊 Umumiy', color: '#34D399' },
    { key: 'advice', label: '💬 Tavsiyalar', color: '#60A5FA' },
    { key: 'schedule', label: '📅 Ish vaqti', color: '#A78BFA' },
    { key: 'contact', label: '📞 Bog\'lanish', color: '#FBB024' },
  ] as const;

  return (
    <div className="wrap" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2rem' }}>
        <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg,rgba(96,165,250,0.15),rgba(96,165,250,0.05))', border: '1px solid rgba(96,165,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>👨‍⚕️</div>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{profile?.fullName ?? 'Psixolog Panel'}</h1>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <span className={`badge ${profile?.isVerified ? 'badge-green' : 'badge-yellow'}`}>{profile?.isVerified ? '✓ Tasdiqlangan' : '⏳ Tasdiq kutilmoqda'}</span>
            <span className={`badge ${profile?.isActive ? 'badge-blue' : 'badge-red'}`}>{profile?.isActive ? 'Faol' : 'Nofaol'}</span>
          </div>
        </div>
      </div>

      {msg && <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px', padding: '10px 16px', marginBottom: '1.5rem', color: '#34D399', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>{msg}<button onClick={() => setMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button></div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '2rem', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '9px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all .2s', background: tab === t.key ? `${t.color}18` : 'var(--c-surface)', border: `1.5px solid ${tab === t.key ? t.color + '55' : 'var(--c-border)'}`, color: tab === t.key ? t.color : 'var(--c-muted)', outline: 'none' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '20px', padding: '1.5rem' }}>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: '1rem', color: '#34D399' }}>Profil ma'lumotlari</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Mutaxassislik', profile?.specialty], ['Narx', `${profile?.price?.toLocaleString()} so'm`]].map(([k, v]) => (
                <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--c-muted)' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{ fontSize: '0.8125rem', color: 'var(--c-muted)', lineHeight: 1.7, marginTop: 4 }}>{profile?.bio}</div>
            </div>
          </div>
          <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '20px', padding: '1.5rem' }}>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: '1rem', color: '#60A5FA' }}>Tavsiyalarim: {advices.length} ta</h3>
            <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
              Bemorlaringizga foydali maslahat va tavsiyalar qo'shing. Ular saytda ko'rinadi.
            </p>
            <button onClick={() => setTab('advice')} style={{ marginTop: '1rem', padding: '8px 16px', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', color: '#60A5FA', borderRadius: '10px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
              Tavsiya qo'shish →
            </button>
          </div>
        </div>
      )}

      {tab === 'advice' && (
        <div>
          {/* Add advice form */}
          <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: '1.25rem' }}>Yangi tavsiya qo'shish</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Mavzu nomi *</label>
                <input className="input" value={adviceTitle} onChange={e => setAdviceTitle(e.target.value)} placeholder="Masalan: Stresni kamaytirish usullari" />
              </div>
              <div>
                <label className="label">Kategoriya</label>
                <input className="input" value={adviceCategory} onChange={e => setAdviceCategory(e.target.value)} placeholder="Tashvish, Uyqu, Munosabatlar..." />
              </div>
              <div>
                <label className="label">Tavsiya matni *</label>
                <textarea className="input" rows={5} value={adviceContent} onChange={e => setAdviceContent(e.target.value)} placeholder="Batafsil tavsiyangizni yozing..." style={{ resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              <button onClick={submitAdvice} disabled={adviceBusy || !adviceTitle || !adviceContent} className="btn" style={{ alignSelf: 'flex-start' }}>
                {adviceBusy ? 'Saqlanmoqda...' : '+ Tavsiya qo\'shish'}
              </button>
            </div>
          </div>

          {/* Advices list */}
          {advices.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {advices.map(a => (
                <div key={a.id} style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '16px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: 4 }}>{a.title}</div>
                    {a.category && <span className="badge badge-blue" style={{ marginBottom: 8 }}>{a.category}</span>}
                    <p style={{ fontSize: '0.8125rem', color: 'var(--c-muted)', lineHeight: 1.7 }}>{a.content?.substring(0, 120)}...</p>
                  </div>
                  <button onClick={() => deleteAdvice(a.id)} style={{ padding: '6px 12px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#F87171', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0 }}>O'chirish</button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--c-muted)' }}>Hali tavsiyalar yo'q. Birinchi tavsiyangizni qo'shing!</div>
          )}
        </div>
      )}

      {tab === 'schedule' && (
        <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '20px', padding: '1.75rem', maxWidth: 520 }}>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: '1.5rem' }}>Ish vaqtini belgilang</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label">Ish boshlanishi</label>
                <input type="time" className="input" value={workStart} onChange={e => setWorkStart(e.target.value)} />
              </div>
              <div>
                <label className="label">Ish tugashi</label>
                <input type="time" className="input" value={workEnd} onChange={e => setWorkEnd(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label" style={{ marginBottom: '0.75rem' }}>Ish kunlari</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {days.map((d, i) => (
                  <button key={i} onClick={() => setWorkDays(prev => prev.includes(i + 1) ? prev.filter(x => x !== i + 1) : [...prev, i + 1])}
                    style={{ width: 44, height: 44, borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all .2s', background: workDays.includes(i + 1) ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${workDays.includes(i + 1) ? 'rgba(167,139,250,0.5)' : 'var(--c-border)'}`, color: workDays.includes(i + 1) ? '#A78BFA' : 'var(--c-muted)', outline: 'none' }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={saveSchedule} disabled={schedBusy} className="btn" style={{ alignSelf: 'flex-start' }}>
              {schedBusy ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </div>
      )}

      {tab === 'contact' && (
        <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '20px', padding: '1.75rem', maxWidth: 520 }}>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: '1.5rem' }}>Bog'lanish ma'lumotlari</h3>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
            Bu ma'lumotlar bemorlar siz bilan bog'lanishi uchun ko'rsatiladi.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Telegram username</label>
              <input className="input" value={telegram} onChange={e => setTelegram(e.target.value)} placeholder="@psixolog_ismi" />
            </div>
            <div>
              <label className="label">Telefon raqam</label>
              <input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+998 90 123 45 67" />
            </div>
            <div>
              <label className="label">Email (ixtiyoriy)</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="doktor@example.com" />
            </div>
            <button onClick={saveContact} disabled={contactBusy} className="btn" style={{ alignSelf: 'flex-start' }}>
              {contactBusy ? 'Saqlanmoqda...' : 'Ma\'lumotlarni saqlash'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
