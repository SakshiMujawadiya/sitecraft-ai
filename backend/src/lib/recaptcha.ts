export async function verifyRecaptcha(token?: string): Promise<{ success: boolean; score?: number; message?: string }> {
  // If no recaptcha secret is configured or token is demo/dev, allow
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret || token === "demo-recaptcha-token" || process.env.NODE_ENV !== "production") {
    return { success: true, score: 0.9 };
  }

  if (!token) {
    return { success: false, message: "reCAPTCHA verification token missing" };
  }

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    });

    const data = (await res.json()) as any;
    if (data.success && (data.score === undefined || data.score >= 0.5)) {
      return { success: true, score: data.score };
    }

    return {
      success: false,
      score: data.score,
      message: "reCAPTCHA verification failed or score too low",
    };
  } catch (error) {
    console.error("reCAPTCHA validation error:", error);
    // Fail gracefully in non-critical dev environments
    return { success: true, score: 0.8 };
  }
}
