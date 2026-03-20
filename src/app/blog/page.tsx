import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Assay",
  description:
    "Articles on COBOL documentation, legacy modernization, business rules extraction, and AI-powered code analysis.",
  openGraph: {
    title: "Blog - Assay",
    description:
      "Articles on COBOL documentation, legacy modernization, business rules extraction, and AI-powered code analysis.",
    type: "website",
    url: "https://assay.software/blog",
    siteName: "Assay",
  },
  alternates: {
    canonical: "https://assay.software/blog",
  },
};

const ARTICLES = [
  {
    slug: "cobol-documentation-guide",
    title:
      "The Complete Guide to COBOL Documentation: Why It Matters and How AI Changes Everything",
    description:
      "800 billion lines of COBOL still run the world's banks, insurers, and government agencies. Most of it is undocumented. Here is what you need to know.",
    date: "2026-03-17",
    readingTime: "9 min read",
  },
] as const;

export default function BlogPage() {
  return (
    <div className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
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

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Blog
        </h1>
        <p className="mb-12 text-[#8899bb]">
          Articles on COBOL documentation, legacy modernization, and AI-powered
          code analysis.
        </p>

        <div className="space-y-6">
          {ARTICLES.map((article) => (
            <a
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group block rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-[#00d4ff]/20 hover:bg-[#00d4ff]/[0.03]"
            >
              <div className="mb-3 flex items-center gap-4 text-xs text-muted">
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span aria-hidden="true">-</span>
                <span>{article.readingTime}</span>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white transition-colors group-hover:text-[#00d4ff]">
                {article.title}
              </h2>
              <p className="text-sm leading-relaxed text-[#8899bb]">
                {article.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
