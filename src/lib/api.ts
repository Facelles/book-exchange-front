import { useAuthStore } from '@/store/useAuthStore';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');

type FetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { auth = false, ...rest } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(rest.headers as Record<string, string>),
  };

  if (auth) {
    const token = useAuthStore.getState().token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody?.message ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
