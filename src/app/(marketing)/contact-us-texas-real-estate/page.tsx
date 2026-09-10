import type { Metadata } from "next";
import Link from "next/link";
import { InquiryForm } from "@/components/inquiry-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Remarkable Texas Real Estate Experts | Contact",
  description: "Get in touch with Resolution Realty Group to buy, sell, or invest in Texas real estate."
};

export default function ContactPage() {
  return (
    <section className="py-16">
      <div className="container-shell grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="section-title">Get In Touch</h1>
          <p className="mt-6 leading-8 text-[var(--body)]">
            Are you looking to buy, sell, or invest in Texas real estate? At Resolution Realty Group, we’re proud to serve
            clients throughout the Lone Star State with expert guidance, market insight, and a commitment to personalized
            service.
          </p>
          <p className="mt-4 leading-8 text-[var(--body)]">
            Whether you’re a first-time homebuyer, seasoned investor, or ready to list your property, our experienced
            agents are here to help make your next move smooth and successful.
          </p>
          <Link href="/buy-your-dream-home-in-texas/" className="mt-6 inline-block text-[var(--coral)]">
            Explore our step-by-step guide to buying your dream home in Texas »
          </Link>
          <div className="mt-8 space-y-2 text-[var(--navy)]">
            <p>
              <a href={site.phoneHref}>{site.phone}</a>
            </p>
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p>{site.officeLine}</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl">Message Us</h2>
          <div className="mt-5">
            <InquiryForm source="contact" />
          </div>
        </div>
      </div>
    </section>
  );
}
