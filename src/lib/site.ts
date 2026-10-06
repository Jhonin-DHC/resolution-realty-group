const PRODUCTION_SITE_URL = "https://www.resolutionrealtygroup.com";

function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
  if (configured.includes("localhost") || configured.includes("127.0.0.1")) return configured;
  if (!configured || configured.includes("vercel.app")) return PRODUCTION_SITE_URL;
  if (/^https?:\/\/resolutionrealtygroup\.com$/i.test(configured)) return PRODUCTION_SITE_URL;
  return configured;
}

export const site = {
  name: "Resolution Realty Group",
  shortName: "RRG",
  url: resolveSiteUrl(),
  email: "concierge@resolutionrealtygroup.com",
  phone: "(469) 837-8891",
  phoneHref: "tel:+14698378891",
  phoneDisplay: "+1 469-837-8891",
  office: "508 North 2nd Street, Honey Grove, TX 75446",
  officeLine: "508 North 2nd Street, Honey Grove Texas 75446",
  agent: "David Josh, MBA",
  broker: "Brokered by Central Metro Realty",
  tagline: "90 Days to Sold Guaranteed or David Will Buy It!",
  description:
    "Skip the stress of showings and waiting. Get a fair, guaranteed cash offer and, with our 90 Days to Sold promise, close on your timeline with complete confidence.",
  hours: "Mo–Su 09:00–17:00",
  socials: {
    youtube: "https://www.youtube.com/@ResolutionRealtyGroup",
    instagram: "https://www.instagram.com/daviator21/",
    facebook: "https://www.facebook.com/davidcjosh",
    linkedin: "https://www.linkedin.com/company/resolution-property-group/"
  },
  logo: "https://39237.us6.myftpupload.com/wp-content/uploads/2025/06/logo-rv-03.png",
  icon: "https://39237.us6.myftpupload.com/wp-content/uploads/2025/02/cropped-resolutionrealtygroup-1-32x32.png"
} as const;

export const reservedSlugs = new Set([
  "admin",
  "api",
  "blogs",
  "blog",
  "category",
  "about",
  "team",
  "contact",
  "contact-us-texas-real-estate",
  "free-home-valuation",
  "privacy-policy",
  "terms-and-conditions",
  "terms",
  "our-mission",
  "login"
]);

export const listingAliases: Record<string, string> = {
  "oconnor-ranch": "2432-oconnor-ranch-dr-weatherford-tx-76087"
};
