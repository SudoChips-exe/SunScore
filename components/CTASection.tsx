import Link from "next/link";
import { ScrollNavButton } from "@/components/ScrollNavButton";

export function CTASection() {
  return (
    <section className="bg-brand-stone-900 px-6 py-20 md:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-6 font-display text-4xl font-medium text-white md:text-5xl">
          Ready to switch to clean energy?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-brand-stone-300">
          Join Nigerian families and businesses saving money and protecting the environment with solar
          PAYGo plans.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/calculate"
            className="rounded-full bg-brand-gold-500 px-8 py-3 text-lg font-semibold text-brand-stone-900 transition hover:bg-brand-gold-600"
          >
            Start Your Savings
          </Link>
          <ScrollNavButton
            targetId="comparison"
            className="rounded-full border border-white/30 px-8 py-3 text-lg font-semibold text-white transition hover:bg-white/10"
          >
            See The Comparison
          </ScrollNavButton>
        </div>
      </div>
    </section>
  );
}
