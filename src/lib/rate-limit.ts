const MAX_ENTRIES = 10_000;
const CLEANUP_INTERVAL_MS = 60_000; // 1 minute

interface RateLimitStore {
  attempts: Map<string, number[]>;
  windowMs: number;
  limit: number;
}

const stores: RateLimitStore[] = [];
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanupRunning() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(cleanupAllStores, CLEANUP_INTERVAL_MS);
  if (typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    cleanupTimer.unref();
  }
}

function cleanupAllStores() {
  for (const store of stores) {
    const cutoff = Date.now() - store.windowMs;
    for (const [k, timestamps] of store.attempts) {
      const valid = timestamps.filter((t) => t > cutoff);
      if (valid.length === 0) store.attempts.delete(k);
      else store.attempts.set(k, valid);
    }
  }
}

export function createRateLimiter(limit: number, windowMs: number): RateLimitStore {
  const store: RateLimitStore = { attempts: new Map(), windowMs, limit };
  stores.push(store);
  ensureCleanupRunning();
  return store;
}

export function isRateLimited(store: RateLimitStore, key: string): boolean {
  const now = Date.now();

  // Hard cap: reject if map is at capacity (should never happen with periodic cleanup)
  if (store.attempts.size > MAX_ENTRIES && !store.attempts.has(key)) {
    return true;
  }

  const attempts = (store.attempts.get(key) ?? []).filter((t) => now - t < store.windowMs);
  if (attempts.length >= store.limit) {
    store.attempts.set(key, attempts);
    return true;
  }
  attempts.push(now);
  store.attempts.set(key, attempts);
  return false;
}

export function getClientIp(request: Request): string {
  const headers = request.headers;
  // Prefer Vercel's non-spoofable header, fall back to x-forwarded-for
  // (which Vercel also sets from the real client IP on their edge)
  return (
    headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}
