import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md rounded border border-border bg-surface p-12">
        <p className="mb-2 font-mono text-xs tracking-widest text-primary">404</p>
        <h2 className="mb-4 text-2xl font-bold text-foreground">Page not found</h2>
        <p className="mb-8 text-sm text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-primary/10 px-6 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/20"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
