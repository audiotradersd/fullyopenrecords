import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "../components/auth/AuthProvider";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import RadioPlayerBar from "../components/player/RadioPlayerBar";
import { TrackPlayerProvider } from "../components/audio/TrackPlayerProvider";
import "./globals.css";
import { siteConfig } from "../lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.url
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-X10VP8P30J" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag("js", new Date());
gtag("config", "G-X10VP8P30J");`}
        </Script>
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} flex min-h-screen flex-col`}>
        <AuthProvider>
          <TrackPlayerProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <RadioPlayerBar />
          </TrackPlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
