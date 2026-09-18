import { Router, Response } from "express";
import { generateWebsite, improveSectionContent } from "../lib/ai-generator";
import { generateAIReading } from "../lib/ai-reading-service";
import { deductUserCredits } from "../lib/db";
import { GenerationPromptInput, SectionContent, WebsiteType, WebsiteStyle, ColorTheme } from "../lib/types";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { checkRateLimit } from "../lib/rate-limit";
import { verifyRecaptcha } from "../lib/recaptcha";

const router = Router();

// 1. Generate full landing page via 9-step wizard
router.post("/generate", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const body = req.body;
    const { recaptchaToken, ...promptInput } = body as GenerationPromptInput & { recaptchaToken?: string };

    // Rate limiting
    const rateCheck = checkRateLimit(`ai-gen:${user.id}`, 20, 60 * 1000);
    if (!rateCheck.allowed) {
      res.status(429).json({ success: false, message: "AI generation rate limit reached. Please wait a moment." });
      return;
    }

    // Bot protection
    const recaptcha = await verifyRecaptcha(recaptchaToken);
    if (!recaptcha.success) {
      res.status(403).json({ success: false, message: "Bot verification failed" });
      return;
    }

    // Credit check
    const cost = 5;
    if (user.credits < cost) {
      res.status(402).json({
        success: false,
        message: `Insufficient AI credits. You need ${cost} credits, but have ${user.credits}. Please upgrade or top up.`,
      });
      return;
    }

    // Deduct credits
    await deductUserCredits(user.id, cost);

    // Generate structured website data
    const websiteData = await generateWebsite(promptInput);

    res.json({
      success: true,
      data: websiteData,
      remainingCredits: user.credits - cost,
      message: "AI landing page generated successfully",
    });
  } catch (err) {
    console.error("AI generation endpoint error:", err);
    res.status(500).json({ success: false, message: "Failed to generate website" });
  }
});

// 2. Inline AI Section Copilot (improve heading, rewrite paragraph, strengthen CTA)
router.post("/improve", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { section, command, businessContext } = req.body as {
      section: SectionContent;
      command: string;
      businessContext?: { name?: string; type?: string };
    };

    if (!section || !command) {
      res.status(400).json({ success: false, message: "Section data and instruction command are required" });
      return;
    }

    // Cost: 1 credit
    const cost = 1;
    if (user.credits < cost) {
      res.status(402).json({ success: false, message: "You need at least 1 AI credit to run the assistant." });
      return;
    }

    await deductUserCredits(user.id, cost);

    const updatedSection = await improveSectionContent(section, command, businessContext);

    res.json({
      success: true,
      section: updatedSection,
      remainingCredits: user.credits - cost,
      message: "Section updated with AI suggestions",
    });
  } catch (err) {
    console.error("AI improve error:", err);
    res.status(500).json({ success: false, message: "Failed to process AI assistant request" });
  }
});

// 3. AI Reading Page Core Endpoint
router.post("/reading", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { content, title, readingMode, readingFocus, websiteType, style, colorTheme } = req.body as {
      content?: string;
      title?: string;
      readingMode?: "comprehensive" | "executive" | "critical" | "simplified";
      readingFocus?: "key-insights" | "thematic" | "action-items" | "general";
      websiteType?: WebsiteType;
      style?: WebsiteStyle;
      colorTheme?: ColorTheme;
    };

    // Validation: Content must be provided
    if (!content || typeof content !== "string" || !content.trim()) {
      res.status(400).json({
        success: false,
        message: "Please enter or paste content to generate an AI reading.",
      });
      return;
    }

    const trimmedContent = content.trim();

    // Validation: Maximum length limit
    if (trimmedContent.length > 50000) {
      res.status(400).json({
        success: false,
        message: "Content exceeds maximum length of 50,000 characters. Please provide a shorter excerpt.",
      });
      return;
    }

    // Rate limiting: 30 requests per minute per user
    const rateCheck = checkRateLimit(`ai-reading:${user.id}`, 30, 60 * 1000);
    if (!rateCheck.allowed) {
      res.status(429).json({
        success: false,
        message: `Too many reading requests. Please wait ${Math.ceil(rateCheck.resetInMs / 1000)} seconds.`,
      });
      return;
    }

    // Credit check & deduction (1 credit)
    const cost = 1;
    if (user.credits >= cost) {
      await deductUserCredits(user.id, cost);
    }

    // Generate reading analysis
    const reading = await generateAIReading({
      content: trimmedContent,
      title: title?.trim(),
      readingMode,
      readingFocus,
    });

    // Generate structured website sections conforming to SiteCraft architecture
    const websiteData = await generateWebsite({
      businessName: title?.trim() || "AI Generated Platform",
      businessDescription: trimmedContent,
      targetAudience: "Target customers and decision makers",
      websiteType: websiteType || "SaaS",
      websiteStyle: style || "Modern",
      colorTheme: colorTheme || "Electric Indigo",
      requiredSections: [
        "Hero",
        "Features",
        "About",
        "Testimonials",
        "Pricing",
        "FAQ",
        "CTA",
        "Footer",
      ],
      animationPreference: "Modern",
    });

    res.json({
      success: true,
      reading,
      websiteData,
      remainingCredits: Math.max(0, user.credits - cost),
      message: "AI website content and reading synthesized successfully",
    });
  } catch (err) {
    console.error("AI reading endpoint error:", err);
    res.status(500).json({
      success: false,
      message: "Unable to process the AI reading at this time. Please check your text and try again.",
    });
  }
});

export default router;
