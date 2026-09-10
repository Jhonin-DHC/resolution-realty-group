import { marketingPages } from "@/data/pages";
import type { PublicPage } from "@/types/content";

export function getMarketingPages(): PublicPage[] {
  return marketingPages;
}

export function getMarketingPageBySlug(slug: string): PublicPage | null {
  return marketingPages.find((page) => page.slug === slug) ?? null;
}
