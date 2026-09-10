import { InquiryForm } from "@/components/inquiry-form";
import { RemoteImage } from "@/components/remote-image";
import { buyerBlurb } from "@/data/home";
import { listingPriceDisplay } from "@/lib/listings-service";
import { formatNumber } from "@/lib/slug";
import { site } from "@/lib/site";
import type { PublicListing } from "@/types/content";

export function ListingDetail({ listing }: { listing: PublicListing }) {
  const gallery = [listing.imageUrl, ...listing.imageUrls.filter((url) => url !== listing.imageUrl)];

  return (
    <article>
      <section className="relative min-h-[420px] bg-[var(--navy)] text-white">
        <RemoteImage src={listing.imageUrl} alt={listing.title} />
        <div className="absolute inset-0 bg-[var(--navy)]/65" />
        <div className="container-shell relative py-24">
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--gold)]">{listing.listingType}</p>
          <h1 className="mt-3 max-w-3xl text-4xl md:text-5xl">{listing.title}</h1>
          <p className="mt-4 text-lg text-white/80">{listing.address}</p>
          <p className="mt-6 font-heading text-3xl text-[var(--gold)]">{listingPriceDisplay(listing, "detail")}</p>
        </div>
      </section>

      <section className="bg-[var(--cream)] py-12">
        <div className="container-shell grid gap-6 md:grid-cols-4">
          <Spec label="Beds" value={listing.beds} />
          <Spec label="Baths" value={listing.baths} />
          <Spec label="Sqft" value={listing.sqft ? formatNumber(listing.sqft) : "—"} />
          <Spec label="Lot" value={listing.lotSqft ? `${formatNumber(listing.lotSqft)} sqft` : "—"} />
        </div>
      </section>

      <section className="py-16">
        <div className="container-shell grid gap-12 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <h2 className="section-title">About this home</h2>
            <div className="prose-rrg mt-6 whitespace-pre-line">{listing.description}</div>
            {listing.features.length > 0 ? (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {listing.features.map((feature) => (
                  <li key={feature} className="rounded-xl bg-[var(--cream)] px-4 py-3 text-sm">
                    {feature}
                  </li>
                ))}
              </ul>
            ) : null}
            {listing.featureBlocks.length > 0 ? (
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {listing.featureBlocks.map((block) => (
                  <div key={block.heading} className="rounded-2xl border border-[var(--light)] p-5">
                    <h3 className="text-lg">{block.heading}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--body)]">{block.body}</p>
                  </div>
                ))}
              </div>
            ) : null}
            <p className="mt-10 rounded-2xl bg-[var(--navy)] p-6 text-sm leading-7 text-white/85">{buyerBlurb}</p>
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl bg-[var(--cream)] p-6">
              <h2 className="text-2xl">Immediate Sale! Submit Your Best Offer Today!</h2>
              <a href={site.phoneHref} className="mt-3 block text-[var(--coral)]">
                {site.phone}
              </a>
              <div className="mt-5">
                <InquiryForm
                  listingId={listing.id}
                  listingSlug={listing.slug}
                  listingTitle={listing.title}
                  source="listing"
                  submitLabel="Submit Offer Inquiry"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {gallery.length > 1 ? (
        <section className="bg-[var(--cream)] py-16">
          <div className="container-shell grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((src) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <RemoteImage src={src} alt={listing.title} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--body)]">{label}</p>
      <p className="mt-2 font-heading text-2xl">{value}</p>
    </div>
  );
}
