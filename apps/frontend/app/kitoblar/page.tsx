'use client'

import { apiGet } from '@/lib/api';
import Link from 'next/link';

type Book = { id: string; title: string; author: string; description: string; coverUrl?: string; downloadUrl?: string; slug: string };

export default async function KitoblarPage() {
  let books: Book[] = [];
  try { books = await apiGet<Book[]>('/books'); } catch {}

  return (
    <div className="wrap" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          <span style={{ background: 'linear-gradient(135deg,#EC4899,#FBB024)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Kitoblar</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.9375rem' }}>Psixologik adabiyotlar va qo'llanmalar to'plami</p>
      </div>

      {books.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--c-muted)', background: 'var(--c-surface)', borderRadius: '20px', border: '1px solid var(--c-border)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📚</div>
          <p>Kitoblar tez orada qo'shiladi</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '1.25rem' }}>
          {books.map(b => (
            <div key={b.id} style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '20px', overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.borderColor = '#EC4899'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(236,72,153,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.borderColor = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
              {b.coverUrl ? (
                <img src={b.coverUrl} alt={b.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '160px', background: 'linear-gradient(135deg,rgba(236,72,153,0.1),rgba(251,176,36,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📚</div>
              )}
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: 4, lineHeight: 1.4 }}>{b.title}</h3>
                <p style={{ fontSize: '0.8rem', color: '#EC4899', fontWeight: 600, marginBottom: 8 }}>{b.author}</p>
                <p style={{ fontSize: '0.775rem', color: 'var(--c-muted)', lineHeight: 1.6, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{b.description}</p>
                {b.downloadUrl && (
                  <a href={b.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', borderRadius: '10px', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', color: '#EC4899', fontWeight: 600, fontSize: '0.8125rem', textDecoration: 'none' }}>
                    ⬇️ Yuklab olish
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
