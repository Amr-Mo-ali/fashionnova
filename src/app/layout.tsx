import { CartProvider } from "@/components/store/CartProvider";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Cairo } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FashionNova",
  description: "FashionNova — luxury fashion, refined for you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className={`${inter.className} flex min-h-full flex-col bg-[var(--cream)] text-[var(--ink)]`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
