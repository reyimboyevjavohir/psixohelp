import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function POST(req: NextRequest, { params }: { params: Promise<{ mode: string }> }) {
  const { mode } = await params;
  const body = await req.json();

  const res = await fetch(`${API_URL}/auth/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) return NextResponse.json(json, { status: res.status });

  const cookieStore = await cookies();

  if (mode === 'login' && json.data?.accessToken) {
    cookieStore.set('token', json.data.accessToken, {
      httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set('accessToken', json.data.accessToken, {
      httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set('refreshToken', json.data.refreshToken || '', {
      httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
    });
    cookieStore.set('userRole', json.data.user?.role || 'USER', {
      httpOnly: false, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
    });
  }

  if (mode === 'logout') {
    cookieStore.delete('accessToken');
    cookieStore.delete('token');
    cookieStore.delete('refreshToken');
    cookieStore.delete('userRole');
  }

  if (mode === 'register' && json.data?.accessToken) {
    cookieStore.set('token', json.data.accessToken, {
      httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set('accessToken', json.data.accessToken, {
      httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set('userRole', json.data.user?.role || 'USER', {
      httpOnly: false, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
    });
  }

  return NextResponse.json(json);
}
