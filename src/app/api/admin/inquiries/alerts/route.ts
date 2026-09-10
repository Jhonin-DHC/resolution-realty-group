import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Inquiry } from "@/models/Inquiry";

export async function GET() {
  try {
    await connectMongo();
    const unreadCount = await Inquiry.countDocuments({ read: false });
    return NextResponse.json({ unreadCount });
  } catch {
    return NextResponse.json({ unreadCount: 0 });
  }
}
