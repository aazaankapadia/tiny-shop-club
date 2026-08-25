import type { Metadata } from "next";
import { Outfit, Manrope } from "next/font/google";
import "./globals.css";

const display = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const title = "Tiny Shop Club | Safe Educational Marketplace for Kids";
const description =
  "Tiny Shop Club is a safe, parent-supervised educational platform where children learn entrepreneurship, creativity, and responsible buying and selling.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tinyshopclub.com"),
  title: {
    default: title,
    template: "%s | Tiny Shop Club",
  },
  description,
  applicationName: "Tiny Shop Club",
  keywords: [
    "Tiny Shop Club",
    "kids marketplace",
    "educational entrepreneurship",
    "parent supervised",
    "Family Link",
    "neighborhood shop",
  ],
  openGraph: {
    title,
    description,
    url: "https://www.tinyshopclub.com",
    siteName: "Tiny Shop Club",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
