import { apiGet } from '@/lib/api';
import Link from 'next/link';

type Test = { id: string; slug: string; title: string; description: string; durationMin: number; questionCount: number; category: { name: string }; isActive: boolean };

export default async function TestlarPage() {
  let tests: Test[] = [];
  try { tests = await apiGet<Test[]>('/tests'); } catch {}

  return (
    <div className="wrap" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="heading-serif" style={{ fontSize: '2rem', marginBottom: 8 }}>🧪 Mental Sog'liq Testlari</h1>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.9rem' }}>PHQ-9, GAD-7, PSS va boshqa klinik standart testlar bilan o'zingizni baholang</p>
      </div>
      <div className="alert-info" style={{ marginBottom: '1.5rem' }}>
        ℹ️ Bu testlar o'z holatingizni tushunishga yordam beradi. Tashxis qo'ymaydi — shuning uchun natijalar haqida psixolog bilan gaplashing.
      </div>
      {tests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧪</div>
          <p style={{ color: 'var(--c-muted)' }}>Hozircha testlar yo'q.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {tests.map(t => (
            <Link key={t.id} href={`/testlar/${t.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-blue">{t.category?.name || 'Test'}</span>
                  <span style={{ fontSize: '1.75rem' }}>🧪</span>
                </div>
                <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.5rem', color: 'var(--c-text)' }}>{t.title}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--c-muted)', lineHeight: 1.6, flex: 1, marginBottom: '1rem' }}>{t.description}</p>
                <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--c-border)', fontSize: '0.8rem', color: 'var(--c-muted)' }}>
                  <span>⏱ {t.durationMin} min</span>
                  <span>📝 {t.questionCount} savol</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
