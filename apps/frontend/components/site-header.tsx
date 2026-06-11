'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const r = document.cookie.split('; ').find(c => c.startsWith('userRole='))?.split('=')[1];
    setRole(r || null);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    document.cookie = 'userRole=; Max-Age=0; path=/';
    setRole(null); setMenuOpen(false);
    router.push('/'); router.refresh();
  }

  const navLinks = [
    { href: '/testlar', label: 'Testlar' },
    { href: '/maslahatlar', label: 'Psixologlar' },
    { href: '/ai-tavsiyalar', label: 'AI Tavsiya' },
    { href: '/kayfiyat', label: 'Kayfiyat' },
    { href: '/kitoblar', label: 'Kitoblar' },
    { href: '/resurslar', label: 'Resurslar' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'rgba(6,9,20,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      transition: 'all .3s',
    }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, borderRadius: 11, background: 'linear-gradient(135deg,#34D399,#60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🧠</div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', fontWeight: 700, color: '#fff', letterSpacing: '-.02em' }}>PsixoHelp</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hidden md:flex">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: '6px 12px', fontSize: '0.875rem', fontWeight: 500, borderRadius: '8px',
              textDecoration: 'none', transition: 'all .15s',
              background: isActive(href) ? 'rgba(52,211,153,0.12)' : 'transparent',
              color: isActive(href) ? '#34D399' : 'rgba(255,255,255,0.55)',
            }}>{label}</Link>
          ))}
          {(role === 'ADMIN' || role === 'SUPERADMIN') && (
            <Link href="/admin" style={{ padding: '6px 12px', fontSize: '0.875rem', fontWeight: 500, borderRadius: '8px', textDecoration: 'none', background: isActive('/admin') ? 'rgba(251,176,36,0.12)' : 'transparent', color: '#FBB024' }}>Admin</Link>
          )}
          {role === 'PSYCHOLOGIST' && (
            <Link href="/psixolog" style={{ padding: '6px 12px', fontSize: '0.875rem', fontWeight: 500, borderRadius: '8px', textDecoration: 'none', background: isActive('/psixolog') ? 'rgba(96,165,250,0.12)' : 'transparent', color: '#60A5FA' }}>Mening Panel</Link>
          )}
          {role === 'SUPERADMIN' && (
            <Link href="/superadmin" style={{ padding: '6px 12px', fontSize: '0.875rem', fontWeight: 500, borderRadius: '8px', textDecoration: 'none', background: isActive('/superadmin') ? 'rgba(167,139,250,0.12)' : 'transparent', color: '#A78BFA' }}>SuperAdmin</Link>
          )}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {role ? (
            <>
              <Link href="/profil" style={{ padding: '6px 14px', fontSize: '0.8125rem', fontWeight: 500, borderRadius: '8px', textDecoration: 'none', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,.8)', border: '1px solid rgba(255,255,255,.1)', transition: 'all .15s' }} className="hidden sm:inline-flex">👤 Profil</Link>
              <button onClick={handleLogout} style={{ padding: '6px 14px', fontSize: '0.8125rem', fontWeight: 500, borderRadius: '8px', background: 'rgba(248,113,113,0.1)', color: '#F87171', border: '1px solid rgba(248,113,113,0.2)', cursor: 'pointer', transition: 'all .15s' }}>Chiqish</button>
            </>
          ) : (
            <>
              <Link href="/kirish" style={{ padding: '6px 14px', fontSize: '0.8125rem', fontWeight: 500, borderRadius: '8px', textDecoration: 'none', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', transition: 'all .15s' }}>Kirish</Link>
              <Link href="/royxatdan-otish" style={{ padding: '7px 16px', fontSize: '0.8125rem', fontWeight: 600, borderRadius: '8px', textDecoration: 'none', background: 'linear-gradient(135deg,#34D399,#60A5FA)', color: '#060914', transition: 'all .2s' }}>Ro'yxat</Link>
            </>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden" style={{ padding: '7px 9px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', lineHeight: 1, fontSize: '1rem' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden" style={{ background: 'rgba(6,9,20,0.98)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{ padding: '10px 12px', borderRadius: '10px', fontWeight: 500, fontSize: '0.9rem', textDecoration: 'none', background: isActive(href) ? 'rgba(52,211,153,0.1)' : 'transparent', color: isActive(href) ? '#34D399' : 'rgba(255,255,255,0.7)' }}>{label}</Link>
          ))}
          {(role === 'ADMIN' || role === 'SUPERADMIN') && (
            <Link href="/admin" onClick={() => setMenuOpen(false)} style={{ padding: '10px 12px', borderRadius: '10px', fontSize: '0.9rem', textDecoration: 'none', color: '#FBB024' }}>Admin Panel</Link>
          )}
          {role === 'PSYCHOLOGIST' && (
            <Link href="/psixolog" onClick={() => setMenuOpen(false)} style={{ padding: '10px 12px', borderRadius: '10px', fontSize: '0.9rem', textDecoration: 'none', color: '#60A5FA' }}>Psixolog Panel</Link>
          )}
          {role && <Link href="/profil" onClick={() => setMenuOpen(false)} style={{ padding: '10px 12px', borderRadius: '10px', fontSize: '0.9rem', textDecoration: 'none', color: 'rgba(255,255,255,0.7)' }}>Profil</Link>}
        </div>
      )}
    </header>
  );
}
