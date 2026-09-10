export type ListingStatus = "draft" | "published" | "coming-soon" | "sold";
export type PriceType = "sale" | "rent";

export interface ListingFeatureBlock {
  heading: string;
  body: string;
}

export interface PublicListing {
  id: string;
  slug: string;
  title: string;
  address: string;
  city: string;
  state: string;
  status: ListingStatus;
  priceUsd: number;
  priceType: PriceType;
  priceLabel: string;
  homepagePriceLabel: string;
  beds: number;
  baths: number;
  bathsHalf: number;
  rooms: number;
  sqft: number;
  lotAcres: number;
  lotSqft: number;
  yearBuilt: number;
  mlsNumber: string;
  hoa: string;
  features: string[];
  featureBlocks: ListingFeatureBlock[];
  description: string;
  imageUrl: string;
  imageUrls: string[];
  seoTitle: string;
  seoDescription: string;
  featuredOnHome: boolean;
  listingType: string;
}

export interface PublicPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  categorySlug: string;
  featuredImage: string;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface PageBenefit {
  h: string;
  p: string;
}

export interface PublicPage {
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  heroImage?: string;
  heading: string;
  intro: string;
  paragraphs?: string[];
  howItWorks?: string[];
  howItWorksIntro?: string;
  conditions?: string[];
  benefits?: PageBenefit[];
  faqs?: FaqItem[];
  extraLists?: { heading: string; items: string[] }[];
  notes?: PageBenefit[];
  cta?: string;
  ctaHeading?: string;
  extraImage?: string;
}

export interface InquirySource {
  source: "contact" | "book-call" | "cash-offer" | "valuation" | "listing";
}
