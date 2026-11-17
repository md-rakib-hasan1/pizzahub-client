
import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PizzaHub | Good Food, Great Moments",
    template: "%s | PizzaHub",
  },
  description:
    "Discover local pizza restaurants, explore delicious menus, and enjoy fresh pizza delivered to your door with PizzaHub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${fraunces.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
