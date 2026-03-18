import type { Metadata } from "next";
import { JetBrains_Mono, DM_Sans, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { headers } from "next/headers";
import Script from "next/script";
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
  title: "Assay - COBOL Documentation Generator",
  description:
    "Transform legacy COBOL codebases into comprehensive, plain-English documentation. Business rules, dependency maps, dead code detection, and data flow analysis powered by Claude Opus 4.6.",
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
    title: "Assay - COBOL Documentation Generator",
    description:
      "Transform legacy COBOL codebases into comprehensive, plain-English documentation. Business rules, dependency maps, dead code detection, and data flow analysis.",
    type: "website",
    url: "https://assay.software",
    siteName: "Assay",
  },
  twitter: {
    card: "summary_large_image",
    title: "Assay - COBOL Documentation Generator",
    description:
      "Transform legacy COBOL codebases into comprehensive, plain-English documentation. Business rules, dependency maps, dead code detection, and data flow analysis.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Assay",
    description:
      "Automated COBOL documentation generator powered by Claude Opus 4.6. Business rules, dependency maps, dead code detection, and data flow analysis.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "AUD",
      lowPrice: "1250",
      highPrice: "6000",
    },
    creator: {
      "@type": "Organization",
      name: "Solaisoft",
      url: "https://solaisoft.com",
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
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script src="/booking-init.js" strategy="lazyOnload" nonce={nonce} />
      </body>
    </html>
  );
}
