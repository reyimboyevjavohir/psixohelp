'use client'

import Link from 'next/link';
import { NeuralHero } from '@/components/neural-hero';

export default function HomePage() {
  return (
    <div>
      {/* 3D Neural Hero */}
      <NeuralHero />

      {/* Services Grid */}
      <section className="wrap" style={{ paddingBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge badge-green" style={{ margin: '0 auto 1rem', display: 'inline-flex' }}>✦ Xizmatlar</div>
          <h2 className="section-title">Ruhiy salomatlik yo'lingizda</h2>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.9375rem', maxWidth: 480, margin: '0 auto' }}>
            Har bir ehtiyojingiz uchun maxsus vosita
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {[
            { icon: '🤖', title: 'AI Psixologik Tavsiyalar', desc: 'CBT asosida 24/7 yordam. Krizis aniqlash filtri bilan.', href: '/ai-tavsiyalar', color: 'var(--c-primary)', glow: 'rgba(52,211,153,0.15)' },
            { icon: '👨‍⚕️', title: 'Psixolog Seanslar', desc: 'Malakali, sertifikatlangan psixologlar bilan video seanslar.', href: '/maslahatlar', color: 'var(--c-blue)', glow: 'rgba(96,165,250,0.15)' },
            { icon: '📊', title: 'Kayfiyat Kuzatish', desc: 'Kunlik kayfiyat, energiya va tashvish darajangizni kuzating.', href: '/kayfiyat', color: 'var(--c-purple)', glow: 'rgba(167,139,250,0.15)' },
            { icon: '🧪', title: 'Mental Testlar', desc: 'PHQ-9, GAD-7, PSS standart testlari — holatingizni baholang.', href: '/testlar', color: 'var(--c-teal)', glow: 'rgba(20,184,166,0.15)' },
            { icon: '📚', title: 'Kitoblar', desc: "Psixologik adabiyotlar va qo'llanmalar to'plami.", href: '/kitoblar', color: 'var(--c-yellow)', glow: 'rgba(251,176,36,0.15)' },
            { icon: '🎯', title: 'Resurslar', desc: 'Video darslar, maqolalar va amaliy mashqlar.', href: '/resurslar', color: 'var(--c-pink)', glow: 'rgba(236,72,153,0.15)' },
          ].map(({ icon, title, desc, href, color, glow }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '20px',
                padding: '1.5rem', height: '100%', transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'perspective(800px) rotateY(-3deg) translateY(-6px)';
                el.style.borderColor = color;
                el.style.boxShadow = `0 20px 40px ${glow}, 0 0 0 1px ${color}22`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = '';
                el.style.borderColor = '';
                el.style.boxShadow = '';
              }}>
                <div style={{ width: 48, height: 48, borderRadius: '14px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem', border: `1px solid ${color}25` }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--c-text)', fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--c-muted)', lineHeight: 1.7 }}>{desc}</p>
                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', color: color, fontSize: '0.75rem', fontWeight: 600, opacity: 0.6 }}>→</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="wrap" style={{ paddingBottom: '5rem' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.06) 0%, rgba(96,165,250,0.06) 50%, rgba(167,139,250,0.06) 100%)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '28px', padding: 'clamp(2rem,5vw,3rem)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {[
            { n: '24/7', label: 'AI yordam', color: 'var(--c-primary)' },
            { n: '15+', label: 'Psixolog', color: 'var(--c-blue)' },
            { n: '100%', label: 'Maxfiylik', color: 'var(--c-purple)' },
            { n: '3 til', label: "O'zbek · Rus · Ingliz", color: 'var(--c-yellow)' },
          ].map(({ n, label, color }) => (
            <div key={label}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, background: `linear-gradient(135deg, ${color}, ${color}aa)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 4 }}>{n}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--c-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="wrap" style={{ paddingBottom: '6rem' }}>
        <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '28px', padding: 'clamp(2rem,5vw,3rem)' }}>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Nega aynan biz?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {[
              { icon: '🔒', title: "To'liq maxfiylik", desc: "Barcha ma'lumotlar shifrlangan.", color: 'var(--c-primary)' },
              { icon: '🇺🇿', title: 'Ona tilida', desc: "O'zbek tilida qurilgan mahalliy platforma.", color: 'var(--c-blue)' },
              { icon: '✅', title: 'Tekshirilgan', desc: 'Barcha psixologlar sertifikat orqali tasdiqlanadi.', color: 'var(--c-purple)' },
              { icon: '💰', title: 'Arzon narx', desc: 'Dastlabki AI tavsiyalar bepul.', color: 'var(--c-yellow)' },
            ].map(({ icon, title, desc, color }) => (
              <div key={title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 42, height: 42, borderRadius: '12px', background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{icon}</div>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.9375rem', fontFamily: "'Space Grotesk', sans-serif" }}>{title}</p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--c-muted)', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
