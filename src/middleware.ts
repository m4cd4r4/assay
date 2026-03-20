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

  const pathname = request.nextUrl.pathname;

  // /docs sets its own CSP (needs cdn.jsdelivr.net for Mermaid, Google Fonts).
  // Skip middleware CSP for that route so the route handler's headers apply.
  if (pathname === '/docs') {
    return NextResponse.next();
  }

  // Generate a per-request nonce for CSP. Next.js reads this from the
  // Content-Security-Policy header and applies it to all inline scripts
  // it injects (bootstrap, chunks, etc.).
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://va.vercel-scripts.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' https://va.vercel-scripts.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  // Pass the nonce to Next.js via request headers so the SSR render
  // can read it and stamp every inline <script> tag with the same nonce.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|opengraph-image|sitemap.xml|robots.txt).*)',
  ],
};
