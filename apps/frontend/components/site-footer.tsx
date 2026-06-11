'use client'

import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer style={{ background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)', marginTop: 'auto' }}>
      <div className="wrap" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.875rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#34D399,#60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🧠</div>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem' }}>PsixoHelp</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--c-muted)', lineHeight: 1.7, maxWidth: 220 }}>
              O'zbekistondagi #1 onlayn psixologik yordam platformasi.
            </p>
          </div>
          {[
            { title: 'Xizmatlar', links: [{ href: '/ai-tavsiyalar', l: 'AI Tavsiyalar' }, { href: '/maslahatlar', l: 'Psixologlar' }, { href: '/testlar', l: 'Mental Testlar' }, { href: '/kayfiyat', l: 'Kayfiyat Kuzatish' }] },
            { title: 'Resurslar', links: [{ href: '/kitoblar', l: 'Kitoblar' }, { href: '/resurslar', l: 'Resurslar' }, { href: '/haqida', l: 'Biz haqimizda' }] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 style={{ fontWeight: 700, fontSize: '0.8125rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--c-muted)', marginBottom: '1rem' }}>{title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {links.map(({ href, l }) => (
                  <Link key={href} href={href} style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color .15s' }}
                    onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = '#34D399')}
                    onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)')}>
                    {l}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--c-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--c-muted)' }}>© 2025 PsixoHelp. Barcha huquqlar himoyalangan.</p>
          <div style={{ display: 'flex', gap: 12 }}>
            {['🔒 Maxfiylik', '📋 Shartlar'].map(t => (
              <span key={t} style={{ fontSize: '0.8125rem', color: 'var(--c-muted)', cursor: 'pointer' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
