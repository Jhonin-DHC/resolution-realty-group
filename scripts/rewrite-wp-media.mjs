import mongoose from "mongoose";

const FROM = /https?:\/\/(?:www\.)?resolutionrealtygroup\.com\/wp-content/gi;
const TO = "https://39237.us6.myftpupload.com/wp-content";

function rewriteValue(value) {
  if (typeof value === "string") return value.replace(FROM, TO);
  if (Array.isArray(value)) return value.map(rewriteValue);
  if (value && typeof value === "object" && !(value instanceof Date) && !value._bsontype) {
    const next = {};
    for (const [key, nested] of Object.entries(value)) {
      if (key === "_id") {
        next[key] = nested;
        continue;
      }
      next[key] = rewriteValue(nested);
    }
    return next;
  }
  return value;
}

function hasLegacyMedia(value) {
  return JSON.stringify(value).includes("resolutionrealtygroup.com/wp-content");
}

async function rewriteCollection(model, label) {
  const docs = await model.find({}).lean();
  let updated = 0;
  for (const doc of docs) {
    if (!hasLegacyMedia(doc)) continue;
    const { _id, ...rest } = doc;
    const rewritten = rewriteValue(rest);
    await model.updateOne({ _id }, { $set: rewritten });
    updated += 1;
  }
  console.log(`${label}: rewired ${updated} of ${docs.length} documents`);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required to rewrite stored media URLs.");

  await mongoose.connect(uri);
  const Listing = mongoose.models.Listing || mongoose.model("Listing", new mongoose.Schema({}, { strict: false, timestamps: true }));
  const Post = mongoose.models.Post || mongoose.model("Post", new mongoose.Schema({}, { strict: false, timestamps: true }));

  await rewriteCollection(Listing, "listings");
  await rewriteCollection(Post, "posts");

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
