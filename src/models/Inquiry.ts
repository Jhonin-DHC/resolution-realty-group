import mongoose, { Schema, models } from "mongoose";

const InquirySchema = new Schema(
  {
    listingId: { type: String, default: "" },
    listingSlug: { type: String, default: "" },
    listingTitle: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    message: { type: String, default: "" },
    source: { type: String, default: "contact" },
    preferredTime: { type: String, default: "" },
    propertyAddress: { type: String, default: "" },
    city: { type: String, default: "" },
    notes: { type: String, default: "" },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Inquiry = models.Inquiry || mongoose.model("Inquiry", InquirySchema);
