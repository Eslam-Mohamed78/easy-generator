const BASE = import.meta.env.VITE_API_URL ?? '/api';

export interface AuthResponse {
  accessToken: string;
  user: { id: string; email: string; name: string };
}

export class ApiError extends Error {
  constructor(
    message: string | string[],
    public status: number,
  ) {
    super(Array.isArray(message) ? message.join('\n') : message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const body = await res.json().catch(() => ({ message: 'Unexpected error' }));
  if (!res.ok) {
    throw new ApiError(body.message ?? 'Request failed', res.status);
  }
  return body as T;
}

export const api = {
  signup: (data: { email: string; name: string; password: string }) =>
    request<AuthResponse>('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  signin: (data: { email: string; password: string }) =>
    request<AuthResponse>('/auth/signin', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request<{ id: string; email: string; name: string }>('/me'),
};
