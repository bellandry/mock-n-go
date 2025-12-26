import { ThemeProvider } from "@/components/theme-provider";
import { AnchoredToastProvider, ToastProvider } from "@/components/ui/toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://mngo.laclass.dev";
const siteName = "Mock'n Go";
const siteDescription = "Create realistic REST API mocks instantly. No configuration, no setup. Perfect for frontend development, testing, and prototyping. Generate mock APIs in seconds with pagination, realistic data, and full REST support.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Instant REST API Mock Generator`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "mock api",
    "rest api mock",
    "api mocking",
    "mock data generator",
    "fake api",
    "api testing",
    "frontend development",
    "api prototyping",
    "mock server",
    "rest api testing",
    "json api mock",
    "api simulator",
    "mock endpoint",
    "development tools",
    "faker.js",
    "mock data",
    "api development",
    "testing tools",
    "mock rest api",
    "instant api",
  ],
  authors: [{ name: "Landry Bella", url: "https://laclass.dev" }],
  creator: "Landry Bella",
  publisher: "Laclass Dev",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: `${siteName} - Instant REST API Mock Generator`,
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteName} - Create realistic REST API mocks instantly`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Instant REST API Mock Generator`,
    description: siteDescription,
    images: [`${siteUrl}/og-image.png`],
    creator: "@laclassdev",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "bnPn80YYA1gjbgGfodk9Oq2gXCkpkXEIXcPtL7tnAHU",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <head>
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: siteName,
              url: siteUrl,
              description: siteDescription,
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "100",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <AnchoredToastProvider>{children}</AnchoredToastProvider>
          </ToastProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
