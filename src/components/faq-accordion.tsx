"use client";

import { useState } from "react";
import type { FaqItem } from "@/types/content";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const active = open === index;
        return (
          <div key={item.q} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpen(active ? -1 : index)}
            >
              <span className="font-heading text-[var(--navy)]">{item.q}</span>
              <span className="text-[var(--coral)]">{active ? "–" : "+"}</span>
            </button>
            {active ? <p className="px-5 pb-5 text-sm leading-7 text-[var(--body)]">{item.a}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
