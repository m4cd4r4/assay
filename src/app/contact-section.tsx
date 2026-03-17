'use client';

import { useState } from 'react';
import ContactForm from './contact-form';

declare global {
  interface Window {
    BookingWidget?: {
      open: () => void;
      init: (config: { project: string; host: string; buttonText?: string | false }) => void;
    };
  }
}

export default function ContactSection() {
  const [showForm, setShowForm] = useState(false);

  function handleBook() {
    if (window.BookingWidget) {
      window.BookingWidget.open();
      return;
    }
    // Load widget on first click to avoid console errors at page load
    const script = document.createElement('script');
    script.src = 'https://donnacha.app/booking-widget.js';
    script.onload = () => {
      if (window.BookingWidget) {
        window.BookingWidget.init({ project: 'assay', host: 'https://donnacha.app', buttonText: false });
        window.BookingWidget.open();
      }
    };
    document.head.appendChild(script);
  }

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          <div className="mx-auto grid max-w-md gap-4 sm:grid-cols-2">
            <button
              onClick={handleBook}
              className="group inline-flex items-center justify-center gap-2 rounded bg-primary px-8 py-3.5 font-medium text-white transition-colors hover:bg-primary-hover sm:col-span-2"
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

          <p className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              Prefer email? Send us a message instead.
            </button>
          </p>
        </>
      ) : (
        <>
          <ContactForm />
          <p className="text-center">
            <button
              onClick={() => setShowForm(false)}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              Rather book a call?
            </button>
          </p>
        </>
      )}
    </div>
  );
}
