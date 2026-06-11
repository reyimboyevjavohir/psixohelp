import { apiGet } from '@/lib/api';
import { BookingFormWrapper } from './booking-form-wrapper';

type Psychologist = {
  id: string; slug: string; fullName: string; specialty: string; bio: string;
  experienceYears: number; rating: number; reviewsCount: number; price: number;
  avatarUrl?: string; languages: string[]; specializations: string[]; availability: Record<string,string[]>;
  approaches?: string[]; isVerified: boolean;
};

export default async function PsixologPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let p: Psychologist | null = null;
  try { p = await apiGet<Psychologist>(`/psychologists/${slug}`); } catch {}

  if (!p) return (
    <div className="wrap" style={{ paddingTop: '4rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--c-muted)' }}>Psixolog topilmadi.</p>
      <a href="/maslahatlar" className="btn" style={{ display: 'inline-flex', marginTop: '1rem' }}>Orqaga</a>
    </div>
  );

  return (
    <div className="wrap" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="lg:grid-cols-[1fr_380px]">
        {/* Left: Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ width: 88, height: 88, borderRadius: 'var(--radius-lg)', background: 'var(--c-primary-l)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', flexShrink: 0, overflow: 'hidden' }}>
                {p.avatarUrl ? <img src={p.avatarUrl} alt={p.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👨‍⚕️'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h1 style={{ fontWeight: 700, fontSize: '1.25rem' }}>{p.fullName}</h1>
                  {p.isVerified && <span className="badge badge-green">✓ Tasdiqlangan</span>}
                </div>
                <p style={{ color: 'var(--c-muted)', fontSize: '0.9rem', marginBottom: 8 }}>{p.specialty}</p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8125rem' }}>
                  <span>⭐ {p.rating.toFixed(1)} ({p.reviewsCount})</span>
                  <span>📅 {p.experienceYears} yil tajriba</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.75rem' }}>Bio</h2>
            <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem', lineHeight: 1.75 }}>{p.bio}</p>
          </div>

          <div className="card">
            <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.875rem' }}>Mutaxassisliklar</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {p.specializations.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
            </div>
          </div>

          {p.approaches && p.approaches.length > 0 && (
            <div className="card">
              <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.875rem' }}>Yondashuvlar</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {p.approaches.map(a => <span key={a} className="badge badge-blue">{a}</span>)}
              </div>
            </div>
          )}

          <div className="card">
            <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.875rem' }}>Tillar</h2>
            <div style={{ display: 'flex', gap: 6 }}>
              {p.languages.map(l => <span key={l} className="badge badge-gray">🗣 {l}</span>)}
            </div>
          </div>
        </div>

        {/* Right: Booking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ position: 'sticky', top: '70px' }}>
            <div style={{ textAlign: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--c-border)', marginBottom: '1rem' }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: 'var(--c-primary)' }}>
                {p.price.toLocaleString()} so'm
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--c-muted)' }}>bir seans uchun</p>
            </div>
            <BookingFormWrapper psychologistId={p.id} psychologistName={p.fullName} availability={p.availability} />
          </div>
        </div>
      </div>
    </div>
  );
}
