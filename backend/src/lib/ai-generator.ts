import {
  GenerationPromptInput,
  WebsiteData,
  SectionContent,
  SectionType,
  ColorTheme,
  WebsiteStyle,
} from "./types";

const COLOR_PALETTES: Record<ColorTheme, { primary: string; secondary: string; accent: string; background: string; surface: string; text: string; mutedText: string; border: string }> = {
  "Electric Indigo": {
    primary: "#6366f1",
    secondary: "#4f46e5",
    accent: "#a855f7",
    background: "#09090b",
    surface: "#18181b",
    text: "#fafafa",
    mutedText: "#a1a1aa",
    border: "#27272a",
  },
  "Emerald Slate": {
    primary: "#10b981",
    secondary: "#059669",
    accent: "#3b82f6",
    background: "#022c22",
    surface: "#064e3b",
    text: "#ecfdf5",
    mutedText: "#a7f3d0",
    border: "#047857",
  },
  "Sunset Amber": {
    primary: "#f59e0b",
    secondary: "#d97706",
    accent: "#ef4444",
    background: "#0c0a09",
    surface: "#1c1917",
    text: "#fafaf9",
    mutedText: "#a8a29e",
    border: "#292524",
  },
  "Rose Quartz": {
    primary: "#f43f5e",
    secondary: "#e11d48",
    accent: "#fb7185",
    background: "#0f0d11",
    surface: "#1f1b24",
    text: "#fff1f2",
    mutedText: "#fda4af",
    border: "#362e3d",
  },
  "Cyberpunk Neon": {
    primary: "#06b6d4",
    secondary: "#3b82f6",
    accent: "#ec4899",
    background: "#050814",
    surface: "#0e1529",
    text: "#f0fdf4",
    mutedText: "#94a3b8",
    border: "#1e293b",
  },
  "Monochrome Minimal": {
    primary: "#ffffff",
    secondary: "#e2e8f0",
    accent: "#94a3b8",
    background: "#000000",
    surface: "#111111",
    text: "#ffffff",
    mutedText: "#888888",
    border: "#222222",
  },
  "Ocean Azure": {
    primary: "#0284c7",
    secondary: "#0369a1",
    accent: "#38bdf8",
    background: "#081325",
    surface: "#0f1f38",
    text: "#f0f9ff",
    mutedText: "#7dd3fc",
    border: "#1e3a5f",
  },
  "Royal Purple": {
    primary: "#9333ea",
    secondary: "#7e22ce",
    accent: "#c084fc",
    background: "#0b0616",
    surface: "#170e2c",
    text: "#faf5ff",
    mutedText: "#d8b4fe",
    border: "#2c1d4d",
  },
};

export async function generateWebsite(input: GenerationPromptInput): Promise<WebsiteData> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `You are an elite conversion-rate optimization expert, web copywriter, and UI/UX designer.
You output strictly valid JSON conforming to the requested WebsiteData structure.
Create compelling, persuasive, highly realistic copy for each section requested.`,
            },
            {
              role: "user",
              content: `Generate a complete landing page JSON for:
- Business Name: ${input.businessName}
- Website Type: ${input.websiteType}
- Business Description: ${input.businessDescription}
- Target Audience: ${input.targetAudience}
- Website Style: ${input.websiteStyle}
- Color Theme: ${input.colorTheme}
- Required Sections: ${input.requiredSections.join(", ")}
- Animation Preference: ${input.animationPreference}

Return JSON with this exact shape:
{
  "businessName": string,
  "tagline": string,
  "description": string,
  "targetAudience": string,
  "websiteType": "${input.websiteType}",
  "theme": {
    "colorTheme": "${input.colorTheme}",
    "fontFamily": "Inter" | "Outfit" | "Playfair Display" | "Plus Jakarta Sans" | "Space Grotesk",
    "borderRadius": "sm" | "md" | "lg" | "full",
    "animation": "${input.animationPreference}",
    "style": "${input.websiteStyle}"
  },
  "sections": Array<SectionContent>,
  "seo": {
    "title": string,
    "metaDescription": string,
    "keywords": string[]
  }
}
For each section in requiredSections, include relevant realistic headlines, subheadlines, descriptions, and items (features with icons, pricing tiers, FAQs with answers, testimonials with realistic names and roles).`,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const jsonRes = (await response.json()) as any;
        const content = jsonRes.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content) as WebsiteData;
          // Ensure valid structure
          if (parsed.sections && Array.isArray(parsed.sections) && parsed.businessName) {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn("OpenAI API call failed or timed out. Using high-grade smart generator engine:", err);
    }
  }

  // High-Grade Smart Contextual Engine Fallback
  return buildSmartGeneratedWebsite(input);
}

function buildSmartGeneratedWebsite(input: GenerationPromptInput): WebsiteData {
  const {
    businessName,
    businessDescription,
    targetAudience,
    websiteType,
    websiteStyle,
    colorTheme,
    requiredSections,
    animationPreference,
  } = input;

  const fontMap: Record<WebsiteStyle, WebsiteData["theme"]["fontFamily"]> = {
    Modern: "Plus Jakarta Sans",
    Minimal: "Inter",
    Dark: "Space Grotesk",
    Luxury: "Playfair Display",
    Glassmorphism: "Outfit",
    Corporate: "Inter",
    Neon: "Space Grotesk",
  };

  const radiusMap: Record<WebsiteStyle, WebsiteData["theme"]["borderRadius"]> = {
    Modern: "lg",
    Minimal: "sm",
    Dark: "md",
    Luxury: "sm",
    Glassmorphism: "lg",
    Corporate: "md",
    Neon: "none",
  };

  const sections: SectionContent[] = [];

  // Generate requested sections in logical order
  const order: SectionType[] = [
    "Hero",
    "Features",
    "About",
    "Testimonials",
    "Pricing",
    "FAQ",
    "CTA",
    "Contact",
    "Footer",
  ];

  for (const type of order) {
    if (!requiredSections.includes(type)) continue;

    switch (type) {
      case "Hero":
        sections.push({
          id: "sec-hero",
          type: "Hero",
          badge: `Next-Gen ${websiteType} Platform`,
          title: `Empower Your Future With ${businessName}`,
          subtitle: `The intelligent platform built exclusively for ${targetAudience}. Accelerate growth, simplify complexity, and achieve unmatched results.`,
          ctaText: "Start Free Trial",
          ctaLink: "#pricing",
          secondaryCtaText: "Watch Demo",
          secondaryCtaLink: "#features",
          imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1000&auto=format&fit=crop&q=80",
          imageAlt: `${businessName} Dashboard Preview`,
          items: [
            { title: "99.99%", description: "Uptime Guaranteed" },
            { title: "10x", description: "Faster Performance" },
            { title: "25k+", description: "Active Customers" },
          ],
        });
        break;

      case "Features":
        sections.push({
          id: "sec-features",
          type: "Features",
          badge: "Key Capabilities",
          title: "Everything You Need to Scale Effortlessly",
          subtitle: `Designed from the ground up to solve the most pressing challenges faced by ${targetAudience}.`,
          items: [
            {
              id: "feat-1",
              title: "Autonomous Intelligence",
              description: "Automate repetitive workflows and unlock deep contextual insights with AI tailored to your domain.",
              icon: "Sparkles",
            },
            {
              id: "feat-2",
              title: "Real-time Collaboration",
              description: "Collaborate synchronously with your team with multi-cursor editing, comments, and role-based permissions.",
              icon: "Users",
            },
            {
              id: "feat-3",
              title: "Enterprise Security",
              description: "End-to-end data encryption, SOC 2 compliance, and granular audit logs protecting every transaction.",
              icon: "ShieldCheck",
            },
            {
              id: "feat-4",
              title: "Lightning Fast Analytics",
              description: "Gain immediate clarity into performance metrics with interactive visual dashboards updated in sub-seconds.",
              icon: "BarChart3",
            },
            {
              id: "feat-5",
              title: "Custom Integrations",
              description: "Connect effortlessly with 100+ native APIs, webhooks, and your existing enterprise toolchain.",
              icon: "Zap",
            },
            {
              id: "feat-6",
              title: "Global Edge Delivery",
              description: "Sub-50ms latency across 320+ edge locations worldwide for a flawless customer experience.",
              icon: "Globe",
            },
          ],
        });
        break;

      case "About":
        sections.push({
          id: "sec-about",
          type: "About",
          badge: "Our Mission",
          title: `Crafting the Future of ${websiteType}`,
          description: `${businessName} was founded with a singular conviction: ${businessDescription}. Today, we help organizations of all sizes conquer friction and unleash their full potential.`,
          imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80",
          imageAlt: "Team collaboration",
          items: [
            { title: "Customer Obsessed", description: "Every feature we ship starts with direct customer feedback." },
            { title: "Relentless Speed", description: "We ship iterations rapidly to keep you ahead of the market." },
          ],
        });
        break;

      case "Testimonials":
        sections.push({
          id: "sec-testimonials",
          type: "Testimonials",
          badge: "Social Proof",
          title: "Loved by Industry Leaders Worldwide",
          subtitle: `See how ${businessName} is transforming how ${targetAudience} works every day.`,
          items: [
            {
              id: "test-1",
              title: "Exceptional Return on Investment",
              description: `"${businessName} has completely revolutionized our workflow. We cut our turnaround time by 65% in the first 30 days alone."`,
              author: "Sarah Jenkins",
              role: "VP of Product at Horizon Labs",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
              rating: 5,
            },
            {
              id: "test-2",
              title: "The Standard in Modern Software",
              description: `"The visual polish and sheer performance are simply unmatched. Our entire leadership team relies on it daily."`,
              author: "Marcus Vance",
              role: "Chief Technology Officer at Apex",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
              rating: 5,
            },
            {
              id: "test-3",
              title: "Incredible Speed & Simplicity",
              description: `"Setting up took minutes, and our team immediately adopted it without any formal training. Truly a 10/10 experience."`,
              author: "Elena Rostova",
              role: "Founder & CEO, Studio Nova",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
              rating: 5,
            },
          ],
        });
        break;

      case "Pricing":
        sections.push({
          id: "sec-pricing",
          type: "Pricing",
          badge: "Transparent Pricing",
          title: "Simple, Predictable Plans for Every Scale",
          subtitle: "No hidden fees. Upgrade or cancel anytime with our 14-day money-back guarantee.",
          items: [
            {
              id: "price-starter",
              title: "Starter",
              price: "$29",
              period: "/month",
              description: `Ideal for solo creators and emerging ${targetAudience}.`,
              popular: false,
              features: [
                "Up to 3 active projects",
                "1,000 AI generation credits",
                "Standard SSL & custom domain",
                "Community Discord support",
                "Basic analytics suite",
              ],
              buttonText: "Get Started",
              link: "#checkout-starter",
            },
            {
              id: "price-pro",
              title: "Pro Growth",
              price: "$79",
              period: "/month",
              description: "The most popular plan for fast-scaling organizations.",
              popular: true,
              features: [
                "Unlimited active projects",
                "15,000 AI generation credits",
                "Priority edge CDN delivery",
                "Custom domains with auto-renew",
                "Real-time team collaboration",
                "Dedicated 24/7 chat support",
              ],
              buttonText: "Start 14-Day Free Trial",
              link: "#checkout-pro",
            },
            {
              id: "price-enterprise",
              title: "Enterprise",
              price: "$199",
              period: "/month",
              description: "Full compliance, dedicated infrastructure and SLA.",
              popular: false,
              features: [
                "Everything in Pro included",
                "Unlimited AI generation",
                "Custom SSO / SAML integration",
                "Dedicated Account Strategist",
                "99.99% uptime SLA guarantee",
                "Custom security audits & reports",
              ],
              buttonText: "Contact Sales",
              link: "#contact",
            },
          ],
        });
        break;

      case "FAQ":
        sections.push({
          id: "sec-faq",
          type: "FAQ",
          badge: "Got Questions?",
          title: "Frequently Asked Questions",
          subtitle: "Have a question that isn't answered here? Reach out to our 24/7 team.",
          items: [
            {
              id: "faq-1",
              question: `How does ${businessName} differ from traditional alternatives?`,
              answer: `${businessName} combines cutting-edge AI generation with visual real-time customizability, delivering finished, high-converting landing pages in seconds instead of weeks.`,
            },
            {
              id: "faq-2",
              question: "Can I connect my own custom domain?",
              answer: "Yes! All paid and trial tiers include one-click custom domain configuration with automatic free SSL certificate provisioning.",
            },
            {
              id: "faq-3",
              question: "Can I export or host the websites myself?",
              answer: "Absolutely. You can publish directly to our ultra-fast global edge network or export structured code at any time.",
            },
            {
              id: "faq-4",
              question: "Is there a long-term contract or cancellation fee?",
              answer: "None at all. You can cancel your subscription at any time directly from your billing portal with zero penalties.",
            },
          ],
        });
        break;

      case "CTA":
        sections.push({
          id: "sec-cta",
          type: "CTA",
          badge: "Get Started Now",
          title: `Ready to Elevate Your ${websiteType} Experience?`,
          subtitle: `Join thousands of satisfied ${targetAudience} who achieve more with ${businessName}. Start your 14-day free trial today.`,
          ctaText: "Get Started for Free",
          ctaLink: "#pricing",
          secondaryCtaText: "Schedule a Demo",
          secondaryCtaLink: "#contact",
        });
        break;

      case "Contact":
        sections.push({
          id: "sec-contact",
          type: "Contact",
          badge: "Get in Touch",
          title: "We'd Love to Hear From You",
          subtitle: "Have questions about our enterprise plans, custom integrations, or partnerships?",
          description: "Our dedicated advisory team responds in less than 2 hours during standard business hours.",
          items: [
            { title: "Email Us", description: `support@${businessName.toLowerCase().replace(/\s+/g, "")}.com` },
            { title: "Office Location", description: "San Francisco, CA • London, UK" },
            { title: "Live Chat", description: "Available 24/7 directly within your dashboard" },
          ],
        });
        break;

      case "Footer":
        sections.push({
          id: "sec-footer",
          type: "Footer",
          title: businessName,
          description: `The premier platform for ${targetAudience} to achieve extraordinary results with speed and confidence.`,
          items: [
            { title: "Product", description: "Features, Integrations, Pricing, Changelog, Roadmap" },
            { title: "Resources", description: "Documentation, Tutorials, API Reference, Community" },
            { title: "Company", description: "About Us, Careers, Press Kit, Contact, Privacy Policy" },
          ],
        });
        break;
    }
  }

  return {
    businessName,
    tagline: `Next-Gen ${websiteType} Experience`,
    description: businessDescription,
    targetAudience,
    websiteType,
    theme: {
      colorTheme,
      customPalette: COLOR_PALETTES[colorTheme],
      fontFamily: fontMap[websiteStyle] || "Inter",
      borderRadius: radiusMap[websiteStyle] || "md",
      animation: animationPreference,
      style: websiteStyle,
    },
    sections,
    seo: {
      title: `${businessName} — The Intelligent ${websiteType} for ${targetAudience}`,
      metaDescription: businessDescription.slice(0, 160),
      keywords: [businessName, websiteType, targetAudience, "Landing Page", "SaaS"],
    },
  };
}

export async function improveSectionContent(
  section: SectionContent,
  command: string,
  businessContext?: { name?: string; type?: string }
): Promise<SectionContent> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `You are an AI web editing assistant. Given a JSON section and user instruction, update the section and return the updated section as JSON with the same schema.`,
            },
            {
              role: "user",
              content: `Section data:\n${JSON.stringify(section, null, 2)}\n\nInstruction: "${command}". Return updated JSON.`,
            },
          ],
        }),
      });

      if (response.ok) {
        const jsonRes = (await response.json()) as any;
        const content = jsonRes.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content) as SectionContent;
          if (parsed.type) return { ...section, ...parsed };
        }
      }
    } catch (err) {
      console.warn("AI improve section failed, falling back to smart rewriter:", err);
    }
  }

  // Fallback smart rewriter
  const updated = { ...section };
  const cmd = command.toLowerCase();

  if (cmd.includes("heading") || cmd.includes("title")) {
    if (cmd.includes("shorter")) {
      updated.title = updated.title ? updated.title.split(" ").slice(0, 4).join(" ") : "Built for Scale";
    } else if (cmd.includes("punchier") || cmd.includes("strong") || cmd.includes("modern")) {
      updated.title = `Unleash Unrivaled Performance with ${businessContext?.name || "Next-Gen AI"}`;
    } else {
      updated.title = `Experience Next-Level ${updated.title || "Growth"}`;
    }
  } else if (cmd.includes("cta") || cmd.includes("button")) {
    updated.ctaText = "Claim Your Free Access Now →";
    if (updated.secondaryCtaText) {
      updated.secondaryCtaText = "See Live Preview";
    }
  } else if (cmd.includes("paragraph") || cmd.includes("description") || cmd.includes("subtitle")) {
    if (cmd.includes("shorter")) {
      updated.subtitle = "Smarter workflows. Faster results. Zero friction.";
      updated.description = "Empowering high-performing teams with modern tools.";
    } else {
      updated.subtitle = "Supercharge your business with automated precision, intelligent insights, and effortless scalability designed for ambitious innovators.";
    }
  } else if (cmd.includes("testimonial") && updated.type === "Testimonials") {
    updated.items = [
      ...(updated.items || []),
      {
        id: `test-${Date.now()}`,
        title: "Total Game Changer",
        description: `"Integrating this was the best strategic decision our engineering team made this year."`,
        author: "David Chen",
        role: "Head of Infrastructure, CloudCore",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        rating: 5,
      },
    ];
  } else if (cmd.includes("feature") && updated.type === "Features") {
    updated.items = [
      ...(updated.items || []),
      {
        id: `feat-${Date.now()}`,
        title: "Intelligent Workflow Triggers",
        description: "Set up instant reactive webhooks and event-driven automation in seconds.",
        icon: "Workflow",
      },
    ];
  } else {
    // General polish
    if (updated.subtitle) {
      updated.subtitle = `Enhanced: ${updated.subtitle}`;
    } else if (updated.title) {
      updated.title = `${updated.title} — Optimized for Conversion`;
    }
  }

  return updated;
}
