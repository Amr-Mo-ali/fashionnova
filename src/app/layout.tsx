import { CartProvider } from "@/components/store/CartProvider";
import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&family=JetBrains+Mono&display=swap" rel="stylesheet" />
      </head>
      <body className={`${outfit.className} flex min-h-full flex-col bg-[#09090B] text-[#FAFAFA]`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
