'use client';
import { useEffect, useState } from 'react';

type User = { id: string; fullName: string; email: string; username: string; role: string; isActive: boolean; createdAt: string };

const ROLES = ['USER', 'PSYCHOLOGIST', 'ADMIN', 'SUPERADMIN'];
const roleColors: Record<string, string> = { USER: 'badge-blue', PSYCHOLOGIST: 'badge-green', ADMIN: 'badge-yellow', SUPERADMIN: 'badge-purple' };
const roleLabels: Record<string, string> = { USER: '👤 User', PSYCHOLOGIST: '👨‍⚕️ Psixolog', ADMIN: '⚙️ Admin', SUPERADMIN: '👑 SuperAdmin' };

export default function FoydalanuvchilarPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [msg, setMsg] = useState('');
  const [editingRole, setEditingRole] = useState<string | null>(null);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch('/api/superadmin/foydalanuvchilar');
    const j = await res.json();
    if (j.success) setUsers(j.data);
    setLoading(false);
  }

  async function setRole(id: string, role: string) {
    setBusy(id);
    await fetch(`/api/superadmin/foydalanuvchilar/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'role', role }),
    });
    await fetchUsers(); setBusy(null); setEditingRole(null);
    setMsg(`Rol ${roleLabels[role]} ga o'zgartirildi ✓`);
  }

  async function toggle(id: string) {
    setBusy(id);
    await fetch(`/api/superadmin/foydalanuvchilar/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'toggle' }) });
    await fetchUsers(); setBusy(null);
  }

  const filtered = users.filter(u => {
    const s = search.toLowerCase();
    const matchSearch = !s || u.fullName.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.username.toLowerCase().includes(s);
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}><div className="spinner" /></div>;

  return (
    <div className="wrap" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2rem' }}>
        <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👥</div>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 800 }}>Foydalanuvchilar</h1>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem' }}>{users.length} ta foydalanuvchi</p>
        </div>
      </div>

      {msg && <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px', padding: '10px 16px', marginBottom: '1.5rem', color: '#34D399', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>{msg}<button onClick={() => setMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button></div>}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input className="input" style={{ maxWidth: 280 }} placeholder="🔍 Qidirish..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input" style={{ maxWidth: 180 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="ALL">Barcha rollar</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { r: 'USER', c: '#60A5FA' }, { r: 'PSYCHOLOGIST', c: '#34D399' }, { r: 'ADMIN', c: '#FBB024' }, { r: 'SUPERADMIN', c: '#A78BFA' },
        ].map(({ r, c }) => (
          <div key={r} style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '12px', padding: '8px 14px', fontSize: '0.8125rem' }}>
            <span style={{ color: c, fontWeight: 700 }}>{users.filter(u => u.role === r).length}</span>
            <span style={{ color: 'var(--c-muted)', marginLeft: 6 }}>{r}</span>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Foydalanuvchi</th><th>Email</th><th>Rol</th><th>Holat</th><th>Sana</th><th>Amallar</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)' }}>@{u.username}</div>
                </td>
                <td style={{ color: 'var(--c-muted)', fontSize: '0.8125rem' }}>{u.email}</td>
                <td>
                  {editingRole === u.id ? (
                    <select value={u.role} onChange={e => setRole(u.id, e.target.value)} style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '8px', color: 'var(--c-text)', padding: '4px 8px', fontSize: '0.8125rem', cursor: 'pointer' }}>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  ) : (
                    <span className={`badge ${roleColors[u.role]}`}>{roleLabels[u.role]}</span>
                  )}
                </td>
                <td><span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Faol' : 'Bloklangan'}</span></td>
                <td style={{ color: 'var(--c-muted)', fontSize: '0.75rem' }}>{new Date(u.createdAt).toLocaleDateString('uz-UZ')}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setEditingRole(editingRole === u.id ? null : u.id)} disabled={busy === u.id} style={{ padding: '5px 10px', borderRadius: '8px', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', color: '#A78BFA', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                      {editingRole === u.id ? 'Yopish' : 'Rol'}
                    </button>
                    <button onClick={() => toggle(u.id)} disabled={busy === u.id} style={{ padding: '5px 10px', borderRadius: '8px', background: u.isActive ? 'rgba(248,113,113,0.1)' : 'rgba(52,211,153,0.1)', border: `1px solid ${u.isActive ? 'rgba(248,113,113,0.2)' : 'rgba(52,211,153,0.2)'}`, color: u.isActive ? '#F87171' : '#34D399', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                      {u.isActive ? 'Bloklash' : 'Faol'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
