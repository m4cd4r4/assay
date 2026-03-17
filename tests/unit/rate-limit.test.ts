import { describe, it, expect, beforeEach } from 'vitest';
import { createRateLimiter, isRateLimited, getClientIp } from '@/lib/rate-limit';

describe('rate-limit', () => {
  describe('createRateLimiter', () => {
    it('returns a config with limit and windowMs', () => {
      const limiter = createRateLimiter(5, 60_000);
      expect(limiter).toEqual({ limit: 5, windowMs: 60_000 });
    });
  });

  describe('isRateLimited (in-memory fallback)', () => {
    let limiter: ReturnType<typeof createRateLimiter>;

    beforeEach(() => {
      limiter = createRateLimiter(3, 60_000);
    });

    it('allows requests under the limit', async () => {
      expect(await isRateLimited(limiter, 'test-ip-1')).toBe(false);
      expect(await isRateLimited(limiter, 'test-ip-1')).toBe(false);
      expect(await isRateLimited(limiter, 'test-ip-1')).toBe(false);
    });

    it('blocks requests over the limit', async () => {
      await isRateLimited(limiter, 'test-ip-2');
      await isRateLimited(limiter, 'test-ip-2');
      await isRateLimited(limiter, 'test-ip-2');
      expect(await isRateLimited(limiter, 'test-ip-2')).toBe(true);
    });

    it('tracks different keys independently', async () => {
      await isRateLimited(limiter, 'ip-a');
      await isRateLimited(limiter, 'ip-a');
      await isRateLimited(limiter, 'ip-a');
      // ip-a is at limit
      expect(await isRateLimited(limiter, 'ip-a')).toBe(true);
      // ip-b is fresh
      expect(await isRateLimited(limiter, 'ip-b')).toBe(false);
    });
  });

  describe('getClientIp', () => {
    it('returns x-vercel-forwarded-for when present', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-vercel-forwarded-for': '1.2.3.4',
          'x-forwarded-for': '5.6.7.8',
        },
      });
      expect(getClientIp(request)).toBe('1.2.3.4');
    });

    it('falls back to x-forwarded-for', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-forwarded-for': '10.0.0.1, 10.0.0.2' },
      });
      expect(getClientIp(request)).toBe('10.0.0.1');
    });

    it('returns unknown when no IP headers', () => {
      const request = new Request('http://localhost');
      expect(getClientIp(request)).toBe('unknown');
    });

    it('does NOT use x-real-ip (spoofable)', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-real-ip': '99.99.99.99' },
      });
      expect(getClientIp(request)).toBe('unknown');
    });
  });
});
