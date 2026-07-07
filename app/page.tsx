import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-bold leading-tight">
        You&apos;ve been affording solar this whole time — you just didn&apos;t know it.
      </h1>
      <p className="text-lg text-neutral-600">
        SunScore compares what you already spend on diesel against an equivalent solar
        PAYGo plan, so you can see your savings and ownership timeline at a glance.
      </p>
      <Link
        href="/calculate"
        className="rounded-2xl bg-amber-400 px-8 py-3 font-semibold text-neutral-900 shadow transition hover:bg-amber-500"
      >
        Calculate My Savings
      </Link>
    </main>
  );
}
