import type { Offer } from "@/types";
import { Naira } from "@/components/Naira";
import { useSunScore } from "@/context/SunScoreContext";
import { DIESEL_KG_CO2_PER_LITRE } from "@/lib/sunScore";

interface OfferCardProps {
  offer: Offer;
  showBadge: boolean;
}

// Each provider gets a distinct accent so the list reads as real matching,
// not three identical cards with different names swapped in.
const PROVIDER_ACCENT: Record<Offer["provider"], { bar: string; chip: string; text: string }> = {
  Lumos: { bar: "bg-brand-gold-500", chip: "bg-brand-gold-100", text: "text-brand-gold-700" },
  Arnergy: { bar: "bg-sky-500", chip: "bg-sky-100", text: "text-sky-700" },
  "d.light": { bar: "bg-rose-500", chip: "bg-rose-100", text: "text-rose-700" },
};

export function OfferCard({ offer, showBadge }: OfferCardProps) {
  const { inputs } = useSunScore();
  const accent = PROVIDER_ACCENT[offer.provider];

  const annualCO2Saved = inputs 
    ? Math.round((inputs.dieselSpend / (inputs.dieselPricePerLitre || 1)) * 12 * DIESEL_KG_CO2_PER_LITRE)
    : 0;

  const contactHref = `mailto:hello@sunscore.ng?subject=${encodeURIComponent(
    `Interested in the ${offer.provider} plan`
  )}&body=${encodeURIComponent(
    `Hi, I'd like to lock in the ${offer.provider} plan at ₦${offer.monthlyPayment.toLocaleString()}/mo (${offer.ownershipMonths} months to ownership).`
  )}`;

  return (
    <div
      className={`group relative flex flex-col gap-6 overflow-hidden rounded-3xl border p-8 pl-9 transition-all hover:shadow-md ${
        showBadge ? "border-brand-green-200 bg-brand-green-50/30" : "border-brand-stone-200 bg-white"
      }`}
    >
      <div className={`absolute inset-y-0 left-0 w-1.5 ${accent.bar}`} aria-hidden />

      {showBadge && (
        <div className="inline-flex w-fit items-center gap-1 rounded-full bg-brand-green-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
          Pre-Qualified
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-stone-400">Provider</p>
          <div className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${accent.chip} ${accent.text}`}>
              {offer.provider[0]}
            </span>
            <p className="text-2xl font-display font-medium text-brand-stone-900">{offer.provider}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-stone-400">Payment</p>
          <p className="text-2xl font-bold text-brand-stone-900">
            <Naira />
            {offer.monthlyPayment.toLocaleString()}
            <span className="text-sm font-normal text-brand-stone-500"> /mo</span>
          </p>
        </div>
      </div>

       <div className="grid grid-cols-2 gap-4 py-4 border-y border-brand-stone-100">
         <div>
           <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-stone-400">Ownership</p>
           <p className="text-sm font-medium text-brand-stone-700">{offer.ownershipMonths} months</p>
         </div>
         <div>
           <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-stone-400">Available In</p>
           <p className="text-sm font-medium text-brand-stone-700">{offer.regions.join(", ")}</p>
         </div>
       </div>

       <div className="flex items-center justify-between py-2 px-1">
         <div className="flex items-center gap-2 text-brand-green-600">
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 7H7"/><path d="M17 12H7"/><path d="M17 17H7"/></svg>
           <span className="text-xs font-medium">Displaces {annualCO2Saved.toLocaleString()}kg CO<sub>2</sub>/year</span>
         </div>
         <span className="text-[10px] text-brand-stone-400 italic">Eco-Impact</span>
       </div>

       <a
         href={contactHref}
        className={`w-full rounded-full py-3 text-center text-sm font-semibold transition-all ${
          showBadge
            ? "bg-brand-green-600 text-white hover:bg-brand-green-700"
            : "bg-brand-stone-100 text-brand-stone-900 hover:bg-brand-stone-200"
        }`}
      >
        Lock In This Plan
      </a>
    </div>
  );
}
