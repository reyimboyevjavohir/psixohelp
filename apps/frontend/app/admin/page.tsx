'use client'

import { apiGet, getTokenFromCookies } from '@/lib/api';
import { redirect } from 'next/navigation';
import Link from 'next/link';

type Dashboard = { totalUsers: number; totalPsychologists: number; totalBookings: number; pendingBookings: number; totalTests: number; totalBooks: number; totalResources: number };

export default async function AdminPage() {
  const token = await getTokenFromCookies();
  if (!token) redirect('/kirish');

  let stats: Dashboard | null = null;
  try { stats = await apiGet<Dashboard>('/admin/dashboard', token); } catch { redirect('/'); }

  const cards = [
    { label: 'Foydalanuvchilar', value: stats?.totalUsers ?? 0, icon: '👥', href: '/superadmin/foydalanuvchilar', color: '#60A5FA', glow: 'rgba(96,165,250,0.2)' },
    { label: 'Psixologlar', value: stats?.totalPsychologists ?? 0, icon: '👨‍⚕️', href: '/admin/psixologlar', color: '#34D399', glow: 'rgba(52,211,153,0.2)' },
    { label: 'Bronlar', value: stats?.totalBookings ?? 0, icon: '📅', href: '/admin/bronlar', color: '#FBB024', glow: 'rgba(251,176,36,0.2)' },
    { label: 'Kutilayotgan', value: stats?.pendingBookings ?? 0, icon: '⏳', href: '/admin/bronlar', color: '#F87171', glow: 'rgba(248,113,113,0.2)' },
    { label: 'Testlar', value: stats?.totalTests ?? 0, icon: '🧪', href: '/admin/testlar', color: '#A78BFA', glow: 'rgba(167,139,250,0.2)' },
    { label: 'Kitoblar', value: stats?.totalBooks ?? 0, icon: '📚', href: '/admin/kitoblar', color: '#EC4899', glow: 'rgba(236,72,153,0.2)' },
    { label: 'Resurslar', value: stats?.totalResources ?? 0, icon: '🎯', href: '/admin/resurslar', color: '#14B8A6', glow: 'rgba(20,184,166,0.2)' },
  ];

  const actions = [
    { href: '/admin/psixologlar', label: "Psixologlar boshqaruvi", icon: '👨‍⚕️', color: '#34D399' },
    { href: '/admin/bronlar', label: 'Bronlar boshqaruvi', icon: '📅', color: '#FBB024' },
    { href: '/admin/testlar', label: 'Testlar boshqaruvi', icon: '🧪', color: '#A78BFA' },
    { href: '/admin/kitoblar', label: 'Kitoblar boshqaruvi', icon: '📚', color: '#EC4899' },
    { href: '/admin/resurslar', label: 'Resurslar boshqaruvi', icon: '🎯', color: '#14B8A6' },
  ];

  return (
    <div className="wrap" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2.5rem' }}>
        <div style={{ width: 52, height: 52, borderRadius: '16px', background: 'linear-gradient(135deg,rgba(251,176,36,0.15),rgba(251,176,36,0.05))', border: '1px solid rgba(251,176,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>⚙️</div>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Admin Panel</h1>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem', marginTop: 2 }}>Platforma kontent va bronlarini boshqaring</p>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map(({ label, value, icon, href, color, glow }) => (
          <Link key={href + label} href={href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '18px', padding: '1.25rem', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = color; el.style.boxShadow = `0 0 30px ${glow}`; el.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = ''; el.style.boxShadow = ''; el.style.transform = ''; }}>
              <div style={{ fontSize: '1.75rem', marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '2rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)', marginTop: 4 }}>{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
        {actions.map(({ href, label, icon, color }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '14px', fontWeight: 600, fontSize: '0.875rem', color: 'var(--c-text)', transition: 'all .2s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = color; el.style.background = `${color}0a`; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = ''; el.style.background = 'var(--c-surface)'; }}>
            <span style={{ fontSize: '1.1rem' }}>{icon}</span> {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
