import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ success: false }, { status: 401 });
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/psixolog/advices/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  return NextResponse.json(await res.json(), { status: res.status });
}
