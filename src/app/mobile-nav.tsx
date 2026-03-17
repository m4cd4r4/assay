'use client';

import { useState } from 'react';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#trust', label: 'Trust' },
  { href: '/demo', label: 'Live Demo' },
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
        className="flex h-10 w-10 items-center justify-center rounded-lg text-white/60 transition-colors hover:text-white"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
          className="absolute left-0 right-0 top-full border-b border-white/10 bg-[#060b18]/95 backdrop-blur-xl"
        >
          <div className="mx-auto max-w-7xl space-y-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm text-muted transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-lg bg-[#00d4ff]/10 px-4 py-3 text-center text-sm font-medium text-[#00d4ff]"
            >
              Request Demo
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
