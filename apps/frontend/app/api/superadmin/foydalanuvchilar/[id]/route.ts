import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
async function tok() { return (await cookies()).get('accessToken')?.value; }

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await tok();
  const { id } = await params;
  const body = await req.json();
  const url = body.action === 'toggle'
    ? `${API}/superadmin/users/${id}/toggle-active`
    : body.action === 'role'
      ? `${API}/superadmin/users/${id}/role`
      : `${API}/superadmin/users/${id}/reset-password`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  return NextResponse.json(await res.json(), { status: res.status });
}
