const BASE_URL = '/api';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

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