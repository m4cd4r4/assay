import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Assay — COBOL Documentation Generator",
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
    title: "Assay — COBOL Documentation Generator",
    description:
      "Transform legacy COBOL codebases into comprehensive, plain-English documentation. Business rules, dependency maps, dead code detection, and data flow analysis.",
    type: "website",
    url: "https://assay.software",
    siteName: "Assay",
  },
  twitter: {
    card: "summary_large_image",
    title: "Assay — COBOL Documentation Generator",
    description:
      "Transform legacy COBOL codebases into comprehensive, plain-English documentation. Business rules, dependency maps, dead code detection, and data flow analysis.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <script
          src="https://donnacha.app/booking-widget.js"
          defer
          crossOrigin="anonymous"
          integrity="sha384-smH9/ePGp/NUu8u4+TrFVK1ry1oc8OU+WRYW+lHgmZaQXBSiwdArdLXi02KpeimG"
        />
        <script src="/booking-init.js" defer />
      </body>
    </html>
  );
}
