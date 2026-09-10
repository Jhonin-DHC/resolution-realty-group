"use client";

import { useState } from "react";
import { testimonials } from "@/data/home";

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const item = testimonials[index];

  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-lg leading-8 text-white/90 md:text-xl">“{item.quote}”</p>
      <p className="mt-6 font-heading text-[var(--gold)]">{item.name}</p>
      <div className="mt-8 flex justify-center gap-3">
        <button
          type="button"
          className="rounded-full border border-white/30 px-4 py-2 text-sm"
          onClick={() => setIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1))}
        >
          Prev
        </button>
        <button
          type="button"
          className="rounded-full border border-white/30 px-4 py-2 text-sm"
          onClick={() => setIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
