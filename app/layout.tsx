import type { Metadata } from "next";
import { SunScoreProvider } from "@/context/SunScoreContext";
import { AuthProvider } from "@/context/AuthContext";
import { SiteHeader } from "@/components/SiteHeader";
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
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-brand-stone-50 text-brand-stone-900 antialiased`}>
        {/* Grain overlay — the one texture that ties every screen back to the landing page's
            editorial feel. Self-hosted as an inline SVG data URI (feTurbulence noise) instead of
            an external asset, so it never depends on a third-party host being reachable. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyMDAnIGhlaWdodD0nMjAwJz48ZmlsdGVyIGlkPSduJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nMC45JyBudW1PY3RhdmVzPScyJyBzdGl0Y2hUaWxlcz0nc3RpdGNoJy8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsdGVyPSd1cmwoJTIzbiknLz48L3N2Zz4K')",
          }}
        />
        <AuthProvider>
          <SunScoreProvider>
            <SiteHeader />
            {children}
          </SunScoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
