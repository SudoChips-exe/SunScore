"use client";

import { Fragment } from "react";
import { Star } from "lucide-react";
import { Naira } from "@/components/Naira";

/** Splits on the ₦ glyph and substitutes the <Naira /> component so amounts
 * embedded in prose don't fall back to a mismatched system font mid-string. */
function withNaira(text: string) {
  return text.split("₦").map((part, i) => (i === 0 ? part : <Fragment key={i}><Naira />{part}</Fragment>));
}

const TESTIMONIALS = [
  {
    id: 1,
    name: "Chioma Okafor",
    role: "Small Business Owner",
    content:
      "I was spending over ₦150,000 monthly on fuel and generator maintenance. With SunScore, my costs dropped by 70% in just three months. The installation was smooth and the team was incredibly helpful.",
    rating: 5,
    avatarSeed: "chioma",
  },
  {
    id: 2,
    name: "Damilola Bello",
    role: "Healthcare Facility Manager",
    content:
      "Solar power transformed our clinic operations. No more noisy generators disrupting patients, and our electric bills are now predictable. SunScore made the financing process simple and transparent.",
    rating: 5,
    avatarSeed: "damilola",
  },
  {
    id: 3,
    name: "Zainab Hassan",
    role: "Manufacturing Business",
    content:
      "The calculator showed us exactly how much we could save. Now we're producing more because our energy costs are stable. This is the best investment we've made for our business growth.",
    rating: 5,
    avatarSeed: "zainab",
  },
  {
    id: 4,
    name: "Chukwu Nwankwo",
    role: "Logistics Company Owner",
    content:
      "Switching to solar with SunScore was the smartest decision for our fleet operations. We save money every day, and the service team is always responsive to our needs.",
    rating: 5,
    avatarSeed: "chukwu",
  },
];

export function Testimonials() {
  return (
    <section className="w-full bg-white px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col items-center gap-6 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-brand-stone-500">
            Testimonials
          </span>
          <h2 className="font-display text-4xl font-medium leading-tight text-brand-stone-900 md:text-5xl">
            Real savings. Real stories.
          </h2>
          <p className="max-w-2xl text-xl leading-relaxed text-brand-stone-600">
            Hear from businesses and families who made the switch and transformed their energy future.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col justify-between rounded-3xl bg-brand-stone-50 p-8"
            >
              <div className="mb-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-brand-gold-500 text-brand-gold-500" />
                  ))}
                </div>
                <p className="mb-6 leading-relaxed text-brand-stone-700">
                  &ldquo;{withNaira(testimonial.content)}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.pravatar.cc/150?u=${testimonial.avatarSeed}`}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full bg-brand-stone-200"
                />
                <div>
                  <p className="font-semibold text-brand-stone-900">{testimonial.name}</p>
                  <p className="text-sm text-brand-stone-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
