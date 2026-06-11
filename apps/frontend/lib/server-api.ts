import { cookies } from 'next/headers';

export async function getTokenFromCookies(): Promise<string | undefined> {
  const store = await cookies();
  return store.get('accessToken')?.value;
}
