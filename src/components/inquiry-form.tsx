"use client";

import { useState } from "react";

export type InquirySource = "contact" | "book-call" | "cash-offer" | "valuation" | "listing";

export function InquiryForm({
  listingId,
  listingSlug,
  listingTitle,
  source = "contact",
  submitLabel = "Send Message"
}: {
  listingId?: string;
  listingSlug?: string;
  listingTitle?: string;
  source?: InquirySource;
  submitLabel?: string;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const showAddress = source === "cash-offer" || source === "valuation" || source === "listing";
  const showCity = source === "valuation";
  const showTime = source === "book-call";
  const messageRequired = source === "contact" || source === "listing" || source === "cash-offer";

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setError(null);
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, listingId, listingSlug, listingTitle, source })
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setError(payload.error ?? "Unable to send your message.");
        return;
      }
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setError("Unable to send your message. Please try again.");
    }
  };

  if (status === "sent") {
    return (
      <p className="rounded-2xl border border-[var(--gold)] bg-white p-5 text-sm text-[var(--navy)]">
        Thank you. Your message has been received. You can also reach us by call or text at (469) 837-8891.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl bg-white p-5 shadow-sm md:p-6">
      <input name="name" className="field-input" placeholder="Full name" required />
      <input name="email" type="email" className="field-input" placeholder="Email" required />
      <input name="phone" className="field-input" placeholder="Phone" />
      {showTime ? <input name="preferredTime" className="field-input" placeholder="Preferred time to talk" /> : null}
      {showAddress ? <input name="propertyAddress" className="field-input" placeholder="Property address" /> : null}
      {showCity ? <input name="city" className="field-input" placeholder="City" /> : null}
      <textarea
        name={source === "valuation" ? "notes" : "message"}
        className="field-input min-h-28"
        placeholder={source === "valuation" ? "Notes about your home" : "How can we help?"}
        required={messageRequired}
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button type="submit" className="btn-coral w-full" disabled={status === "saving"}>
        {status === "saving" ? "Sending..." : submitLabel}
      </button>
    </form>
  );
}
