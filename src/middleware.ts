import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // CSRF protection: verify Origin header on state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    if (!origin) {
      return NextResponse.json({ error: 'Missing origin' }, { status: 403 });
    }

    if (!host) {
      return NextResponse.json({ error: 'Missing host' }, { status: 400 });
    }

    let originHost: string;
    try {
      originHost = new URL(origin).host;
    } catch {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }

    if (originHost !== host) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }
  }

  // Generate per-request nonce for CSP
  const nonce = crypto.randomUUID();

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://donnacha.app`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' https://donnacha.app https://va.vercel-scripts.com https://accounts.google.com",
    "frame-src 'self' https://accounts.google.com https://donnacha.app",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self' https://accounts.google.com",
  ].join('; ');

  // Pass nonce to Next.js via request header so it can inject it into inline scripts
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|opengraph-image|sitemap.xml|robots.txt).*)',
  ],
};
