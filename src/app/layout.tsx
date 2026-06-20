import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = "https://fmashfaq.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "F.M. Ashfaq — Software engineer & applied-security researcher",
    template: "%s — F.M. Ashfaq",
  },
  description:
    "F.M. Ashfaq builds full-stack systems and studies how they behave under real constraints — secure engineering, post-quantum IoT research, AI-assisted threat detection, and accessible health technology. Based in Perth, working at CodeXGate and studying at Curtin University.",
  keywords: [
    "F.M. Ashfaq",
    "software engineer Perth",
    "applied security research",
    "post-quantum cryptography MQTT",
    "Bengali Sign Language translation",
    "full-stack engineering",
    "Next.js",
    "IEEE federated metaverse authentication",
    "Curtin University",
    "CodeXGate",
  ],
  authors: [{ name: "F.M. Ashfaq" }],
  creator: "F.M. Ashfaq",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteUrl,
    siteName: "F.M. Ashfaq",
    title: "F.M. Ashfaq — Software engineer & applied-security researcher",
    description:
      "Full-stack systems and applied security research, built and tested under real constraints. Perth, Australia.",
  },
  twitter: {
    card: "summary_large_image",
    title: "F.M. Ashfaq — Software engineer & applied-security researcher",
    description:
      "Full-stack systems and applied security research, built and tested under real constraints.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6f9" },
    { media: "(prefers-color-scheme: dark)", color: "#131520" },
  ],
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "F.M. Ashfaq",
  url: siteUrl,
  email: "mailto:ashfaq601230@gmail.com",
  jobTitle: "Software Engineer",
  worksFor: { "@type": "Organization", name: "CodeXGate" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Curtin University" },
    { "@type": "CollegeOrUniversity", name: "BRAC University" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Perth",
    addressRegion: "WA",
    addressCountry: "AU",
  },
  sameAs: [
    "https://github.com/ShakChunni",
    "https://www.linkedin.com/in/f-m-ashfaq/",
    "https://www.researchgate.net/profile/Fm-Ashfaq",
    "https://scholar.google.com/citations?user=-tP7SxwAAAAJ&hl=en",
    "https://doi.org/10.1109/ICICT64387.2024.10839681",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        geistSans.variable,
        geistMono.variable,
        instrumentSerif.variable,
        "h-full antialiased",
      )}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="bg-grid flex min-h-full flex-col font-sans text-ink">
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>
            <ScrollProgress />
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xs focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
            >
              Skip to content
            </a>
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var s=localStorage.getItem('theme');if(s==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()`,
        }}
      />
      {children}
    </>
  );
}
