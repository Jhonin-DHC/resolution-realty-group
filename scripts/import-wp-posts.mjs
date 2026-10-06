import mongoose from "mongoose";

const WP_ORIGIN = "https://39237.us6.myftpupload.com";
const WP_MEDIA_ORIGIN = "https://39237.us6.myftpupload.com";

function rewriteWpMedia(text = "") {
  return text.replace(
    /https?:\/\/(?:www\.)?(?:resolutionrealtygroup\.com|39237\.us6\.myftpupload\.com)\/wp-content/gi,
    `${WP_MEDIA_ORIGIN}/wp-content`
  );
}

const SKIP_SLUGS = new Set(["kms-activator-download"]);

function stripTags(value = "") {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeEntities(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed ${url}: ${response.status}`);
  }
  return { data: await response.json(), headers: response.headers };
}

async function fetchAll(path) {
  const items = [];
  let page = 1;
  while (true) {
    const url = `${WP_ORIGIN}/wp-json/wp/v2/${path}${path.includes("?") ? "&" : "?"}per_page=100&page=${page}`;
    const response = await fetch(url);
    if (response.status === 400 && page > 1) break;
    if (!response.ok) throw new Error(`Failed ${url}: ${response.status}`);
    const batch = await response.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    items.push(...batch);
    const totalPages = Number(response.headers.get("X-WP-TotalPages") || 1);
    if (page >= totalPages) break;
    page += 1;
    console.log(`Fetched ${path} page ${page - 1}/${totalPages} (${items.length} so far)`);
  }
  return items;
}

async function extractBodyFallback(slug) {
  try {
    const html = await fetch(`${WP_ORIGIN}/${slug}/`).then((res) => res.text());
    const match =
      html.match(/<div[^>]+class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<footer|<nav|<\/article)/i) ||
      html.match(/<div[^>]+class="[^"]*elementor-widget-theme-post-content[^"]*"[\s\S]*?<div[^>]+class="elementor-widget-container"[^>]*>([\s\S]*?)<\/div>/i);
    return match?.[1]?.trim() || "";
  } catch {
    return "";
  }
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required to import WordPress posts.");

  await mongoose.connect(uri);
  const Post = mongoose.models.Post || mongoose.model("Post", new mongoose.Schema({}, { strict: false, timestamps: true }));

  const categories = await fetchAll("categories");
  const categoryMap = new Map(categories.map((cat) => [cat.id, { name: cat.name, slug: cat.slug }]));

  let page = 1;
  let imported = 0;
  let skipped = 0;

  while (true) {
    const url = `${WP_ORIGIN}/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed=1`;
    const response = await fetch(url);
    if (response.status === 400 && page > 1) break;
    if (!response.ok) throw new Error(`Failed posts page ${page}: ${response.status}`);
    const posts = await response.json();
    if (!Array.isArray(posts) || posts.length === 0) break;

    for (const post of posts) {
      const slug = post.slug;
      if (!slug || SKIP_SLUGS.has(slug)) {
        skipped += 1;
        continue;
      }

      const title = decodeEntities(stripTags(post.title?.rendered || slug));
      let body = rewriteWpMedia(post.content?.rendered || "");
      if (!stripTags(body)) {
        body = rewriteWpMedia(await extractBodyFallback(slug));
      }

      const excerpt = decodeEntities(stripTags(post.excerpt?.rendered || body)).slice(0, 280);
      const featured = rewriteWpMedia(
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
          post.jetpack_featured_media_url ||
          ""
      );
      const categoryId = Array.isArray(post.categories) ? post.categories[0] : null;
      const category = categoryMap.get(categoryId) || { name: "Uncategorized", slug: "uncategorized" };
      const seo = post.yoast_head_json || post.rank_math || {};
      const seoTitle =
        seo.title ||
        post.rank_math_title ||
        post.yoast_title ||
        title;
      const seoDescription =
        seo.description ||
        post.rank_math_description ||
        post.yoast_metadesc ||
        excerpt;

      await Post.updateOne(
        { slug },
        {
          $set: {
            slug,
            title,
            excerpt,
            body,
            category: category.name,
            categorySlug: category.slug,
            featuredImage: featured,
            publishedAt: post.date ? new Date(post.date) : new Date(),
            published: post.status === "publish",
            seoTitle,
            seoDescription
          }
        },
        { upsert: true }
      );
      imported += 1;
    }

    const totalPages = Number(response.headers.get("X-WP-TotalPages") || 1);
    console.log(`Imported page ${page}/${totalPages} (${imported} posts, ${skipped} skipped)`);
    if (page >= totalPages) break;
    page += 1;
  }

  console.log(`Done. Upserted ${imported} posts. Skipped ${skipped}.`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
