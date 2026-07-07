interface AmbientBackgroundProps {
  tone?: "gold" | "green";
}

/**
 * Carries the landing page's editorial signature (skewed panel + blur blob)
 * onto the product screens so /calculate, /results, /offers don't read as a
 * context switch away from the marketing page.
 */
export function AmbientBackground({ tone = "gold" }: AmbientBackgroundProps) {
  const panel = tone === "gold" ? "bg-brand-gold-50/50" : "bg-brand-green-50/60";
  const blob = tone === "gold" ? "bg-brand-gold-100/40" : "bg-brand-green-100/40";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className={`absolute top-0 right-0 h-full w-1/3 -skew-x-12 translate-x-20 ${panel}`} />
      <div className={`absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl ${blob}`} />
    </div>
  );
}
