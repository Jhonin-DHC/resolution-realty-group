import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { rewriteLegacyWpMediaUrl } from "@/lib/wp-media";

function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error("R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET are required.");
  }

  return { accountId, accessKeyId, secretAccessKey, bucket };
}

function getPublicBaseUrl() {
  const configured = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  throw new Error("R2_PUBLIC_BASE_URL is required to serve uploaded images publicly.");
}

function createR2Client() {
  const { accountId, accessKeyId, secretAccessKey } = getR2Config();
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey }
  });
}

const MEDIA_PREFIXES = ["listings/", "posts/", "uploads/"];

export function isAllowedMediaKey(key: string) {
  return (
    Boolean(key) &&
    MEDIA_PREFIXES.some((prefix) => key.startsWith(prefix)) &&
    !key.includes("..") &&
    !key.includes("\\")
  );
}

export async function getR2ObjectStream(key: string, range?: string | null) {
  const { bucket } = getR2Config();
  const client = createR2Client();
  const result = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ...(range ? { Range: range } : {})
    })
  );
  const body = result.Body?.transformToWebStream?.() ?? null;
  return {
    body,
    contentType: result.ContentType || "application/octet-stream",
    etag: result.ETag,
    contentLength: result.ContentLength,
    contentRange: result.ContentRange,
    acceptRanges: "bytes" as const
  };
}

function sanitizeFilename(filename: string) {
  return filename.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/-+/g, "-");
}

export function isR2Configured() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_BASE_URL
  );
}

export function normalizePublicImageUrl(url: string) {
  if (!url) return url;
  const rewritten = rewriteLegacyWpMediaUrl(url);
  if (!process.env.R2_PUBLIC_BASE_URL) return rewritten;
  try {
    const current = new URL(rewritten);
    const targetBase = getPublicBaseUrl();
    const targetHost = new URL(targetBase).hostname;
    if (current.hostname === targetHost) return rewritten;
    if (current.hostname.endsWith(".r2.dev")) {
      return `${targetBase}${current.pathname}${current.search}`;
    }
    return rewritten;
  } catch {
    return rewritten;
  }
}

export function normalizePublicImageUrls(urls: string[]) {
  return urls.map(normalizePublicImageUrl);
}

async function putPublicObject(key: string, file: File, fallbackType: string) {
  const { bucket } = getR2Config();
  const publicBaseUrl = getPublicBaseUrl();

  if (/pub-your-id\.r2\.dev/i.test(publicBaseUrl)) {
    throw new Error("R2_PUBLIC_BASE_URL is still a placeholder. Set your real Cloudflare R2 public URL.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const client = createR2Client();
  const contentType = file.type || fallbackType;

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable"
      })
    );
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown R2 error";
    throw new Error(`R2 upload failed: ${detail}`);
  }

  return { key, url: `${publicBaseUrl}/${key}`, contentType, sizeBytes: buffer.length };
}

export async function uploadMedia(file: File, folder = "uploads") {
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const key = `${folder}/${randomUUID()}-${sanitizeFilename(file.name || `image.${extension}`)}`;
  const uploaded = await putPublicObject(key, file, "image/jpeg");
  return { key: uploaded.key, url: uploaded.url };
}

export async function uploadListingImage(file: File) {
  return uploadMedia(file, "listings");
}
