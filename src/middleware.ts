import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // CSRF protection: verify Origin header on state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // Reject mutating requests without an Origin header
    if (!origin) {
      return NextResponse.json({ error: 'Missing origin' }, { status: 403 });
    }

    // Reject mutating requests without a Host header
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|opengraph-image|sitemap.xml|robots.txt).*)',
  ],
};
