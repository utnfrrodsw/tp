// src/lib/http.ts
import { BACKEND_URL } from '@/lib/config';

interface Options {
  params?: object;
  signal?: AbortSignal;
}

const request = async <T>(method: string, path: string, body?: unknown, { params, signal }: Options = {}): Promise<T> => {

  const qs = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      qs.append(key, String(value));
    }
  });
  const query = qs.toString() ? `?${qs}` : '';

  const res = await fetch(`${BACKEND_URL}/api/${path}${query}`, {
    method,
    credentials: 'include',
    signal,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => undefined);

  if (!res.ok) throw new Error(data?.message ?? `Error ${res.status}`);

  return data as T;
};

export const http = {
  get: <T>(path: string, options?: Options) =>
    request<T>('GET', path, undefined, options),

  post: <T>(path: string, body?: unknown) =>
    request<T>('POST', path, body),

  put: <T>(path: string, body?: unknown) =>
    request<T>('PUT', path, body),

  delete: <T = void>(path: string) =>
    request<T>('DELETE', path),
};