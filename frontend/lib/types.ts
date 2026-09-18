export type WebsiteType =
  | "SaaS"
  | "Portfolio"
  | "Agency"
  | "Restaurant"
  | "Startup"
  | "Ecommerce"
  | "AI Tool"
  | "Gym";

export type WebsiteStyle =
  | "Modern"
  | "Minimal"
  | "Dark"
  | "Luxury"
  | "Glassmorphism"
  | "Corporate"
  | "Neon";

export type ColorTheme =
  | "Electric Indigo"
  | "Emerald Slate"
  | "Sunset Amber"
  | "Rose Quartz"
  | "Cyberpunk Neon"
  | "Monochrome Minimal"
  | "Ocean Azure"
  | "Royal Purple";

export type SectionType =
  | "Hero"
  | "Features"
  | "About"
  | "Pricing"
  | "Testimonials"
  | "FAQ"
  | "Contact"
  | "CTA"
  | "Footer";

export type AnimationPreference = "None" | "Subtle" | "Modern";

export interface ColorPaletteConfig {
  name: ColorTheme;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  border: string;
}

export interface SectionContent {
  id: string;
  type: SectionType;
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl?: string;
  imageAlt?: string;
  items?: Array<{
    id?: string;
    title?: string;
    description?: string;
    icon?: string;
    price?: string;
    period?: string;
    popular?: boolean;
    features?: string[];
    author?: string;
    role?: string;
    avatar?: string;
    rating?: number;
    question?: string;
    answer?: string;
    buttonText?: string;
    link?: string;
  }>;
  customStyles?: {
    backgroundColor?: string;
    textColor?: string;
    paddingY?: "small" | "medium" | "large" | "xlarge";
    textAlign?: "left" | "center" | "right";
  };
}

export interface WebsiteTheme {
  colorTheme: ColorTheme;
  customPalette?: Partial<ColorPaletteConfig>;
  fontFamily: "Inter" | "Outfit" | "Playfair Display" | "Plus Jakarta Sans" | "Space Grotesk";
  borderRadius: "none" | "sm" | "md" | "lg" | "full";
  animation: AnimationPreference;
  style: WebsiteStyle;
}

export interface WebsiteData {
  businessName: string;
  tagline: string;
  description: string;
  targetAudience: string;
  websiteType: WebsiteType;
  theme: WebsiteTheme;
  sections: SectionContent[];
  seo: {
    title: string;
    metaDescription: string;
    ogImage?: string;
    keywords?: string[];
  };
}

export interface CustomDomainConfig {
  domain: string;
  verified: boolean;
  status: "pending" | "verified" | "invalid" | "failed";
  recordType: "CNAME" | "A";
  expectedTarget: string;
  verificationToken: string;
  sslActive: boolean;
  sslStatus: "active" | "provisioning" | "pending";
  configuredAt: string;
  lastCheckedAt?: string;
  dnsDiagnostics?: {
    foundRecords: string[];
    message: string;
  };
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  slug: string;
  isPublished: boolean;
  publishedAt?: string;
  status: "draft" | "published" | "archived";
  websiteData: WebsiteData;
  templateId?: string;
  customDomain?: CustomDomainConfig;
  analytics: {
    totalViews: number;
    uniqueVisitors: number;
    devices: {
      desktop: number;
      mobile: number;
      tablet: number;
    };
    referrers: Record<string, number>;
    dailyViews: Array<{ date: string; views: number; visitors: number }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "user" | "admin";
  subscriptionTier: "free" | "pro" | "business";
  credits: number;
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  category: WebsiteType;
  description: string;
  style: WebsiteStyle;
  thumbnailUrl: string;
  websiteData: WebsiteData;
}

export interface GenerationPromptInput {
  websiteType: WebsiteType;
  businessName: string;
  businessDescription: string;
  targetAudience: string;
  websiteStyle: WebsiteStyle;
  colorTheme: ColorTheme;
  requiredSections: SectionType[];
  animationPreference: AnimationPreference;
}

export interface AIReadingInput {
  content: string;
  title?: string;
  readingMode?: "comprehensive" | "executive" | "critical" | "simplified";
  readingFocus?: "key-insights" | "thematic" | "action-items" | "general";
}

export interface AIReadingKeyTheme {
  title: string;
  tag: string;
  summary: string;
  significance: "Core" | "High" | "Medium" | "Strategic";
}

export interface AIReadingAnalysisSection {
  heading: string;
  body: string;
  keyPoints?: string[];
}

export interface AIReadingResult {
  id: string;
  title: string;
  readingMode: string;
  createdAt: string;
  metrics: {
    wordCount: number;
    characterCount: number;
    estimatedReadTimeMinutes: number;
    readingComplexity: "Accessible" | "Intermediate" | "Advanced" | "Specialized";
    sentimentTone: string;
  };
  executiveSummary: string;
  keyThemes: AIReadingKeyTheme[];
  inDepthAnalysis: AIReadingAnalysisSection[];
  actionableTakeaways: string[];
  criticalPerspectives: string[];
}
