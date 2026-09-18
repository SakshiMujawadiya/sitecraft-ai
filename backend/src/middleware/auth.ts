import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, verifyRefreshToken, TokenPayload } from "../lib/jwt";
import { getUserById, getUserByEmail } from "../lib/db";
import { User } from "../lib/types";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined;

    // 1. Authorization header: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    // 2. Access token cookie
    if (!token && req.cookies) {
      token = req.cookies.lp_access_token;
    }

    let payload: TokenPayload | null = null;
    if (token) {
      payload = verifyAccessToken(token);
    }

    // 3. Refresh token fallback
    if (!payload && req.cookies && req.cookies.lp_refresh_token) {
      payload = verifyRefreshToken(req.cookies.lp_refresh_token);
    }

    if (!payload) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Please login to access this resource.",
      });
      return;
    }

    let user = await getUserById(payload.userId);
    if (!user && payload.email) {
      user = await getUserByEmail(payload.email);
    }

    if (!user) {
      res.clearCookie("lp_access_token", { path: "/" });
      res.clearCookie("lp_refresh_token", { path: "/" });
      res.status(401).json({
        success: false,
        message: "User session expired or user no longer exists.",
      });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ success: false, message: "Authentication failed." });
  }
}
