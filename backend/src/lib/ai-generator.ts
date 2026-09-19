import {
  GenerationPromptInput,
  WebsiteData,
  WebsiteType,
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
  const safeInput: GenerationPromptInput = {
    businessName: input?.businessName || "My Project",
    businessDescription: input?.businessDescription || (input as any)?.description || "Modern AI-powered web platform",
    targetAudience: input?.targetAudience || "Tech professionals and modern teams",
    websiteType: input?.websiteType || "SaaS",
    websiteStyle: input?.websiteStyle || (input as any)?.style || "Modern",
    colorTheme: input?.colorTheme || "Electric Indigo",
    animationPreference: input?.animationPreference || "Modern",
    requiredSections: Array.isArray(input?.requiredSections) && input.requiredSections.length > 0
      ? input.requiredSections
      : ["Hero", "Features", "About", "Pricing", "CTA", "Footer"],
  };

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
- Business Name: ${safeInput.businessName}
- Website Type: ${safeInput.websiteType}
- Business Description: ${safeInput.businessDescription}
- Target Audience: ${safeInput.targetAudience}
- Website Style: ${safeInput.websiteStyle}
- Color Theme: ${safeInput.colorTheme}
- Required Sections: ${safeInput.requiredSections.join(", ")}
- Animation Preference: ${safeInput.animationPreference}

Return JSON with this exact shape:
{
  "businessName": string,
  "tagline": string,
  "description": string,
  "targetAudience": string,
  "websiteType": "${safeInput.websiteType}",
  "theme": {
    "colorTheme": "${safeInput.colorTheme}",
    "fontFamily": "Inter" | "Outfit" | "Playfair Display" | "Plus Jakarta Sans" | "Space Grotesk",
    "borderRadius": "sm" | "md" | "lg" | "full",
    "animation": "${safeInput.animationPreference}",
    "style": "${safeInput.websiteStyle}"
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
  return buildSmartGeneratedWebsite(safeInput);
}

function buildSmartGeneratedWebsite(input: GenerationPromptInput): WebsiteData {
  const businessName = input?.businessName || "My Project";
  const businessDescription = input?.businessDescription || (input as any)?.description || "Modern AI-powered web platform";
  const targetAudience = input?.targetAudience || "Tech professionals and modern teams";
  const websiteType = input?.websiteType || "SaaS";
  const websiteStyle = input?.websiteStyle || (input as any)?.style || "Modern";
  const colorTheme = input?.colorTheme || "Electric Indigo";
  const animationPreference = input?.animationPreference || "Modern";
  const requiredSections = Array.isArray(input?.requiredSections) && input.requiredSections.length > 0
    ? input.requiredSections
    : ["Hero", "Features", "About", "Pricing", "CTA", "Footer"];

  const fontMap: Record<string, WebsiteData["theme"]["fontFamily"]> = {
    Modern: "Plus Jakarta Sans",
    Minimal: "Inter",
    Dark: "Space Grotesk",
    Luxury: "Playfair Display",
    Glassmorphism: "Outfit",
    Corporate: "Inter",
    Neon: "Space Grotesk",
  };

  const radiusMap: Record<string, WebsiteData["theme"]["borderRadius"]> = {
    Modern: "lg",
    Minimal: "sm",
    Dark: "md",
    Luxury: "sm",
    Glassmorphism: "lg",
    Corporate: "md",
    Neon: "none",
  };

  const fontFamily = fontMap[websiteStyle] || "Inter";
  const borderRadius = radiusMap[websiteStyle] || "md";

  const sections: SectionContent[] = [];

  // Industry-specific contextual content dictionary
  const industryMap: Record<WebsiteType, {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    heroCtaText: string;
    heroSecondaryCtaText: string;
    heroImage: string;
    heroItems: Array<{ title: string; description: string }>;
    featuresBadge: string;
    featuresTitle: string;
    featuresSubtitle: string;
    featuresItems: Array<{ id: string; title: string; description: string; icon: string }>;
    aboutBadge: string;
    aboutTitle: string;
    aboutDescription: string;
    aboutItems: Array<{ title: string; description: string }>;
    aboutImage: string;
    testimonialsBadge: string;
    testimonialsTitle: string;
    testimonialsItems: Array<{ id: string; title: string; description: string; author: string; role: string; avatar: string; rating: number }>;
    pricingBadge: string;
    pricingTitle: string;
    pricingSubtitle: string;
    pricingItems: Array<{ id: string; title: string; price: string; period: string; description: string; popular: boolean; features: string[]; buttonText: string; link: string }>;
    faqItems: Array<{ id: string; question: string; answer: string }>;
    ctaBadge: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaText: string;
    ctaSecondaryText: string;
  }> = {
    SaaS: {
      heroBadge: "Next-Gen SaaS Cloud Platform",
      heroTitle: `Scale Distributed Workflows with ${businessName}`,
      heroSubtitle: `The autonomous infrastructure platform built exclusively for ${targetAudience}. Reduce operational overhead by up to 48% with intelligent autoscaling.`,
      heroCtaText: "Start 14-Day Free Trial",
      heroSecondaryCtaText: "Live Interactive Demo",
      heroImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1000&auto=format&fit=crop&q=80",
      heroItems: [
        { title: "48%", description: "Overhead Reduction" },
        { title: "99.99%", description: "Guaranteed SLA Uptime" },
        { title: "< 1ms", description: "Global Edge Latency" },
      ],
      featuresBadge: "Engineered for Reliability",
      featuresTitle: "Everything Modern Teams Need to Deploy at Scale",
      featuresSubtitle: `Built from the ground up to solve complex distributed computing challenges for ${targetAudience}.`,
      featuresItems: [
        { id: "f-1", title: "Autonomous Orchestration", description: "Self-healing clusters with zero-downtime hot migration across multi-cloud regions.", icon: "Cpu" },
        { id: "f-2", title: "Real-Time Observability", description: "Distributed tracing, telemetry logs, and APM metrics in a single high-density dashboard.", icon: "Activity" },
        { id: "f-3", title: "Zero-Trust Mesh Security", description: "Mutual TLS encryption, short-lived tokens, and automated SOC 2 compliance enforcement.", icon: "ShieldCheck" },
        { id: "f-4", title: "Predictive Capacity Scaling", description: "Forecast traffic surges 5 minutes ahead of demand to prevent cascading timeouts.", icon: "TrendingUp" },
        { id: "f-5", title: "Universal API Mesh", description: "100+ native connectors with GraphQL and gRPC streaming pipelines ready out of the box.", icon: "Zap" },
        { id: "f-6", title: "Instant Edge Rollbacks", description: "Revert deployments in 250ms worldwide with automated canary health checks.", icon: "Layers" },
      ],
      aboutBadge: "Our Mission",
      aboutTitle: "Eliminating Friction in Enterprise Cloud Compute",
      aboutDescription: `${businessName} was founded with a clear vision: ${businessDescription}. Today, we empower thousands of engineering leaders worldwide to conquer operational complexity with confidence.`,
      aboutItems: [
        { title: "Developer First", description: "Designed by engineers for engineers with seamless CLI and SDK integration." },
        { title: "Reliability Obsessed", description: "We treat reliability as our premier product feature." },
      ],
      aboutImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80",
      testimonialsBadge: "Customer Proof",
      testimonialsTitle: "Trusted by Fast-Growing Engineering Teams",
      testimonialsItems: [
        { id: "t-1", title: "Cut our AWS cloud bill by 42%", description: `"${businessName} streamlined our entire deployment pipeline. We cut our cloud spend by 42% in the first two months."`, author: "David Chen", role: "Head of Infrastructure at CloudPulse", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80", rating: 5 },
        { id: "t-2", title: "Flawless reliability under pressure", description: `"During Black Friday traffic peaks, ${businessName} auto-scaled flawlessly with zero manual intervention."`, author: "Marcus Vance", role: "VP of Engineering at Apex Retail", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80", rating: 5 },
        { id: "t-3", title: "Unmatched developer experience", description: `"Onboarding took less than thirty minutes. The visual monitoring and instant rollbacks are indispensable."`, author: "Sarah Jenkins", role: "Platform Lead at Datastream", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80", rating: 5 },
      ],
      pricingBadge: "Simple Pricing",
      pricingTitle: "Transparent Plans Scaled to Your Workloads",
      pricingSubtitle: "No hidden charges. Upgrade or downgrade anytime with our 14-day risk-free trial.",
      pricingItems: [
        { id: "p-1", title: "Developer", price: "$29", period: "/mo", description: `Ideal for solo builders and early-stage prototypes.`, popular: false, features: ["Up to 5 micro-services", "100GB monthly telemetry", "Community Discord support", "Standard SSL & domains", "Automated backups"], buttonText: "Start Free Sandbox", link: "#checkout-dev" },
        { id: "p-2", title: "Growth Pro", price: "$79", period: "/mo", description: "The premier tier for fast-scaling technical companies.", popular: true, features: ["Unlimited services & clusters", "Sub-second autoscaling", "24/7 Slack engineer support", "Custom SSL & domain routing", "Advanced APM diagnostics", "Multi-region failover"], buttonText: "Start 14-Day Free Trial", link: "#checkout-pro" },
        { id: "p-3", title: "Enterprise", price: "$249", period: "/mo", description: "Dedicated isolation, custom SLA and SOC 2 audits.", popular: false, features: ["Dedicated isolated hardware", "99.999% SLA guarantee", "Custom VPC peering", "Dedicated Technical Account Manager", "Single Sign-On (SAML/Okta)", "Custom security audits"], buttonText: "Contact Enterprise Sales", link: "#contact" },
      ],
      faqItems: [
        { id: "faq-1", question: `How quickly can we migrate our services to ${businessName}?`, answer: `Most engineering teams connect their existing cloud accounts and migrate their first production service in less than 30 minutes using our CLI.` },
        { id: "faq-2", question: "Can we connect custom domain names and manage SSL?", answer: "Yes! Every plan includes automated custom domain routing with instant free SSL certificate issuance." },
        { id: "faq-3", question: "What SLA guarantees do you provide?", answer: "We provide a financially backed 99.99% uptime SLA for Pro tiers and 99.999% for Enterprise accounts." },
      ],
      ctaBadge: "Instant Deployment",
      ctaTitle: `Start Building Faster with ${businessName} Today`,
      ctaSubtitle: `Join thousands of top engineering organizations that trust ${businessName} to run their mission-critical services.`,
      ctaText: "Get Started Free in 60s",
      ctaSecondaryText: "Talk to Solutions Architect",
    },
    "AI Tool": {
      heroBadge: "Powered by Generative Transformers 3.0",
      heroTitle: `Turn Prompts into Masterpieces with ${businessName}`,
      heroSubtitle: `The multimodal generative canvas engineered for ${targetAudience}. Produce cinematic videos, responsive UI code, and high-res assets in seconds.`,
      heroCtaText: "Try in Browser Free",
      heroSecondaryCtaText: "Explore Playground",
      heroImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80",
      heroItems: [
        { title: "120B+", description: "Parameter Multimodal Foundation" },
        { title: "45ms", description: "Sub-Second Generation Latency" },
        { title: "99.4%", description: "Benchmark Quality Score" },
      ],
      featuresBadge: "Cutting-Edge AI",
      featuresTitle: "The All-in-One Studio for Next-Gen Creators",
      featuresSubtitle: `Eliminate repetitive creative bottlenecks and unlock limitless generative potential with ${businessName}.`,
      featuresItems: [
        { id: "f-1", title: "Multimodal Generation", description: "Seamlessly transition between text, high-res 4K imagery, vector code, and voice synthesis.", icon: "Sparkles" },
        { id: "f-2", title: "Infinite Collaborative Canvas", description: "Work alongside team members simultaneously on an unbounded multi-node generative canvas.", icon: "Layout" },
        { id: "f-3", title: "Zero-Shot Style Transfer", description: "Match brand guidelines and aesthetic palettes across hundreds of generated assets instantly.", icon: "Palette" },
        { id: "f-4", title: "Production REST & SDKs", description: "Integrate model predictions into your own applications with clean Python and TypeScript libraries.", icon: "Code" },
        { id: "f-5", title: "Strict Data Privacy", description: "Your proprietary training data and prompts are never used to train public foundation models.", icon: "ShieldCheck" },
        { id: "f-6", title: "Fine-Tuning Sandbox", description: "Upload your custom dataset and fine-tune specialized adapters with a single click.", icon: "Cpu" },
      ],
      aboutBadge: "The Vision",
      aboutTitle: "Democratizing Exponential Creative Intelligence",
      aboutDescription: `${businessName} was engineered to bridge human imagination with state-of-the-art diffusion models: ${businessDescription}. We believe creative expression should have zero technical barriers.`,
      aboutItems: [
        { title: "Instant Feedback", description: "Real-time generation loops that react as you type." },
        { title: "Artisan Quality", description: "Trained on curated aesthetics for clean commercial outputs." },
      ],
      aboutImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&auto=format&fit=crop&q=80",
      testimonialsBadge: "Creator Reviews",
      testimonialsTitle: "Loved by Over 80,000 Generative Artists",
      testimonialsItems: [
        { id: "t-1", title: "Revolutionized our studio pipeline", description: `"${businessName} slashed our concept art creation time from 4 days to 2 hours. The multimodal canvas is magic."`, author: "Elena Rostova", role: "Creative Director at Studio Nova", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80", rating: 5 },
        { id: "t-2", title: "The fidelity is unbelievable", description: `"The lighting consistency and fine details blow every alternative out of the water. Indispensable for VFX."`, author: "Kai Tanaka", role: "VFX Supervisor, Hologram Studios", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80", rating: 5 },
        { id: "t-3", title: "Supercharged our marketing team", description: `"We created 200 campaign variations in an afternoon. Our conversion rates increased by 54%."`, author: "Claire Dupont", role: "Growth Lead at HyperScale", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80", rating: 5 },
      ],
      pricingBadge: "Flexible Plans",
      pricingTitle: "Simple Token & Subscription Tiers",
      pricingSubtitle: "Generate without limits. Top up credits anytime or subscribe for high-throughput concurrency.",
      pricingItems: [
        { id: "p-1", title: "Creator Free", price: "$0", period: "/mo", description: "Get started exploring generative models with free monthly credits.", popular: false, features: ["50 free generations / mo", "Standard resolution 1080p", "Public canvas community", "Web browser editor", "Standard queue priority"], buttonText: "Start Free Now", link: "#free" },
        { id: "p-2", title: "Pro Artist", price: "$39", period: "/mo", description: "For power creators, designers, and creative directors.", popular: true, features: ["Unlimited standard generations", "4K Ultra-HD upscaling", "Priority fast-lane GPU queue", "Commercial rights included", "Custom style fine-tuning", "Private canvas workspace"], buttonText: "Upgrade to Pro", link: "#pro" },
        { id: "p-3", title: "Studio & API", price: "$149", period: "/mo", description: "Dedicated high-concurrency API for agencies and studios.", popular: false, features: ["100,000 API requests / mo", "Custom fine-tuned adapters", "Zero data retention guarantee", "Dedicated GPU cluster", "Dedicated account engineer", "Custom webhooks integration"], buttonText: "Get API Access", link: "#studio" },
      ],
      faqItems: [
        { id: "faq-1", question: "Do I own the commercial rights to generated content?", answer: "Yes! All assets produced on Pro and Studio plans carry full royalty-free commercial ownership." },
        { id: "faq-2", question: "Is my proprietary data kept private?", answer: "Absolutely. We enforce a strict zero data retention policy. Your prompts and private uploads are never retained or used to retrain public models." },
        { id: "faq-3", question: "Can I connect the API into our automated workflow?", answer: "Yes, our low-latency REST and WebSocket APIs make embedding generation directly into your apps seamless." },
      ],
      ctaBadge: "Unleash Imagination",
      ctaTitle: `Transform Your Creative Workflow with ${businessName}`,
      ctaSubtitle: `Join over 80,000 artists, developers, and founders building the future of generative media.`,
      ctaText: "Start Creating in Browser Free",
      ctaSecondaryText: "View Creative Showcase",
    },
    Startup: {
      heroBadge: "Breakthrough Technological Innovation",
      heroTitle: `Pioneering the Next Frontier with ${businessName}`,
      heroSubtitle: `Solving foundational industry challenges for ${targetAudience}. Accelerating the world's transition to sustainable, intelligent systems.`,
      heroCtaText: "Join the Pilot Program",
      heroSecondaryCtaText: "Read Technical Whitepaper",
      heroImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&auto=format&fit=crop&q=80",
      heroItems: [
        { title: "$14M", description: "Series A Capital Raised" },
        { title: "42+", description: "Global Patents Filed" },
        { title: "120k+", description: "Commercial Waitlist" },
      ],
      featuresBadge: "Core Breakthroughs",
      featuresTitle: "Engineered from First Principles for Exponential Impact",
      featuresSubtitle: `Discover how our patented architectural breakthroughs outperform legacy infrastructure.`,
      featuresItems: [
        { id: "f-1", title: "Proprietary Architecture", description: "Novel mechanical and computational topology delivering 10x higher energy efficiency.", icon: "Cpu" },
        { id: "f-2", title: "Automated Diagnostics", description: "Continuous telemetry monitoring with predictive failure prevention before anomalies emerge.", icon: "Activity" },
        { id: "f-3", title: "Zero Carbon Footprint", description: "Engineered with 100% recyclable components and sustainable closed-loop energy recovery.", icon: "Zap" },
        { id: "f-4", title: "Modular Scale Units", description: "Hot-swappable hardware nodes that scale linearly with customer operational demand.", icon: "Layers" },
        { id: "f-5", title: "Regulatory Certified", description: "Pre-certified for global international safety, security, and environmental standards.", icon: "ShieldCheck" },
        { id: "f-6", title: "Autonomous OS Mesh", description: "Distributed operating firmware with encrypted peer-to-peer synchronization.", icon: "Globe" },
      ],
      aboutBadge: "Founding Story",
      aboutTitle: "Reimagining Infrastructure for the Next Century",
      aboutDescription: `${businessName} was founded by researchers and engineers driven by a singular purpose: ${businessDescription}. We are building the physical and digital foundations for tomorrow's economy.`,
      aboutItems: [
        { title: "First Principles", description: "We reject conventional assumptions and engineer from fundamental physics." },
        { title: "Speed of Execution", description: "Rapid real-world prototyping that brings lab breakthroughs to market fast." },
      ],
      aboutImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&auto=format&fit=crop&q=80",
      testimonialsBadge: "Partner Validation",
      testimonialsTitle: "What Industry Pioneers Are Saying",
      testimonialsItems: [
        { id: "t-1", title: "A genuine generational leap", description: `"The efficiency benchmarks achieved by ${businessName} fundamentally change the economics of our operations."`, author: "Dr. Aris Thorne", role: "Managing Director at Horizon Ventures", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80", rating: 5 },
        { id: "t-2", title: "Seamless commercial deployment", description: `"Integrating the initial pilot pods took less than a week. The reliability has exceeded all our expectations."`, author: "Victoria Reed", role: "COO at Global Logistics Partners", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80", rating: 5 },
        { id: "t-3", title: "The standard for sustainable tech", description: `"An extraordinary engineering achievement that delivers both commercial profitability and radical eco-efficiency."`, author: "Siddharth Rao", role: "Chief Science Officer, CleanTech Labs", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80", rating: 5 },
      ],
      pricingBadge: "Deployment Options",
      pricingTitle: "Commercial Pilot & Fleet Expansion Tiers",
      pricingSubtitle: "Reserve units for upcoming deployment phases. Custom volume agreements available.",
      pricingItems: [
        { id: "p-1", title: "Pilot Program", price: "$499", period: "/mo", description: "Dedicated test deployment for research and evaluation facilities.", popular: false, features: ["Single modular deployment unit", "Full telemetry access", "Direct engineering team hotline", "Weekly optimization reviews", "Full warranty & maintenance"], buttonText: "Apply for Pilot", link: "#pilot" },
        { id: "p-2", title: "Commercial Fleet", price: "$1,499", period: "/mo", description: "Full commercial integration for active operating facilities.", popular: true, features: ["Up to 10 modular units", "Real-time edge automated mesh", "Dedicated Field Engineer", "99.9% uptime performance guarantee", "Custom ERP & API integration", "Priority hardware swap SLA"], buttonText: "Deploy Commercial Fleet", link: "#fleet" },
        { id: "p-3", title: "Global Enterprise", price: "Custom", period: "/contract", description: "Turnkey multi-region infrastructure rollout.", popular: false, features: ["Unlimited hardware deployment", "Custom hardware co-design", "Dedicated 24/7 on-site team", "Custom regulatory certifications", "Tailored financing & leasing", "Guaranteed long-term parts supply"], buttonText: "Schedule Executive Briefing", link: "#contact" },
      ],
      faqItems: [
        { id: "faq-1", question: "When are new commercial units delivered?", answer: "Pilot units ship within 14 business days. Large fleet orders are dispatched according to our phased manufacturing schedule." },
        { id: "faq-2", question: "How does ${businessName} integrate with existing legacy systems?", answer: "Our systems connect via standard industrial protocols, REST APIs, and native cloud connectors with zero disruptive overhaul." },
        { id: "faq-3", question: "What warranty and service coverage is provided?", answer: "All hardware units include a 5-year full replacement warranty and 24/7 remote diagnostic monitoring." },
      ],
      ctaBadge: "Be an Early Partner",
      ctaTitle: `Shape the Future of Industry with ${businessName}`,
      ctaSubtitle: `Join forward-looking commercial partners deploying next-generation systems today.`,
      ctaText: "Apply for Exclusive Pilot",
      ctaSecondaryText: "Download Investor Deck",
    },
    Agency: {
      heroBadge: "Award-Winning Creative & Digital Studio",
      heroTitle: `We Build Iconic Brands & High-Converting Experiences`,
      heroSubtitle: `Partnering with ambitious founders and Fortune 500 companies to craft memorable digital identities for ${targetAudience}.`,
      heroCtaText: "View Our Work",
      heroSecondaryCtaText: "Book Discovery Call",
      heroImage: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=1000&auto=format&fit=crop&q=80",
      heroItems: [
        { title: "150+", description: "Iconic Brands Scaled" },
        { title: "14", description: "Awwwards & FWA Trophies" },
        { title: "4.9 / 5", description: "Client Satisfaction Score" },
      ],
      featuresBadge: "Our Capabilities",
      featuresTitle: "Full-Spectrum Creative & Digital Engineering",
      featuresSubtitle: `From initial brand strategy to complex WebGL interactions and high-conversion landing pages.`,
      featuresItems: [
        { id: "f-1", title: "Brand Identity & Strategy", description: "Comprehensive visual systems, logo design, tone-of-voice, and distinct brand guidelines.", icon: "Palette" },
        { id: "f-2", title: "Product & UI/UX Design", description: "Human-centric research, design systems, and rapid high-fidelity prototyping that converts.", icon: "Layout" },
        { id: "f-3", title: "Creative Web Development", description: "Clean Next.js, WebGL shaders, responsive animations, and lightning-fast SEO architecture.", icon: "Code" },
        { id: "f-4", title: "Conversion Optimization", description: "A/B test experimentation and UX auditing to turn visitors into lifelong paying customers.", icon: "TrendingUp" },
        { id: "f-5", title: "3D & Motion Direction", description: "Cinematic product renders, interactive Three.js models, and kinetic typography.", icon: "Sparkles" },
        { id: "f-6", title: "Content & Copywriting", description: "Persuasive editorial copy tailored to captivate your highest-value customers.", icon: "Target" },
      ],
      aboutBadge: "The Agency",
      aboutTitle: "We Believe Good Design Is Good Business",
      aboutDescription: `${businessName} was founded to eliminate generic, uninspired web templates: ${businessDescription}. We blend artistic vision with conversion metrics to deliver exponential business results.`,
      aboutItems: [
        { title: "Tailored Craft", description: "Zero templates. Every line of code and pixel is meticulously handcrafted." },
        { title: "Commercial Impact", description: "We build digital experiences that drive measurable revenue growth." },
      ],
      aboutImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&auto=format&fit=crop&q=80",
      testimonialsBadge: "Client Testimonials",
      testimonialsTitle: "What Our Partners Say About Working With Us",
      testimonialsItems: [
        { id: "t-1", title: "Tripled our inbound conversion rate", description: `"The rebrand and interactive web platform developed by ${businessName} tripled our qualified demo requests in 60 days."`, author: "Alexandra Moore", role: "Chief Brand Officer at Vesper", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80", rating: 5 },
        { id: "t-2", title: "World-class team and execution", description: `"Easily the best agency collaboration we've ever had. Fast, communicative, and obsessively attentive to every detail."`, author: "Julian Foster", role: "Founder & CEO, Lumina Tech", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80", rating: 5 },
        { id: "t-3", title: "Won Site of the Day on Awwwards", description: `"They elevated our product narrative beyond anything we dreamed possible. Outstanding creative vision."`, author: "Camille Laurent", role: "Head of Marketing, Atelier Paris", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80", rating: 5 },
      ],
      pricingBadge: "Engagement Models",
      pricingTitle: "Flexible Partnerships Tailored to Your Growth Stage",
      pricingSubtitle: "Choose between focused sprint projects or continuous dedicated creative retainers.",
      pricingItems: [
        { id: "p-1", title: "Brand Sprint", price: "$4,500", period: "/sprint", description: "Complete brand visual identity & landing page design in 2 weeks.", popular: false, features: ["Brand identity & color tokens", "High-conversion landing page", "Responsive mobile optimization", "SEO & OpenGraph assets", "Figma design system source files"], buttonText: "Book a Sprint", link: "#sprint" },
        { id: "p-2", title: "Growth Retainer", price: "$8,500", period: "/mo", description: "Dedicated ongoing design & engineering team for scaling companies.", popular: true, features: ["Dedicated Creative Lead & Developer", "Unlimited design requests & iterations", "Continuous CRO A/B testing", "Fast 48-hour delivery turnarounds", "Weekly sync & Slack channel access", "Cancel or pause anytime"], buttonText: "Start Growth Retainer", link: "#retainer" },
        { id: "p-3", title: "Custom Enterprise", price: "Custom", period: "/project", description: "Full digital transformation and bespoke custom platform.", popular: false, features: ["Complete multi-page web platform", "Custom 3D / WebGL motion", "Headless CMS integration", "Enterprise design system", "Full team onboarding & handoff", "Dedicated ongoing maintenance"], buttonText: "Schedule Consultation", link: "#contact" },
      ],
      faqItems: [
        { id: "faq-1", question: "How long does a typical project take?", answer: "Our focused Brand Sprints take 2 weeks. Comprehensive custom digital platforms typically span 4 to 6 weeks from kick-off to live launch." },
        { id: "faq-2", question: "Do you offer ongoing post-launch maintenance?", answer: "Yes! We offer monthly retainer packages covering continuous feature development, hosting, and conversion optimization." },
        { id: "faq-3", question: "Who will I be working with directly?", answer: "You will work directly with our Senior Creative Lead and Lead Engineer via a dedicated shared Slack channel." },
      ],
      ctaBadge: "Let's Collaborate",
      ctaTitle: `Have a Project in Mind? Let's Build Something Iconic`,
      ctaSubtitle: `We are currently booking projects for the upcoming quarter. Let's discuss your vision today.`,
      ctaText: "Schedule a Discovery Call",
      ctaSecondaryText: "Browse Full Portfolio",
    },
    Portfolio: {
      heroBadge: "Senior Product Designer & Creative Engineer",
      heroTitle: `Designing Thoughtful Products at the Intersection of Art & Code`,
      heroSubtitle: `Helping high-growth teams and founders craft bespoke digital experiences, design systems, and delightful interfaces for ${targetAudience}.`,
      heroCtaText: "Explore Selected Works",
      heroSecondaryCtaText: "Download Resume",
      heroImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80",
      heroItems: [
        { title: "8+ Years", description: "Crafting Digital Products" },
        { title: "45+", description: "Shipped Global Projects" },
        { title: "3x", description: "Awwwards Site of the Day" },
      ],
      featuresBadge: "Core Disciplines",
      featuresTitle: "Design Leadership Combined with Production Engineering",
      featuresSubtitle: `Bridging the gap between creative visual elegance and high-performance technical execution.`,
      featuresItems: [
        { id: "f-1", title: "Product Strategy & UX", description: "Customer journey mapping, user research, wireframing, and validating high-impact hypotheses.", icon: "Target" },
        { id: "f-2", title: "Design Systems & Tokens", description: "Scalable component libraries built with Figma variants, design tokens, and accessibility standards.", icon: "Layout" },
        { id: "f-3", title: "Interactive Prototyping", description: "High-fidelity micro-interactions with Framer, CSS motion, and tangible state transitions.", icon: "Sparkles" },
        { id: "f-4", title: "Frontend Engineering", description: "Clean production React, Next.js, Tailwind CSS, and performance-optimized edge builds.", icon: "Code" },
        { id: "f-5", title: "Design Audits & CRO", description: "Data-driven heuristics review to unblock funnel friction and boost signups.", icon: "TrendingUp" },
        { id: "f-6", title: "Fractional Design Lead", description: "Mentoring junior talent, aligning cross-functional teams, and steering product roadmaps.", icon: "Users" },
      ],
      aboutBadge: "About Me",
      aboutTitle: "Passionate About Meticulous Craft & Human Delight",
      aboutDescription: `Over the past eight years, ${businessName} has collaborated with ambitious startups and iconic brands: ${businessDescription}. I believe extraordinary products are built where craft meets clarity.`,
      aboutItems: [
        { title: "Obsessive Detail", description: "From typographic kerning to 60fps micro-animations." },
        { title: "Outcome Driven", description: "Focusing on business outcomes and real user delight." },
      ],
      aboutImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
      testimonialsBadge: "Colleague Endorsements",
      testimonialsTitle: "What Founders and Product Leaders Say",
      testimonialsItems: [
        { id: "t-1", title: "A rare 1% designer-engineer", description: `"Working with ${businessName} was transformative. They delivered not only breathtaking designs but also production-ready code."`, author: "David Vance", role: "Co-Founder at Prism AI", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80", rating: 5 },
        { id: "t-2", title: "Elevated our entire design culture", description: `"They established our core design system from scratch, cutting our sprint delivery cycles in half."`, author: "Sophie Martin", role: "VP Product, FinScale", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80", rating: 5 },
        { id: "t-3", title: "Incredible eye for polish and speed", description: `"Fast, thoughtful, and communicative. Our users constantly compliment the new interface."`, author: "Liam Chen", role: "Founder, Kinetic Health", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80", rating: 5 },
      ],
      pricingBadge: "Work With Me",
      pricingTitle: "Consulting, Sprint Engagements, & Advisory",
      pricingSubtitle: "Limited availability for select client collaborations each quarter.",
      pricingItems: [
        { id: "p-1", title: "Advisory & Audit", price: "$350", period: "/hr", description: "Deep-dive heuristic review of your product UX, design system, and roadmap.", popular: false, features: ["Comprehensive UX audit report", "Actionable quick-win checklist", "Recorded video walkthrough", "Direct Q&A strategy session", "Follow-up email guidance"], buttonText: "Book Advisory Session", link: "#audit" },
        { id: "p-2", title: "Feature Sprint", price: "$3,800", period: "/sprint", description: "End-to-end design of a flagship product feature in two weeks.", popular: true, features: ["User flows & wireframes", "Figma high-fidelity prototypes", "Design tokens & component specs", "Interactive motion preview", "Developer handoff documentation", "Two revision rounds included"], buttonText: "Reserve a Sprint", link: "#sprint" },
        { id: "p-3", title: "Fractional Lead", price: "$7,500", period: "/mo", description: "Dedicated senior design leadership for fast-growing ventures.", popular: false, features: ["20 hours weekly dedicated focus", "Full design system ownership", "Mentoring in-house team", "Direct Slack collaboration", "Cross-functional roadmap input", "Monthly rolling retainer"], buttonText: "Apply for Fractional", link: "#contact" },
      ],
      faqItems: [
        { id: "faq-1", question: "What is your current availability?", answer: "I typically book projects 2 to 3 weeks in advance. Get in touch early to ensure alignment with your timeline." },
        { id: "faq-2", question: "Do you write production code?", answer: "Yes! I specialize in modern React, Next.js, and Tailwind CSS, ensuring pixel-perfect fidelity from Figma to browser." },
        { id: "faq-3", question: "Where are you based?", answer: "I work remotely with teams worldwide, with primary availability across US and European timezones." },
      ],
      ctaBadge: "Get in Touch",
      ctaTitle: `Have an Exciting Project? Let's Talk`,
      ctaSubtitle: `Whether you need a full product redesign, design system audit, or fractional leadership.`,
      ctaText: "Send an Inquiry",
      ctaSecondaryText: "Connect on LinkedIn",
    },
    Restaurant: {
      heroBadge: "Artisanal Seasonal Dining & Natural Cellar",
      heroTitle: `Experience the Art of Seasonal Gastronomy at ${businessName}`,
      heroSubtitle: `Handcrafted farm-to-table cuisine prepared over wood fire with wild-foraged botanicals. Curated for discerning ${targetAudience}.`,
      heroCtaText: "Reserve a Table",
      heroSecondaryCtaText: "View Seasonal Menu",
      heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80",
      heroItems: [
        { title: "100%", description: "Organic Farm-to-Table" },
        { title: "350+", description: "Curated Biodynamic Wines" },
        { title: "Michelin Guide", description: "Recommended Selection 2026" },
      ],
      featuresBadge: "Culinary Philosophy",
      featuresTitle: "Honoring Heritage, Technique, and Terroir",
      featuresSubtitle: `Every dish tells the story of our local farmers, sustainable fisheries, and artisan makers.`,
      featuresItems: [
        { id: "f-1", title: "Daily Farm Harvest", description: "Produce harvested at dawn from our organic cooperative partners within 40 miles.", icon: "Sun" },
        { id: "f-2", title: "Wood-Fired Hearth", description: "Primal open-flame cooking over aged fruitwoods, unlocking deep smoky complexity.", icon: "Sparkles" },
        { id: "f-3", title: "Master Sommelier Pairings", description: "Natural, biodynamic, and rare vintage cellar selections paired with each course.", icon: "Zap" },
        { id: "f-4", title: "Private Dining Vaults", description: "Intimate heritage spaces for family milestones, celebrations, and corporate retreats.", icon: "Users" },
        { id: "f-5", title: "House Charcuterie & Ferments", description: "Dry-aged heritage meats, lacto-fermented condiments, and house-cultured butter.", icon: "ShieldCheck" },
        { id: "f-6", title: "Craft Botanical Cocktails", description: "Small-batch aperitifs, cold-pressed bitters, and zero-proof artisanal infusions.", icon: "BarChart3" },
      ],
      aboutBadge: "Our Kitchen",
      aboutTitle: "A Celebration of Living Flavors and Hospitality",
      aboutDescription: `${businessName} was founded with one clear passion: ${businessDescription}. We invite you to slow down, share stories, and savor culinary craftsmanship at its finest.`,
      aboutItems: [
        { title: "Regenerative Earth", description: "Zero single-use plastics and 100% closed-loop kitchen composting." },
        { title: "Artisan Community", description: "Supporting 30+ regional heirloom farmers and coastal fishermen." },
      ],
      aboutImage: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=900&auto=format&fit=crop&q=80",
      testimonialsBadge: "Guest Reviews",
      testimonialsTitle: "Praise from Food Critics and Cherished Guests",
      testimonialsItems: [
        { id: "t-1", title: "An unforgettable culinary journey", description: `"The 7-course tasting menu at ${businessName} was one of the most sublime dining experiences I have enjoyed in a decade."`, author: "Chef Laurent Mercier", role: "Michelin Star Patron", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80", rating: 5 },
        { id: "t-2", title: "The wine pairings are extraordinary", description: `"The sommelier introduced us to breathtaking biodynamic vintages that elevated every single plate."`, author: "Isabella Rossi", role: "Gastronomy Journalist, Gourmet Review", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80", rating: 5 },
        { id: "t-3", title: "Warmth, atmosphere, and sheer craft", description: `"The ambient lighting, the wood-fired hearth, and the impeccable hospitality make this our favorite dining destination."`, author: "Thomas Keller", role: "Frequent Guest & Wine Collector", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80", rating: 5 },
      ],
      pricingBadge: "Dining Experiences",
      pricingTitle: "Tasting Menus and Curated Cellar Experiences",
      pricingSubtitle: "Reservations open 30 days in advance. Dietary accommodations gladly arranged with 48h notice.",
      pricingItems: [
        { id: "p-1", title: "Seasonal Lunch", price: "$55", period: "/guest", description: "A 3-course midday exploration of our daily farm harvest.", popular: false, features: ["3 seasonal chef courses", "House-made sourdough & cultured butter", "Choice of garden dessert", "Artisanal coffee & tea", "Available Tuesday through Saturday"], buttonText: "Reserve Lunch Table", link: "#lunch" },
        { id: "p-2", title: "Chef's 5-Course Dinner", price: "$110", period: "/guest", description: "Our flagship evening tasting experience celebrating the season.", popular: true, features: ["5 progressive tasting courses", "Amuse-bouche & palate cleansers", "Open hearth wood-fired special", "Optional sommelier wine pairing (+$65)", "Handmade mignardises to conclude"], buttonText: "Reserve Dinner Experience", link: "#dinner" },
        { id: "p-3", title: "Grand Reserve Vault", price: "$185", period: "/guest", description: "7-course private vault dining with rare reserve cellar pairings.", popular: false, features: ["7 bespoke courses by Executive Chef", "Prestige library vintage pairings included", "Private dining room & dedicated sommelier", "Personalized engraved printed menus", "Exclusive kitchen tour & chef greeting"], buttonText: "Inquire Private Vault", link: "#vault" },
      ],
      faqItems: [
        { id: "faq-1", question: "What is your reservation and cancellation policy?", answer: "Table reservations can be cancelled or rescheduled up to 48 hours in advance with a full deposit refund." },
        { id: "faq-2", question: "Can you accommodate vegan, gluten-free, or specific allergies?", answer: "Yes! Our culinary team happily crafts personalized tasting alternatives with at least 48 hours advance notice." },
        { id: "faq-3", question: "Is there a dress code?", answer: "We encourage smart casual attire to match our warm, intimate dining atmosphere." },
      ],
      ctaBadge: "Join Us Tonight",
      ctaTitle: `Reserve Your Table at ${businessName}`,
      ctaSubtitle: `Experience the warmth of our open hearth and seasonal cuisine. We look forward to hosting you.`,
      ctaText: "Book Your Reservation",
      ctaSecondaryText: "View Full Wine List",
    },
    Ecommerce: {
      heroBadge: "Direct-to-Consumer Seasonal Release",
      heroTitle: `Elevate Your Everyday Essentials with ${businessName}`,
      heroSubtitle: `Meticulously crafted lifestyle products designed for ${targetAudience}. Lifetime durability guarantee with free worldwide carbon-neutral delivery.`,
      heroCtaText: "Shop the Collection",
      heroSecondaryCtaText: "Explore Lookbook",
      heroImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80",
      heroItems: [
        { title: "50,000+", description: "Satisfied Customers" },
        { title: "100%", description: "Carbon-Neutral Delivery" },
        { title: "30-Day", description: "Risk-Free Trial & Returns" },
      ],
      featuresBadge: "Craft & Integrity",
      featuresTitle: "Designed for Living, Engineered to Last",
      featuresSubtitle: `We reject fast fashion and cheap plastics. Everything we make is built for decades of reliable use.`,
      featuresItems: [
        { id: "f-1", title: "Premium Sustainable Materials", description: "GOTS-certified organic fibers and recycled marine alloys that age with distinct patina.", icon: "Sparkles" },
        { id: "f-2", title: "Ergonomic Modern Form", description: "Designed by ergonomic specialists for effortless all-day comfort and timeless aesthetic.", icon: "Layout" },
        { id: "f-3", title: "Lifetime Repair Warranty", description: "If any component wears out, our artisan repair team will restore it free of charge.", icon: "ShieldCheck" },
        { id: "f-4", title: "Water & Weather Resistant", description: "Hydrophobic sealed seams protecting your valuable essentials in all conditions.", icon: "Zap" },
        { id: "f-5", title: "Carbon-Neutral Delivery", description: "Zero-plastic biodegradable packaging shipped with 100% verified carbon offset credits.", icon: "Globe" },
        { id: "f-6", title: "Effortless 30-Day Returns", description: "Try it at home risk-free. Pre-paid return labels included inside every delivery.", icon: "Activity" },
      ],
      aboutBadge: "Our Craft",
      aboutTitle: "Thoughtful Goods Built for a Lifetime",
      aboutDescription: `${businessName} was founded with a singular conviction: ${businessDescription}. We partner directly with master craftsmen to offer uncompromising luxury at honest, direct prices.`,
      aboutItems: [
        { title: "Direct to You", description: "No middlemen markups. Pure quality at authentic prices." },
        { title: "Zero Waste", description: "Small-batch seasonal drops designed to eliminate unsold inventory." },
      ],
      aboutImage: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=900&auto=format&fit=crop&q=80",
      testimonialsBadge: "Verified Reviews",
      testimonialsTitle: "What Our Customers Are Saying",
      testimonialsItems: [
        { id: "t-1", title: "The best purchase I made this year", description: `"The tactile quality of the materials and precision finishing are simply in a league of their own. I carry mine daily."`, author: "Liam O'Connor", role: "Verified Buyer • Brooklyn, NY", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80", rating: 5 },
        { id: "t-2", title: "Exceeded all expectations", description: `"Arrived in beautiful packaging and feels indestructible yet wonderfully refined. Will definitely be ordering gifts."`, author: "Emma Watson", role: "Verified Buyer • London, UK", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80", rating: 5 },
        { id: "t-3", title: "Unbeatable customer service", description: `"Had to swap sizes and the team handled the exchange in two days with zero friction. Outstanding company."`, author: "Marco Silva", role: "Verified Buyer • Toronto, Canada", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80", rating: 5 },
      ],
      pricingBadge: "Featured Bundles",
      pricingTitle: "Popular Seasonal Kits & Direct Bundles",
      pricingSubtitle: "Save up to 25% when purchasing bundled everyday essentials. Free expedited shipping included.",
      pricingItems: [
        { id: "p-1", title: "The Starter Kit", price: "$69", period: "/kit", description: "The foundational piece to elevate your daily routine.", popular: false, features: ["Flagship essential item", "Organic cotton protective pouch", "Certificate of authenticity", "Free standard shipping", "30-day trial guarantee"], buttonText: "Add to Bag", link: "#starter" },
        { id: "p-2", title: "The Everyday Bundle", price: "$129", period: "/pack", description: "Our most coveted 3-piece complete daily ensemble.", popular: true, features: ["Flagship essential item", "Complementary accessory piece", "Hard-shell travel organizer", "Priority express delivery", "Lifetime repair warranty", "Exclusive early access to drops"], buttonText: "Claim Bundle — Save $40", link: "#bundle" },
        { id: "p-3", title: "Collector's Edition", price: "$219", period: "/set", description: "The complete artisanal collection in limited numbered edition.", popular: false, features: ["Full 5-piece complete set", "Laser-engraved custom monogram", "Heavyweight leather storage case", "Priority express worldwide shipping", "Dedicated concierge support", "Guaranteed heirloom replacement"], buttonText: "Order Collector's Edition", link: "#collector" },
      ],
      faqItems: [
        { id: "faq-1", question: "How long does delivery take?", answer: "Orders ship within 24 hours. Domestic orders arrive in 2 to 3 business days; international delivery takes 4 to 7 business days." },
        { id: "faq-2", question: "How does the 30-day risk-free trial work?", answer: "Try your items at home for 30 days. If you are not completely delighted, return them in original condition for an instant 100% refund." },
        { id: "faq-3", question: "What does the Lifetime Warranty cover?", answer: "We cover all manufacturing defects, seams, and hardware failures for the lifetime of the product." },
      ],
      ctaBadge: "Limited Inventory",
      ctaTitle: `Upgrade Your Daily Essentials with ${businessName}`,
      ctaSubtitle: `Join over 50,000 satisfied customers enjoying better design and lifetime durability.`,
      ctaText: "Shop the New Collection",
      ctaSecondaryText: "Explore Customer Gallery",
    },
    Gym: {
      heroBadge: "High-Performance Athletic Club",
      heroTitle: `Unleash Your Peak Performance at ${businessName}`,
      heroSubtitle: `World-class Olympic equipment, biometric conditioning, and luxury recovery suites engineered for ${targetAudience}.`,
      heroCtaText: "Claim Your 7-Day Free Pass",
      heroSecondaryCtaText: "Take a Virtual Tour",
      heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=80",
      heroItems: [
        { title: "24/7", description: "Unrestricted Keycard Access" },
        { title: "16", description: "Master Olympic Coaches" },
        { title: "500+", description: "Verified Transformations" },
      ],
      featuresBadge: "Elite Facilities",
      featuresTitle: "Where Science Meets Maximum Athletic Performance",
      featuresSubtitle: `Step into an uncompromising training environment designed for measurable strength, speed, and recovery.`,
      featuresItems: [
        { id: "f-1", title: "Olympic Lifting Platforms", description: "Eleiko barbells, calibrated bumper plates, and competition-spec power cages.", icon: "Zap" },
        { id: "f-2", title: "Biometric Heart-Rate Tracking", description: "Real-time overhead displays tracking metabolic output and calorie expenditure.", icon: "Activity" },
        { id: "f-3", title: "Cryo & Contrast Recovery", description: "-110°C full-body cryotherapy, 4°C cold plunges, and infrared cedar saunas.", icon: "Sparkles" },
        { id: "f-4", title: "Metabolic HIIT & Hyrox Arena", description: "Dedicated turf sprint tracks, curved motorless treadmills, and assault airbikes.", icon: "TrendingUp" },
        { id: "f-5", title: "Custom Nutrition Coaching", description: "InBody bio-impedance composition scans and individualized macronutrient meal blueprints.", icon: "PieChart" },
        { id: "f-6", title: "Luxury Spa Locker Suites", description: "Rain showers, eucalyptus steam rooms, towel service, and Malin+Goetz amenities.", icon: "ShieldCheck" },
      ],
      aboutBadge: "Our Standard",
      aboutTitle: "Built for Those Who Demand More from Themselves",
      aboutDescription: `${businessName} was created to replace crowded, soulless fitness chains: ${businessDescription}. We foster an elite culture of discipline, support, and unstoppable momentum.`,
      aboutItems: [
        { title: "Zero Crowding", description: "Strict membership caps guarantee you never wait for barbells or equipment." },
        { title: "Elite Coaching", description: "Every coach holds master-level certifications in human kinesiology." },
      ],
      aboutImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80",
      testimonialsBadge: "Member Stories",
      testimonialsTitle: "Real Athletes, Real Transformations",
      testimonialsItems: [
        { id: "t-1", title: "In the best shape of my life at 38", description: `"The coaching and recovery facilities at ${businessName} transformed my fitness. I shed 24 lbs while setting new personal bests in deadlift."`, author: "Jason Miller", role: "Member for 2 Years • Marathoner", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80", rating: 5 },
        { id: "t-2", title: "The recovery suite is game-changing", description: `"The cold plunge and infrared sauna after a brutal squat session make recovery ten times faster. I wake up soreness-free."`, author: "Brittany Hayes", role: "Hyrox Competitor • Member", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80", rating: 5 },
        { id: "t-3", title: "The atmosphere is unmatched", description: `"Zero egos, incredible high-end equipment, and coaches who genuinely invest in your progress. Best athletic club in the city."`, author: "Marcus Taylor", role: "Tech Executive & Powerlifter", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80", rating: 5 },
      ],
      pricingBadge: "Memberships",
      pricingTitle: "Invest in Your Physical Longevity & Strength",
      pricingSubtitle: "Capped membership to prevent overcrowding. Month-to-month flexibility with zero cancellation fees.",
      pricingItems: [
        { id: "p-1", title: "Open Club", price: "$29", period: "/day pass", description: "Full day access to gym floor and standard locker amenities.", popular: false, features: ["All-day gym floor access", "Complimentary locker & towel service", "Standard Olympic weight room", "InBody body composition scan", "Access during staffed hours"], buttonText: "Get Day Pass", link: "#pass" },
        { id: "p-2", title: "All-Access Club", price: "$99", period: "/mo", description: "Our flagship membership for committed athletes.", popular: true, features: ["24/7 unlimited facility access", "Unlimited contrast therapy & saunas", "All group HIIT & Hyrox classes", "Monthly biometric progress scan", "Guest passes (2 per month)", "Zero annual maintenance fees"], buttonText: "Start 7-Day Free Trial", link: "#membership" },
        { id: "p-3", title: "Elite Performance", price: "$199", period: "/mo", description: "All-Access plus private master coaching & nutrition.", popular: false, features: ["Everything in All-Access included", "4 private 1-on-1 coaching sessions / mo", "Personalized custom nutrition plan", "Heart-rate monitor strap included", "Private laundry locker service", "Priority booking for cryo recovery"], buttonText: "Apply for Elite Club", link: "#elite" },
      ],
      faqItems: [
        { id: "faq-1", question: "Is there a long-term contract or cancellation fee?", answer: "No! All our memberships are month-to-month. You can cancel or freeze your membership anytime with 14 days notice." },
        { id: "faq-2", question: "Are group training classes included in the membership?", answer: "Yes! All-Access and Elite Performance members receive unlimited access to all strength, conditioning, and HIIT classes." },
        { id: "faq-3", question: "Can I bring a training partner or guest?", answer: "All-Access members receive 2 complimentary guest passes each month to bring friends or colleagues." },
      ],
      ctaBadge: "Join the Club",
      ctaTitle: `Your Transformation Begins with One Step`,
      ctaSubtitle: `Experience the difference of training in an elite facility. Claim your complimentary 7-day trial pass today.`,
      ctaText: "Claim 7-Day Free Trial Pass",
      ctaSecondaryText: "Schedule Private Facility Tour",
    },
  };

  const ind = industryMap[websiteType] || industryMap.SaaS;

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
          badge: ind.heroBadge,
          title: ind.heroTitle,
          subtitle: ind.heroSubtitle,
          ctaText: ind.heroCtaText,
          ctaLink: "#pricing",
          secondaryCtaText: ind.heroSecondaryCtaText,
          secondaryCtaLink: "#features",
          imageUrl: ind.heroImage,
          imageAlt: `${businessName} Showcase Preview`,
          items: ind.heroItems,
        });
        break;

      case "Features":
        sections.push({
          id: "sec-features",
          type: "Features",
          badge: ind.featuresBadge,
          title: ind.featuresTitle,
          subtitle: ind.featuresSubtitle,
          items: ind.featuresItems,
        });
        break;

      case "About":
        sections.push({
          id: "sec-about",
          type: "About",
          badge: ind.aboutBadge,
          title: ind.aboutTitle,
          description: ind.aboutDescription,
          imageUrl: ind.aboutImage,
          imageAlt: `${businessName} philosophy`,
          items: ind.aboutItems,
        });
        break;

      case "Testimonials":
        sections.push({
          id: "sec-testimonials",
          type: "Testimonials",
          badge: ind.testimonialsBadge,
          title: ind.testimonialsTitle,
          subtitle: `See what our partners and customers have to say about ${businessName}.`,
          items: ind.testimonialsItems,
        });
        break;

      case "Pricing":
        sections.push({
          id: "sec-pricing",
          type: "Pricing",
          badge: ind.pricingBadge,
          title: ind.pricingTitle,
          subtitle: ind.pricingSubtitle,
          items: ind.pricingItems,
        });
        break;

      case "FAQ":
        sections.push({
          id: "sec-faq",
          type: "FAQ",
          badge: "Got Questions?",
          title: "Frequently Asked Questions",
          subtitle: "Everything you need to know about our services, guarantees, and onboarding.",
          items: ind.faqItems,
        });
        break;

      case "CTA":
        sections.push({
          id: "sec-cta",
          type: "CTA",
          badge: ind.ctaBadge,
          title: ind.ctaTitle,
          subtitle: ind.ctaSubtitle,
          ctaText: ind.ctaText,
          ctaLink: "#pricing",
          secondaryCtaText: ind.ctaSecondaryText,
          secondaryCtaLink: "#contact",
        });
        break;

      case "Contact":
        sections.push({
          id: "sec-contact",
          type: "Contact",
          badge: "Get in Touch",
          title: "We'd Love to Hear From You",
          subtitle: `Connect directly with our team to discuss your goals with ${businessName}.`,
          description: "Our dedicated advisory team responds in less than 2 hours during standard business hours.",
          items: [
            { title: "Direct Email", description: `hello@${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com` },
            { title: "HQ Studio", description: "San Francisco, CA • London, UK" },
            { title: "Direct Support", description: "Available 24/7 directly within your dashboard" },
          ],
        });
        break;

      case "Footer":
        sections.push({
          id: "sec-footer",
          type: "Footer",
          title: businessName,
          description: `${ind.heroBadge}. The premier platform for ${targetAudience} to achieve extraordinary results.`,
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
