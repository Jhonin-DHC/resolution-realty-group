import { rewriteLegacyWpMediaUrl } from "@/lib/wp-media";

const MEDIA_PREFIXES = ["listings/", "posts/", "uploads/"];

function isAllowedMediaKey(key: string) {
  return (
    Boolean(key) &&
    MEDIA_PREFIXES.some((prefix) => key.startsWith(prefix)) &&
    !key.includes("..") &&
    !key.includes("\\")
  );
}

function isOurR2PublicHost(hostname: string) {
  const configured = process.env.NEXT_PUBLIC_R2_HOST;
  return hostname.endsWith(".r2.dev") || (configured ? hostname === configured : false);
}

export function toDisplayImageUrl(url: string) {
  if (!url) return url;
  url = rewriteLegacyWpMediaUrl(url);
  if (url.startsWith("/api/media/") || url.startsWith("/brand/") || url.startsWith("/")) return url;
  try {
    const parsed = new URL(url);
    if (!isOurR2PublicHost(parsed.hostname)) return url;
    const key = parsed.pathname.replace(/^\/+/, "");
    if (!isAllowedMediaKey(key)) return url;
    return `/api/media/${key.split("/").map(encodeURIComponent).join("/")}`;
  } catch {
    return url;
  }
}

export function toDisplayImageUrls(urls: string[]) {
  return urls.map(toDisplayImageUrl);
}
