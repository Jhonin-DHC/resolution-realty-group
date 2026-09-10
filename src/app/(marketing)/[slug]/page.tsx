import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingDetail } from "@/components/listing-detail";
import { MarketingPage } from "@/components/marketing-page";
import { PostDetail } from "@/components/post-detail";
import { resolveSlug } from "@/lib/content-resolver";
import { getPublishedListings } from "@/lib/listings-service";
import { getMarketingPages } from "@/lib/pages-service";
import { getPostsPage } from "@/lib/posts-service";
import { site } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const [listings, pages] = await Promise.all([getPublishedListings(), Promise.resolve(getMarketingPages())]);
  return [...listings, ...pages].map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveSlug(slug);
  if (resolved.kind === "listing") {
    return {
      title: resolved.listing.seoTitle || resolved.listing.title,
      description: resolved.listing.seoDescription,
      openGraph: { images: resolved.listing.imageUrl ? [resolved.listing.imageUrl] : [] }
    };
  }
  if (resolved.kind === "page") {
    return {
      title: resolved.page.seoTitle || resolved.page.title,
      description: resolved.page.seoDescription || resolved.page.intro
    };
  }
  if (resolved.kind === "post") {
    return {
      title: resolved.post.seoTitle || resolved.post.title,
      description: resolved.post.seoDescription || resolved.post.excerpt
    };
  }
  return { title: site.name };
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  const resolved = await resolveSlug(slug);

  if (resolved.kind === "listing") {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: resolved.listing.title,
      url: `${site.url}/${resolved.listing.slug}/`,
      description: resolved.listing.seoDescription,
      image: resolved.listing.imageUrl,
      offers: {
        "@type": "Offer",
        price: resolved.listing.priceUsd || undefined,
        priceCurrency: "USD"
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: resolved.listing.address,
        addressLocality: resolved.listing.city,
        addressRegion: resolved.listing.state
      }
    };
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ListingDetail listing={resolved.listing} />
      </>
    );
  }

  if (resolved.kind === "page") {
    const cashOffer = resolved.page.slug.includes("cash-offer") || resolved.page.slug === "sell-your-home";
    return <MarketingPage page={resolved.page} formSource={cashOffer ? "cash-offer" : "contact"} />;
  }

  if (resolved.kind === "post") {
    const { posts } = await getPostsPage(1, 8, resolved.post.categorySlug);
    const related = posts.filter((item) => item.slug !== resolved.post.slug).slice(0, 2);
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: resolved.post.title,
      datePublished: resolved.post.publishedAt,
      description: resolved.post.seoDescription || resolved.post.excerpt
    };
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <PostDetail post={resolved.post} related={related} />
      </>
    );
  }

  notFound();
}
