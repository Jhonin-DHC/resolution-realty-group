import mongoose, { Schema, models } from "mongoose";

export const listingStatuses = ["draft", "published", "coming-soon", "sold"] as const;
export const priceTypes = ["sale", "rent"] as const;

const ListingSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: "" },
    state: { type: String, default: "TX" },
    status: { type: String, enum: listingStatuses, default: "published" },
    priceUsd: { type: Number, default: 0 },
    priceType: { type: String, enum: priceTypes, default: "sale" },
    priceLabel: { type: String, default: "" },
    homepagePriceLabel: { type: String, default: "" },
    beds: { type: Number, default: 0 },
    baths: { type: Number, default: 0 },
    bathsHalf: { type: Number, default: 0 },
    rooms: { type: Number, default: 0 },
    sqft: { type: Number, default: 0 },
    lotAcres: { type: Number, default: 0 },
    lotSqft: { type: Number, default: 0 },
    yearBuilt: { type: Number, default: 0 },
    mlsNumber: { type: String, default: "" },
    hoa: { type: String, default: "" },
    features: { type: [String], default: [] },
    featureBlocks: { type: [{ heading: String, body: String }], default: [] },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    imageUrls: { type: [String], default: [] },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    featuredOnHome: { type: Boolean, default: false },
    listingType: { type: String, default: "Single Family Home" }
  },
  { timestamps: true }
);

export const Listing = models.Listing || mongoose.model("Listing", ListingSchema);
