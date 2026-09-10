import { NextResponse } from "next/server";
import { getTeamNotifyEmails, isEmailConfigured } from "@/lib/email";
import { isMongoConfigured } from "@/lib/mongodb";
import { isR2Configured } from "@/lib/r2";

export async function GET() {
  return NextResponse.json({
    settings: {
      mongoConfigured: isMongoConfigured(),
      r2Configured: isR2Configured(),
      emailConfigured: isEmailConfigured(),
      inquiryNotifyEmails: getTeamNotifyEmails(),
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || ""
    }
  });
}
