const BASE_URL = '/api';

const RETRY_STATUSES = new Set([503, 504]);
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function request<T>(path: string, options: RequestInit = {}, attempt = 0): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    // network error — machine likely cold-starting
    if (attempt < MAX_RETRIES) {
      await sleep(RETRY_DELAY_MS);
      return request<T>(path, options, attempt + 1);
    }
    throw new Error('서버에 연결할 수 없습니다');
  }

  if (RETRY_STATUSES.has(res.status) && attempt < MAX_RETRIES) {
    await sleep(RETRY_DELAY_MS);
    return request<T>(path, options, attempt + 1);
  }

  if (res.status === 204) return undefined as T;

  const body = await res.json();

  if (res.status === 401) {
    if (!path.startsWith('/auth/')) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    throw new Error(body.error ?? 'unauthorized');
  }

  if (!res.ok) throw new Error(body.error ?? 'request failed');
  return body;
}

export const api = {
  auth: {
    register: (email: string, password: string) =>
      request<{ token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    login: (email: string, password: string) =>
      request<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },
  items: {
    list: () => request<{ data: unknown[] }>('/items'),
    create: (body: object) =>
      request<{ data: unknown }>('/items', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: object) =>
      request<{ data: unknown }>(`/items/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => request<void>(`/items/${id}`, { method: 'DELETE' }),
  },
};