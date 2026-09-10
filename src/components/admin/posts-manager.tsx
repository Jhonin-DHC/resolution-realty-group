"use client";

import { useEffect, useState } from "react";
import { slugify } from "@/lib/slug";

interface PostRow {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  categorySlug: string;
  featuredImage: string;
  publishedAt: string;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
}

const emptyForm: Omit<PostRow, "_id"> = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  category: "",
  categorySlug: "",
  featuredImage: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  published: true,
  seoTitle: "",
  seoDescription: ""
};

export function PostsManager() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async (nextPage = page) => {
    const response = await fetch(`/api/admin/posts?page=${nextPage}&perPage=20`);
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Failed to load posts.");
      return;
    }
    setPosts(payload.posts ?? []);
    setTotal(payload.total ?? 0);
    setPage(payload.page ?? nextPage);
  };

  useEffect(() => {
    void load(1);
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      categorySlug: form.categorySlug || slugify(form.category)
    };
    const response = await fetch(editingId ? `/api/admin/posts/${editingId}` : "/api/admin/posts", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await response.json();
    if (!response.ok) {
      setError(body.error ?? "Save failed.");
      return;
    }
    setForm(emptyForm);
    setEditingId(null);
    await load(1);
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
      <form onSubmit={save} className="space-y-3 rounded-2xl bg-white p-5">
        <h2 className="text-xl">{editingId ? "Edit post" : "New post"}</h2>
        <input className="field-input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className="field-input" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <input className="field-input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="field-input" placeholder="Featured image URL" value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} />
        <textarea className="field-input min-h-20" placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        <textarea className="field-input min-h-40" placeholder="HTML body" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button className="btn-coral">Save post</button>
      </form>
      <div className="space-y-3">
        <p className="text-sm text-[var(--body)]">{total} posts</p>
        {posts.map((post) => (
          <div key={post._id} className="rounded-2xl bg-white p-4">
            <p className="font-heading">{post.title}</p>
            <p className="text-sm text-[var(--body)]">/{post.slug}/</p>
            <button
              type="button"
              className="mt-2 text-sm text-[var(--coral)]"
              onClick={() => {
                setEditingId(post._id);
                setForm({
                  slug: post.slug,
                  title: post.title,
                  excerpt: post.excerpt,
                  body: post.body,
                  category: post.category,
                  categorySlug: post.categorySlug,
                  featuredImage: post.featuredImage,
                  publishedAt: String(post.publishedAt).slice(0, 10),
                  published: post.published,
                  seoTitle: post.seoTitle,
                  seoDescription: post.seoDescription
                });
              }}
            >
              Edit
            </button>
          </div>
        ))}
        <div className="flex gap-3">
          <button type="button" className="btn-outline" onClick={() => void load(Math.max(1, page - 1))}>
            Prev
          </button>
          <button type="button" className="btn-outline" onClick={() => void load(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
