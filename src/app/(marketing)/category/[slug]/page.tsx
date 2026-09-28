import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { getCategories, getPostsPage, POSTS_PER_PAGE } from "@/lib/posts-service";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);
  return pageMetadata({
    title: category ? `${category.name} Real Estate` : "Category",
    description: category
      ? `Texas real estate articles and selling tips for ${category.name} from Resolution Realty Group.`
      : "Texas real estate articles from Resolution Realty Group.",
    path: `/category/${slug}/`
  });
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const current = Number(page) || 1;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const { posts, totalPages } = await getPostsPage(current, POSTS_PER_PAGE, slug);

  return (
    <section className="bg-[var(--cream)] py-16">
      <div className="container-shell">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--coral)]">Category</p>
        <h1 className="section-title mt-2">{category.name}</h1>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        {totalPages > 1 ? (
          <div className="mt-12 flex justify-center gap-3">
            {current > 1 ? (
              <Link href={`/category/${slug}/?page=${current - 1}`} className="btn-outline">
                Prev
              </Link>
            ) : null}
            <span className="self-center text-sm text-[var(--body)]">
              Page {current} of {totalPages}
            </span>
            {current < totalPages ? (
              <Link href={`/category/${slug}/?page=${current + 1}`} className="btn-outline">
                Next
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
