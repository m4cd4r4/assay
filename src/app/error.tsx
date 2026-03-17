'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Page error:', error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="glass max-w-md p-12">
        <p className="mb-2 font-mono text-xs tracking-widest text-[#00d4ff]">ERROR</p>
        <h2 className="mb-4 text-2xl font-bold text-white">Something went wrong</h2>
        <p className="mb-8 text-sm text-[#8899bb]">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-[#00d4ff]/10 px-6 py-2.5 text-sm font-medium text-[#00d4ff] transition-all hover:bg-[#00d4ff]/20"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
