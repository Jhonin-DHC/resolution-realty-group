import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Inquiry } from "@/models/Inquiry";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    await connectMongo();
    const body = await request.json();
    const inquiry = await Inquiry.findByIdAndUpdate(id, body, { new: true });
    if (!inquiry) return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    return NextResponse.json({ inquiry });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update inquiry.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    await connectMongo();
    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete inquiry.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
