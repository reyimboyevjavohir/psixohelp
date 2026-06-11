'use client';
import { useState, useRef, useEffect } from 'react';

type Msg = { id: number; role: 'user' | 'ai'; text: string; isCrisis?: boolean };
type GemHist = { role: 'user' | 'model'; parts: { text: string }[] };

const SUGGESTIONS = [
  'Stress boshqarishga yordam bering',
  "Uyqum yomon, nima qilsam bo'ladi?",
  "O'zimni yolg'iz his qilyapman",
  'Tashvich va xavotirni kamaytirish',
];

export default function AiTavsiyalarPage() {
  const [msgs, setMsgs] = useState<Msg[]>([{
    id: 0, role: 'ai',
    text: "Salom! Men PsixoHelp AI yordamchisiman. Ruhiy salomatlik, stress, tashvish yoki his-tuyg'ularingiz haqida gaplashishga tayyorman. Qanday yordam bera olaman?",
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  function buildHistory(): GemHist[] {
    return msgs.filter(m => m.id !== 0).slice(-10).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setMsgs(p => [...p, { id: Date.now(), role: 'user', text }]);
    setInput(''); setError(''); setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: buildHistory() }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) { setError(json.message || 'Xatolik'); setLoading(false); return; }
      setMsgs(p => [...p, { id: Date.now() + 1, role: 'ai', text: json.data.reply, isCrisis: json.data.isCrisis }]);
    } catch { setError('Tarmoq xatoligi'); }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function formatText(text: string) {
    return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i}>{p.slice(2, -2)}</strong>
        : <span key={i}>{p}</span>
    );
  }

  return (
    <div className="wrap" style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      <div style={{ display: 'flex', gap: '1.5rem', height: '100%' }}>
        {/* Left sidebar */}
        <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }} className="hidden lg:flex">
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🤖</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>AI Yordamchi</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--c-muted)' }}>Faol • 24/7</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--c-muted)', lineHeight: 1.6 }}>
              CBT tamoyillari asosida ishlaydi. Krizis holatlarini aniqlaydi.
            </p>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--c-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tezkor savollar</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  style={{ textAlign: 'left', padding: '7px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', color: 'var(--c-text)', background: 'var(--c-bg)', border: '1px solid var(--c-border)', cursor: 'pointer', lineHeight: 1.5 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="alert-warning" style={{ fontSize: '0.8rem' }}>
            ⚠️ Dastlabki qo'llab-quvvatlash uchun mo'ljallangan. Jiddiy holatda <a href="/maslahatlar" style={{ color: 'var(--c-primary)' }}>psixolog bilan</a> ko'ring.
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', minHeight: 0, overflow: 'hidden' }}>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {msgs.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}>
                  {m.role === 'ai' && (
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0, marginTop: 2 }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth: '78%', padding: '0.625rem 0.875rem', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    fontSize: '0.875rem', lineHeight: 1.65, whiteSpace: 'pre-wrap',
                    background: m.role === 'user' ? 'var(--c-primary)' : m.isCrisis ? '#FEF2F2' : 'var(--c-bg)',
                    color: m.role === 'user' ? '#fff' : m.isCrisis ? '#991B1B' : 'var(--c-text)',
                    border: m.role === 'ai' ? '1px solid var(--c-border)' : 'none',
                  }}>
                    {m.role === 'ai' ? formatText(m.text) : m.text}
                  </div>
                  {m.role === 'user' && (
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff', flexShrink: 0, marginTop: 2 }}>Siz</div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--c-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>🤖</div>
                  <div style={{ padding: '0.625rem 0.875rem', borderRadius: '4px 16px 16px 16px', background: 'var(--c-bg)', border: '1px solid var(--c-border)', display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0, 150, 300].map(d => (
                      <span key={d} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--c-muted)', display: 'inline-block', animation: 'bounce 1s infinite', animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions mobile */}
            {msgs.length === 1 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '0.75rem 0', paddingTop: '0.75rem', borderTop: '1px solid var(--c-border)' }} className="lg:hidden">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                    style={{ padding: '5px 10px', borderRadius: 999, fontSize: '0.8rem', background: 'var(--c-primary-l)', color: 'var(--c-primary)', border: 'none', cursor: 'pointer' }}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {error && <div className="alert-danger" style={{ margin: '0.5rem 0', fontSize: '0.8rem' }}>⚠️ {error}</div>}

            {/* Input */}
            <div style={{ display: 'flex', gap: 8, marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--c-border)' }}>
              <textarea ref={inputRef} rows={2} className="input" style={{ resize: 'none', flex: 1, borderRadius: 'var(--radius-md)', lineHeight: 1.5 }}
                placeholder="Xabaringizni yozing... (Enter = yuborish, Shift+Enter = yangi qator)"
                value={input} onChange={e => setInput(e.target.value)} maxLength={1000} disabled={loading}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
              <button onClick={send} disabled={loading || !input.trim()} className="btn"
                style={{ flexShrink: 0, padding: '0 1.25rem', alignSelf: 'stretch', borderRadius: 'var(--radius-md)' }}>
                ➤
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--c-muted)', textAlign: 'right', marginTop: 4 }}>{input.length}/1000</p>
          </div>
        </div>
      </div>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }`}</style>
    </div>
  );
}
