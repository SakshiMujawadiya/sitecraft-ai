import { Router, Request, Response } from "express";
import {
  saveOtp,
  getOtp,
  incrementOtpAttempts,
  deleteOtp,
  getUserByEmail,
  createUser,
  getUserById,
  updateUser,
} from "../lib/db";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { sendOtpEmail } from "../lib/mailer";
import { checkRateLimit } from "../lib/rate-limit";
import { verifyRecaptcha } from "../lib/recaptcha";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { hashPassword, verifyPassword, sanitizeUser } from "../lib/auth-utils";

const router = Router();

// Helper to set cookies in Express
function setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("lp_access_token", accessToken, {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15 mins
    path: "/",
  });
  res.cookie("lp_refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
}

// 0a. Registration with Email & Password
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Required fields check
    if (!email || typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ success: false, message: "A valid email address is required" });
      return;
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
      return;
    }

    const normalized = email.toLowerCase().trim();

    // Prevent duplicate accounts
    const existing = await getUserByEmail(normalized);
    if (existing) {
      res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in instead.",
      });
      return;
    }

    // Securely hash password
    const { hash, salt } = hashPassword(password);

    // Create user
    const newUser = await createUser({
      email: normalized,
      name: (name && typeof name === "string" && name.trim()) ? name.trim() : normalized.split("@")[0],
      passwordHash: hash,
      salt,
    });

    const accessToken = signAccessToken(newUser);
    const refreshToken = signRefreshToken(newUser);

    setTokenCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      message: "Registration successful! Welcome to the platform.",
      user: sanitizeUser(newUser),
      accessToken,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Failed to complete registration" });
  }
});

// 0b. Login with Email & Password
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      return;
    }

    const normalized = String(email).toLowerCase().trim();
    const user = await getUserByEmail(normalized);

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    // If user has a passwordHash, verify it
    if (user.passwordHash && user.salt) {
      const isValid = verifyPassword(String(password), user.passwordHash, user.salt);
      if (!isValid) {
        res.status(401).json({ success: false, message: "Invalid email or password" });
        return;
      }
    } else {
      // User registered via OTP/demo previously and has no password yet. Set their password on first password login!
      const { hash, salt } = hashPassword(String(password));
      await updateUser(user.id, { passwordHash: hash, salt });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    setTokenCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      message: "Logged in successfully",
      user: sanitizeUser(user),
      accessToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed. Please try again." });
  }
});

// 1. Send Email OTP
router.post("/otp/send", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, recaptchaToken } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ success: false, message: "Valid email is required" });
      return;
    }

    const normalized = email.toLowerCase().trim();
    const clientIp = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";

    // Rate limit: 5 requests per 10 mins
    const rateCheck = checkRateLimit(`otp-send:${clientIp}:${normalized}`, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      res.status(429).json({
        success: false,
        message: `Too many OTP requests. Please wait ${Math.ceil(rateCheck.resetInMs / 1000)} seconds.`,
      });
      return;
    }

    // reCAPTCHA v3 verification
    const recaptcha = await verifyRecaptcha(recaptchaToken);
    if (!recaptcha.success) {
      res.status(403).json({ success: false, message: recaptcha.message || "Bot verification failed" });
      return;
    }

    // Generate 6-digit numeric code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await saveOtp(normalized, otp, 10);

    const mailRes = await sendOtpEmail(normalized, otp);

    res.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${normalized}`,
      previewOtp: mailRes.previewOtp,
    });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({ success: false, message: "Failed to dispatch OTP" });
  }
});

// 2. Verify Email OTP
router.post("/otp/verify", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({ success: false, message: "Email and OTP are required" });
      return;
    }

    const normalized = email.toLowerCase().trim();
    const record = await getOtp(normalized);

    if (!record) {
      res.status(400).json({ success: false, message: "No active OTP found. Please request a new code." });
      return;
    }

    if (Date.now() > record.expiresAt) {
      await deleteOtp(normalized);
      res.status(400).json({ success: false, message: "OTP has expired. Please request a new code." });
      return;
    }

    if (record.attempts >= 5) {
      await deleteOtp(normalized);
      res.status(403).json({ success: false, message: "Too many failed attempts. Code invalidated." });
      return;
    }

    // Validate code or development master code
    const isMaster = process.env.NODE_ENV !== "production" && otp === "777888";
    if (record.otp !== otp.trim() && !isMaster) {
      const attempts = await incrementOtpAttempts(normalized);
      res.status(400).json({
        success: false,
        message: `Incorrect code. ${5 - attempts} attempt(s) remaining.`,
      });
      return;
    }

    await deleteOtp(normalized);

    let user = await getUserByEmail(normalized);
    if (!user) {
      user = await createUser({
        email: normalized,
        name: normalized.split("@")[0],
      });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    setTokenCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      message: "Logged in successfully",
      user,
      accessToken,
    });
  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

// 3. Google OAuth & Demo instant login
router.get("/google", async (req: Request, res: Response): Promise<void> => {
  try {
    const { action, email, name } = req.query;
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

    if (action === "demo_login" || !process.env.GOOGLE_CLIENT_ID) {
      const demoEmail = (email as string) || "alex.google@example.com";
      const demoName = (name as string) || "Alex Rivera (Google)";
      const demoAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80";

      let user = await getUserByEmail(demoEmail);
      if (!user) {
        user = await createUser({
          email: demoEmail,
          name: demoName,
          avatar: demoAvatar,
        });
      }

      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);

      setTokenCookies(res, accessToken, refreshToken);
      const safeRedirect =
        typeof req.query.redirect === "string" && req.query.redirect.startsWith("/") && !req.query.redirect.startsWith("//")
          ? req.query.redirect
          : "/dashboard";
      res.redirect(`${clientUrl}${safeRedirect}`);
      return;
    }

    // Real Google OAuth redirect URL
    const redirectUri = `${req.protocol}://${req.get("host")}/api/auth/google`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
      process.env.GOOGLE_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=openid%20email%20profile&access_type=offline`;

    res.redirect(googleAuthUrl);
  } catch (err) {
    console.error("Google auth error:", err);
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/auth/login?error=oauth_failed`);
  }
});

// 4. Token Refresh
router.post("/refresh", async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.lp_refresh_token;
    if (!refreshToken) {
      res.status(401).json({ success: false, message: "No refresh token cookie found" });
      return;
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      res.status(401).json({ success: false, message: "Expired or invalid refresh token" });
      return;
    }

    const user = await getUserById(payload.userId);
    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    const newAccessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);

    setTokenCookies(res, newAccessToken, newRefreshToken);

    res.json({
      success: true,
      user: sanitizeUser(user),
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("Token refresh error:", err);
    res.status(500).json({ success: false, message: "Failed to refresh token" });
  }
});

// 5. Logout
router.post("/logout", (_req: Request, res: Response): void => {
  const isProd = process.env.NODE_ENV === "production";
  const cookieOpts = {
    path: "/",
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  };
  res.clearCookie("lp_access_token", cookieOpts);
  res.clearCookie("lp_refresh_token", cookieOpts);
  res.json({ success: true, message: "Logged out successfully" });
});

// 6. Current User Session
router.get("/me", requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  res.json({
    success: true,
    user: req.user ? sanitizeUser(req.user) : null,
  });
});

export default router;
