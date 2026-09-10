import { getPublishedListings } from "@/lib/listings-service";
import { getMarketingPages } from "@/lib/pages-service";
import { getAllPostSlugs, getCategories } from "@/lib/posts-service";
import { site } from "@/lib/site";

export default async function sitemap() {
  const [listings, pages, posts, categories] = await Promise.all([
    getPublishedListings(),
    Promise.resolve(getMarketingPages()),
    getAllPostSlugs(),
    getCategories()
  ]);

  const staticRoutes = [
    "",
    "/about/",
    "/team/",
    "/our-mission/",
    "/contact-us-texas-real-estate/",
    "/free-home-valuation/",
    "/blogs/",
    "/privacy-policy/",
    "/terms-and-conditions/"
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date()
  }));

  const listingRoutes = listings.map((item) => ({
    url: `${site.url}/${item.slug}/`,
    lastModified: new Date()
  }));

  const pageRoutes = pages.map((item) => ({
    url: `${site.url}/${item.slug}/`,
    lastModified: new Date()
  }));

  const postRoutes = posts.map((item) => ({
    url: `${site.url}/${item.slug}/`,
    lastModified: new Date(item.publishedAt || Date.now())
  }));

  const categoryRoutes = categories.map((item) => ({
    url: `${site.url}/category/${item.slug}/`,
    lastModified: new Date()
  }));

  return [...staticRoutes, ...listingRoutes, ...pageRoutes, ...categoryRoutes, ...postRoutes];
}
