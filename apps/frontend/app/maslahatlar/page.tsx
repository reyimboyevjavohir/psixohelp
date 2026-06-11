import { apiGet } from '@/lib/api';
import Link from 'next/link';

type Psychologist = {
  id: string; slug: string; fullName: string; specialty: string; bio: string;
  experienceYears: number; rating: number; reviewsCount: number; price: number;
  avatarUrl?: string; languages: string[]; specializations: string[]; isVerified: boolean;
};

export default async function MaslahatlarPage() {
  let psychologists: Psychologist[] = [];
  try { psychologists = await apiGet<Psychologist[]>('/psychologists'); } catch {}

  return (
    <div className="wrap" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="heading-serif" style={{ fontSize: '2rem', marginBottom: 8 }}>👨‍⚕️ Psixologlar</h1>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.9rem' }}>Malakali, sertifikatlangan psixologlar bilan seans band qiling</p>
      </div>

      {psychologists.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍⚕️</div>
          <p style={{ color: 'var(--c-muted)', marginBottom: '1rem' }}>Hozircha psixologlar yo'q.</p>
          <Link href="/ai-tavsiyalar" className="btn">🤖 AI bilan gaplashing</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {psychologists.map(p => (
            <Link key={p.id} href={`/maslahatlar/${p.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.875rem' }}>
                  <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-md)', background: 'var(--c-primary-l)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0, overflow: 'hidden' }}>
                    {p.avatarUrl ? <img src={p.avatarUrl} alt={p.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👨‍⚕️'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, flexWrap: 'wrap' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--c-text)' }}>{p.fullName}</p>
                      {p.isVerified && <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>✓ Tasdiqlangan</span>}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--c-muted)', marginTop: 2 }}>{p.specialty}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <span style={{ fontSize: '0.8rem', color: '#F59E0B' }}>★</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{p.rating.toFixed(1)}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--c-muted)' }}>({p.reviewsCount} sharh)</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--c-muted)', lineHeight: 1.6, flex: 1, marginBottom: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {p.bio}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: '0.875rem' }}>
                  {p.specializations.slice(0, 3).map(s => <span key={s} className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{s}</span>)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.875rem', borderTop: '1px solid var(--c-border)' }}>
                  <div>
                    <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.125rem', color: 'var(--c-primary)' }}>
                      {p.price.toLocaleString()} so'm
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--c-muted)' }}>/seans</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--c-muted)' }}>{p.experienceYears} yil tajriba</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
