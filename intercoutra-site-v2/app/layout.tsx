import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import Analytics from "@/components/Analytics";
import UtmCapture from "@/components/UtmCapture";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Intercoutra | Shuttle, Airport Transfers & Tours - South Africa & Eswatini",
    template: "%s | Intercoutra",
  },
  description:
    "Premium shuttle, airport transfers and tours across South Africa and Eswatini. Safe, reliable, comfortable - chat on WhatsApp for a quote.",
  openGraph: {
    type: "website",
    siteName: "Intercoutra",
    locale: "en_ZA",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <a href="#main-content" className="visually-hidden">
          Skip to main content
        </a>
        <UtmCapture />
        <Analytics />
        <TopBar />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
