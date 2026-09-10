import { site } from "@/lib/site";

export function getRequestOrigin(request: Request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL || site.url;
}

export function publicErrorMessage(error: unknown, fallback: string) {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  if (/535|BadCredentials|Username and Password not accepted|EAUTH|Invalid login/i.test(raw)) {
    return "Email is not sending right now. Please email or call the concierge, or try again later.";
  }
  if (!raw || raw.length > 180 || /smtp|nodemailer|gsmtp/i.test(raw)) {
    return fallback;
  }
  return raw;
}
