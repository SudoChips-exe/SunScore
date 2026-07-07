import type { Metadata } from "next";
import { SunScoreProvider } from "@/context/SunScoreContext";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "SunScore",
  description:
    "See how your existing diesel spend already covers an equivalent solar PAYGo plan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${playfair.variable} font-sans bg-brand-stone-50 text-brand-stone-900 antialiased`}>
        <SunScoreProvider>{children}</SunScoreProvider>
      </body>
    </html>
  );
}
