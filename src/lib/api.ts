const TOKEN_KEY = 'treasureHuntToken';

export interface AuthUser {
  id: number;
  username: string;
}

export interface Stats {
  username: string;
  wins: number;
  ties: number;
  losses: number;
  roundsPlayed: number;
  bestScore: number;
  totalScore: number;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Request failed');
  return body as T;
}

export const register = (username: string, password: string) =>
  request<{ token: string; user: AuthUser }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const login = (username: string, password: string) =>
  request<{ token: string; user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const getMyStats = () => request<Stats>('/api/stats/me');

export const submitRoundResult = (score: number) =>
  request<Stats>('/api/stats/submit', {
    method: 'POST',
    body: JSON.stringify({ score }),
  });
