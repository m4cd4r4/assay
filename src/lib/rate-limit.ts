import { kv } from '@vercel/kv';

const KV_PREFIX = 'rl:';

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

// In-memory fallback for local development (no KV)
const memoryStore = new Map<string, number[]>();

function useKv(): boolean {
  return Boolean(process.env.KV_REST_API_URL);
}

export function createRateLimiter(limit: number, windowMs: number): RateLimitConfig {
  return { limit, windowMs };
}

export async function isRateLimited(config: RateLimitConfig, key: string): Promise<boolean> {
  if (useKv()) {
    return isRateLimitedKv(config, key);
  }
  return isRateLimitedMemory(config, key);
}

async function isRateLimitedKv(config: RateLimitConfig, key: string): Promise<boolean> {
  const kvKey = `${KV_PREFIX}${key}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Use a sorted set: score = timestamp, member = unique ID
  // Remove expired entries, count remaining, add new if under limit
  await kv.zremrangebyscore(kvKey, 0, windowStart);
  const count = await kv.zcard(kvKey);

  if (count >= config.limit) {
    return true;
  }

  // Add this request with score = now, member = unique ID
  await kv.zadd(kvKey, { score: now, member: `${now}:${Math.random()}` });
  // Set TTL to auto-expire the whole key after the window
  await kv.expire(kvKey, Math.ceil(config.windowMs / 1000));
  return false;
}

function isRateLimitedMemory(config: RateLimitConfig, key: string): boolean {
  const now = Date.now();
  const attempts = (memoryStore.get(key) ?? []).filter((t) => now - t < config.windowMs);

  if (attempts.length >= config.limit) {
    memoryStore.set(key, attempts);
    return true;
  }

  attempts.push(now);
  memoryStore.set(key, attempts);
  return false;
}

export function getClientIp(request: Request): string {
  const headers = request.headers;
  return (
    headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}
