import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { ListingDetail } from "@/components/listing-detail";
import { MarketingPage } from "@/components/marketing-page";
import { PostDetail } from "@/components/post-detail";
import { resolveSlug } from "@/lib/content-resolver";
import { getPublishedListings } from "@/lib/listings-service";
import { getMarketingPages } from "@/lib/pages-service";
import { getPostsPage } from "@/lib/posts-service";
import { articleJsonLd, breadcrumbJsonLd, canonicalUrl, pageMetadata } from "@/lib/seo";
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
  const path = `/${slug}/`;
  if (resolved.kind === "listing") {
    return pageMetadata({
      title: resolved.listing.seoTitle || resolved.listing.title,
      description: resolved.listing.seoDescription || resolved.listing.description.slice(0, 160),
      path,
      image: resolved.listing.imageUrl
    });
  }
  if (resolved.kind === "page") {
    return pageMetadata({
      title: resolved.page.seoTitle || resolved.page.title,
      description: resolved.page.seoDescription || resolved.page.intro,
      path,
      image: resolved.page.heroImage
    });
  }
  if (resolved.kind === "post") {
    return pageMetadata({
      title: resolved.post.seoTitle || resolved.post.title,
      description: resolved.post.seoDescription || resolved.post.excerpt,
      path,
      image: resolved.post.featuredImage,
      type: "article"
    });
  }
  return pageMetadata({ title: site.name, description: site.description, path });
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  const resolved = await resolveSlug(slug);

  if (resolved.kind === "listing") {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: resolved.listing.title,
      url: canonicalUrl(`/${resolved.listing.slug}/`),
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
        <JsonLd data={jsonLd} />
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: resolved.listing.title, path: `/${resolved.listing.slug}/` }
          ])}
        />
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
    return (
      <>
        <JsonLd data={articleJsonLd(resolved.post)} />
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blogs", path: "/blogs/" },
            { name: resolved.post.category, path: `/category/${resolved.post.categorySlug}/` },
            { name: resolved.post.title, path: `/${resolved.post.slug}/` }
          ])}
        />
        <PostDetail post={resolved.post} related={related} />
      </>
    );
  }

  notFound();
}
