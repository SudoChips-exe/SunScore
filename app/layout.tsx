import type { Metadata } from "next";
import { SunScoreProvider } from "@/context/SunScoreContext";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
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
    "See how your existing fuel and diesel spend already covers an equivalent solar PAYGo plan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-brand-stone-50 text-brand-stone-900 antialiased`}>
        {/* Grain overlay — the one texture that ties every screen back to the landing page's editorial feel */}
        <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <SunScoreProvider>{children}</SunScoreProvider>
      </body>
    </html>
  );
}
