import Image from 'next/image';
import ContactSection from './contact-section';
import MobileNav from './mobile-nav';

const FEATURES = [
  {
    num: "01",
    title: "Program Overview",
    description:
      "Plain-English summary of every program. Business purpose, inputs, outputs, processing logic, and modernization notes.",
  },
  {
    num: "02",
    title: "Business Rule Extraction",
    description:
      "Every IF, EVALUATE, and conditional catalogued with severity levels. Critical rules flagged for compliance review.",
  },
  {
    num: "03",
    title: "Dependency Mapping",
    description:
      "Interactive Mermaid diagrams of CALL/COPY relationships. See how programs connect across your entire codebase.",
  },
  {
    num: "04",
    title: "Dead Code Detection",
    description:
      "Unreferenced paragraphs, sections, and data items identified with confidence levels. Reduce maintenance surface area.",
  },
  {
    num: "05",
    title: "Data Flow Analysis",
    description:
      "Sequence diagrams showing how data moves between files, working storage, and called programs. Trace any field.",
  },
] as const;

const STEPS = [
  {
    num: "1",
    title: "Upload Your Source",
    description:
      "Provide a ZIP of your .cbl and .cpy files via encrypted transfer. We never touch production systems.",
  },
  {
    num: "2",
    title: "AI Analysis",
    description:
      "Claude Opus 4.6 processes your codebase with 1M token context. Entire program groups analysed in a single pass.",
  },
  {
    num: "3",
    title: "Download Knowledge Base",
    description:
      "Receive a comprehensive markdown knowledge base with searchable documentation, diagrams, and executive summary.",
  },
] as const;

const TIERS = [
  { name: "Starter", lines: "Up to 25K", price: "$1,250", popular: false, features: ["5-pass documentation", "Dependency diagrams", "Dead code report", "Executive summary"] },
  { name: "Standard", lines: "25K - 100K", price: "$2,500", popular: true, features: ["Everything in Starter", "Cross-program data flow", "Business rule catalogue", "Modernisation roadmap"] },
  { name: "Professional", lines: "100K - 500K", price: "$6,000", popular: false, features: ["Everything in Standard", "Full system architecture map", "Compliance risk assessment", "Dedicated delivery manager"] },
  { name: "Enterprise", lines: "500K+", price: "Custom", popular: false, features: ["Everything in Professional", "Phased delivery schedule", "On-site presentation", "Ongoing support retainer"] },
] as const;

const TRUST_ITEMS = [
  { title: "Read-Only", description: "We never modify your source code. Zero production access." },
  { title: "NDA Protected", description: "Mutual NDA with 3-year confidentiality. Source deleted within 30 days." },
  { title: "API-Only Processing", description: "TLS 1.3 encrypted. Anthropic commercial terms - inputs not used for training." },
  { title: "Australian Owned", description: "Solaisoft Pty Ltd. Australian Privacy Act compliant. Professionally insured." },
] as const;

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Skip navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm" aria-label="Main navigation">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="" width={40} height={40} className="rounded" />
            <span className="font-serif text-xl font-semibold tracking-tight">
              Assay
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            {[
              { href: "#features", label: "Features" },
              { href: "#process", label: "Process" },
              { href: "#pricing", label: "Pricing" },
              { href: "#trust", label: "Trust" },
              { href: "/demo", label: "Demo" },
              { href: "/docs", label: "Docs" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Get in touch
            </a>
            <MobileNav />
          </div>
        </div>
      </nav>

      <main id="main-content">
        {/* Hero - left aligned, editorial */}
        <section className="border-b border-border px-6 pb-20 pt-24 md:pb-28 md:pt-32">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="mb-6 text-sm font-medium uppercase tracking-widest text-primary">
                COBOL Documentation Generator
              </p>
              <h1 className="mb-8 font-serif text-4xl font-semibold leading-tight tracking-tight md:text-6xl md:leading-[1.1]">
                Five analysis passes.{" "}
                <span className="text-primary">Complete COBOL documentation.</span>
              </h1>
              <p className="mb-10 max-w-xl text-lg leading-relaxed text-muted">
                Upload your COBOL source. Receive business rules, dependency maps,
                dead code analysis, and data flow diagrams. All generated by AI
                with 1M token context. No production access required.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className="rounded bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                >
                  Request free Proof of Concept
                </a>
                <a
                  href="/demo"
                  className="rounded border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
                >
                  Try live demo
                </a>
              </div>
            </div>

            {/* Stats - horizontal, editorial */}
            <div className="mt-16 grid grid-cols-2 gap-0 border-t border-border md:grid-cols-4">
              {[
                { value: "1M", label: "Token Context" },
                { value: "5", label: "Analysis Passes" },
                { value: "14 Day", label: "Turnaround" },
                { value: "$0", label: "Production Risk" },
              ].map((stat) => (
                <div key={stat.label} className="border-r border-border py-6 pr-8 last:border-r-0">
                  <div className="font-serif text-3xl font-semibold text-foreground">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COBOL Code Preview */}
        <section className="border-b border-border px-6 py-20">
          <div className="fade-in-view mx-auto max-w-3xl">
            <div className="overflow-hidden rounded border border-border">
              <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
                <span className="ml-3 font-mono text-xs text-muted">PAYROLL-CALC.cbl</span>
              </div>
              <pre className="overflow-x-auto bg-code-bg p-5 font-mono text-xs leading-relaxed text-code-fg md:text-sm">
                <code>
                  <span className="text-[#6b7a99]">{"       "}</span>
                  <span className="text-[#e06c75]">IDENTIFICATION DIVISION.</span>
                  {"\n"}
                  <span className="text-[#6b7a99]">{"       "}</span>
                  <span className="text-[#d19a66]">PROGRAM-ID.</span>
                  <span className="text-code-fg"> PAYROLL-CALC.</span>
                  {"\n"}
                  <span className="text-[#6b7a99]">{"      *"}</span>
                  {"\n"}
                  <span className="text-[#6b7a99]">{"      * "}PAYROLL CALCULATION PROGRAM</span>
                  {"\n"}
                  <span className="text-[#6b7a99]">{"      * "}Calculates gross pay, tax, and net pay</span>
                  {"\n"}
                  <span className="text-[#6b7a99]">{"       "}</span>
                  <span className="text-[#e06c75]">PROCEDURE DIVISION.</span>
                  {"\n"}
                  <span className="text-[#6b7a99]">{"       "}</span>
                  <span className="text-[#61afef]">0000-MAIN-CONTROL.</span>
                  {"\n"}
                  <span className="text-[#6b7a99]">{"           "}</span>
                  <span className="text-[#c678dd]">PERFORM</span>
                  <span className="text-code-fg"> 1000-INITIALIZE</span>
                  {"\n"}
                  <span className="text-[#6b7a99]">{"           "}</span>
                  <span className="text-[#c678dd]">PERFORM</span>
                  <span className="text-code-fg"> 2000-PROCESS-PAYROLL</span>
                  {"\n"}
                  <span className="text-[#6b7a99]">{"               "}</span>
                  <span className="text-[#c678dd]">UNTIL</span>
                  <span className="text-code-fg"> END-OF-TIME</span>
                  {"\n"}
                  <span className="text-[#6b7a99]">{"           "}</span>
                  <span className="text-[#c678dd]">STOP RUN</span>
                  <span className="text-code-fg">.</span>
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Features - list layout, not card grid */}
        <section id="features" className="border-b border-border px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="fade-in-view mb-16 max-w-2xl">
              <hr className="rule-accent mb-6" />
              <h2 className="mb-4 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
                Five-Pass Deep Analysis
              </h2>
              <p className="text-muted">
                Every program group is analysed five times, each pass extracting a
                different dimension of understanding.
              </p>
            </div>

            <div className="space-y-0 divide-y divide-border">
              {FEATURES.map((feature) => (
                <div
                  key={feature.num}
                  className="fade-in-view grid gap-4 py-8 md:grid-cols-[80px_200px_1fr] md:gap-8"
                >
                  <span className="font-mono text-sm text-muted">
                    Pass {feature.num}
                  </span>
                  <h3 className="text-base font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - numbered steps, left aligned */}
        <section id="process" className="border-b border-border px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="fade-in-view mb-16 max-w-2xl">
              <hr className="rule-accent mb-6" />
              <h2 className="mb-4 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
                How It Works
              </h2>
              <p className="text-muted">
                No production access. No code changes. Comprehensive
                documentation delivered within 14 days.
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-3 md:gap-8">
              {STEPS.map((item) => (
                <div key={item.num} className="fade-in-view">
                  <span className="mb-4 inline-block font-serif text-5xl font-semibold text-primary/20">
                    {item.num}
                  </span>
                  <h3 className="mb-3 text-base font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Security */}
        <section id="trust" className="border-b border-border px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="fade-in-view mb-16 max-w-2xl">
              <hr className="rule-accent mb-6" />
              <h2 className="mb-4 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
                Enterprise-Grade Security
              </h2>
              <p className="text-muted">
                Your source code is your most sensitive asset. Our architecture
                ensures it stays protected at every step.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {TRUST_ITEMS.map((item) => (
                <div key={item.title} className="fade-in-view border-l-2 border-primary/30 py-1 pl-6">
                  <h3 className="mb-1 font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Verified quality scores */}
            <div className="fade-in-view mt-16 border-t border-border pt-8">
              <p className="mb-6 text-xs font-medium uppercase tracking-widest text-muted">
                Independently verified - click to audit live
              </p>
              <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
                {[
                  { score: "100", label: "Accessibility", sub: "Lighthouse", href: "https://pagespeed.web.dev/analysis/https-assay-software/lgjpfz4a8o?form_factor=mobile&hl=en&category=accessibility" },
                  { score: "100", label: "Performance", sub: "Lighthouse", href: "https://pagespeed.web.dev/analysis/https-assay-software/lgjpfz4a8o?form_factor=mobile&hl=en&category=performance" },
                  { score: "100", label: "SEO", sub: "Lighthouse", href: "https://pagespeed.web.dev/analysis/https-assay-software/lgjpfz4a8o?form_factor=mobile&hl=en&category=seo" },
                  { score: "A", label: "SSL/TLS", sub: "Qualys", href: "https://www.ssllabs.com/ssltest/analyze.html?d=assay.software" },
                  { score: "A+", label: "Security", sub: "Observatory", href: "https://developer.mozilla.org/en-US/observatory/analyze?host=assay.software" },
                  { score: "0", label: "Vulnerabilities", sub: "npm audit", href: "https://github.com/m4cd4r4/assay" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group text-center transition-colors hover:bg-surface rounded py-3"
                  >
                    <div className="font-serif text-2xl font-semibold text-primary">
                      {item.score}
                    </div>
                    <div className="mt-0.5 text-xs font-medium">{item.label}</div>
                    <div className="text-[10px] text-muted">{item.sub}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing - clean table, not cards */}
        <section id="pricing" className="border-b border-border px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="fade-in-view mb-16 max-w-2xl">
              <hr className="rule-accent mb-6" />
              <h2 className="mb-4 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
                Project-Based Pricing
              </h2>
              <p className="text-muted">
                Fixed-price engagements sized to your codebase. No subscriptions.
                No per-seat licensing. All prices in AUD.
              </p>
            </div>

            {/* Mobile: stacked */}
            <div className="space-y-6 md:hidden">
              {TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`fade-in-view border-t-2 pt-6 ${
                    tier.popular ? "border-primary" : "border-border"
                  }`}
                >
                  <div className="mb-1 flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold">{tier.name}</h3>
                    {tier.popular && (
                      <span className="text-xs font-medium uppercase tracking-wider text-primary">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mb-3 text-sm text-muted">{tier.lines} lines</p>
                  <p className="mb-4 font-serif text-3xl font-semibold">
                    {tier.price}
                    {tier.price !== "Custom" && (
                      <span className="ml-1 text-sm font-normal text-muted">AUD</span>
                    )}
                  </p>
                  <ul className="space-y-1.5 text-sm text-muted">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-1 text-primary">-</span> {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className={`mt-4 block rounded py-2.5 text-center text-sm font-medium transition-colors ${
                      tier.popular
                        ? "bg-primary text-white hover:bg-primary-hover"
                        : "border border-border hover:bg-surface"
                    }`}
                  >
                    {tier.price === "Custom" ? "Contact us" : "Get started"}
                  </a>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="fade-in-view hidden overflow-hidden rounded border border-border md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface text-left">
                    <th className="px-6 py-3 font-medium text-muted">Tier</th>
                    <th className="px-6 py-3 font-medium text-muted">Codebase</th>
                    <th className="px-6 py-3 font-medium text-muted">Price</th>
                    <th className="px-6 py-3 font-medium text-muted">Includes</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {TIERS.map((tier) => (
                    <tr key={tier.name} className={tier.popular ? "bg-primary/[0.03]" : ""}>
                      <td className="px-6 py-4 font-semibold">
                        {tier.name}
                        {tier.popular && (
                          <span className="ml-2 text-[10px] font-medium uppercase tracking-wider text-primary">
                            Popular
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted">{tier.lines} lines</td>
                      <td className="px-6 py-4 font-serif text-lg font-semibold">
                        {tier.price}
                        {tier.price !== "Custom" && (
                          <span className="ml-1 text-xs font-normal text-muted">AUD</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted">{tier.features.join(", ")}</td>
                      <td className="px-6 py-4 text-right">
                        <a
                          href="#contact"
                          className="rounded bg-primary px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-hover"
                        >
                          {tier.price === "Custom" ? "Contact" : "Start"}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-sm text-muted">
              Free 5-program Proof of Concept included with every engagement.
            </p>
          </div>
        </section>

        {/* CTA / Contact */}
        <section id="contact" className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
              Start with a free Proof of Concept.
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-muted">
              We&apos;ll document 5 of your programs at no cost. See exactly
              what you&apos;ll get before committing.
            </p>
            <ContactSection />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="" width={28} height={28} className="rounded" />
            <span className="text-sm font-medium text-muted">Assay</span>
          </div>
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Solaisoft Pty Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { href: "/blog", label: "Blog" },
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
