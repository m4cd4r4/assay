import Image from 'next/image';
import ContactSection from './contact-section';
import MobileNav from './mobile-nav';

const FEATURES = [
  {
    icon: "01",
    title: "Program Overview",
    description:
      "Plain-English summary of every program — business purpose, inputs, outputs, processing logic, and modernization notes.",
  },
  {
    icon: "02",
    title: "Business Rule Extraction",
    description:
      "Every IF, EVALUATE, and conditional catalogued with severity levels. Critical rules flagged for compliance review.",
  },
  {
    icon: "03",
    title: "Dependency Mapping",
    description:
      "Interactive Mermaid diagrams of CALL/COPY relationships. See how programs connect across your entire codebase.",
  },
  {
    icon: "04",
    title: "Dead Code Detection",
    description:
      "Unreferenced paragraphs, sections, and data items identified with confidence levels. Reduce maintenance surface area.",
  },
  {
    icon: "05",
    title: "Data Flow Analysis",
    description:
      "Sequence diagrams showing how data moves between files, working storage, and called programs. Trace any field.",
  },
] as const;

const STEPS = [
  {
    step: "1",
    title: "Upload Your Source",
    description:
      "Provide a ZIP of your .cbl and .cpy files via encrypted transfer. We never touch production systems.",
  },
  {
    step: "2",
    title: "AI Analysis",
    description:
      "Claude Opus 4.6 processes your codebase with 1M token context — entire program groups analysed in a single pass.",
  },
  {
    step: "3",
    title: "Download Knowledge Base",
    description:
      "Receive a comprehensive markdown knowledge base with searchable documentation, diagrams, and executive summary.",
  },
] as const;

const TIERS = [
  {
    name: "Starter",
    size: "S",
    lines: "Up to 25K",
    price: "$1,250",
    popular: false,
    features: [
      "5-pass documentation",
      "Dependency diagrams",
      "Dead code report",
      "Executive summary",
    ],
  },
  {
    name: "Standard",
    size: "M",
    lines: "25K - 100K",
    price: "$2,500",
    popular: true,
    features: [
      "Everything in Starter",
      "Cross-program data flow",
      "Business rule catalogue",
      "Modernisation roadmap",
    ],
  },
  {
    name: "Professional",
    size: "L",
    lines: "100K - 500K",
    price: "$6,000",
    popular: false,
    features: [
      "Everything in Standard",
      "Full system architecture map",
      "Compliance risk assessment",
      "Dedicated delivery manager",
    ],
  },
  {
    name: "Enterprise",
    size: "XL",
    lines: "500K+",
    price: "Custom",
    popular: false,
    features: [
      "Everything in Professional",
      "Phased delivery schedule",
      "On-site presentation",
      "Ongoing support retainer",
    ],
  },
] as const;

const TRUST_ITEMS = [
  {
    title: "Read-Only",
    description: "We never modify your source code. Zero production access.",
  },
  {
    title: "NDA Protected",
    description:
      "Mutual NDA with 3-year confidentiality. Source deleted within 30 days.",
  },
  {
    title: "API-Only Processing",
    description:
      "TLS 1.3 encrypted. Anthropic commercial terms — inputs not used for training.",
  },
  {
    title: "Australian Owned",
    description:
      "Solaisoft Pty Ltd. Australian Privacy Act compliant. Professionally insured.",
  },
] as const;

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background mesh gradient */}
      <div className="mesh-gradient fixed inset-0 -z-10" aria-hidden="true" />

      {/* Skip navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#00d4ff] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#060b18]"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full" aria-label="Main navigation">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="" width={32} height={32} className="rounded-md" />
            <span className="text-lg font-semibold tracking-tight text-white">
              Assay
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-muted transition-colors hover:text-white"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted transition-colors hover:text-white"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-sm text-muted transition-colors hover:text-white"
            >
              Pricing
            </a>
            <a
              href="#trust"
              className="text-sm text-muted transition-colors hover:text-white"
            >
              Trust
            </a>
            <a
              href="/demo"
              className="text-sm font-medium text-[#00d4ff] transition-colors hover:text-[#33ddff]"
            >
              Live Demo
            </a>
            <a
              href="/docs"
              className="text-sm text-muted transition-colors hover:text-white"
            >
              Docs
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="rounded-lg bg-[#00d4ff]/10 px-4 py-2 text-sm font-medium text-[#00d4ff] transition-all hover:bg-[#00d4ff]/20"
            >
              Request Demo
            </a>
            <MobileNav />
          </div>
        </div>
      </nav>

      <main id="main-content">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00d4ff]" />
            <span className="font-mono text-xs tracking-wider text-[#00d4ff]">
              POWERED BY CLAUDE OPUS 4.6
            </span>
          </div>

          <h1
            className="mb-6 text-5xl font-bold leading-[1.08] tracking-tight text-white md:text-7xl"
            style={{ textWrap: "balance" }}
          >
            Your COBOL codebase,
            <br />
            <span className="bg-gradient-to-r from-[#00d4ff] to-[#6366f1] bg-clip-text text-transparent">
              finally understood.
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#8899bb] md:text-xl">
            Upload your COBOL source. Receive business rules, dependency maps,
            dead code analysis, and data flow diagrams - all generated by
            AI with 1M token context. No production access required.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-[#00d4ff] px-8 py-3.5 font-semibold text-[#060b18] transition-all hover:bg-[#33ddff] hover:shadow-[0_0_32px_rgba(0,212,255,0.3)]"
            >
              Request Free PoC
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
            <a
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl border border-[#00d4ff]/20 px-8 py-3.5 font-medium text-[#00d4ff] transition-all hover:border-[#00d4ff]/40 hover:bg-[#00d4ff]/5"
            >
              Try Live Demo
            </a>
          </div>

          {/* Stats bar */}
          <div className="glass mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl md:grid-cols-4">
            {[
              { value: "1M", label: "Token Context" },
              { value: "5", label: "Analysis Passes" },
              { value: "14-Day", label: "Turnaround" },
              { value: "$0", label: "Production Risk" },
            ].map((stat) => (
              <div key={stat.label} className="px-6 py-5 text-center">
                <div className="font-mono text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs tracking-wider text-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative grid - rendered after hero content to not delay LCP */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
          aria-hidden="true"
        />
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <div className="fade-in-view mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Five-Pass Deep Analysis
            </h2>
            <p className="mx-auto max-w-xl text-[#8899bb]">
              Every program group is analysed five times, each pass extracting a
              different dimension of understanding.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.icon}
                className="fade-in-view glass group relative overflow-hidden p-6 transition-all hover:border-[#00d4ff]/20 hover:shadow-[0_0_32px_rgba(0,212,255,0.06)]"
              >
                <div className="noise" />
                <div className="relative z-10">
                  <span className="mb-4 inline-block font-mono text-xs font-bold tracking-widest text-[#00d4ff]">
                    PASS {feature.icon}
                  </span>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#8899bb]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COBOL Code Preview */}
      <section className="relative px-6 py-16">
        <div className="fade-in-view glass-elevated glow-cyan mx-auto max-w-3xl overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-xs text-muted">
              PAYROLL-CALC.cbl
            </span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed md:text-sm">
            <code>
              <span className="text-muted">{"       "}</span>
              <span className="text-[#ff6b6b]">IDENTIFICATION DIVISION.</span>
              {"\n"}
              <span className="text-muted">{"       "}</span>
              <span className="text-[#f0b429]">PROGRAM-ID.</span>
              <span className="text-white"> PAYROLL-CALC.</span>
              {"\n"}
              <span className="text-muted">{"      *"}</span>
              {"\n"}
              <span className="text-muted">
                {"      * "}PAYROLL CALCULATION PROGRAM
              </span>
              {"\n"}
              <span className="text-muted">
                {"      * "}Calculates gross pay, tax, and net pay
              </span>
              {"\n"}
              <span className="text-muted">{"       "}</span>
              <span className="text-[#ff6b6b]">PROCEDURE DIVISION.</span>
              {"\n"}
              <span className="text-muted">{"       "}</span>
              <span className="text-[#00d4ff]">0000-MAIN-CONTROL.</span>
              {"\n"}
              <span className="text-muted">{"           "}</span>
              <span className="text-[#c084fc]">PERFORM</span>
              <span className="text-white"> 1000-INITIALIZE</span>
              {"\n"}
              <span className="text-muted">{"           "}</span>
              <span className="text-[#c084fc]">PERFORM</span>
              <span className="text-white"> 2000-PROCESS-PAYROLL</span>
              {"\n"}
              <span className="text-muted">{"               "}</span>
              <span className="text-[#c084fc]">UNTIL</span>
              <span className="text-white"> END-OF-TIME</span>
              {"\n"}
              <span className="text-muted">{"           "}</span>
              <span className="text-[#c084fc]">STOP RUN</span>
              <span className="text-white">.</span>
            </code>
          </pre>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative px-6 py-32">
        <div className="mx-auto max-w-5xl">
          <div className="fade-in-view mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Three Steps to Clarity
            </h2>
            <p className="mx-auto max-w-xl text-[#8899bb]">
              No production access. No code changes. Just comprehensive
              documentation delivered securely.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((item) => (
              <div key={item.step} className="fade-in-view text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00d4ff]/20 bg-[#00d4ff]/5">
                  <span className="font-mono text-2xl font-bold text-[#00d4ff]">
                    {item.step}
                  </span>
                </div>
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#8899bb]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Connecting line */}
          <div
            className="mx-auto mt-[-180px] mb-[-60px] hidden h-px max-w-lg md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent)",
            }}
            aria-hidden="true"
          />
        </div>
      </section>

      {/* Trust & Compliance - before pricing to build confidence */}
      <section id="trust" className="relative px-6 py-32">
        <div className="mx-auto max-w-5xl">
          <div className="fade-in-view mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Enterprise-Grade Security
            </h2>
            <p className="mx-auto max-w-xl text-muted">
              Your source code is your most sensitive asset. Our architecture
              ensures it stays protected at every step.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.title}
                className="fade-in-view glass flex items-start gap-4 p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00d4ff]/8">
                  <svg
                    className="h-5 w-5 text-[#00d4ff]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quality audit scores - linked to third-party verification */}
          <div className="fade-in-view mt-12 glass overflow-hidden rounded-2xl">
            <div className="border-b border-white/5 px-6 py-3">
              <p className="text-center font-mono text-xs tracking-widest text-muted">
                INDEPENDENTLY VERIFIED - CLICK TO AUDIT LIVE
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px md:grid-cols-4 lg:grid-cols-6">
              {[
                { score: "100", label: "Accessibility", sub: "Lighthouse", href: "https://pagespeed.web.dev/analysis/https-assay-software/lgjpfz4a8o?form_factor=mobile&hl=en&category=accessibility" },
                { score: "100", label: "Performance", sub: "Lighthouse", href: "https://pagespeed.web.dev/analysis/https-assay-software/lgjpfz4a8o?form_factor=mobile&hl=en&category=performance" },
                { score: "100", label: "SEO", sub: "Lighthouse", href: "https://pagespeed.web.dev/analysis/https-assay-software/lgjpfz4a8o?form_factor=mobile&hl=en&category=seo" },
                { score: "A", label: "SSL/TLS", sub: "Qualys SSL Labs", href: "https://www.ssllabs.com/ssltest/analyze.html?d=assay.software" },
                { score: "A+", label: "Security", sub: "Mozilla Observatory", href: "https://developer.mozilla.org/en-US/observatory/analyze?host=assay.software" },
                { score: "0", label: "Vulnerabilities", sub: "npm audit", href: "https://github.com/m4cd4r4/assay" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-4 py-4 text-center transition-colors hover:bg-white/5"
                >
                  <div className="font-mono text-2xl font-bold text-[#00d4ff] transition-colors group-hover:text-[#33ddff]">
                    {item.score}
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-white">
                    {item.label}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-muted">
                    {item.sub}
                    <svg className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Technology credibility */}
          <div className="fade-in-view mt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-muted">
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              Powered by Anthropic Claude
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              Deployed on Vercel
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
              Professionally insured
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              TLS 1.3 encrypted
            </span>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <div className="fade-in-view mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Project-Based Pricing
            </h2>
            <p className="mx-auto max-w-xl text-muted">
              Fixed-price engagements sized to your codebase. No subscriptions.
              No per-seat licensing. All prices in AUD.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((tier) => (
              <div
                key={tier.size}
                className={`fade-in-view relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all ${
                  tier.popular
                    ? "border-[#00d4ff]/30 bg-[#00d4ff]/[0.04] shadow-[0_0_48px_rgba(0,212,255,0.08)]"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                {tier.popular && (
                  <div className="absolute right-4 top-4 rounded-full bg-[#00d4ff]/10 px-3 py-0.5 font-mono text-[10px] font-bold tracking-widest text-[#00d4ff]">
                    POPULAR
                  </div>
                )}
                <div className="mb-4">
                  <span className="font-mono text-xs tracking-widest text-muted">
                    {tier.size}
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-white">
                    {tier.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    {tier.lines} lines
                  </p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && (
                    <span className="ml-1 text-sm text-muted">AUD</span>
                  )}
                </div>
                <ul className="mb-6 flex-1 space-y-2.5">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-muted"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#00d4ff]/60"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`block rounded-lg py-2.5 text-center text-sm font-medium transition-all ${
                    tier.popular
                      ? "bg-[#00d4ff] text-[#060b18] hover:bg-[#33ddff]"
                      : "bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {tier.price === "Custom" ? "Contact Us" : "Get Started"}
                </a>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted">
            Free 5-program Proof of Concept included with every engagement.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative px-6 py-32">
        <div className="fade-in-view glass-elevated glow-cyan mx-auto max-w-3xl overflow-hidden p-12 text-center md:p-16">
          <div className="noise" />
          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Ready to understand your COBOL?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-[#8899bb]">
              Start with a free Proof of Concept — we&apos;ll document 5 of
              your programs at no cost. See exactly what you&apos;ll get before
              committing.
            </p>
            <ContactSection />
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="" width={24} height={24} className="rounded" />
            <span className="text-sm font-medium text-white/60">
              Assay
            </span>
          </div>
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Solaisoft Pty Ltd. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="/blog"
              className="text-xs text-muted transition-colors hover:text-white"
            >
              Blog
            </a>
            <a
              href="/privacy"
              className="text-xs text-muted transition-colors hover:text-white"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-xs text-muted transition-colors hover:text-white"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
