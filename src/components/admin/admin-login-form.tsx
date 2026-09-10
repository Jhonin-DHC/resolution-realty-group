"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const payload = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(payload.error ?? "Login failed.");
      return;
    }
    router.push("/admin/listings");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-md space-y-4 rounded-2xl bg-[var(--navy)] p-8 text-white">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Resolution Realty Group</p>
      <h1 className="text-3xl">Admin login</h1>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        className="field-input"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        className="field-input"
        required
      />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button type="submit" disabled={loading} className="btn-coral w-full">
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
