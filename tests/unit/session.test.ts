import { describe, it, expect } from 'vitest';
import { generateSessionToken, getSessionCookieName, sessionCookieOptions } from '@/lib/auth/session';

describe('session', () => {
  describe('generateSessionToken', () => {
    it('returns a 64-char hex string (32 random bytes)', () => {
      const token = generateSessionToken();
      expect(token).toMatch(/^[0-9a-f]{64}$/);
    });

    it('generates unique tokens', () => {
      const tokens = new Set(Array.from({ length: 100 }, () => generateSessionToken()));
      expect(tokens.size).toBe(100);
    });
  });

  describe('getSessionCookieName', () => {
    it('returns assay_session', () => {
      expect(getSessionCookieName()).toBe('assay_session');
    });
  });

  describe('sessionCookieOptions', () => {
    it('sets httpOnly to true', () => {
      expect(sessionCookieOptions().httpOnly).toBe(true);
    });

    it('sets sameSite to lax', () => {
      expect(sessionCookieOptions().sameSite).toBe('lax');
    });

    it('sets path to /', () => {
      expect(sessionCookieOptions().path).toBe('/');
    });

    it('sets maxAge to 24 hours', () => {
      expect(sessionCookieOptions().maxAge).toBe(86400);
    });
  });
});
