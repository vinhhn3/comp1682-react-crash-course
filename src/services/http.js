import { API_BASE_URL, USE_MOCK } from '../config/env';
import { mockApi } from '../../mock/server';

/** A failed request that knows its status. Components should never see `res.status`. */
export class HttpError extends Error {
  constructor(status, message) {
    super(message || `HTTP ${status}`);
    this.name = 'HttpError';
    this.status = status;
  }
}

function chaos() {
  const raw = new URLSearchParams(window.location.search).get('chaos') ?? '';
  return {
    fail: raw === 'fail',
    offline: raw === 'offline',
    slow: raw.startsWith('slow') ? Number(raw.split('=')[1] || 2) : 0,
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * The only function in the app that knows what a request is.
 * Everything else asks for a resource by name.
 */
export async function request(path, { method = 'GET', body, signal } = {}) {
  console.log(`→ ${method} ${path}`);

  const c = chaos();

  if (c.offline) {
    console.warn('✕ network error (simulated)');
    throw new TypeError('Failed to fetch');
  }

  // In mock mode the fake server already applies the latency.
  if (c.slow && !USE_MOCK) await sleep(c.slow * 1000);

  if (c.fail) {
    console.warn('← 500 (simulated)');
    throw new HttpError(500, 'Internal Server Error');
  }

  let data;

  if (USE_MOCK) {
    data = await mockApi.handle(method, path, body, { signal });
  } else {
    const res = await fetch(API_BASE_URL + path, {
      method,
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new HttpError(res.status, res.statusText);
    data = res.status === 204 ? null : await res.json();
  }

  console.log(`← ${method} ${path}`, data);
  return data;
}

export const http = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
