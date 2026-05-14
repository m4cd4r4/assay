import type { Metadata } from "next";
import { headers } from "next/headers";
import { JetBrains_Mono, DM_Sans, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://assay.software"),
  title: "Assay - COBOL Documentation Generator (Portfolio Project)",
  description:
    "Portfolio project by Macdara. A production-ready Next.js application that turns COBOL source into business rules, dependency maps, dead code reports, and data flow diagrams using Claude. Open source. Available on request.",
  keywords: [
    "COBOL",
    "documentation",
    "legacy modernization",
    "AI",
    "Claude",
    "Anthropic",
    "banking",
    "mainframe",
  ],
  openGraph: {
    title: "Assay - COBOL Documentation Generator (Portfolio Project)",
    description:
      "Portfolio project. Five-pass AI analysis of legacy COBOL: business rules, dependency maps, dead code, data flow. Open source, available on request.",
    type: "website",
    url: "https://assay.software",
    siteName: "Assay",
  },
  twitter: {
    card: "summary_large_image",
    title: "Assay - COBOL Documentation Generator (Portfolio Project)",
    description:
      "Portfolio project. Five-pass AI analysis of legacy COBOL: business rules, dependency maps, dead code, data flow. Open source, available on request.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Assay",
    description:
      "Portfolio project. Automated COBOL documentation generator powered by Claude. Business rules, dependency maps, dead code detection, and data flow analysis. Open source, available on request.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    codeRepository: "https://github.com/m4cd4r4/assay",
    creator: {
      "@type": "Person",
      name: "Macdara",
      url: "https://m4cd4r4.github.io/",
    },
  };

  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <script
          nonce={nonce}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
