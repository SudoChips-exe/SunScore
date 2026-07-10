import { Zap, TrendingDown, Leaf, Clock, Shield, Headset } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Reliable Power",
    description:
      "Get consistent, clean electricity for your home or business. No more outages or load-shedding disruptions.",
  },
  {
    icon: TrendingDown,
    title: "Lower Costs",
    description:
      "Your SunScore shows exactly how much you'd save compared to fuel and diesel and it only improves as fuel prices rise.",
  },
  {
    icon: Leaf,
    title: "Zero Emissions",
    description:
      "Cut your carbon footprint. Solar is clean, renewable, and doesn't produce toxic fumes or noise pollution.",
  },
  {
    icon: Clock,
    title: "Fast Installation",
    description: "Professional installation in days, not weeks. Start generating power almost immediately.",
  },
  {
    icon: Shield,
    title: "Warranty Coverage",
    description: "Long-term panel and system warranties from our matched providers protect your investment.",
  },
  {
    icon: Headset,
    title: "Expert Support",
    description:
      "Dedicated support from your matched provider for maintenance, upgrades, or technical questions.",
  },
];

export function Features() {
  return (
    <section id="features" className="w-full bg-white px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="mb-4 block text-sm font-semibold uppercase tracking-wide text-brand-stone-500">
            Why Choose Solar
          </span>
          <h2 className="mb-6 font-display text-4xl font-medium leading-tight text-brand-stone-900 md:text-5xl">
            Benefits that matter
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-brand-stone-600">
            Beyond savings, solar gives you reliable power, environmental responsibility, and peace of
            mind.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-brand-stone-200 bg-white p-8 transition-all hover:border-brand-gold-300 hover:shadow-lg"
            >
              <div className="mb-4 text-brand-gold-600">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-brand-stone-900">{feature.title}</h3>
              <p className="leading-relaxed text-brand-stone-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
