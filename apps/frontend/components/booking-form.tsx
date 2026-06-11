'use client';

import { useState } from 'react';

export function BookingForm({ psychologistId, price, name }: { psychologistId: string; price: number; name: string }) {
  const [form, setForm] = useState({ scheduledAt: '', mode: 'online', notes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ psychologistId, scheduledAt: new Date(form.scheduledAt).toISOString(), mode: form.mode, notes: form.notes }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.message); setLoading(false); return; }
      setSuccess('Bron muvaffaqiyatli yaratildi! Tasdiqlanishini kuting.');
    } catch { setError('Xatolik. Tizimga kirgansizmi?'); }
    setLoading(false);
  }

  // min datetime: 1 soatdan keyin
  const minDate = new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 16);

  return (
    <div className="card sticky top-24">
      <h3 className="text-lg font-semibold mb-4">Bron qilish</h3>
      <p className="text-2xl font-bold text-sky-700 mb-4">{price.toLocaleString()} <span className="text-sm font-normal text-slate-500">so'm / seans</span></p>
      {success ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-4 text-sm text-emerald-800 text-center space-y-2">
          <p className="text-xl">✅</p>
          <p className="font-medium">{success}</p>
          <a href="/profil" className="btn-sm inline-block mt-2">Bronlarimga o'tish</a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Sana va vaqt *</label>
            <input type="datetime-local" className="input" value={form.scheduledAt} min={minDate}
              onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Seans turi *</label>
            <select className="input" value={form.mode} onChange={e => setForm(f => ({ ...f, mode: e.target.value }))}>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="chat">Chat</option>
            </select>
          </div>
          <div>
            <label className="label">Izoh (ixtiyoriy)</label>
            <textarea className="input resize-none" rows={3} maxLength={500}
              placeholder="Muammo yoki savolingizni qisqacha yozing..."
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
          <button className="btn w-full" disabled={loading}>{loading ? 'Yuborilmoqda...' : 'Bron qilish'}</button>
        </form>
      )}
    </div>
  );
}
