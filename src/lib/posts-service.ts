import { connectMongo, isMongoConfigured } from "@/lib/mongodb";
import { normalizePublicImageUrl } from "@/lib/r2";
import { rewriteLegacyWpMediaInText } from "@/lib/wp-media";
import { Post } from "@/models/Post";
import { seedPosts } from "@/data/posts";
import type { PublicPost } from "@/types/content";

export const POSTS_PER_PAGE = 12;

function withPublicMedia(post: PublicPost): PublicPost {
  return {
    ...post,
    featuredImage: normalizePublicImageUrl(post.featuredImage),
    body: rewriteLegacyWpMediaInText(post.body)
  };
}

function fromDoc(doc: Record<string, unknown>): PublicPost {
  const publishedAt = doc.publishedAt instanceof Date ? doc.publishedAt.toISOString() : String(doc.publishedAt ?? "");
  return {
    id: String(doc._id ?? doc.id ?? doc.slug),
    slug: String(doc.slug ?? ""),
    title: String(doc.title ?? ""),
    excerpt: String(doc.excerpt ?? ""),
    body: rewriteLegacyWpMediaInText(String(doc.body ?? "")),
    category: String(doc.category ?? "Dallas"),
    categorySlug: String(doc.categorySlug ?? "dallas"),
    featuredImage: normalizePublicImageUrl(String(doc.featuredImage ?? "")),
    publishedAt,
    seoTitle: String(doc.seoTitle ?? ""),
    seoDescription: String(doc.seoDescription ?? "")
  };
}

async function mongoAvailable() {
  if (!isMongoConfigured()) return false;
  try {
    await connectMongo();
    const count = await Post.countDocuments({ published: true });
    return count > 0;
  } catch {
    return false;
  }
}

export async function getRecentPosts(limit = 3): Promise<PublicPost[]> {
  try {
    if (await mongoAvailable()) {
      const docs = await Post.find({ published: true }).sort({ publishedAt: -1 }).limit(limit).lean();
      return docs.map((doc) => fromDoc(doc as Record<string, unknown>));
    }
  } catch {
    // fall through
  }
  return seedPosts.slice(0, limit).map(withPublicMedia);
}

export async function getPostsPage(page = 1, perPage = POSTS_PER_PAGE, categorySlug?: string) {
  const safePage = Math.max(1, page);
  try {
    if (await mongoAvailable()) {
      const filter: Record<string, unknown> = { published: true };
      if (categorySlug) filter.categorySlug = categorySlug;
      const [docs, total] = await Promise.all([
        Post.find(filter)
          .sort({ publishedAt: -1 })
          .skip((safePage - 1) * perPage)
          .limit(perPage)
          .lean(),
        Post.countDocuments(filter)
      ]);
      return {
        posts: docs.map((doc) => fromDoc(doc as Record<string, unknown>)),
        total,
        page: safePage,
        perPage,
        totalPages: Math.max(1, Math.ceil(total / perPage))
      };
    }
  } catch {
    // fall through
  }

  const source = categorySlug ? seedPosts.filter((item) => item.categorySlug === categorySlug) : seedPosts;
  const start = (safePage - 1) * perPage;
  return {
    posts: source.slice(start, start + perPage).map(withPublicMedia),
    total: source.length,
    page: safePage,
    perPage,
    totalPages: Math.max(1, Math.ceil(source.length / perPage))
  };
}

export async function getPostBySlug(slug: string): Promise<PublicPost | null> {
  try {
    if (await mongoAvailable()) {
      const doc = await Post.findOne({ slug, published: true }).lean();
      return doc ? fromDoc(doc as Record<string, unknown>) : null;
    }
  } catch {
    // fall through
  }
  const fallback = seedPosts.find((item) => item.slug === slug);
  return fallback ? withPublicMedia(fallback) : null;
}

export async function getAllPostSlugs() {
  try {
    if (await mongoAvailable()) {
      const docs = await Post.find({ published: true }).select("slug publishedAt").sort({ publishedAt: -1 }).lean();
      return docs.map((doc) => ({
        slug: String(doc.slug),
        publishedAt: doc.publishedAt instanceof Date ? doc.publishedAt.toISOString() : String(doc.publishedAt ?? "")
      }));
    }
  } catch {
    // fall through
  }
  return seedPosts.map((post) => ({ slug: post.slug, publishedAt: post.publishedAt }));
}

export async function getCategories() {
  try {
    if (await mongoAvailable()) {
      const docs = await Post.aggregate([
        { $match: { published: true } },
        { $group: { _id: "$categorySlug", name: { $first: "$category" }, count: { $sum: 1 } } },
        { $sort: { name: 1 } }
      ]);
      return docs.map((doc) => ({ slug: String(doc._id), name: String(doc.name), count: Number(doc.count) }));
    }
  } catch {
    // fall through
  }

  const map = new Map<string, { name: string; slug: string; count: number }>();
  for (const post of seedPosts) {
    const current = map.get(post.categorySlug);
    if (current) current.count += 1;
    else map.set(post.categorySlug, { name: post.category, slug: post.categorySlug, count: 1 });
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPublishedPosts(): Promise<PublicPost[]> {
  const { posts } = await getPostsPage(1, 50);
  return posts;
}
