import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Free Home Valuation in Texas",
  description: "Get a free, no-obligation home valuation from Resolution Realty Group.",
  path: "/free-home-valuation/"
});

export default function ValuationPage() {
  return (
    <section className="py-16">
      <div className="container-shell grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="section-title">Curious about your home&apos;s value?</h1>
          <p className="mt-6 leading-8 text-[var(--body)]">
            Get a free, no-obligation home valuation from the local experts at Resolution Realty Group. Whether you’re just
            exploring your options or getting ready to sell your home, we’ll provide a personalized estimate based on real
            market data.
          </p>
          <div className="mt-8 space-y-2">
            <p>
              <a href={site.phoneHref} className="text-[var(--coral)]">
                {site.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="text-[var(--coral)]">
                {site.email}
              </a>
            </p>
            <p className="text-[var(--body)]">{site.officeLine}</p>
          </div>
        </div>
        <InquiryForm source="valuation" submitLabel="Get My Free Valuation" />
      </div>
    </section>
  );
}
