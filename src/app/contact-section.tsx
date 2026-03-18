'use client';

import { useState } from 'react';
import ContactForm from './contact-form';

export default function ContactSection() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          <div className="mx-auto max-w-md">
            <button
              onClick={() => setShowForm(true)}
              className="group inline-flex w-full items-center justify-center gap-2 rounded bg-primary px-8 py-3.5 font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Book a Call
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              15-min discovery call
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              No obligations
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Perth timezone
            </span>
          </div>
        </>
      ) : (
        <>
          <ContactForm />
          <p className="text-center">
            <button
              onClick={() => setShowForm(false)}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Go back
            </button>
          </p>
        </>
      )}
    </div>
  );
}
