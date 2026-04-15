import { CartProvider } from "@/components/store/CartProvider";
import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700", "900"],
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
      className={`${cormorant.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant_Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700;900&family=JetBrains+Mono&display=swap" rel="stylesheet" />
      </head>
      <body className={`${dmSans.className} flex min-h-full flex-col bg-[#f5f2ed] text-[#0f0e0d]`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
