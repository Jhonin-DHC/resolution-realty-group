import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing-page";
import { getMarketingPageBySlug } from "@/lib/pages-service";

export const metadata: Metadata = {
  title: "Our Mission",
  description: "Turning real estate challenges into opportunities with integrity, expertise, and compassion."
};

export default function MissionPage() {
  const page = getMarketingPageBySlug("our-mission");
  if (!page) return null;
  return <MarketingPage page={page} />;
}
