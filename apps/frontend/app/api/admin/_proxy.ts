import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getToken() {
  return (await cookies()).get('accessToken')?.value;
}

// ─── Psixologlar ─────────────────────────────────────────────────────────────
export async function psixologlarGET() {
  const token = await getToken();
  const res = await fetch(`${API_URL}/psychologists`, { cache: 'no-store' });
  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}

export async function psixologlarPOST(req: NextRequest) {
  const token = await getToken();
  const body = await req.json();
  const res = await fetch(`${API_URL}/admin/psychologists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}

export async function psixologlarPATCH(req: NextRequest, id: string) {
  const token = await getToken();
  const body = await req.json();
  const res = await fetch(`${API_URL}/admin/psychologists/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}

export async function psixologlarDELETE(_req: NextRequest, id: string) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/admin/psychologists/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}

// ─── Superadmin users ─────────────────────────────────────────────────────────
export async function usersGET() {
  const token = await getToken();
  const res = await fetch(`${API_URL}/superadmin/users`, {
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
  });
  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}

export async function userRolePATCH(req: NextRequest, id: string) {
  const token = await getToken();
  const body = await req.json();
  const res = await fetch(`${API_URL}/superadmin/users/${id}/role`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}

export async function userTogglePATCH(_req: NextRequest, id: string) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/superadmin/users/${id}/toggle-active`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: '{}',
  });
  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}
