'use client';

import { useState, FormEvent } from 'react';

const CODEBASE_SIZES = [
  'Under 25K lines',
  '25K — 100K lines',
  '100K — 500K lines',
  '500K+ lines',
  'Not sure',
] as const;

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    codebaseSize: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Something went wrong');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div role="status" aria-live="polite" className="text-center py-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#00d4ff]/10">
          <svg className="h-7 w-7 text-[#00d4ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Request Received</h3>
        <p className="text-[#8899bb] text-sm">
          We&apos;ll review your details and get back to you within 1-2 business days.
          <br />Check your inbox for a confirmation email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 text-left">
      <fieldset>
        <legend className="sr-only">Contact information (* required)</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="poc-name" className="mb-1 block text-xs font-medium text-muted">
            Name *
          </label>
          <input
            id="poc-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-muted transition-colors focus:border-[#00d4ff]/40 focus:bg-white/[0.07]"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label htmlFor="poc-email" className="mb-1 block text-xs font-medium text-muted">
            Work Email *
          </label>
          <input
            id="poc-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-muted transition-colors focus:border-[#00d4ff]/40 focus:bg-white/[0.07]"
            placeholder="jane@company.com"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="poc-company" className="mb-1 block text-xs font-medium text-muted">
            Company *
          </label>
          <input
            id="poc-company"
            type="text"
            required
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-muted transition-colors focus:border-[#00d4ff]/40 focus:bg-white/[0.07]"
            placeholder="Acme Corp"
          />
        </div>
        <div>
          <label htmlFor="poc-size" className="mb-1 block text-xs font-medium text-muted">
            Codebase Size
          </label>
          <select
            id="poc-size"
            value={form.codebaseSize}
            onChange={(e) => setForm({ ...form, codebaseSize: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition-colors focus:border-[#00d4ff]/40 focus:bg-white/[0.07] [&>option]:bg-[#0a1628] [&>option]:text-white"
          >
            <option value="">Select...</option>
            {CODEBASE_SIZES.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="poc-message" className="mb-1 block text-xs font-medium text-muted">
          Tell us about your project
        </label>
        <textarea
          id="poc-message"
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-muted transition-colors focus:border-[#00d4ff]/40 focus:bg-white/[0.07] resize-none"
          placeholder="What systems does your COBOL run? Any specific documentation needs?"
        />
      </div>

      </fieldset>

      {status === 'error' && (
        <p role="alert" className="text-center text-sm text-red-400">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#00d4ff] px-8 py-3.5 font-semibold text-[#060b18] transition-all hover:bg-[#33ddff] hover:shadow-[0_0_32px_rgba(0,212,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Sending...' : 'Request Free PoC'}
        {status !== 'loading' && (
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        )}
      </button>

      <p className="text-center text-xs text-muted">
        Free 5-program PoC. No obligations. We&apos;ll respond within 1-2 business days.
      </p>
    </form>
  );
}
