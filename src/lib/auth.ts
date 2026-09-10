import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { connectMongo } from "@/lib/mongodb";
import { AdminUser } from "@/models/AdminUser";

export const ADMIN_COOKIE = "rrg_admin";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is required.");
  }
  return new TextEncoder().encode(secret);
}

export async function ensureAdminUser() {
  await connectMongo();
  const existing = await AdminUser.findOne();
  if (existing) return existing;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD to create the first admin user.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  return AdminUser.create({ email: email.toLowerCase(), passwordHash });
}

export async function verifyAdminCredentials(email: string, password: string) {
  await connectMongo();
  await ensureAdminUser();
  const user = await AdminUser.findOne({ email: email.toLowerCase() });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}

export async function createAdminSession(email: string) {
  const token = await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getAuthSecret());

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function getAdminEmail() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    if (payload.role !== "admin") return null;
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}

export { SESSION_MAX_AGE };
