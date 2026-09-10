import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const heading = Inter({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-heading"
});

const body = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`
  },
  description: site.description,
  icons: {
    icon: site.icon
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
