import type { Metadata } from "next";
import { site } from "@/lib/site";

export function siteOrigin() {
  return site.url.replace(/\/$/, "");
}

export function canonicalUrl(path = "/") {
  const origin = siteOrigin();
  if (!path || path === "/") return `${origin}/`;
  const prefixed = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${prefixed.endsWith("/") ? prefixed : `${prefixed}/`}`;
}

export function metadataTitle(title: string): Metadata["title"] {
  if (/resolution realty group/i.test(title)) {
    return { absolute: title };
  }
  return title;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website"
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const url = canonicalUrl(path);
  const ogImage = image || site.logo;
  const displayTitle = /resolution realty group/i.test(title) ? title : `${title} | ${site.name}`;
  return {
    title: metadataTitle(title),
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: displayTitle,
      description,
      siteName: site.name,
      images: ogImage ? [{ url: ogImage }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description,
      images: ogImage ? [ogImage] : undefined
    }
  };
}

export function localBusinessJsonLd() {
  const origin = siteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    "@id": `${origin}/#business`,
    name: site.name,
    url: `${origin}/`,
    telephone: site.phone,
    email: site.email,
    image: site.logo,
    logo: site.logo,
    description: site.description,
    slogan: site.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: "508 North 2nd Street",
      addressLocality: "Honey Grove",
      addressRegion: "TX",
      postalCode: "75446",
      addressCountry: "US"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 33.5838976,
      longitude: -95.9121306
    },
    openingHours: "Mo-Su 09:00-17:00",
    areaServed: "Texas",
    sameAs: [site.socials.youtube, site.socials.instagram, site.socials.facebook, site.socials.linkedin],
    employee: {
      "@type": "Person",
      name: site.agent,
      jobTitle: "Founder"
    },
    parentOrganization: {
      "@type": "Organization",
      name: "Central Metro Realty"
    }
  };
}

export function articleJsonLd(post: {
  title: string;
  slug: string;
  publishedAt: string;
  seoDescription?: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
}) {
  const origin = siteOrigin();
  const url = canonicalUrl(`/${post.slug}/`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    description: post.seoDescription || post.excerpt,
    url,
    mainEntityOfPage: url,
    image: post.featuredImage || site.logo,
    author: {
      "@type": "Organization",
      name: site.name,
      url: `${origin}/`
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: site.logo }
    },
    articleSection: post.category
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path)
    }))
  };
}
