import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="glass max-w-md p-12">
        <p className="mb-2 font-mono text-xs tracking-widest text-[#00d4ff]">404</p>
        <h2 className="mb-4 text-2xl font-bold text-white">Page not found</h2>
        <p className="mb-8 text-sm text-[#8899bb]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-[#00d4ff]/10 px-6 py-2.5 text-sm font-medium text-[#00d4ff] transition-all hover:bg-[#00d4ff]/20"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
