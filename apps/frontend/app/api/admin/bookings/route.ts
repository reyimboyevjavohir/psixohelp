import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getToken() {
  return (await cookies()).get('accessToken')?.value;
}

export async function GET(_req: NextRequest) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/admin/bookings`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}
