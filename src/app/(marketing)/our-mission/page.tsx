import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing-page";
import { getMarketingPageBySlug } from "@/lib/pages-service";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Mission",
  description: "Turning real estate challenges into opportunities with integrity, expertise, and compassion.",
  path: "/our-mission/"
});

export default function MissionPage() {
  const page = getMarketingPageBySlug("our-mission");
  if (!page) return null;
  return <MarketingPage page={page} />;
}
