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

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' https://va.vercel-scripts.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|opengraph-image|sitemap.xml|robots.txt).*)',
  ],
};
