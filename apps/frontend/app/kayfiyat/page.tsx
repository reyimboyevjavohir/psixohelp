'use client';
import { useEffect, useState } from 'react';

const MOODS = [
  { score: 5, emoji: '😄', label: "A'lo", color: '#34D399' },
  { score: 4, emoji: '🙂', label: 'Yaxshi', color: '#60A5FA' },
  { score: 3, emoji: '😐', label: "O'rta", color: '#FBB024' },
  { score: 2, emoji: '😟', label: 'Yomon', color: '#F97316' },
  { score: 1, emoji: '😔', label: "Og'ir", color: '#F87171' },
];

type Entry = { id: string; date: string; moodScore: number; energyLevel: number; anxietyLevel: number; sleepQuality: number; notes?: string; emotions?: string[] };

export default function KayfiyatPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [energy, setEnergy] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [sleep, setSleep] = useState(5);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/mood').then(r => r.json()).then(j => { if (j.success) setEntries(j.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (selected === null) return;
    setSaving(true);
    const res = await fetch('/api/mood', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moodScore: selected, energyLevel: energy, anxietyLevel: anxiety, sleepQuality: sleep, notes }),
    });
    const j = await res.json();
    if (j.success) { setEntries(p => [j.data, ...p]); setSelected(null); setNotes(''); setMsg('Kayfiyat saqlandi ✓'); }
    setSaving(false);
  }

  const ScaleInput = ({ label, value, onChange, color }: { label: string; value: number; onChange: (v: number) => void; color: string }) => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <label className="label" style={{ marginBottom: 0 }}>{label}</label>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color }}>{value}/10</span>
      </div>
      <input type="range" min={1} max={10} value={value} onChange={e => onChange(+e.target.value)} style={{ width: '100%', accentColor: color }} />
    </div>
  );

  return (
    <div className="wrap" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          <span style={{ background: 'linear-gradient(135deg,#A78BFA,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Kayfiyat</span> Kuzatish
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.9375rem' }}>Kunlik holatingizni qayd eting va dinamikani kuzating</p>
      </div>

      {msg && <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px', padding: '10px 16px', marginBottom: '1.5rem', color: '#34D399', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>{msg}<button onClick={() => setMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button></div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Mood selector */}
        <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '24px', padding: '1.75rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.05rem' }}>Bugungi kayfiyat</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MOODS.map(m => (
              <button key={m.score} onClick={() => setSelected(m.score)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: '14px', background: selected === m.score ? `${m.color}15` : 'rgba(255,255,255,0.03)', border: `1.5px solid ${selected === m.score ? m.color + '55' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', transition: 'all 0.2s', outline: 'none', transform: selected === m.score ? 'scale(1.02)' : 'scale(1)' }}>
                <span style={{ fontSize: '1.5rem' }}>{m.emoji}</span>
                <span style={{ fontWeight: 600, color: selected === m.score ? m.color : 'var(--c-text)', fontSize: '0.9rem' }}>{m.label}</span>
                {selected === m.score && <span style={{ marginLeft: 'auto', color: m.color, fontSize: '0.8rem' }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Scales */}
        <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '24px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem' }}>Batafsil baholash</h2>
          <ScaleInput label="⚡ Energiya darajasi" value={energy} onChange={setEnergy} color="#FBB024" />
          <ScaleInput label="😰 Tashvish darajasi" value={anxiety} onChange={setAnxiety} color="#F87171" />
          <ScaleInput label="😴 Uyqu sifati" value={sleep} onChange={setSleep} color="#60A5FA" />
          <div>
            <label className="label">Eslatma (ixtiyoriy)</label>
            <textarea className="input" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Bugun nima his qildingiz..." style={{ resize: 'none', fontFamily: 'inherit' }} />
          </div>
          <button onClick={handleSave} disabled={saving || selected === null} className="btn" style={{ width: '100%', justifyContent: 'center' }}>
            {saving ? 'Saqlanmoqda...' : selected === null ? 'Avval kayfiyat tanlang' : '💾 Saqlash'}
          </button>
        </div>
      </div>

      {/* History */}
      {!loading && entries.length > 0 && (
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.25rem' }}>Tarix</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {entries.slice(0, 10).map(e => {
              const mood = MOODS.find(m => m.score === e.moodScore) || MOODS[2];
              return (
                <div key={e.id} style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '16px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.5rem' }}>{mood.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: mood.color }}>{mood.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)' }}>{new Date(e.date).toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                  {[['⚡', e.energyLevel, '#FBB024'], ['😰', e.anxietyLevel, '#F87171'], ['😴', e.sleepQuality, '#60A5FA']].map(([ic, v, c]) => (
                    <div key={ic as string} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.8rem' }}>{ic}</div>
                      <div style={{ fontWeight: 700, color: c as string, fontSize: '0.875rem' }}>{v}/10</div>
                    </div>
                  ))}
                  {e.notes && <p style={{ width: '100%', fontSize: '0.8125rem', color: 'var(--c-muted)', margin: '0.25rem 0 0', paddingLeft: '2.5rem' }}>{e.notes}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
