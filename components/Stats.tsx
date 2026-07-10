import { Naira } from "@/components/Naira";

export function Stats() {
  const stats = [
    { value: "50K+", label: "Families Powered" },
    { value: <><Naira />2B+</>, label: "Savings Delivered" },
    { value: "99%", label: "Uptime Guarantee" },
    { value: "24/7", label: "Customer Support" },
  ];

  return (
    <section className="w-full bg-brand-stone-50 px-6 py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl font-medium text-brand-stone-900">{stat.value}</p>
              <p className="mt-2 text-brand-stone-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
