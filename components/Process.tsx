import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ScrollNavButton } from "@/components/ScrollNavButton";

type Step = {
  number: string;
  title: string;
  description: string;
  cta: string;
  image: string;
} & ({ href: string } | { scrollTo: string });

const STEPS: Step[] = [
  {
    number: "Step 1",
    title: "Enter your current fuel & diesel costs honestly",
    description:
      "Tell us what you spend on fuel and repairs. The numbers don't lie and neither should you.",
    cta: "Start",
    href: "/calculate",
    image: "/process-step1.jpg",
  },
  {
    number: "Step 2",
    title: "Get your SunScore and a personalized plan",
    description:
      "We compute a real, auditable score and build a PAYGo plan that matches your budget.",
    cta: "See how",
    scrollTo: "comparison",
    image: "/process-step2.png",
  },
  {
    number: "Step 3",
    title: "Switch to clean, reliable power and save",
    description:
      "Installation is fast. The power is quiet. The savings start the moment the sun hits the panels.",
    cta: "Get matched",
    href: "/calculate",
    image: "/process-step3.jpg",
  },
];

export function Process() {
  return (
    <section id="process" className="w-full bg-white px-6 py-24 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 space-y-6 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-brand-stone-500">
            Process
          </span>
          <h2 className="font-display text-4xl font-medium leading-tight text-brand-stone-900 md:text-5xl">
            How it works
          </h2>
          <p className="text-xl text-brand-stone-600">
            A clean break from the fuel and diesel life in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="relative flex h-96 flex-col justify-between overflow-hidden rounded-3xl bg-brand-stone-900 p-8 text-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={step.image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-brand-stone-900/60 via-brand-stone-900/70 to-brand-stone-900/90" />

              <div className="relative z-10 space-y-6">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wide text-brand-gold-300">
                    {step.number}
                  </span>
                  <h3 className="mt-2 font-display text-3xl font-medium leading-tight">{step.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-brand-stone-200">{step.description}</p>
              </div>

              {"scrollTo" in step ? (
                <ScrollNavButton
                  targetId={step.scrollTo}
                  className="relative z-10 flex items-center gap-2 text-lg font-medium text-white transition hover:text-brand-gold-300"
                >
                  {step.cta}
                  <ChevronRight size={20} />
                </ScrollNavButton>
              ) : (
                <Link
                  href={step.href}
                  className="relative z-10 flex items-center gap-2 text-lg font-medium text-white transition hover:text-brand-gold-300"
                >
                  {step.cta}
                  <ChevronRight size={20} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
