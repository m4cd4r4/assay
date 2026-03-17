import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Assay",
  description:
    "How Assay handles your data. Privacy-first architecture for enterprise COBOL documentation.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 py-24">
      <article className="mx-auto max-w-3xl">
        <a
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-white"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Assay
        </a>

        <h1 className="mb-2 text-4xl font-bold tracking-tight text-white">
          Privacy Policy
        </h1>
        <p className="mb-12 text-muted">
          Solaisoft Pty Ltd trading as Assay. Last updated: March 2026.
        </p>

        <div className="space-y-10 text-[#c0c8d8] [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
          <section>
            <h2>1. Who We Are</h2>
            <p>
              Assay is a read-only COBOL documentation generation service
              operated by Solaisoft Pty Ltd, an Australian proprietary company.
              We generate comprehensive documentation from COBOL source code
              using AI analysis. We never modify, execute, or deploy source
              code.
            </p>
          </section>

          <section>
            <h2>2. Data We Collect</h2>
            <h3>2.1 Business Contact Information</h3>
            <ul>
              <li>Company name, contact name, email address, phone number</li>
              <li>Billing information (processed via Stripe — we do not store card details)</li>
            </ul>

            <h3>2.2 Source Code (Temporary)</h3>
            <ul>
              <li>COBOL source files (.cbl, .cpy) provided by you for analysis</li>
              <li>Source code is processed via the Anthropic API and is <strong>not stored persistently</strong></li>
              <li>All source copies are deleted within 30 days of delivery, with written confirmation</li>
            </ul>

            <h3>2.3 Generated Documentation</h3>
            <ul>
              <li>The documentation we generate from your source code</li>
              <li>Retained until you request deletion</li>
              <li>Ownership of generated documentation transfers to you upon payment</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Process Source Code</h2>
            <p>
              Your source code follows a strict processing pipeline:
            </p>
            <ul>
              <li>
                <strong>Intake:</strong> Encrypted file transfer (SFTP or
                encrypted ZIP)
              </li>
              <li>
                <strong>Processing:</strong> Transmitted to Anthropic&apos;s
                API over TLS 1.3. Under Anthropic&apos;s commercial terms,
                inputs are <strong>not used for model training</strong>.
              </li>
              <li>
                <strong>Storage:</strong> No persistent storage of source code.
                Files exist only in memory during processing.
              </li>
              <li>
                <strong>Delivery:</strong> Time-limited secure download link
                for generated documentation
              </li>
              <li>
                <strong>Deletion:</strong> All source copies destroyed within
                30 days of delivery. Written confirmation provided.
              </li>
            </ul>
          </section>

          <section>
            <h2>4. Who Has Access</h2>
            <p>
              Access to your source code is strictly limited to:
            </p>
            <ul>
              <li>
                <strong>Macdara (Director, Solaisoft Pty Ltd)</strong> — sole
                operator with access to source files during processing
              </li>
              <li>
                <strong>Anthropic API</strong> — processes source code under
                commercial terms (no training, no retention beyond API call)
              </li>
            </ul>
            <p>
              No other employees, contractors, or third parties have access to
              your source code.
            </p>
          </section>

          <section>
            <h2>5. Third-Party Processors</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-muted">
                  <th className="pb-2 pr-4">Processor</th>
                  <th className="pb-2 pr-4">Purpose</th>
                  <th className="pb-2">Data</th>
                </tr>
              </thead>
              <tbody className="text-[#c0c8d8]">
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">Anthropic</td>
                  <td className="py-2 pr-4">AI analysis</td>
                  <td className="py-2">Source code (transient)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">Stripe</td>
                  <td className="py-2 pr-4">Payment processing</td>
                  <td className="py-2">Billing details</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">Vercel</td>
                  <td className="py-2 pr-4">Website hosting</td>
                  <td className="py-2">Web analytics (anonymous)</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>6. Data Retention</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-muted">
                  <th className="pb-2 pr-4">Data Type</th>
                  <th className="pb-2">Retention Period</th>
                </tr>
              </thead>
              <tbody className="text-[#c0c8d8]">
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">Source code</td>
                  <td className="py-2">Deleted within 30 days of delivery</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">Generated documentation</td>
                  <td className="py-2">Until customer requests deletion</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">Business contact info</td>
                  <td className="py-2">Duration of relationship + 7 years (tax)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">Invoices/billing records</td>
                  <td className="py-2">7 years (Australian tax law)</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>7. Your Rights</h2>
            <p>
              Under the Australian Privacy Act 1988, you have the right to:
            </p>
            <ul>
              <li>Access your personal information held by us</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data (subject to legal retention requirements)</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Lodge a complaint with the Office of the Australian Information Commissioner (OAIC)</li>
            </ul>
          </section>

          <section>
            <h2>8. Security Measures</h2>
            <ul>
              <li>TLS 1.3 encryption for all data in transit</li>
              <li>Encrypted file transfer for source code intake</li>
              <li>No persistent storage of source code</li>
              <li>Stripe PCI-DSS Level 1 for payment processing</li>
              <li>Professional Indemnity insurance to $10M (via ACS membership)</li>
            </ul>
          </section>

          <section>
            <h2>9. Changes to This Policy</h2>
            <p>
              We will notify existing customers of material changes via email at
              least 14 days before they take effect. The current version is
              always available at assay.software/privacy.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>
              For privacy enquiries or data requests:
            </p>
            <ul>
              <li>Email: privacy@assay.software</li>
              <li>Mail: Solaisoft Pty Ltd, Perth, Western Australia</li>
            </ul>
          </section>
        </div>
      </article>
    </div>
  );
}
