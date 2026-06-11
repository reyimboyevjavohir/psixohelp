import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = (await cookies()).get('accessToken')?.value;
  const body = await req.json();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}/tests/${slug}/submit`, { method: 'POST', headers, body: JSON.stringify(body) });
  return NextResponse.json(await res.json(), { status: res.status });
}
