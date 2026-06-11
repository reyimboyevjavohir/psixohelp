'use client';

import { useState } from 'react';
import { Test } from '@/types';

export function TestRunner({ test }: { test: Test }) {
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(test.questions.length).fill(null));
  const [result, setResult] = useState<{ score: number; level: string; summary: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function setAnswer(qi: number, ai: number) {
    setAnswers(prev => { const n = [...prev]; n[qi] = ai; return n; });
  }

  async function handleSubmit() {
    if (answers.some(a => a === null)) { setError('Barcha savollarga javob bering'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/tests/${test.slug}/submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.message || 'Xatolik'); setLoading(false); return; }
      setResult(json.data);
    } catch { setError("Natijani saqlashda xatolik. Tizimga kirgansizmi?"); }
    setLoading(false);
  }

  if (result) {
    return (
      <div className="card max-w-xl mx-auto text-center space-y-4">
        <div className="text-5xl mb-2">🎉</div>
        <h2 className="text-2xl font-bold">Test yakunlandi!</h2>
        <div className="rounded-xl bg-sky-50 border border-sky-200 p-5 space-y-1">
          <p className="text-4xl font-bold text-sky-700">{result.score}</p>
          <p className="text-sm text-slate-500">umumiy ball</p>
          <span className="badge badge-blue text-base mt-2">{result.level}</span>
        </div>
        <p className="text-slate-600">{result.summary}</p>
        <a href="/profil" className="btn inline-block">Natijalarni ko'rish</a>
      </div>
    );
  }

  const answered = answers.filter(a => a !== null).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{answered} / {test.questions.length} javob berildi</span>
        <div className="h-2 w-48 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-2 rounded-full bg-sky-500 transition-all" style={{ width: `${(answered / test.questions.length) * 100}%` }} />
        </div>
      </div>

      {test.questions.map((q, qi) => (
        <div key={q.id} className="card space-y-3">
          <p className="font-semibold">{qi + 1}. {q.text}</p>
          <div className="space-y-2">
            {q.options.map((opt, ai) => (
              <button
                key={ai}
                onClick={() => setAnswer(qi, ai)}
                className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm transition ${answers[qi] === ai ? 'border-sky-500 bg-sky-50 text-sky-800 font-medium' : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      <button onClick={handleSubmit} disabled={loading || answered < test.questions.length} className="btn w-full text-base py-3">
        {loading ? 'Saqlanmoqda...' : answered < test.questions.length ? `${test.questions.length - answered} ta savol qoldi` : 'Natijani ko\'rish'}
      </button>
    </div>
  );
}
