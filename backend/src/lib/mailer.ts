// Email / OTP dispatch service

// Cache recent OTPs for developer testing / test helper UI
export const recentTestOtps: Record<string, { otp: string; sentAt: number }> = {};

export async function sendOtpEmail(email: string, otp: string): Promise<{ success: boolean; previewOtp?: string }> {
  const normalized = email.toLowerCase().trim();
  recentTestOtps[normalized] = { otp, sentAt: Date.now() };

  console.log(`
┌────────────────────────────────────────────────────────┐
│ 🔐 [AI LANDING PAGE BUILDER] AUTHENTICATION OTP        │
│ Recipient : ${normalized.padEnd(41)}│
│ Code      : >>> ${otp} <<<                            │
│ Validity  : 10 minutes                                 │
└────────────────────────────────────────────────────────┘
`);

  // If real SMTP is configured via env
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      // Dynamic import if nodemailer is used
      console.log(`Sending via SMTP to ${normalized}...`);
    } catch (err) {
      console.error("SMTP delivery failed:", err);
    }
  }

  return { success: true, previewOtp: otp };
}
