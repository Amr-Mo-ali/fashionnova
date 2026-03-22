import { CartProvider } from "@/components/store/CartProvider";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
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
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body
        className={`${inter.className} flex min-h-full flex-col bg-zinc-950 text-zinc-100`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
