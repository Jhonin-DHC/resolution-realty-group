import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Post } from "@/models/Post";

export async function GET(request: Request) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const perPage = Math.min(100, Number(searchParams.get("perPage") || 30));
    const [posts, total] = await Promise.all([
      Post.find().sort({ publishedAt: -1 }).skip((page - 1) * perPage).limit(perPage).lean(),
      Post.countDocuments()
    ]);
    return NextResponse.json({ posts, total, page, perPage });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load posts.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectMongo();
    const body = await request.json();
    const post = await Post.create({
      ...body,
      published: body.published !== false,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date()
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create post.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
