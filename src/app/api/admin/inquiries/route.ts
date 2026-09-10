import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Inquiry } from "@/models/Inquiry";

export async function GET() {
  try {
    await connectMongo();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
    const unreadCount = inquiries.filter((item) => !item.read).length;
    return NextResponse.json({ inquiries, unreadCount });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load inquiries.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
