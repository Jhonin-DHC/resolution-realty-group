import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth";

export async function GET() {
  const email = await getAdminEmail();
  if (!email) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, email });
}
