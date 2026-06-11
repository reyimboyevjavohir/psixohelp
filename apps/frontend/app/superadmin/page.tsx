
import Link from 'next/link';
import { getTokenFromCookies, apiGet } from '@/lib/api';
import { redirect } from 'next/navigation';

export default async function SuperAdminPage() {
  const token = await getTokenFromCookies();
  if (!token) redirect('/kirish');

  let stats: any = null;
  try { stats = await apiGet<any>('/admin/dashboard', token); } catch { redirect('/'); }

  return (
    <div className="wrap" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2.5rem' }}>
        <div style={{ width: 52, height: 52, borderRadius: '16px', background: 'linear-gradient(135deg,rgba(167,139,250,0.15),rgba(167,139,250,0.05))', border: '1px solid rgba(167,139,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👑</div>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>SuperAdmin Panel</h1>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem', marginTop: 2 }}>Platforma ustidan to'liq nazorat</p>
        </div>
      </div>

      {/* Overview stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { n: stats?.totalUsers ?? '—', l: 'Foydalanuvchi', c: '#60A5FA' },
          { n: stats?.totalPsychologists ?? '—', l: 'Psixolog', c: '#34D399' },
          { n: stats?.totalBookings ?? '—', l: 'Jami bron', c: '#FBB024' },
          { n: stats?.pendingBookings ?? '—', l: 'Kutilayotgan', c: '#F87171' },
        ].map(({ n, l, c }) => (
          <div key={l} style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '16px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '2rem', fontWeight: 800, color: c }}>{n}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)', marginTop: 3 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Superadmin sections */}
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
        {[
          { href: '/superadmin/foydalanuvchilar', icon: '👥', title: 'Foydalanuvchilar', desc: 'Rol, blok va parolni boshqarish', color: '#60A5FA' },
          { href: '/superadmin/adminlar', icon: '🛡️', title: 'Admin Boshqaruvi', desc: "Adminlarni qo'shish va o'chirish", color: '#A78BFA' },
          { href: '/admin', icon: '🛠️', title: 'Admin Panel', desc: 'Kontent va bronlarni boshqarish', color: '#FBB024' },
          { href: '/superadmin/statistika', icon: '📈', title: 'Statistika', desc: "Sayt bo'yicha to'liq hisobotlar", color: '#34D399' },
        ].map(({ href, icon, title, desc, color }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '20px', padding: '1.5rem', transition: 'all 0.3s', cursor: 'pointer' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = color; el.style.boxShadow = `0 0 30px ${color}22`; el.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = ''; el.style.boxShadow = ''; el.style.transform = ''; }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.875rem' }}>{icon}</div>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem' }}>{title}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--c-muted)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
