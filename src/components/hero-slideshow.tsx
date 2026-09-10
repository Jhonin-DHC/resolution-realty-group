"use client";

import { useEffect, useState } from "react";
import { RemoteImage } from "@/components/remote-image";
import { heroSlides } from "@/data/home";

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0">
      {heroSlides.map((src, slideIndex) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-700 ${slideIndex === index ? "opacity-100" : "opacity-0"}`}
        >
          <RemoteImage src={src} alt="" className="object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-[var(--navy)]/70" />
    </div>
  );
}
