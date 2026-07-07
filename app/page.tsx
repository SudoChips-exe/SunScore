import Link from "next/link";
import { Naira } from "@/components/Naira";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full bg-brand-stone-50 overflow-x-hidden">
      {/* Background Architectural Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-gold-50/50 -skew-x-12 translate-x-20" />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-gold-100/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Editorial Statement */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-stone-200 bg-white text-brand-stone-500 text-xs font-medium mb-8 w-fit animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green-500"></span>
              </span>
              Now available across Nigeria
            </div>
            
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tighter text-brand-stone-900 mb-8">
              The <span className="italic text-brand-gold-600">end</span> of the <br />
              fuel &amp; diesel era.
            </h1>

            <p className="text-xl md:text-2xl text-brand-stone-600 max-w-2xl leading-relaxed mb-12 font-light">
              You&apos;ve been financing a solar system for years—you just paid the fuel and diesel companies instead. <span className="font-medium text-brand-stone-900">Stop the leak.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Link
                href="/calculate"
                className="group relative px-10 py-5 bg-brand-stone-900 text-white rounded-full font-medium text-lg transition-all hover:scale-105 hover:bg-brand-stone-800 shadow-2xl overflow-hidden"
              >
                <span className="relative z-10">Reveal Your Savings</span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              
              <div className="flex items-center gap-4 px-6 py-5">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-brand-stone-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-bold text-brand-stone-900">Join 2,000+ households</p>
                  <p className="text-brand-stone-500">already switching to solar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Contrast Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-[40px] border border-brand-stone-200 bg-white p-8 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex justify-between items-center mb-12">
                <span className="font-display text-2xl font-medium">SunScore Analysis</span>
                <div className="h-12 w-12 rounded-full bg-brand-gold-100 flex items-center justify-center text-brand-gold-600">
                  ☀️
                </div>
              </div>

              <div className="space-y-8">
                <div className="group cursor-default">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-brand-stone-400 uppercase tracking-widest">Fuel &amp; Diesel Burden</span>
                    <span className="text-sm font-bold text-brand-stone-900"><Naira />120,000/mo</span>
                  </div>
                  <div className="h-3 w-full bg-brand-stone-100 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-brand-stone-300 group-hover:bg-brand-stone-400 transition-colors" />
                  </div>
                </div>

                <div className="group cursor-default">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-brand-green-600 uppercase tracking-widest">Solar Freedom</span>
                    <span className="text-sm font-bold text-brand-green-700"><Naira />85,000/mo</span>
                  </div>
                  <div className="h-3 w-full bg-brand-green-50 rounded-full overflow-hidden">
                    <div className="h-full w-[70%] bg-brand-green-500 group-hover:bg-brand-green-600 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-brand-stone-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-brand-stone-500">Monthly Profit:</span>
                  <span className="text-3xl font-display font-bold text-brand-green-600"><Naira />35,000</span>
                </div>
                <p className="text-xs text-brand-stone-400 mt-2 italic">
                  *Based on average Nigerian household spend patterns
                </p>
              </div>
            </div>
            
            {/* Decorative Backdrop for the card */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-brand-gold-200 rounded-[40px] -z-10" />
          </div>

        </div>
      </div>
    </main>
  );
}
