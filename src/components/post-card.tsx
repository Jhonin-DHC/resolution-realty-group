import Link from "next/link";
import { RemoteImage } from "@/components/remote-image";
import { stripHtml } from "@/lib/slug";
import type { PublicPost } from "@/types/content";

export function PostCard({ post }: { post: PublicPost }) {
  return (
    <Link href={`/${post.slug}/`} className="group block overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative aspect-[16/10] bg-[var(--navy)]">
        {post.featuredImage ? <RemoteImage src={post.featuredImage} alt={post.title} /> : null}
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--coral)]">{post.category}</p>
        <h3 className="mt-2 text-lg leading-snug group-hover:text-[var(--coral)]">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--body)]">{stripHtml(post.excerpt)}</p>
        <p className="mt-4 text-sm text-[var(--coral)]">Read more about {post.title}</p>
      </div>
    </Link>
  );
}
