import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/faq-accordion";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { InquiryForm } from "@/components/inquiry-form";
import { ListingCard } from "@/components/listing-card";
import { PostCard } from "@/components/post-card";
import { RemoteImage } from "@/components/remote-image";
import { SocialLinks } from "@/components/social-links";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { aboutImages, heroSlides, homepageFaqs, partnerLogos, pillars, processSteps } from "@/data/home";
import { getFeaturedListings } from "@/lib/listings-service";
import { getRecentPosts } from "@/lib/posts-service";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} | ${site.tagline}`,
  description: site.description,
  path: "/",
  image: heroSlides[0]
});

export default async function HomePage() {
  const [listings, posts] = await Promise.all([getFeaturedListings(), getRecentPosts(3)]);

  return (
    <>
      <section className="relative min-h-[86vh] overflow-hidden text-white">
        <HeroSlideshow />
        <div className="container-shell relative flex min-h-[86vh] items-center py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl leading-tight md:text-6xl">
              90 Days to Sold <span className="text-[var(--gold)]">Guaranteed</span>
              <br />
              or David Will Buy It!
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">{site.description}</p>
            <Link href="/sell-your-home-fast-with-our-solid-cash-offer-guarantee/" className="btn-coral mt-8">
              Get My Cash Offer Now!
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[var(--cream)] py-16">
        <div className="container-shell grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="rounded-2xl bg-white p-7 shadow-sm">
              <h2 className="text-xl">{pillar.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--body)]">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="container-shell">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="section-title">Explore Our Featured Listings</h2>
            <Link href="/6808-pentridge-drive/" className="btn-outline">
              Explore All
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.slug} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--cream)] py-16">
        <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            {aboutImages.map((src) => (
              <div key={src} className="relative aspect-[4/5] overflow-hidden rounded-2xl first:col-span-2 first:aspect-[16/9]">
                <RemoteImage src={src} alt="Resolution Realty Group" />
              </div>
            ))}
          </div>
          <div>
            <h2 className="section-title">Building Dreams, One Home at a Time</h2>
            <p className="mt-3 text-sm uppercase tracking-[0.16em] text-[var(--coral)]">Years of Experience</p>
            <p className="font-heading text-5xl text-[var(--navy)]">20+</p>
            <p className="mt-4 text-lg text-[var(--navy)]">At the heart of everything we do is a simple promise: Results you can trust.</p>
            <p className="mt-4 leading-8 text-[var(--body)]">
              Finding the perfect place to call home is a significant milestone. At Resolution Realty Group, we understand
              the importance of this decision. We’re dedicated to helping you navigate the real estate market with
              confidence and ease.
            </p>
            <p className="mt-4 leading-8 text-[var(--body)]">
              We’ll help you buy your dream home, sell your property quickly, invest wisely by using our market expertise,
              providing personalized service, and offering innovative solutions.
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.16em] text-[var(--navy)]">Our Socials</p>
            <SocialLinks className="mt-3 !text-[var(--navy)]" />
            <Link href="/about/" className="btn-coral mt-8">
              Discover More
            </Link>
          </div>
        </div>
        <div className="container-shell mt-12 grid grid-cols-2 gap-6 md:grid-cols-6">
          {partnerLogos.map((src) => (
            <div key={src} className="relative h-12">
              <RemoteImage src={src} alt="" className="object-contain" />
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="container-shell">
          <h2 className="section-title max-w-2xl">Your Dream Home, Your Stress-Free Journey</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {processSteps.map((step) => (
              <div key={step.n} className="rounded-2xl bg-[var(--cream)] p-7">
                <p className="text-sm text-[var(--coral)]">{step.n}</p>
                <h3 className="mt-3 text-2xl">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--body)]">{step.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-4xl leading-8 text-[var(--body)]">
            Buying or selling a home is more than just a transaction—it’s a life-changing experience. That’s why our
            dedicated team goes beyond the sale, providing expert guidance, unmatched service, and a personal touch to
            make your journey seamless and stress-free.
          </p>
        </div>
      </section>

      <section className="bg-[var(--navy)] py-16 text-white">
        <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
          <h2 className="text-3xl leading-tight md:text-4xl">
            We believe in earning your trust, not locking you in. If you&apos;re not completely satisfied, you can cancel
            anytime, no questions asked.
          </h2>
          <FaqAccordion items={homepageFaqs} />
        </div>
      </section>

      <section className="py-16">
        <div className="container-shell">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="section-title">Our Recent Blogs & Insights</h2>
            <Link href="/blogs/" className="btn-outline">
              View All
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--cream)] py-16">
        <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Your Questions, Answered!</h2>
            <p className="mt-4 max-w-xl leading-8 text-[var(--body)]">
              We know buying or selling a home comes with a lot of questions—that’s why we’re here to provide clarity and
              confidence every step of the way.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <RemoteImage src="https://resolutionrealtygroup.com/wp-content/uploads/2025/06/building-bg.png" alt="" />
          </div>
        </div>
      </section>

      <section id="testimonials" className="bg-[var(--navy)] py-20 text-white">
        <div className="container-shell">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Reviews</p>
          <h2 className="mt-3 text-center text-3xl md:text-4xl">Don’t Trust us, Trust Our Clients</h2>
          <div className="mt-12">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      <section id="contact" className="py-16">
        <div className="container-shell grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--coral)]">Contact Us</p>
            <h2 className="section-title mt-3">Message Me Today – 90 Days to Sold, Guaranteed, or David will buy it!</h2>
            <p className="mt-4 leading-8 text-[var(--body)]">
              {site.officeLine}
              <br />
              <a href={`mailto:${site.email}`} className="text-[var(--coral)]">
                {site.email}
              </a>
              <br />
              <a href={site.phoneHref} className="text-[var(--coral)]">
                {site.phone}
              </a>
            </p>
          </div>
          <InquiryForm source="contact" submitLabel="Send Message" />
        </div>
      </section>
    </>
  );
}
