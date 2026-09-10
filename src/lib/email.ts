import nodemailer from "nodemailer";
import { site } from "@/lib/site";

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getFromAddress() {
  return process.env.SMTP_FROM?.trim() || process.env.SMTP_USER || `noreply@${new URL(site.url).hostname}`;
}

function createTransport() {
  if (!isEmailConfigured()) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.");
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1" || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}) {
  const transport = createTransport();
  const to = Array.isArray(options.to) ? options.to.join(", ") : options.to;

  await transport.sendMail({
    from: getFromAddress(),
    to,
    subject: options.subject,
    text: options.text,
    html: options.html ?? options.text.replace(/\n/g, "<br />"),
    replyTo: options.replyTo
  });
}

export function getTeamNotifyEmails() {
  const configured = process.env.INQUIRY_NOTIFY_EMAILS || process.env.ADMIN_EMAIL || site.email;
  return configured
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function sendInquiryAlert(inquiry: {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  listingTitle?: string;
  source: string;
  propertyAddress?: string;
  city?: string;
  preferredTime?: string;
}) {
  if (!isEmailConfigured()) return;

  const recipients = getTeamNotifyEmails();
  if (recipients.length === 0) return;

  const siteUrl = site.url.replace(/\/$/, "");
  const adminUrl = `${siteUrl}/admin/inquiries`;
  const subject = inquiry.listingTitle
    ? `Listing inquiry — ${inquiry.listingTitle}`
    : `New ${site.name} inquiry (${inquiry.source})`;

  const text = [
    "A new inquiry was submitted.",
    "",
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone || "(none)"}`,
    `Source: ${inquiry.source}`,
    inquiry.listingTitle ? `Listing: ${inquiry.listingTitle}` : "",
    inquiry.propertyAddress ? `Property: ${inquiry.propertyAddress}` : "",
    inquiry.city ? `City: ${inquiry.city}` : "",
    inquiry.preferredTime ? `Preferred time: ${inquiry.preferredTime}` : "",
    "",
    "Message:",
    inquiry.message || "(none)",
    "",
    `Review in admin: ${adminUrl}`,
    `Inquiry ID: ${inquiry.id}`
  ]
    .filter((line) => line !== "")
    .join("\n");

  await sendEmail({
    to: recipients,
    subject,
    text,
    replyTo: inquiry.email
  });
}
