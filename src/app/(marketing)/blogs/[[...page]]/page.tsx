import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { getCategories, getPostsPage, POSTS_PER_PAGE } from "@/lib/posts-service";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ page?: string[] }> }): Promise<Metadata> {
  const { page } = await params;
  const current = page && page.length ? Number(page[0] === "page" ? page[1] : page[0]) || 1 : 1;
  const path = current > 1 ? `/blogs/${current}/` : "/blogs/";
  return pageMetadata({
    title: current > 1 ? `Blogs — Page ${current}` : "Texas Real Estate Blog",
    description: "Texas real estate insights from Resolution Realty Group.",
    path
  });
}

function parsePage(page?: string[]) {
  if (!page || page.length === 0) return 1;
  if (page[0] === "page" && page[1]) return Number(page[1]) || 1;
  return Number(page[0]) || 1;
}

export default async function BlogsPage({ params }: { params: Promise<{ page?: string[] }> }) {
  const { page } = await params;
  const current = parsePage(page);
  const [{ posts, totalPages }, categories] = await Promise.all([getPostsPage(current, POSTS_PER_PAGE), getCategories()]);

  return (
    <section className="bg-[var(--cream)] py-16">
      <div className="container-shell">
        <h1 className="section-title">Our Recent Blogs & Insights</h1>
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.slice(0, 24).map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}/`}
              className="rounded-full bg-white px-3 py-1 text-sm text-[var(--navy)] hover:text-[var(--coral)]"
            >
              {category.name}
            </Link>
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <Pagination base="/blogs" page={current} totalPages={totalPages} />
      </div>
    </section>
  );
}

function Pagination({ base, page, totalPages }: { base: string; page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const prev = page > 1 ? (page === 2 ? `${base}/` : `${base}/${page - 1}/`) : null;
  const next = page < totalPages ? `${base}/${page + 1}/` : null;
  return (
    <div className="mt-12 flex justify-center gap-3">
      {prev ? (
        <Link href={prev} className="btn-outline">
          Prev
        </Link>
      ) : null}
      <span className="self-center text-sm text-[var(--body)]">
        Page {page} of {totalPages}
      </span>
      {next ? (
        <Link href={next} className="btn-outline">
          Next
        </Link>
      ) : null}
    </div>
  );
}
