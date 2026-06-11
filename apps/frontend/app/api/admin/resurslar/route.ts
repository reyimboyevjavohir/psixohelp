import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
async function tok() { return (await cookies()).get('accessToken')?.value; }
export async function GET() {
  const res = await fetch(`${API}/resources`, { cache: 'no-store' });
  return NextResponse.json(await res.json(), { status: res.status });
}
export async function POST(req: NextRequest) {
  const token = await tok(); const body = await req.json();
  const res = await fetch(`${API}/admin/resources`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
  return NextResponse.json(await res.json(), { status: res.status });
}
