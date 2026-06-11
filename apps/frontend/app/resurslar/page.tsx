import { apiGet } from '@/lib/api';
import Link from 'next/link';

type Resource = { id: string; slug: string; title: string; type: string; description: string; thumbnailUrl?: string; category: { name: string } };
const TYPE_ICONS: Record<string, string> = { BOOK: '📕', ARTICLE: '📄', VIDEO: '🎬', GUIDE: '📋' };

export default async function ResurslarPage() {
  let resources: Resource[] = [];
  try { resources = await apiGet<Resource[]>('/resources'); } catch {}
  return (
    <div className="wrap" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="heading-serif" style={{ fontSize: '2rem', marginBottom: 8 }}>🎯 Resurslar</h1>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.9rem' }}>Video darslar, maqolalar va amaliy psixologik qo'llanmalar</p>
      </div>
      {resources.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
          <p style={{ color: 'var(--c-muted)' }}>Hozircha resurslar yo'q.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {resources.map(r => (
            <Link key={r.id} href={`/resurslar/${r.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-orange" style={{ fontSize: '0.72rem' }}>{r.category?.name}</span>
                  <span style={{ fontSize: '1.5rem' }}>{TYPE_ICONS[r.type] || '📄'}</span>
                </div>
                <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.5rem', color: 'var(--c-text)', flex: 1 }}>{r.title}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--c-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>{r.description.slice(0, 100)}{r.description.length > 100 ? '...' : ''}</p>
                <span className="badge badge-gray" style={{ width: 'fit-content' }}>
                  {r.type === 'VIDEO' ? '🎬 Video' : r.type === 'ARTICLE' ? '📄 Maqola' : r.type === 'GUIDE' ? "📋 Qo'llanma" : '📕 Kitob'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
