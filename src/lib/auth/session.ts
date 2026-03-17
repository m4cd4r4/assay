import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'assay_session';

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  return cookie?.value ?? null;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  };
}
