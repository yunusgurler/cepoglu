import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";

const heading = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["700", "800"],
});

const body = Sora({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Çepoğlu",
  description: "Premium inşaat ve taahhüt projeleri için kurumsal web sitesi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${heading.variable} ${body.variable}`}>
        {children}
      </body>
    </html>
  );
}
