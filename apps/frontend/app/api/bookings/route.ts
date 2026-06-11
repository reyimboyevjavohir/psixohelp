import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
export async function POST(req: NextRequest) {
  const token = (await cookies()).get('accessToken')?.value;
  if (!token) return NextResponse.json({ success: false, message: 'Avval tizimga kiring' }, { status: 401 });
  const body = await req.json();
  const res = await fetch(`${API}/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
  return NextResponse.json(await res.json(), { status: res.status });
}
