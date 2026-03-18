import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

// Read once at module load to avoid blocking the event loop on each request
const html = readFileSync(
  join(process.cwd(), 'docs', 'architecture.html'),
  'utf-8'
);

export async function GET() {
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' https://cdn.jsdelivr.net",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data:",
        "font-src 'self' https://fonts.gstatic.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
      ].join('; '),
    },
  });
}
