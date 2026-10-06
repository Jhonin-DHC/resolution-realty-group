import { getPublishedListings } from "@/lib/listings-service";
import { getMarketingPages } from "@/lib/pages-service";
import { getAllPostSlugs, getCategories } from "@/lib/posts-service";
import { canonicalUrl } from "@/lib/seo";

export default async function sitemap() {
  const [listings, pages, posts, categories] = await Promise.all([
    getPublishedListings(),
    Promise.resolve(getMarketingPages()),
    getAllPostSlugs(),
    getCategories()
  ]);

  const staticPaths = [
    "/",
    "/about/",
    "/team/",
    "/our-mission/",
    "/contact-us-texas-real-estate/",
    "/free-home-valuation/",
    "/blogs/",
    "/privacy-policy/",
    "/terms-and-conditions/"
  ];
  const staticRoutes = staticPaths.map((path) => ({
    url: canonicalUrl(path),
    lastModified: new Date()
  }));

  const listingRoutes = listings.map((item) => ({
    url: canonicalUrl(`/${item.slug}/`),
    lastModified: new Date()
  }));

  const pageRoutes = pages
    .filter((item) => !staticPaths.includes(`/${item.slug}/`))
    .map((item) => ({
      url: canonicalUrl(`/${item.slug}/`),
      lastModified: new Date()
    }));

  const postRoutes = posts.map((item) => ({
    url: canonicalUrl(`/${item.slug}/`),
    lastModified: new Date(item.publishedAt || Date.now())
  }));

  const categoryRoutes = categories.map((item) => ({
    url: canonicalUrl(`/category/${item.slug}/`),
    lastModified: new Date()
  }));

  return [...staticRoutes, ...listingRoutes, ...pageRoutes, ...categoryRoutes, ...postRoutes];
}
