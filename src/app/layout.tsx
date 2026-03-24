import { CartProvider } from "@/components/store/CartProvider";
import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-playfair",
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
      className={`${dmSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body
        className={`${dmSans.className} flex min-h-full flex-col bg-[#f5f2ed] text-[#0f0e0d]`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
