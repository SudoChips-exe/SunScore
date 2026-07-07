import type { Offer } from "@/types";

interface OfferCardProps {
  offer: Offer;
  showBadge: boolean;
}

export function OfferCard({ offer, showBadge }: OfferCardProps) {
  return (
    <div className={`group relative flex flex-col gap-6 rounded-3xl border p-8 transition-all hover:shadow-md ${
      showBadge ? "border-brand-green-200 bg-brand-green-50/30" : "border-brand-stone-200 bg-white"
    }`}>
      {showBadge && (
        <div className="absolute -top-3 left-6 rounded-full bg-brand-green-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
          Pre-Qualified
        </div>
      )}
      
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-stone-400">Provider</p>
          <p className="text-2xl font-display font-medium text-brand-stone-900">{offer.provider}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-stone-400">Payment</p>
          <p className="text-2xl font-bold text-brand-stone-900">
            ₦{offer.monthlyPayment.toLocaleString()}
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

      <button className={`w-full rounded-full py-3 text-sm font-semibold transition-all ${
        showBadge 
          ? "bg-brand-green-600 text-white hover:bg-brand-green-700" 
          : "bg-brand-stone-100 text-brand-stone-900 hover:bg-brand-stone-200"
      }`}>
        View Offer Details
      </button>
    </div>
  );
}
