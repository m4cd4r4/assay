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
      <div className="max-w-md rounded border border-border bg-surface p-12">
        <p className="mb-2 font-mono text-xs tracking-widest text-primary">ERROR</p>
        <h2 className="mb-4 text-2xl font-bold text-foreground">Something went wrong</h2>
        <p className="mb-8 text-sm text-muted">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-primary/10 px-6 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/20"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
