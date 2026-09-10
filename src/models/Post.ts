import mongoose, { Schema, models } from "mongoose";

const PostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: "" },
    body: { type: String, default: "" },
    category: { type: String, default: "Dallas" },
    categorySlug: { type: String, default: "dallas" },
    featuredImage: { type: String, default: "" },
    publishedAt: { type: Date, default: Date.now },
    published: { type: Boolean, default: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" }
  },
  { timestamps: true }
);

PostSchema.index({ published: 1, publishedAt: -1 });
PostSchema.index({ categorySlug: 1, published: 1, publishedAt: -1 });

export const Post = models.Post || mongoose.model("Post", PostSchema);
