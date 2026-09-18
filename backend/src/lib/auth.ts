import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, verifyRefreshToken, signAccessToken, TokenPayload } from "./jwt";
import { getUserById } from "./db";
import { User } from "./types";

export const ACCESS_COOKIE_NAME = "lp_access_token";
export const REFRESH_COOKIE_NAME = "lp_refresh_token";

export async function getSessionUser(req: NextRequest): Promise<User | null> {
  // 1. Try Bearer header
  const authHeader = req.headers.get("authorization");
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  // 2. Try access token cookie
  if (!token) {
    token = req.cookies.get(ACCESS_COOKIE_NAME)?.value;
  }

  let payload: TokenPayload | null = null;
  if (token) {
    payload = verifyAccessToken(token);
  }

  // 3. Fallback to refresh token cookie if access token expired
  if (!payload) {
    const refreshToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;
    if (refreshToken) {
      payload = verifyRefreshToken(refreshToken);
    }
  }

  if (!payload) {
    return null;
  }

  const user = await getUserById(payload.userId);
  return user;
}

export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string
): void {
  const isProd = process.env.NODE_ENV === "production";

  // Access Token cookie (15 mins)
  res.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: accessToken,
    httpOnly: false, // readable by client-side auth context if needed
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  // Refresh Token cookie (HTTP-only, 7 days)
  res.cookies.set({
    name: REFRESH_COOKIE_NAME,
    value: refreshToken,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export function clearAuthCookies(res: NextResponse): void {
  res.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: "",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  res.cookies.set({
    name: REFRESH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
