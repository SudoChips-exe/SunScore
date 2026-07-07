import type { Offer } from "@/types";

interface OfferCardProps {
  offer: Offer;
  showBadge: boolean;
}

export function OfferCard({ offer, showBadge }: OfferCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-neutral-200 p-6">
      {showBadge && (
        <span className="w-fit rounded-full bg-green-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
          Pre-Qualified
        </span>
      )}
      <p className="text-lg font-bold">{offer.provider}</p>
      <p>₦{offer.monthlyPayment.toLocaleString()} / month</p>
      <p>{offer.ownershipMonths} months to ownership</p>
      <p className="text-sm text-neutral-500">{offer.regions.join(", ")}</p>
    </div>
  );
}
