import { getListingBySlug } from "@/lib/listings-service";
import { getMarketingPageBySlug } from "@/lib/pages-service";
import { getPostBySlug } from "@/lib/posts-service";
import { reservedSlugs } from "@/lib/site";

export type ResolvedSlug =
  | { kind: "listing"; listing: NonNullable<Awaited<ReturnType<typeof getListingBySlug>>> }
  | { kind: "page"; page: NonNullable<ReturnType<typeof getMarketingPageBySlug>> }
  | { kind: "post"; post: NonNullable<Awaited<ReturnType<typeof getPostBySlug>>> }
  | { kind: "none" };

export async function resolveSlug(slug: string): Promise<ResolvedSlug> {
  if (reservedSlugs.has(slug)) return { kind: "none" };

  const listing = await getListingBySlug(slug);
  if (listing) return { kind: "listing", listing };

  const page = getMarketingPageBySlug(slug);
  if (page) return { kind: "page", page };

  const post = await getPostBySlug(slug);
  if (post) return { kind: "post", post };

  return { kind: "none" };
}
