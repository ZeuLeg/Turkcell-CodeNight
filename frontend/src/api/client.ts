// Vite proxy routes /api/* → http://localhost:3000/api/*
// In production, set VITE_API_URL to the actual backend URL
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BASE_URL: string = (import.meta as any).env?.VITE_API_URL || '';

let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

function drainQueue(token: string) {
  pendingQueue.forEach(cb => cb(token));
  pendingQueue = [];
}

async function tryRefresh(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json() as { token: string; refreshToken: string };
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.token;
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && !path.includes('/auth/')) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push(async (newToken) => {
          try {
            resolve(await request<T>(path, {
              ...options,
              headers: { ...(options.headers as Record<string, string> ?? {}), Authorization: `Bearer ${newToken}` },
            }));
          } catch (e) { reject(e); }
        });
      });
    }

    isRefreshing = true;
    const newToken = await tryRefresh();
    isRefreshing = false;

    if (newToken) {
      drainQueue(newToken);
      return request<T>(path, options);
    }

    // Refresh failed — clear session
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
    throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
};
