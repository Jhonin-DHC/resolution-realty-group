import Link from "next/link";
import { SocialLinks } from "@/components/social-links";
import { site } from "@/lib/site";

const guaranteeLinks = [
  { href: "/sold-in-90-days-guarantee/", label: "Sold in 90 Days Guarantee" },
  { href: "/sell-your-home-fast-with-our-solid-cash-offer-guarantee/", label: "Solid Cash Offer" },
  { href: "/no-lock-in-listing-guarantee/", label: "No Lock-In Listing" },
  { href: "/trade-up-and-buy-your-dream-home-in-texas/", label: "Trade-Up Program" },
  { href: "/first-access-program/", label: "First Access Program" }
];

export function Footer() {
  return (
    <footer className="bg-[var(--navy)] text-white">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold)]">Office</p>
          <p className="mt-3 max-w-xs text-sm leading-7 text-white/80">{site.officeLine}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--gold)]">Our Socials</p>
          <SocialLinks className="mt-3" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold)]">Email</p>
          <a href={`mailto:${site.email}`} className="mt-3 block text-sm text-white/80 hover:text-[var(--coral)]">
            {site.email}
          </a>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-[var(--gold)]">Phone</p>
          <a href={site.phoneHref} className="mt-3 block text-sm text-white/80 hover:text-[var(--coral)]">
            {site.phoneDisplay}
          </a>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold)]">Guarantees</p>
          <div className="mt-3 space-y-2 text-sm text-white/80">
            {guaranteeLinks.map((item) => (
              <Link key={item.href} href={item.href} className="block hover:text-[var(--coral)]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold)]">Company</p>
          <div className="mt-3 space-y-2 text-sm text-white/80">
            <Link href="/about/" className="block hover:text-[var(--coral)]">
              About / Our Team
            </Link>
            <Link href="/our-mission/" className="block hover:text-[var(--coral)]">
              Our Mission
            </Link>
            <Link href="/blogs/" className="block hover:text-[var(--coral)]">
              Blog
            </Link>
            <Link href="/contact-us-texas-real-estate/" className="block hover:text-[var(--coral)]">
              Contact
            </Link>
            <Link href="/privacy-policy/" className="block hover:text-[var(--coral)]">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions/" className="block hover:text-[var(--coral)]">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {site.name}. {site.agent} — {site.broker}.
      </div>
    </footer>
  );
}
