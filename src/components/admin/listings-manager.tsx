"use client";

import { useEffect, useState } from "react";
import { slugify } from "@/lib/slug";

interface ListingRow {
  _id: string;
  slug: string;
  title: string;
  address: string;
  city: string;
  state: string;
  status: "draft" | "published" | "coming-soon" | "sold";
  priceUsd: number;
  priceType: "sale" | "rent";
  priceLabel: string;
  homepagePriceLabel: string;
  beds: number;
  baths: number;
  sqft: number;
  features: string[];
  description: string;
  imageUrl: string;
  imageUrls: string[];
  seoTitle: string;
  seoDescription: string;
  featuredOnHome: boolean;
}

const emptyForm: Omit<ListingRow, "_id"> = {
  slug: "",
  title: "",
  address: "",
  city: "",
  state: "TX",
  status: "published",
  priceUsd: 0,
  priceType: "sale",
  priceLabel: "",
  homepagePriceLabel: "",
  beds: 0,
  baths: 0,
  sqft: 0,
  features: [],
  description: "",
  imageUrl: "",
  imageUrls: [],
  seoTitle: "",
  seoDescription: "",
  featuredOnHome: false
};

export function ListingsManager() {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const response = await fetch("/api/admin/listings");
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Failed to load listings.");
      return;
    }
    setListings(payload.listings ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;
    setUploading(true);
    setError(null);
    const uploadedUrls: string[] = [];
    for (const file of fileArray) {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "listings");
      const response = await fetch("/api/admin/uploads", { method: "POST", body });
      const payload = await response.json();
      if (response.ok && payload.url) uploadedUrls.push(payload.url as string);
      else setError(payload.error ?? "Upload failed.");
    }
    if (uploadedUrls.length > 0) {
      setForm((current) => {
        if (!current.imageUrl) {
          const [main, ...rest] = uploadedUrls;
          return { ...current, imageUrl: main, imageUrls: [...current.imageUrls, ...rest] };
        }
        return { ...current, imageUrls: [...current.imageUrls, ...uploadedUrls] };
      });
    }
    setUploading(false);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { ...form, slug: form.slug || slugify(form.address || form.title) };
    const response = await fetch(editingId ? `/api/admin/listings/${editingId}` : "/api/admin/listings", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await response.json();
    setSaving(false);
    if (!response.ok) {
      setError(body.error ?? "Save failed.");
      return;
    }
    setForm(emptyForm);
    setEditingId(null);
    await load();
  };

  const edit = (listing: ListingRow) => {
    const { _id, ...rest } = listing;
    setEditingId(_id);
    setForm({ ...emptyForm, ...rest, features: rest.features ?? [], imageUrls: rest.imageUrls ?? [] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
      <form onSubmit={save} className="space-y-3 rounded-2xl bg-white p-5">
        <h2 className="text-xl">{editingId ? "Edit listing" : "New listing"}</h2>
        <input className="field-input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className="field-input" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <input className="field-input" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <div className="grid grid-cols-2 gap-3">
          <input className="field-input" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input className="field-input" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <input className="field-input" type="number" placeholder="Price" value={form.priceUsd} onChange={(e) => setForm({ ...form, priceUsd: Number(e.target.value) })} />
          <input className="field-input" placeholder="Price label" value={form.priceLabel} onChange={(e) => setForm({ ...form, priceLabel: e.target.value })} />
          <input className="field-input" placeholder="Homepage price" value={form.homepagePriceLabel} onChange={(e) => setForm({ ...form, homepagePriceLabel: e.target.value })} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <input className="field-input" type="number" placeholder="Beds" value={form.beds} onChange={(e) => setForm({ ...form, beds: Number(e.target.value) })} />
          <input className="field-input" type="number" placeholder="Baths" value={form.baths} onChange={(e) => setForm({ ...form, baths: Number(e.target.value) })} />
          <input className="field-input" type="number" placeholder="Sqft" value={form.sqft} onChange={(e) => setForm({ ...form, sqft: Number(e.target.value) })} />
        </div>
        <textarea className="field-input min-h-28" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="field-input" placeholder="Main image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <input className="field-input" placeholder="Gallery URLs, comma separated" value={form.imageUrls.join(", ")} onChange={(e) => setForm({ ...form, imageUrls: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} />
        <input className="field-input" placeholder="Features, comma separated" value={form.features.join(", ")} onChange={(e) => setForm({ ...form, features: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featuredOnHome} onChange={(e) => setForm({ ...form, featuredOnHome: e.target.checked })} />
          Featured on homepage
        </label>
        <input type="file" multiple accept="image/*" onChange={(e) => e.target.files && void uploadFiles(e.target.files)} />
        {uploading ? <p className="text-sm">Uploading…</p> : null}
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button className="btn-coral" disabled={saving}>
          {saving ? "Saving…" : "Save listing"}
        </button>
      </form>
      <div className="space-y-3">
        {listings.map((listing) => (
          <div key={listing._id} className="rounded-2xl bg-white p-4">
            <p className="font-heading">{listing.title}</p>
            <p className="text-sm text-[var(--body)]">/{listing.slug}/ · {listing.city}</p>
            <div className="mt-3 flex gap-3 text-sm">
              <button type="button" onClick={() => edit(listing)} className="text-[var(--coral)]">
                Edit
              </button>
              <button type="button" onClick={() => void remove(listing._id)} className="text-red-700">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
