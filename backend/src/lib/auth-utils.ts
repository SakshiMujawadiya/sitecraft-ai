import crypto from "crypto";
import { User } from "./types";

/**
 * Hashes a password using crypto.scryptSync with a salt.
 */
export function hashPassword(
  password: string,
  salt = crypto.randomBytes(16).toString("hex")
): { hash: string; salt: string } {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

/**
 * Timing-safe comparison of a candidate password with stored hash and salt.
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    const storedBuf = Buffer.from(storedHash, "hex");
    const testBuf = Buffer.from(hash, "hex");
    if (storedBuf.length !== testBuf.length) {
      return false;
    }
    return crypto.timingSafeEqual(storedBuf, testBuf);
  } catch {
    return false;
  }
}

/**
 * Strips passwordHash and salt from user object before returning to client.
 */
export function sanitizeUser(user: User): Omit<User, "passwordHash" | "salt"> {
  const { passwordHash, salt, ...safeUser } = user;
  return safeUser;
}
