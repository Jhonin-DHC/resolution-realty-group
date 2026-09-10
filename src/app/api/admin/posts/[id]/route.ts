import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Post } from "@/models/Post";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    await connectMongo();
    const body = await request.json();
    const post = await Post.findByIdAndUpdate(
      id,
      { ...body, publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined },
      { new: true }
    );
    if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    return NextResponse.json({ post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update post.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    await connectMongo();
    const post = await Post.findByIdAndDelete(id);
    if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete post.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
