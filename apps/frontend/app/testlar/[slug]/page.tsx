import { apiGet } from '@/lib/api';
import { TestRunner } from './test-runner';

type Test = { id: string; slug: string; title: string; description: string; durationMin: number; questionCount: number; instructions: string; questions: Question[] };
type Question = { id: string; text: string; options: { value: number; label: string }[] };

export default async function TestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let test: Test | null = null;
  try { test = await apiGet<Test>(`/tests/${slug}`); } catch {}

  if (!test) return (
    <div className="wrap" style={{ paddingTop: '4rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--c-muted)' }}>Test topilmadi.</p>
      <a href="/testlar" className="btn" style={{ display: 'inline-flex', marginTop: '1rem' }}>Orqaga</a>
    </div>
  );

  return (
    <div className="wrap-sm" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <TestRunner test={test} />
    </div>
  );
}
