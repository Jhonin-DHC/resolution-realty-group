import { FaqAccordion } from "@/components/faq-accordion";
import { InquiryForm } from "@/components/inquiry-form";
import { RemoteImage } from "@/components/remote-image";
import type { PublicPage } from "@/types/content";

export function MarketingPage({ page, formSource = "contact" }: { page: PublicPage; formSource?: "contact" | "cash-offer" | "book-call" }) {
  return (
    <article>
      <section className="relative min-h-[360px] bg-[var(--navy)] text-white">
        {page.heroImage ? <RemoteImage src={page.heroImage} alt="" /> : null}
        <div className="absolute inset-0 bg-[var(--navy)]/70" />
        <div className="container-shell relative py-24">
          <h1 className="max-w-4xl text-4xl md:text-5xl">{page.heading || page.title}</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container-shell grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            {page.intro ? <p className="text-lg leading-8 text-[var(--navy)]">{page.intro}</p> : null}
            {page.paragraphs?.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="mt-5 leading-8 text-[var(--body)]">
                {paragraph}
              </p>
            ))}
            {page.howItWorksIntro ? <p className="mt-8 leading-8 text-[var(--body)]">{page.howItWorksIntro}</p> : null}
            {page.howItWorks?.length ? (
              <>
                <h2 className="mt-10 text-2xl">Here&apos;s how it works</h2>
                <ol className="mt-5 space-y-4">
                  {page.howItWorks.map((item, index) => (
                    <li key={item} className="rounded-2xl bg-[var(--cream)] p-5">
                      <span className="text-sm text-[var(--coral)]">0{index + 1}</span>
                      <p className="mt-2 leading-7 text-[var(--navy)]">{item}</p>
                    </li>
                  ))}
                </ol>
              </>
            ) : null}
            {page.conditions?.length ? (
              <>
                <h2 className="mt-10 text-2xl">Conditions</h2>
                <ul className="mt-5 list-disc space-y-2 pl-5 text-[var(--body)]">
                  {page.conditions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ) : null}
            {page.benefits?.length ? (
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {page.benefits.map((item) => (
                  <div key={item.h} className="rounded-2xl border border-[var(--light)] p-5">
                    <h3 className="text-lg">{item.h}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--body)]">{item.p}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {page.extraLists?.map((list) => (
              <div key={list.heading} className="mt-10">
                <h2 className="text-2xl">{list.heading}</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--body)]">
                  {list.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            {page.notes?.map((note) => (
              <div key={note.h} className="mt-8">
                <h3 className="text-lg">{note.h}</h3>
                <p className="mt-2 leading-7 text-[var(--body)]">{note.p}</p>
              </div>
            ))}
            {page.faqs?.length ? (
              <div className="mt-10">
                <h2 className="mb-5 text-2xl">FAQs</h2>
                <FaqAccordion items={page.faqs} />
              </div>
            ) : null}
            {page.extraImage ? (
              <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl">
                <RemoteImage src={page.extraImage} alt="" />
              </div>
            ) : null}
            {page.ctaHeading ? <h2 className="mt-10 text-2xl">{page.ctaHeading}</h2> : null}
            {page.cta ? <p className="mt-4 leading-8 text-[var(--body)]">{page.cta}</p> : null}
          </div>
          <aside>
            <div className="rounded-2xl bg-[var(--cream)] p-6">
              <h2 className="text-2xl">Message Me Today</h2>
              <p className="mt-2 text-sm text-[var(--body)]">90 Days to Sold, Guaranteed, or David will buy it!</p>
              <div className="mt-5">
                <InquiryForm source={formSource} submitLabel="Get Started" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </article>
  );
}
