'use client';
import { useEffect, useState } from 'react';

type User = { id: string; fullName: string; email: string; username: string; role: string; isActive: boolean; createdAt: string };

export default function AdminlarPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch('/api/superadmin/foydalanuvchilar');
    const j = await res.json();
    if (j.success) setUsers(j.data.filter((u: User) => u.role === 'ADMIN' || u.role === 'SUPERADMIN'));
    setLoading(false);
  }

  async function promoteToAdmin(id: string) {
    setBusy(id);
    await fetch(`/api/superadmin/foydalanuvchilar/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: 'ADMIN' }) });
    await fetchUsers(); setBusy(null); setMsg('Admin rolga o\'zgartirildi ✓');
  }

  async function demoteToUser(id: string) {
    setBusy(id);
    await fetch(`/api/superadmin/foydalanuvchilar/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: 'USER' }) });
    await fetchUsers(); setBusy(null); setMsg('Oddiy foydalanuvchiga tushirildi');
  }

  async function toggleActive(id: string) {
    setBusy(id);
    await fetch(`/api/superadmin/foydalanuvchilar/${id}/toggle`, { method: 'PATCH' });
    await fetchUsers(); setBusy(null);
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}><div className="spinner" /></div>;

  return (
    <div className="wrap" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2rem' }}>
        <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🛡️</div>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 800 }}>Admin Boshqaruvi</h1>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem' }}>Adminlarni qo'shish va o'chirish</p>
        </div>
      </div>

      {msg && <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px', padding: '10px 16px', marginBottom: '1.5rem', color: '#34D399', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>{msg}<button onClick={() => setMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button></div>}

      {users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--c-muted)' }}>Hozircha adminlar yo'q</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ism</th><th>Email</th><th>Rol</th><th>Holat</th><th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)' }}>@{u.username}</div>
                  </td>
                  <td style={{ color: 'var(--c-muted)' }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'SUPERADMIN' ? 'badge-purple' : 'badge-yellow'}`}>{u.role === 'SUPERADMIN' ? '👑 SuperAdmin' : '⚙️ Admin'}</span>
                  </td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Faol' : 'Bloklangan'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {u.role === 'ADMIN' && (
                        <button onClick={() => demoteToUser(u.id)} disabled={busy === u.id} style={{ padding: '5px 10px', borderRadius: '8px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#F87171', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                          Rolni olish
                        </button>
                      )}
                      <button onClick={() => toggleActive(u.id)} disabled={busy === u.id} style={{ padding: '5px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--c-border)', color: 'var(--c-muted)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                        {u.isActive ? 'Bloklash' : 'Faollashtirish'}
                      </button>
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
