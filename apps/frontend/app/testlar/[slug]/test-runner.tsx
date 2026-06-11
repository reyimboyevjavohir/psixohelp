'use client';
import { useState } from 'react';

type Question = { id: string; text: string; options: { value: number; label: string }[] };
type Test = { id: string; slug: string; title: string; description: string; durationMin: number; questionCount: number; instructions: string; questions: Question[] };
type Result = { score: number; level: string; summary: string; details: { recommendation: string } };

export function TestRunner({ test }: { test: Test }) {
  const [step, setStep] = useState<'intro' | 'test' | 'done'>('intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const q = test.questions[current];
  const progress = Math.round((current / test.questions.length) * 100);

  function answer(qId: string, val: number) {
    setAnswers(p => ({ ...p, [qId]: val }));
    if (current < test.questions.length - 1) {
      setTimeout(() => setCurrent(p => p + 1), 300);
    }
  }

  async function submit() {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/tests/${test.slug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) { setError(json.message || 'Xatolik'); setLoading(false); return; }
      setResult(json.data); setStep('done');
    } catch { setError('Xatolik yuz berdi'); }
    setLoading(false);
  }

  const levelColor: Record<string, string> = { normal: '#22C55E', mild: '#F59E0B', moderate: '#F97316', severe: '#DC2626' };

  if (step === 'intro') return (
    <div className="card">
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧪</div>
        <h1 className="heading-serif" style={{ fontSize: '1.75rem', marginBottom: 8 }}>{test.title}</h1>
        <p style={{ color: 'var(--c-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{test.description}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: 'var(--c-primary)' }}>{test.durationMin}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--c-muted)' }}>daqiqa</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: 'var(--c-primary)' }}>{test.questionCount}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--c-muted)' }}>savol</p>
          </div>
        </div>
        <div className="alert-info" style={{ textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.8125rem' }}>
          📋 <strong>Ko'rsatma:</strong> {test.instructions}
        </div>
        <button className="btn" onClick={() => setStep('test')} style={{ padding: '0.75rem 2rem', fontSize: '0.9375rem' }}>
          Testni boshlash →
        </button>
      </div>
    </div>
  );

  if (step === 'done' && result) return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
      <h2 className="heading-serif" style={{ fontSize: '1.5rem', marginBottom: 8 }}>Test natijasi</h2>
      <div style={{ margin: '1.5rem auto', width: 100, height: 100, borderRadius: '50%', border: `4px solid ${levelColor[result.level] || '#6B7280'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: levelColor[result.level] || '#6B7280' }}>{result.score}</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--c-muted)' }}>ball</span>
      </div>
      <span className="badge" style={{ background: levelColor[result.level] + '20', color: levelColor[result.level] || '#6B7280', fontSize: '0.875rem', padding: '5px 14px', marginBottom: '1rem', display: 'inline-block' }}>
        {result.level === 'normal' ? 'Normal' : result.level === 'mild' ? 'Yengil' : result.level === 'moderate' ? "O'rtacha" : 'Jiddiy'}
      </span>
      <p style={{ color: 'var(--c-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem', maxWidth: 500, margin: '0 auto 1rem' }}>{result.summary}</p>
      {result.details?.recommendation && (
        <div className="alert-info" style={{ textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.8125rem', maxWidth: 500, margin: '0 auto 1.5rem' }}>
          💡 {result.details.recommendation}
        </div>
      )}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/maslahatlar" className="btn" style={{ textDecoration: 'none' }}>Psixolog bilan ko'rish</a>
        <a href="/testlar" className="btn-outline" style={{ textDecoration: 'none' }}>Boshqa testlar</a>
      </div>
    </div>
  );

  return (
    <div className="card">
      {/* Progress */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--c-muted)', marginBottom: 6 }}>
          <span>{current + 1} / {test.questions.length}</span>
          <span>{progress}%</span>
        </div>
        <div style={{ background: 'var(--c-bg)', borderRadius: 99, height: 6 }}>
          <div style={{ background: 'var(--c-primary)', borderRadius: 99, height: '100%', width: `${progress}%`, transition: 'width .3s' }} />
        </div>
      </div>

      {q && (
        <div>
          <p style={{ fontWeight: 600, fontSize: '1.0625rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {current + 1}. {q.text}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {q.options.map(o => (
              <button key={o.value} onClick={() => answer(q.id, o.value)} style={{
                padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', textAlign: 'left',
                fontSize: '0.875rem', cursor: 'pointer', transition: 'all .15s',
                border: `1.5px solid ${answers[q.id] === o.value ? 'var(--c-primary)' : 'var(--c-border)'}`,
                background: answers[q.id] === o.value ? 'var(--c-primary-l)' : 'var(--c-surface)',
                color: answers[q.id] === o.value ? 'var(--c-primary)' : 'var(--c-text)',
                fontWeight: answers[q.id] === o.value ? 500 : 400,
              }}>
                {o.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'space-between' }}>
            <button onClick={() => setCurrent(p => p - 1)} disabled={current === 0} className="btn-ghost">
              ← Oldingi
            </button>
            {current === test.questions.length - 1 ? (
              <button className="btn" onClick={submit} disabled={loading || Object.keys(answers).length < test.questions.length}>
                {loading ? 'Hisoblanmoqda...' : '✓ Natijani ko\'rish'}
              </button>
            ) : (
              <button className="btn" onClick={() => setCurrent(p => p + 1)} disabled={answers[q.id] === undefined}>
                Keyingi →
              </button>
            )}
          </div>
          {error && <div className="alert-danger" style={{ marginTop: '1rem', fontSize: '0.8125rem' }}>⚠️ {error}</div>}
        </div>
      )}
    </div>
  );
}
