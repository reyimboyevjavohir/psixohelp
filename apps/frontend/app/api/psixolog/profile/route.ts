import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export async function GET() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ success: false }, { status: 401 });
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/psixolog/profile`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  return NextResponse.json(await res.json(), { status: res.status });
}
