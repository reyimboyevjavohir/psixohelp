const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { headers, cache: 'no-store' });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'API error');
  return json.data as T;
}
