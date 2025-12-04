// Lightweight fetch-based API wrapper to avoid axios bundling issues in Expo
// Adjust this base URL to your backend (use device IP when testing on a real device)
const API_BASE = process.env.REACT_APP_API_URL || 'https://rdpsolutions.online/pomodoro-api/public/api';

let authToken: string | null = null;

export function setAuthToken(token?: string | null) {
  authToken = token ?? null;
}

async function request(method: string, path: string, body?: any, params?: Record<string, any>) {
  // Ensure path starts with / and API_BASE ends without /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
  const fullUrl = `${baseUrl}${normalizedPath}`;
  const url = new URL(fullUrl);
  
  if (params) {
    Object.keys(params).forEach(k => {
      const v = params[k];
      if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
    });
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  console.log(`[API] ${method} ${url.toString()}`);
  console.log(`[API] Headers:`, headers);
  if (body) console.log(`[API] Body:`, body);

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  let data: any = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    const err: any = new Error(`API Error: ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return { data, status: res.status };
}

export default {
  get: (path: string, params?: Record<string, any>) => request('GET', path, undefined, params),
  post: (path: string, body?: any) => request('POST', path, body),
  put: (path: string, body?: any) => request('PUT', path, body),
  delete: (path: string) => request('DELETE', path),
};
