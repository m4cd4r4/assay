import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Assay",
  description:
    "Terms governing Assay documentation generation engagements.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen px-6 py-24">
      <article className="mx-auto max-w-3xl">
        <a
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#6b7a99] transition-colors hover:text-white"
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

        <div className="mb-8 rounded-xl border border-[#f0b429]/20 bg-[#f0b429]/5 px-5 py-3">
          <p className="text-sm text-[#f0b429]">
            <strong>Draft</strong> — These terms are pending formal legal review.
            Last updated: February 2026.
          </p>
        </div>

        <h1 className="mb-2 text-4xl font-bold tracking-tight text-white">
          Terms of Service
        </h1>
        <p className="mb-12 text-[#6b7a99]">
          Solaisoft Pty Ltd (ABN pending) trading as Assay
        </p>

        <div className="space-y-10 text-[#c0c8d8] [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
          <section>
            <h2>1. Service Description</h2>
            <p>
              Assay provides documentation generation for
              COBOL codebases. The Service is <strong>read-only</strong> — we
              analyse source code and produce documentation. We do not modify,
              compile, execute, or deploy any source code. We do not access
              production systems.
            </p>
            <p>
              The Service produces: program overviews, business rule
              catalogues, dependency maps, dead code reports, and data flow
              analysis, delivered as a searchable knowledge base.
            </p>
          </section>

          <section>
            <h2>2. Engagement Process</h2>
            <ul>
              <li>
                <strong>Scoping:</strong> Customer provides codebase size
                estimate. We provide a fixed-price quote based on tier (S/M/L/XL).
              </li>
              <li>
                <strong>NDA:</strong> Mutual NDA executed before any source code
                is shared.
              </li>
              <li>
                <strong>Transfer:</strong> Customer provides a static copy of
                source files via encrypted transfer. No production access
                required.
              </li>
              <li>
                <strong>Processing:</strong> We analyse the source code and
                generate documentation.
              </li>
              <li>
                <strong>Delivery:</strong> Documentation delivered via secure,
                time-limited download link.
              </li>
              <li>
                <strong>Review:</strong> 14-day acceptance period for Customer
                review.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Payment Terms</h2>
            <ul>
              <li>50% of the engagement fee due upon execution of the engagement agreement</li>
              <li>50% due upon delivery of the completed knowledge base</li>
              <li>Payment terms: Net 14 from invoice date</li>
              <li>All prices quoted in AUD and exclude GST unless stated otherwise</li>
              <li>Payments processed via Stripe</li>
            </ul>
          </section>

          <section>
            <h2>4. Intellectual Property</h2>
            <h3>4.1 Customer Source Code</h3>
            <p>
              The Customer retains all intellectual property rights in their
              source code. We acquire no rights to your source code beyond the
              limited licence to process it for documentation generation.
            </p>

            <h3>4.2 Generated Documentation</h3>
            <p>
              Upon full payment, ownership of the generated documentation
              transfers to the Customer. The Customer may use, modify, and
              distribute the documentation internally without restriction.
            </p>

            <h3>4.3 Our Tools and Methods</h3>
            <p>
              We retain ownership of our processing pipeline, prompt templates,
              and analytical methods. Nothing in these terms grants the Customer
              rights to our proprietary tools.
            </p>
          </section>

          <section>
            <h2>5. Confidentiality</h2>
            <p>
              All source code provided by the Customer is treated as
              Confidential Information. Our obligations include:
            </p>
            <ul>
              <li>All source copies deleted within 30 days of delivery, with written confirmation</li>
              <li>Confidentiality survives 3 years post-engagement</li>
              <li>Access limited to the Director of Solaisoft Pty Ltd only</li>
              <li>Source code processed via Anthropic API under commercial terms (not used for training)</li>
              <li>No reverse engineering of business logic</li>
            </ul>
            <p>
              A separate Mutual NDA is executed before any source code is
              shared. The NDA terms supplement these Terms of Service.
            </p>
          </section>

          <section>
            <h2>6. Warranties and Disclaimers</h2>
            <h3>6.1 What We Warrant</h3>
            <ul>
              <li>Documentation will be generated using commercially reasonable AI analysis</li>
              <li>We will process your source code in accordance with our Privacy Policy</li>
              <li>All source copies will be deleted within the stated timeframe</li>
            </ul>

            <h3>6.2 What We Do Not Warrant</h3>
            <ul>
              <li>
                Documentation is generated by AI and may contain inaccuracies.
                It should be reviewed by qualified personnel before reliance.
              </li>
              <li>
                We do not warrant that the documentation is complete or free
                from errors.
              </li>
              <li>
                We do not warrant fitness for any particular purpose, including
                regulatory compliance, audit, or legal proceedings.
              </li>
              <li>
                We do not provide COBOL consulting, code modification, or
                modernisation services.
              </li>
            </ul>
          </section>

          <section>
            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by Australian law:
            </p>
            <ul>
              <li>
                Our total liability for any claim arising from or related to
                the Service is limited to the <strong>fees paid by the Customer
                for the specific engagement</strong> giving rise to the claim.
              </li>
              <li>
                We are not liable for indirect, consequential, incidental, or
                punitive damages, including lost profits, lost data, or
                business interruption.
              </li>
              <li>
                We are not liable for any decisions made based on the generated
                documentation.
              </li>
            </ul>
          </section>

          <section>
            <h2>8. Acceptance and Review</h2>
            <ul>
              <li>
                Customer has 14 days from delivery to review the documentation
                and raise any material concerns.
              </li>
              <li>
                Material concerns include: missing programs, incorrect program
                identification, or failure to process agreed-upon files.
              </li>
              <li>
                We will re-process affected sections at no additional cost for
                valid material concerns.
              </li>
              <li>
                After the 14-day review period, the deliverable is deemed
                accepted.
              </li>
            </ul>
          </section>

          <section>
            <h2>9. Termination</h2>
            <ul>
              <li>
                Either party may terminate an engagement with 7 days written
                notice.
              </li>
              <li>
                If the Customer terminates before delivery, the upfront deposit
                (50%) is non-refundable.
              </li>
              <li>
                If we terminate before delivery, the upfront deposit is
                refunded in full.
              </li>
              <li>
                Upon termination, all source code copies are deleted within 30
                days.
              </li>
            </ul>
          </section>

          <section>
            <h2>10. Governing Law</h2>
            <p>
              These terms are governed by the laws of Western Australia,
              Australia. The parties submit to the exclusive jurisdiction of
              the courts of Western Australia.
            </p>
          </section>

          <section>
            <h2>11. Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. Changes do not
              apply retroactively to existing engagements. The current version
              is always available at assay.software/terms.
            </p>
          </section>

          <section>
            <h2>12. Contact</h2>
            <p>For enquiries about these terms:</p>
            <ul>
              <li>Email: legal@assay.software</li>
              <li>Mail: Solaisoft Pty Ltd, Perth, Western Australia</li>
            </ul>
          </section>
        </div>
      </article>
    </div>
  );
}
