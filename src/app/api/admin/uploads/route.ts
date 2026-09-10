import { NextResponse } from "next/server";
import { isR2Configured, uploadMedia } from "@/lib/r2";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  try {
    if (!isR2Configured()) {
      return NextResponse.json(
        { error: "R2 is not fully configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, and R2_PUBLIC_BASE_URL." },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "uploads");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A file is required." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Only JPEG, PNG, WebP, and GIF images are allowed." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image must be 8MB or smaller." }, { status: 400 });
    }

    const safeFolder = ["listings", "posts", "uploads"].includes(folder) ? folder : "uploads";
    const uploaded = await uploadMedia(file, safeFolder);
    return NextResponse.json({ ok: true, ...uploaded });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
