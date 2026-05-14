import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import DemoClient from './demo-client';

export const metadata: Metadata = {
  title: 'Live Demo - Assay',
  description:
    'See Assay in action. Watch Claude Opus analyse a 301-line COBOL payroll program and produce comprehensive documentation in 4 passes.',
};

export default function DemoPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="" width={36} height={36} className="rounded" />
            <span className="font-serif text-lg font-semibold tracking-tight">
              Assay
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="rounded border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              Live Demo
            </span>
            <Link
              href="/#contact"
              className="rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="sr-only">Assay Live Demo</h1>
        <DemoClient />
      </main>
    </div>
  );
}
