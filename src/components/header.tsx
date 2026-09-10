"use client";

import Link from "next/link";
import { useState } from "react";
import { RemoteImage } from "@/components/remote-image";
import { site } from "@/lib/site";

const listings = [
  { href: "/6808-pentridge-drive/", label: "6808 Pentridge Drive, Plano, TX 75024" },
  { href: "/6809-pentridge-drive/", label: "6809 Pentridge Drive, Plano, TX 75024" },
  { href: "/2432-oconnor-ranch-dr-weatherford-tx-76087/", label: "2432 Oconnor Ranch Drive, Weatherford, TX 76087" },
  { href: "/1105-w-2nd-street-white-deer-tx-79097/", label: "1105 W 2nd Street, White Deer, TX 79097" }
];

const guarantees = [
  { href: "/sold-in-90-days-guarantee/", label: "Sold in 90 days Guarantee" },
  { href: "/sell-your-home-fast-with-our-solid-cash-offer-guarantee/", label: "Solid Cash Offer Guarantee" },
  { href: "/no-lock-in-listing-guarantee/", label: "No Lock-In Listing Guarantee" },
  { href: "/trade-up-and-buy-your-dream-home-in-texas/", label: "Trade Up Program" },
  { href: "/first-access-program/", label: "First Access Program" }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [listingsOpen, setListingsOpen] = useState(false);
  const [guaranteesOpen, setGuaranteesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-[var(--navy)] text-white">
        <div className="container-shell flex flex-wrap items-center justify-between gap-3 py-2 text-sm">
          <a href={`mailto:${site.email}`} className="hover:text-[var(--gold)]">
            {site.email}
          </a>
          <a href={site.phoneHref} className="hover:text-[var(--gold)]">
            {site.phone}
          </a>
        </div>
      </div>

      <div className="container-shell flex items-center justify-between gap-4 py-3 lg:py-4">
        <Link href="/" className="relative block h-14 w-40 shrink-0 lg:h-16 lg:w-48">
          <RemoteImage src={site.logo} alt={site.name} className="object-contain object-left" />
        </Link>

        <nav className="hidden items-center gap-6 text-[0.92rem] text-[var(--navy)] lg:flex">
          <Link href="/free-home-valuation/" className="hover:text-[var(--coral)]">
            Free Home Valuation
          </Link>
          <div className="relative" onMouseEnter={() => setListingsOpen(true)} onMouseLeave={() => setListingsOpen(false)}>
            <button type="button" className="hover:text-[var(--coral)]">
              Listings
            </button>
            {listingsOpen ? (
              <div className="absolute left-0 top-full z-20 min-w-80 rounded-xl bg-white py-2 shadow-xl">
                {listings.map((item) => (
                  <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm hover:bg-[var(--cream)]">
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <div
            className="relative"
            onMouseEnter={() => setGuaranteesOpen(true)}
            onMouseLeave={() => setGuaranteesOpen(false)}
          >
            <button type="button" className="hover:text-[var(--coral)]">
              Our Guarantees
            </button>
            {guaranteesOpen ? (
              <div className="absolute left-0 top-full z-20 min-w-80 rounded-xl bg-white py-2 shadow-xl">
                {guarantees.map((item) => (
                  <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm hover:bg-[var(--cream)]">
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <Link href="/#testimonials" className="hover:text-[var(--coral)]">
            Testimonials
          </Link>
          <Link href="/about/" className="hover:text-[var(--coral)]">
            Our Team
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/#contact" className="btn-coral hidden sm:inline-flex">
            Book a Call Now!
          </Link>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--navy)] lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="text-lg">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[var(--light)] bg-white lg:hidden">
          <div className="container-shell space-y-3 py-5 text-[var(--navy)]">
            <Link href="/free-home-valuation/" className="block" onClick={() => setOpen(false)}>
              Free Home Valuation
            </Link>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--body)]">Listings</p>
            {listings.map((item) => (
              <Link key={item.href} href={item.href} className="block pl-3 text-sm" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--body)]">Our Guarantees</p>
            {guarantees.map((item) => (
              <Link key={item.href} href={item.href} className="block pl-3 text-sm" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/#testimonials" className="block" onClick={() => setOpen(false)}>
              Testimonials
            </Link>
            <Link href="/about/" className="block" onClick={() => setOpen(false)}>
              Our Team
            </Link>
            <Link href="/blogs/" className="block" onClick={() => setOpen(false)}>
              Our Blog
            </Link>
            <Link href="/#contact" className="btn-coral w-full" onClick={() => setOpen(false)}>
              Book a Call Now!
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
