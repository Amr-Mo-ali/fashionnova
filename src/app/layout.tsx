import { CartProvider } from "@/components/store/CartProvider";
import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "900"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FashionNova",
  description: "Dramatic luxury. Crafted for those who dress with intention.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className={`${outfit.className} flex min-h-full flex-col bg-[#f5f2ed] text-[#0f0e0d]`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
