import Link from "next/link";
import { RemoteImage } from "@/components/remote-image";
import { listingPriceDisplay } from "@/lib/listings-service";
import { formatNumber } from "@/lib/slug";
import type { PublicListing } from "@/types/content";

export function ListingCard({ listing }: { listing: PublicListing }) {
  const price = listingPriceDisplay(listing, "card");
  const [amount, suffix] = price.includes("|") ? price.split("|").map((part) => part.trim()) : [price, ""];

  return (
    <Link href={`/${listing.slug}/`} className="group block overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden">
        <RemoteImage src={listing.imageUrl} alt={listing.title} className="transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
          <p className="text-2xl font-heading">{amount}</p>
          {suffix ? <p className="text-xs uppercase tracking-[0.16em] text-white/80">{suffix}</p> : null}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg leading-snug text-[var(--navy)]">{listing.title}</h3>
        <p className="mt-2 text-sm text-[var(--body)]">{listing.city}, {listing.state}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--navy)]">
          {listing.sqft ? <span>{formatNumber(listing.sqft)} Sqt</span> : null}
          {listing.beds ? <span>{listing.beds} Beds</span> : null}
          {listing.baths ? <span>{listing.baths} Baths</span> : null}
        </div>
      </div>
    </Link>
  );
}
