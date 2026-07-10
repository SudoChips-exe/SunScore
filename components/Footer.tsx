import Link from "next/link";
import { ScrollNavButton } from "@/components/ScrollNavButton";

type FooterLink = { label: string } | { label: string; scrollTo: string } | { label: string; href: string };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", scrollTo: "process" },
      { label: "Savings", href: "/calculate" },
      { label: "Pricing" },
      { label: "Features", scrollTo: "features" },
    ],
  },
  {
    title: "Company",
    links: [{ label: "About" }, { label: "Blog" }, { label: "Careers" }, { label: "Contact" }],
  },
  {
    title: "Partnerships",
    links: [{ label: "Installers" }, { label: "Financiers" }, { label: "Distributors" }, { label: "API" }],
  },
  {
    title: "Legal",
    links: [{ label: "Privacy" }, { label: "Terms" }, { label: "Security" }],
  },
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  if ("scrollTo" in link) {
    return (
      <ScrollNavButton targetId={link.scrollTo} className="transition hover:text-white">
        {link.label}
      </ScrollNavButton>
    );
  }
  if ("href" in link) {
    return (
      <Link href={link.href} className="transition hover:text-white">
        {link.label}
      </Link>
    );
  }
  return <span className="cursor-default text-brand-stone-500">{link.label}</span>;
}

export function Footer() {
  return (
    <footer className="w-full bg-brand-stone-900 text-brand-stone-400">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-16">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-5">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.svg" alt="SunScore" className="mb-6 h-11 w-auto rounded-lg" />
            <p className="text-sm leading-relaxed">
              Powering Nigeria with affordable, clean solar energy through innovative PAYGo financing.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h5 className="mb-4 font-semibold text-white">{column.title}</h5>
              <ul className="space-y-2 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-brand-stone-500">© 2026 SunScore. All rights reserved.</p>
            <div className="flex gap-6">
              {["Twitter", "LinkedIn", "Instagram"].map((social) => (
                <span key={social} className="cursor-default text-sm text-brand-stone-600">
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
