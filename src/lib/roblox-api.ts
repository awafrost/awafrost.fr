type CacheEntry = {
  expiresAt: number;
  value?: unknown;
  pending?: Promise<unknown>;
};

type CacheableRequestInit = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

const cacheHost = globalThis as typeof globalThis & {
  __awafrostRobloxCache?: Map<string, CacheEntry>;
};

const responseCache = cacheHost.__awafrostRobloxCache ?? new Map<string, CacheEntry>();
cacheHost.__awafrostRobloxCache = responseCache;

export function cacheRobloxData<T>(key: string, ttlSeconds: number, loader: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const cached = responseCache.get(key);

  if (cached && cached.expiresAt > now && Object.prototype.hasOwnProperty.call(cached, 'value')) {
    return Promise.resolve(cached.value as T);
  }
  if (cached?.pending) return cached.pending as Promise<T>;

  const pending = loader()
    .then((value) => {
      responseCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
      if (responseCache.size > 2500) {
        for (const [cacheKey, entry] of responseCache) {
          if (entry.expiresAt <= Date.now()) responseCache.delete(cacheKey);
          if (responseCache.size <= 2000) break;
        }
      }
      return value;
    })
    .catch((error: unknown) => {
      responseCache.delete(key);
      throw error;
    });

  responseCache.set(key, { expiresAt: now + ttlSeconds * 1000, pending });
  return pending;
}

export function fetchRobloxJson<T>(url: string, ttlSeconds: number, init: RequestInit = {}): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase();
  const bodyKey = typeof init.body === 'string' ? init.body : '';
  const cacheKey = `roblox:${method}:${url}:${bodyKey}`;

  return cacheRobloxData(cacheKey, ttlSeconds, async () => {
    const headers = new Headers(init.headers);
    if (!headers.has('Accept')) headers.set('Accept', 'application/json');

    const options: CacheableRequestInit = {
      ...init,
      headers,
      signal: init.signal ?? AbortSignal.timeout(10000),
    };
    if (method === 'GET') options.next = { revalidate: ttlSeconds };

    const response = await fetch(url, options);
    if (!response.ok) {
      const retryAfter = response.headers.get('Retry-After');
      throw new Error(`Roblox API ${response.status}${retryAfter ? ` (retry after ${retryAfter}s)` : ''}: ${url}`);
    }
    return response.json() as Promise<T>;
  });
}

export const dashboardCacheHeaders = {
  'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
};
