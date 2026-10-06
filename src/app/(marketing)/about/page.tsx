import type { Metadata } from "next";
import Link from "next/link";
import { RemoteImage } from "@/components/remote-image";
import { teamMembers } from "@/data/home";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Story | Real Estate Experts in Texas",
  description: "Meet Resolution Realty Group, founded in 2025 and built on trust, integrity, and personalized service.",
  path: "/about/",
  image: "https://39237.us6.myftpupload.com/wp-content/uploads/2025/06/resolution-realty-group.webp"
});

export default function AboutPage() {
  return (
    <article>
      <section className="relative min-h-[360px] bg-[var(--navy)] text-white">
        <RemoteImage src="https://39237.us6.myftpupload.com/wp-content/uploads/2025/06/resolution-realty-group.webp" alt="" />
        <div className="absolute inset-0 bg-[var(--navy)]/70" />
        <div className="container-shell relative py-24">
          <h1 className="text-5xl">Our Story</h1>
        </div>
      </section>
      <section className="py-16">
        <div className="container-shell max-w-4xl">
          <h2 className="section-title">Building Dreams, One Home at a Time</h2>
          <p className="mt-6 leading-8 text-[var(--body)]">
            Finding the perfect place to call home is a significant milestone. At Resolution Realty Group, we are your real
            estate experts in Texas, committed to helping you navigate the market with confidence and ease. We understand
            how important this decision is, and our experienced team is here to guide you every step of the way.
          </p>
          <p className="mt-5 leading-8 text-[var(--body)]">
            Founded in 2025, Resolution Realty Group began as a family-owned business with a passion for connecting people
            with their ideal properties. Today, we’ve grown into one of the leading real estate experts in Texas, built on
            a foundation of trust, integrity, and unmatched market expertise. Our commitment to personalized service has
            earned us a reputation for excellence, making us a trusted name in Texas real estate.
          </p>
        </div>
      </section>
      <section className="bg-[var(--cream)] py-16">
        <div className="container-shell">
          <h2 className="section-title tracking-normal">Meet the Real Estate Experts in Texas</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <div key={member.name} className="overflow-hidden rounded-2xl bg-white text-center shadow-sm">
                <div className="relative aspect-[3/4] bg-[var(--navy)]/5">
                  {member.image ? (
                    <RemoteImage src={member.image} alt={member.name} className="object-cover object-top" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--navy)] text-4xl text-white/70">
                      {member.name
                        .split(" ")
                        .filter((part) => !/^(iii|mba)$/i.test(part))
                        .map((part) => part[0])
                        .join("")}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-base tracking-normal">{member.name}</h3>
                  {member.role ? <p className="mt-1 text-sm tracking-normal text-[var(--body)]">{member.role}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container-shell max-w-4xl">
          <h2 className="section-title">Why Choose Us: Real Estate Experts in Texas</h2>
          <p className="mt-6 leading-8 text-[var(--body)]">
            Our mission is to provide exceptional real estate services that exceed our clients’ expectations. We strive to
            create lasting relationships by delivering personalized guidance and achieving optimal results.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Value title="Honesty" body="We uphold honesty through clear communication, fair dealings, and integrity." />
            <Value title="Transparency" body="We prioritize transparency by providing clear, accurate information and open communication." />
            <Value title="Client Satisfaction" body="We operate with the highest ethical standards and prioritize building trust in every transaction." />
          </div>
          <p className="mt-10 text-xl">Let us help you find your dream home.</p>
          <Link href="/#contact" className="btn-coral mt-6">
            Book a Call Now!
          </Link>
        </div>
      </section>
    </article>
  );
}

function Value({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-[var(--cream)] p-5">
      <h3 className="text-lg">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[var(--body)]">{body}</p>
    </div>
  );
}
