import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import DemoClient from './demo-client';

export const metadata: Metadata = {
  title: 'Live Demo - Assay',
  description:
    'See Assay in action. Watch Claude Opus 4.6 analyse a 301-line COBOL payroll program and produce comprehensive documentation in 4 passes.',
};

export default function DemoPage() {
  return (
    <div className="relative min-h-screen">
      <div className="mesh-gradient fixed inset-0 -z-10" aria-hidden="true" />

      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="" width={32} height={32} className="rounded-md" />
            <span className="text-lg font-semibold tracking-tight text-white">
              Assay
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/5 px-3 py-1 text-xs font-medium text-[#00d4ff]">
              Live Demo
            </span>
            <Link
              href="/#contact"
              className="rounded-lg bg-[#00d4ff] px-4 py-2 text-sm font-semibold text-[#060b18] transition-colors hover:bg-[#33ddff]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="sr-only">Assay Live Demo</h1>
        <DemoClient />
      </main>
    </div>
  );
}
