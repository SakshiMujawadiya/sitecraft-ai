import jwt from "jsonwebtoken";
import { User } from "./types";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "lp_builder_access_super_secret_jwt_key_2025";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "lp_builder_refresh_super_secret_jwt_key_2025";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function signAccessToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
