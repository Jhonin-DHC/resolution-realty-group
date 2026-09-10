import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { RemoteImage } from "@/components/remote-image";
import { rewriteLegacyWpMediaInText } from "@/lib/wp-media";
import type { PublicPost } from "@/types/content";

export function PostDetail({ post, related }: { post: PublicPost; related: PublicPost[] }) {
  return (
    <article>
      <section className="bg-[var(--navy)] py-16 text-white">
        <div className="container-shell">
          <Link href="/blogs/" className="text-sm text-[var(--gold)]">
            ← All blogs
          </Link>
          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--coral)]">{post.category}</p>
          <h1 className="mt-3 max-w-4xl text-4xl md:text-5xl">{post.title}</h1>
          <p className="mt-4 text-white/60">
            {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </section>
      {post.featuredImage ? (
        <div className="container-shell relative mt-10 aspect-[16/8] overflow-hidden rounded-2xl">
          <RemoteImage src={post.featuredImage} alt={post.title} />
        </div>
      ) : null}
      <section className="py-12">
        <div
          className="prose-rrg container-shell max-w-3xl"
          dangerouslySetInnerHTML={{ __html: rewriteLegacyWpMediaInText(post.body) }}
        />
      </section>
      {related.length > 0 ? (
        <section className="bg-[var(--cream)] py-16">
          <div className="container-shell">
            <h2 className="section-title">Related posts</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {related.map((item) => (
                <PostCard key={item.slug} post={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
