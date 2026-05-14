'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

interface DemoOutput {
  programId: string;
  fileName: string;
  lineCount: number;
  copybooks: string[];
  generatedAt: string;
  stats: {
    totalLines: number;
    codeLines: number;
    commentLines: number;
    paragraphs: number;
    callStatements: number;
    copyStatements: number;
    dataItems: number;
    maxNestingDepth: number;
  };
  passes: {
    overview: string;
    businessRules: string;
    deadCode: string;
    dataFlow: string;
  };
}

const PASS_LABELS = [
  { key: 'overview', label: 'Program Overview', icon: '01' },
  { key: 'businessRules', label: 'Business Rules', icon: '02' },
  { key: 'deadCode', label: 'Dead Code Detection', icon: '03' },
  { key: 'dataFlow', label: 'Data Flow Analysis', icon: '04' },
] as const;

const TYPING_SPEED = 8;
const LINE_PAUSE = 40;

function DemoEmailCapture() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Demo visitor',
          email,
          company: '',
          codebaseSize: '',
          message: 'Completed full demo - requested free PoC via demo page.',
        }),
      });
    } catch {
      // Best-effort
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded border border-primary/20 bg-primary/5 px-6 py-4">
        <p className="text-sm text-primary">
          Got it. We will be in touch within 1-2 business days with your free PoC details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-sm gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Work email"
        aria-label="Work email"
        className="flex-1 rounded border border-border bg-white px-4 py-3 text-sm text-foreground placeholder-muted/60 transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
      />
      <button
        type="submit"
        className="shrink-0 rounded bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Get Free PoC
      </button>
    </form>
  );
}

export default function DemoClient() {
  const [demoData, setDemoData] = useState<DemoOutput | null>(null);
  const [activePass, setActivePass] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [completedPasses, setCompletedPasses] = useState<Set<number>>(new Set());
  const [showSource, setShowSource] = useState(false);
  const [sourceCode, setSourceCode] = useState('');
  const animationRef = useRef<number | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/demo/output/payroll-calc.json')
      .then((r) => r.json())
      .then((data: DemoOutput) => setDemoData(data));
  }, []);

  useEffect(() => {
    if (showSource && !sourceCode) {
      fetch('/demo/sample-payroll.cbl')
        .then((r) => r.text())
        .then(setSourceCode);
    }
  }, [showSource, sourceCode]);

  const animateText = useCallback((fullText: string, passIndex: number) => {
    setIsAnimating(true);
    setDisplayedText('');
    let i = 0;

    function tick() {
      if (i < fullText.length) {
        const chunk = Math.min(i + 3, fullText.length);
        setDisplayedText(fullText.slice(0, chunk));
        i = chunk;

        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }

        const delay = fullText[i - 1] === '\n' ? LINE_PAUSE : TYPING_SPEED;
        animationRef.current = window.setTimeout(tick, delay);
      } else {
        setIsAnimating(false);
        setCompletedPasses((prev) => new Set([...prev, passIndex]));
      }
    }
    tick();
  }, []);

  const startDemo = useCallback(() => {
    if (!demoData) return;
    setHasStarted(true);
    setActivePass(0);
    setCompletedPasses(new Set());
    const passKey = PASS_LABELS[0].key;
    animateText(demoData.passes[passKey], 0);
  }, [demoData, animateText]);

  const switchPass = useCallback((index: number) => {
    if (!demoData) return;
    // Stop any running animation before switching
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
    setActivePass(index);
    const passKey = PASS_LABELS[index].key;
    if (completedPasses.has(index)) {
      setDisplayedText(demoData.passes[passKey]);
    } else {
      animateText(demoData.passes[passKey], index);
    }
  }, [demoData, completedPasses, animateText]);

  const skipAnimation = useCallback(() => {
    if (!demoData || !isAnimating) return;
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    const passKey = PASS_LABELS[activePass].key;
    setDisplayedText(demoData.passes[passKey]);
    setIsAnimating(false);
    setCompletedPasses((prev) => new Set([...prev, activePass]));
  }, [demoData, isAnimating, activePass]);

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const downloadBundle = useCallback(() => {
    if (!demoData) return;
    const bundle = {
      projectName: 'PAYROLL-DEMO',
      generatedAt: demoData.generatedAt,
      fileCount: 1,
      files: {
        'programs/PAYROLL-CALC/overview.md': [
          `# ${demoData.programId}\n`,
          `> File: \`${demoData.fileName}\` | Lines: ${demoData.lineCount} | Generated by Assay\n`,
          demoData.passes.overview,
          '\n---\n\n## Business Rules\n\n',
          demoData.passes.businessRules,
          '\n---\n\n## Dead Code Analysis\n\n',
          demoData.passes.deadCode,
          '\n---\n\n## Data Flow\n\n',
          demoData.passes.dataFlow,
        ].join('\n'),
      },
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PAYROLL-DEMO-knowledge-base.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [demoData]);

  if (!demoData) {
    return (
      <div className="mx-auto max-w-2xl py-32">
        <div className="animate-pulse space-y-6 text-center">
          <div className="mx-auto h-8 w-48 rounded bg-surface" />
          <div className="mx-auto h-4 w-64 rounded bg-surface" />
          <div className="mx-auto flex max-w-md justify-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 w-12 rounded bg-surface" />
                <div className="h-3 w-16 rounded bg-surface" />
              </div>
            ))}
          </div>
          <div className="mx-auto h-12 w-36 rounded bg-surface" />
        </div>
        <p className="mt-8 text-center text-sm text-muted">Loading demo data...</p>
      </div>
    );
  }

  return (
    <>
      {/* Intro */}
      {!hasStarted && (
        <div className="mx-auto max-w-2xl py-16 text-center">
          <h2 className="mb-4 font-serif text-3xl font-semibold tracking-tight">
            See Assay in Action
          </h2>
          <p className="mb-2 text-muted">
            Watch how Claude Opus analyses a 301-line Australian payroll
            program with 2 copybooks and produces comprehensive documentation
            in 4 passes.
          </p>
          <p className="mb-8 text-sm text-muted">
            This is real AI-generated output from the sample program below. No
            API calls are made during this demo.
          </p>

          {/* Stats bar */}
          <div className="mx-auto mb-8 grid max-w-md grid-cols-4 gap-0 border-t border-border">
            {[
              { value: demoData.stats.totalLines, label: 'Lines of COBOL' },
              { value: demoData.stats.paragraphs, label: 'Paragraphs' },
              { value: 4, label: 'AI Passes' },
              { value: 13, label: 'Rules Found' },
            ].map((stat) => (
              <div key={stat.label} className="border-r border-border py-4 pr-4 last:border-r-0">
                <div className="font-serif text-2xl font-semibold">{stat.value}</div>
                <div className="text-xs text-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={startDemo}
              className="rounded bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Run Analysis
            </button>
            <button
              onClick={() => setShowSource(!showSource)}
              className="rounded border border-border px-6 py-3 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              {showSource ? 'Hide Source' : 'View Source Code'}
            </button>
          </div>

          {/* Source code viewer */}
          {showSource && sourceCode && (
            <div className="mt-8 text-left">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-sm text-muted">sample-payroll.cbl</span>
                <span className="text-xs text-muted">{demoData.stats.totalLines} lines</span>
              </div>
              <pre className="max-h-96 overflow-auto rounded border border-border bg-code-bg p-4 font-mono text-xs leading-relaxed text-code-fg">
                {sourceCode}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Analysis view */}
      {hasStarted && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-2">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
              Analysis Passes
            </h2>
            {PASS_LABELS.map((pass, i) => (
              <button
                key={pass.key}
                onClick={() => switchPass(i)}
                className={`flex w-full items-center gap-3 rounded px-4 py-3 text-left text-sm transition-all ${
                  i === activePass
                    ? 'border border-primary/30 bg-primary/5 font-medium text-foreground'
                    : completedPasses.has(i)
                      ? 'border border-border bg-surface text-muted hover:text-foreground'
                      : 'border border-transparent text-muted hover:text-foreground'
                }`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded font-mono text-xs font-bold ${
                  i === activePass
                    ? 'bg-primary/10 text-primary'
                    : completedPasses.has(i)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-surface text-muted'
                }`}>
                  {completedPasses.has(i) ? '\u2713' : pass.icon}
                </span>
                <span>{pass.label}</span>
              </button>
            ))}

            {/* Actions */}
            <div className="mt-6 space-y-2 border-t border-border pt-6">
              {isAnimating && (
                <button
                  onClick={skipAnimation}
                  className="w-full rounded border border-border px-4 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
                >
                  Skip Animation
                </button>
              )}
              {completedPasses.size === 4 && (
                <button
                  onClick={downloadBundle}
                  className="w-full rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                >
                  Download Knowledge Base
                </button>
              )}
              <button
                onClick={() => setShowSource(!showSource)}
                className="w-full rounded border border-border px-4 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                {showSource ? 'Hide Source' : 'View Source'}
              </button>
            </div>

            {/* Program stats */}
            <div className="mt-4 rounded border border-border p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                Program Stats
              </h3>
              <dl className="space-y-1 text-xs">
                {[
                  ['Program', demoData.programId],
                  ['File', demoData.fileName],
                  ['Total Lines', demoData.stats.totalLines],
                  ['Code Lines', demoData.stats.codeLines],
                  ['Comments', demoData.stats.commentLines],
                  ['Paragraphs', demoData.stats.paragraphs],
                  ['CALL Stmts', demoData.stats.callStatements],
                  ['COPY Stmts', demoData.stats.copyStatements],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex justify-between">
                    <dt className="text-muted">{label}</dt>
                    <dd className="font-mono text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>

          {/* Main output area */}
          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold">
                {PASS_LABELS[activePass].label}
              </h2>
              {isAnimating && (
                <span className="flex items-center gap-2 text-xs text-primary">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden="true" />
                  Analysing...
                </span>
              )}
            </div>

            {/* Source code panel */}
            {showSource && sourceCode && (
              <div className="mb-4">
                <pre className="max-h-64 overflow-auto rounded border border-border bg-code-bg p-4 font-mono text-xs leading-relaxed text-code-fg">
                  {sourceCode}
                </pre>
              </div>
            )}

            {/* Output */}
            <div
              ref={outputRef}
              className="max-h-[calc(100vh-240px)] overflow-auto rounded border border-border bg-code-bg p-6"
            >
              <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-code-fg">
                {displayedText}
                {isAnimating && (
                  <span className="inline-block h-4 w-1.5 animate-pulse bg-primary" aria-hidden="true" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mx-auto mt-16 max-w-xl border-t border-border pt-12 text-center">
        {completedPasses.size === 4 ? (
          <>
            <h2 className="mb-2 font-serif text-xl font-semibold">
              Imagine this for your entire codebase.
            </h2>
            <p className="mb-6 text-sm text-muted">
              You just saw 1 program documented in 4 passes. A typical engagement
              covers 50-500+ programs with cross-reference indexing, dependency
              maps, and an executive summary.
            </p>
            <DemoEmailCapture />
          </>
        ) : (
          <>
            <h2 className="mb-2 font-serif text-xl font-semibold">
              Ready for your codebase?
            </h2>
            <p className="mb-6 text-sm text-muted">
              This demo shows 1 program. A typical engagement covers 50-500+
              programs with full cross-reference indexing, dependency maps, and
              executive summary.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/m4cd4r4/assay"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                View source on GitHub
              </a>
              <Link
                href="/"
                className="rounded border border-border px-6 py-3 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                Back to overview
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
