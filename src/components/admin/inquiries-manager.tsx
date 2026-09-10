"use client";

import { useEffect, useState } from "react";

interface InquiryRow {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  listingTitle?: string;
  propertyAddress?: string;
  city?: string;
  preferredTime?: string;
  read: boolean;
  createdAt: string;
}

export function InquiriesManager() {
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const response = await fetch("/api/admin/inquiries");
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Failed to load inquiries.");
      return;
    }
    setInquiries(payload.inquiries ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const mark = async (id: string, read: boolean) => {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read })
    });
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {inquiries.length === 0 ? <p>No inquiries yet.</p> : null}
      {inquiries.map((inquiry) => (
        <article key={inquiry._id} className={`rounded-2xl bg-white p-5 ${inquiry.read ? "opacity-70" : ""}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-heading text-lg">{inquiry.name}</p>
              <p className="text-sm text-[var(--body)]">
                {inquiry.email} · {inquiry.phone || "no phone"} · {inquiry.source}
              </p>
            </div>
            <p className="text-xs text-[var(--body)]">{new Date(inquiry.createdAt).toLocaleString()}</p>
          </div>
          {inquiry.listingTitle ? <p className="mt-2 text-sm">Listing: {inquiry.listingTitle}</p> : null}
          {inquiry.propertyAddress ? <p className="text-sm">Property: {inquiry.propertyAddress}</p> : null}
          {inquiry.preferredTime ? <p className="text-sm">Preferred time: {inquiry.preferredTime}</p> : null}
          <p className="mt-3 whitespace-pre-line text-sm leading-7">{inquiry.message}</p>
          <div className="mt-4 flex gap-3 text-sm">
            <button type="button" className="text-[var(--coral)]" onClick={() => void mark(inquiry._id, !inquiry.read)}>
              {inquiry.read ? "Mark unread" : "Mark read"}
            </button>
            <button type="button" className="text-red-700" onClick={() => void remove(inquiry._id)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
