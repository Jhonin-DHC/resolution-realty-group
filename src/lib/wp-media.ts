/** WordPress still hosts the original media library. Keep absolute URLs on the live host. */
export const WP_MEDIA_ORIGIN = "https://resolutionrealtygroup.com";
export const WP_UPLOADS_BASE = `${WP_MEDIA_ORIGIN}/wp-content/uploads`;

const WP_HOSTS = new Set(["resolutionrealtygroup.com", "www.resolutionrealtygroup.com"]);

export function rewriteLegacyWpMediaUrl(url: string) {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    if (WP_HOSTS.has(parsed.hostname) && parsed.pathname.startsWith("/wp-content/")) {
      return `${WP_MEDIA_ORIGIN}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return url;
  } catch {
    return rewriteLegacyWpMediaInText(url);
  }
}

export function rewriteLegacyWpMediaInText(text: string) {
  if (!text) return text;
  return text.replace(
    /https?:\/\/(?:www\.)?resolutionrealtygroup\.com\/wp-content/gi,
    `${WP_MEDIA_ORIGIN}/wp-content`
  );
}
