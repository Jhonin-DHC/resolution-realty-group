import { NextResponse } from "next/server";
import { sendInquiryAlert } from "@/lib/email";
import { connectMongo } from "@/lib/mongodb";
import { publicErrorMessage } from "@/lib/public-error";
import { Inquiry } from "@/models/Inquiry";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
      notes?: string;
      listingId?: string;
      listingSlug?: string;
      listingTitle?: string;
      source?: string;
      preferredTime?: string;
      propertyAddress?: string;
      city?: string;
    };

    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const source = body.source || "contact";
    const message =
      body.message?.trim() ||
      body.notes?.trim() ||
      (source === "book-call" ? "Requested a call." : source === "valuation" ? "Requested a free home valuation." : "");

    if ((source === "contact" || source === "listing") && !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    await connectMongo();
    const inquiry = await Inquiry.create({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || "",
      message,
      notes: body.notes?.trim() || "",
      listingId: body.listingId || "",
      listingSlug: body.listingSlug || "",
      listingTitle: body.listingTitle || "",
      source,
      preferredTime: body.preferredTime?.trim() || "",
      propertyAddress: body.propertyAddress?.trim() || "",
      city: body.city?.trim() || "",
      read: false
    });

    try {
      await sendInquiryAlert({
        id: String(inquiry._id),
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        message: inquiry.message,
        listingTitle: inquiry.listingTitle,
        source: inquiry.source,
        propertyAddress: inquiry.propertyAddress,
        city: inquiry.city,
        preferredTime: inquiry.preferredTime
      });
    } catch {
      // Inquiry is saved even if SMTP is down.
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    const message = publicErrorMessage(error, "Could not save your message. Please try again.");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
