import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export async function PATCH(req: NextRequest) {
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ success: false }, { status: 401 });
  const body = await req.json();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/psixolog/schedule`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
  return NextResponse.json(await res.json(), { status: res.status });
}
