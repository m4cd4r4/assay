'use client';

import { useState } from 'react';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#process', label: 'Process' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#trust', label: 'Trust' },
  { href: '/demo', label: 'Demo' },
  { href: '/docs', label: 'Docs' },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Toggle navigation menu"
        className="flex h-10 w-10 items-center justify-center rounded text-muted transition-colors hover:text-foreground"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="absolute left-0 right-0 top-full z-50 border-b border-border bg-background"
        >
          <div className="mx-auto max-w-6xl space-y-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded px-4 py-3 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded bg-primary px-4 py-3 text-center text-sm font-medium text-white"
            >
              Get in touch
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
