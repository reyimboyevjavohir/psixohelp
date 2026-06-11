import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get('accessToken')?.value;
  const { id } = await params;
  const body = await req.json();
  const res = await fetch(`${API_URL}/admin/bookings/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}
