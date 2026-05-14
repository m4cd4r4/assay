import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy - Assay",
  description:
    "Privacy notice for the assay.software portfolio website.",
};

export default function PrivacyPage() {
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
          Privacy
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
              The source is open under MIT at
              {" "}
              <a href="https://github.com/m4cd4r4/assay" target="_blank" rel="noopener noreferrer">github.com/m4cd4r4/assay</a>.
              No production COBOL intake pipeline runs from this domain.
            </p>
          </section>

          <section>
            <h2>What the website collects</h2>
            <ul>
              <li>
                <strong>Vercel Analytics</strong> — anonymous page views and
                referrer data. No cookies, no cross-site tracking, no personal
                identifiers.
              </li>
              <li>
                <strong>Server logs</strong> — request IPs and user agents,
                retained briefly for abuse prevention by the hosting provider
                (Vercel).
              </li>
            </ul>
            <p>
              That is the complete list. The site does not use cookies for
              tracking, does not run third-party ad scripts, and does not sell
              or share data.
            </p>
          </section>

          <section>
            <h2>The demo page</h2>
            <p>
              The /demo page replays a pre-generated analysis of a sample COBOL
              program. It does not accept your code, does not call the Anthropic
              API at runtime, and does not store any input from you.
            </p>
          </section>

          <section>
            <h2>If you contact me</h2>
            <p>
              Any email you send (e.g. via the GitHub repo or my portfolio
              site) is retained as a normal email exchange. I do not add it to
              a mailing list or share it with anyone.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Issues or questions:
              {" "}
              <a href="https://github.com/m4cd4r4/assay/issues" target="_blank" rel="noopener noreferrer">github.com/m4cd4r4/assay/issues</a>.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
