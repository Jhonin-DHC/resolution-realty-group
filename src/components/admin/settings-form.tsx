"use client";

import { useEffect, useState } from "react";

export function SettingsForm() {
  const [settings, setSettings] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/admin/settings");
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Failed to load settings.");
        return;
      }
      setSettings(payload.settings);
    };
    void load();
  }, []);

  if (error) return <p className="text-red-700">{error}</p>;
  if (!settings) return <p>Loading…</p>;

  return (
    <div className="space-y-3 rounded-2xl bg-white p-6">
      <Row label="MongoDB" ok={Boolean(settings.mongoConfigured)} />
      <Row label="SMTP" ok={Boolean(settings.emailConfigured)} />
      <Row label="Cloudflare R2" ok={Boolean(settings.r2Configured)} />
      <p className="text-sm text-[var(--body)]">Notify emails: {String(settings.inquiryNotifyEmails || "—")}</p>
      <p className="text-sm text-[var(--body)]">Site URL: {String(settings.siteUrl || "—")}</p>
    </div>
  );
}

function Row({ label, ok }: { label: string; ok: boolean }) {
  return (
    <p className="flex items-center justify-between border-b border-[var(--light)] py-3">
      <span>{label}</span>
      <span className={ok ? "text-green-700" : "text-[var(--coral)]"}>{ok ? "Configured" : "Missing"}</span>
    </p>
  );
}
