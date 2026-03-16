'use client';

declare global {
  interface Window {
    BookingWidget?: {
      open: () => void;
      init: (config: { project: string; host: string; buttonText?: string | false }) => void;
    };
  }
}

export default function ContactSection() {
  function handleBook() {
    if (window.BookingWidget) {
      window.BookingWidget.open();
    }
  }

  return (
    <div className="space-y-6">
      <div className="mx-auto grid max-w-md gap-4 sm:grid-cols-2">
        <button
          onClick={handleBook}
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#00d4ff] px-8 py-3.5 font-semibold text-[#060b18] transition-all hover:bg-[#33ddff] hover:shadow-[0_0_32px_rgba(0,212,255,0.3)] sm:col-span-2"
        >
          Book a Call
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-[#6b7a99]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
          15-min discovery call
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
          No obligations
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
          Perth timezone
        </span>
      </div>
    </div>
  );
}
