import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms - Assay",
  description: "Terms covering use of the assay.software portfolio website.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen px-6 py-24">
      <article className="mx-auto max-w-3xl">
        <a
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
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

        <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">
          Terms
        </h1>
        <p className="mb-12 text-muted">
          Portfolio site. Last updated: May 2026.
        </p>

        <div className="space-y-10 text-muted [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-foreground [&_a]:underline">
          <section>
            <h2>What this site is</h2>
            <p>
              assay.software is a portfolio project by Macdara
              (<a href="https://m4cd4r4.github.io/" target="_blank" rel="noopener noreferrer">m4cd4r4.github.io</a>).
              The application source is open under the MIT License at
              {" "}
              <a href="https://github.com/m4cd4r4/assay" target="_blank" rel="noopener noreferrer">github.com/m4cd4r4/assay</a>.
            </p>
          </section>

          <section>
            <h2>Use of the website</h2>
            <p>
              You may browse the site, view the demo, and read the source. The
              site is provided as-is for demonstration. There is no commercial
              service, no SLA, and no support obligation attached to using
              this domain.
            </p>
          </section>

          <section>
            <h2>Use of the source code</h2>
            <p>
              The application source is licensed under the MIT License. The
              full license text is in the
              {" "}
              <a href="https://github.com/m4cd4r4/assay/blob/master/LICENSE" target="_blank" rel="noopener noreferrer">LICENSE file</a>
              {" "}
              of the repository. In short: use it, fork it, modify it,
              redistribute it, no warranty.
            </p>
          </section>

          <section>
            <h2>Commercial engagement</h2>
            <p>
              If you would like a paid engagement based on this work, get in
              touch via the GitHub repo or my portfolio site. Engagement terms
              would be agreed in writing on a per-project basis. Nothing on
              this website constitutes such an agreement.
            </p>
          </section>

          <section>
            <h2>Disclaimer</h2>
            <p>
              The demo output is illustrative. The application analyses code
              with a large language model and can produce mistakes. Do not
              rely on any output of this software, demo or otherwise, for
              production decisions without human review.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
