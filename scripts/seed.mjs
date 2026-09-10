import mongoose from "mongoose";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required to seed. Public pages already fall back to src/data without Mongo.");
  }

  await mongoose.connect(uri);

  const Listing = mongoose.models.Listing || mongoose.model("Listing", new mongoose.Schema({}, { strict: false, timestamps: true }));
  const Post = mongoose.models.Post || mongoose.model("Post", new mongoose.Schema({}, { strict: false, timestamps: true }));

  const { seedListings } = await import("../src/data/listings.ts");
  const { seedPosts } = await import("../src/data/posts.ts");

  for (const listing of seedListings) {
    const { id: _id, ...rest } = listing;
    await Listing.updateOne({ slug: rest.slug }, { $set: rest }, { upsert: true });
  }
  for (const post of seedPosts) {
    const { id: _id, ...rest } = post;
    await Post.updateOne(
      { slug: rest.slug },
      { $set: { ...rest, published: true, publishedAt: new Date(rest.publishedAt) } },
      { upsert: true }
    );
  }

  console.log(`Seeded ${seedListings.length} listings and ${seedPosts.length} posts.`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
