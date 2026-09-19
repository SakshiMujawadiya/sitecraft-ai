"use client";

import React, { useState } from "react";
import { WebsiteData, SectionContent, ColorTheme, WebsiteStyle } from "@/lib/types";
import {
  Sparkles,
  ArrowRight,
  Check,
  ChevronDown,
  Star,
  ExternalLink,
  Shield,
  Zap,
  Layers,
  Cpu,
  TrendingUp,
  Activity,
  Users,
  BarChart3,
  Globe,
  Mail,
  PieChart,
  Bell,
  Code,
  Target,
  Layout,
  Sun,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

interface WebsiteRendererProps {
  data: WebsiteData;
  isEditable?: boolean;
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  PieChart: <PieChart className="w-5 h-5" />,
  Bell: <Bell className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Layout: <Layout className="w-5 h-5" />,
  Sun: <Sun className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5" />,
};

export default function WebsiteRenderer({
  data,
  isEditable = false,
  selectedSectionId = null,
  onSelectSection,
}: WebsiteRendererProps) {
  const [faqOpen, setFaqOpen] = useState<Record<string, boolean>>({ "0": true });

  const theme = data.theme;
  const colorTheme = theme.colorTheme || "Electric Indigo";
  const style = theme.style || "Modern";

  // Dynamic Theme Styling Tokens
  const getThemeColors = (name: ColorTheme) => {
    switch (name) {
      case "Emerald Slate":
        return {
          bg: "#022c22",
          surface: "#064e3b",
          surfaceHover: "#065f46",
          primary: "#10b981",
          primaryHover: "#059669",
          accent: "#3b82f6",
          text: "#ecfdf5",
          muted: "#a7f3d0",
          border: "#047857",
        };
      case "Sunset Amber":
        return {
          bg: "#0c0a09",
          surface: "#1c1917",
          surfaceHover: "#292524",
          primary: "#f59e0b",
          primaryHover: "#d97706",
          accent: "#ef4444",
          text: "#fafaf9",
          muted: "#a8a29e",
          border: "#292524",
        };
      case "Rose Quartz":
        return {
          bg: "#0f0d11",
          surface: "#1f1b24",
          surfaceHover: "#2b2533",
          primary: "#f43f5e",
          primaryHover: "#e11d48",
          accent: "#fb7185",
          text: "#fff1f2",
          muted: "#fda4af",
          border: "#362e3d",
        };
      case "Cyberpunk Neon":
        return {
          bg: "#050814",
          surface: "#0e1529",
          surfaceHover: "#172242",
          primary: "#06b6d4",
          primaryHover: "#0891b2",
          accent: "#ec4899",
          text: "#f0fdf4",
          muted: "#94a3b8",
          border: "#1e293b",
        };
      case "Monochrome Minimal":
        return {
          bg: "#000000",
          surface: "#111111",
          surfaceHover: "#1a1a1a",
          primary: "#ffffff",
          primaryHover: "#e2e8f0",
          accent: "#71717a",
          text: "#ffffff",
          muted: "#a1a1aa",
          border: "#27272a",
        };
      case "Ocean Azure":
        return {
          bg: "#081325",
          surface: "#0f1f38",
          surfaceHover: "#172e54",
          primary: "#0284c7",
          primaryHover: "#0369a1",
          accent: "#38bdf8",
          text: "#f0f9ff",
          muted: "#7dd3fc",
          border: "#1e3a5f",
        };
      case "Royal Purple":
        return {
          bg: "#0b0616",
          surface: "#170e2c",
          surfaceHover: "#231542",
          primary: "#9333ea",
          primaryHover: "#7e22ce",
          accent: "#c084fc",
          text: "#faf5ff",
          muted: "#d8b4fe",
          border: "#2c1d4d",
        };
      case "Electric Indigo":
      default:
        return {
          bg: "#09090b",
          surface: "#18181b",
          surfaceHover: "#27272a",
          primary: "#6366f1",
          primaryHover: "#4f46e5",
          accent: "#a855f7",
          text: "#fafafa",
          muted: "#a1a1aa",
          border: "#27272a",
        };
    }
  };

  const colors = getThemeColors(colorTheme);

  const getBorderRadius = () => {
    switch (theme.borderRadius) {
      case "none":
        return "rounded-none";
      case "sm":
        return "rounded-sm";
      case "lg":
        return "rounded-2xl";
      case "full":
        return "rounded-full";
      case "md":
      default:
        return "rounded-xl";
    }
  };

  const getFontClass = () => {
    switch (theme.fontFamily) {
      case "Space Grotesk":
        return "font-mono";
      case "Playfair Display":
        return "font-serif";
      case "Outfit":
      case "Plus Jakarta Sans":
      case "Inter":
      default:
        return "font-sans";
    }
  };

  const toggleFaq = (idx: string) => {
    setFaqOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${getFontClass()}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {/* Top Navbar Component */}
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md px-6 py-4 flex items-center justify-between transition-all"
        style={{
          borderColor: colors.border,
          backgroundColor: `${colors.bg}cc`,
        }}
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg"
            style={{ backgroundColor: colors.primary }}
          >
            {data.businessName ? data.businessName.charAt(0).toUpperCase() : "A"}
          </div>
          <span className="font-bold text-lg tracking-tight">{data.businessName || "Landing Page"}</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium" style={{ color: colors.muted }}>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center space-x-3">
          <a
            href="#pricing"
            className={`px-4 py-2 text-sm font-semibold transition-all shadow-md active:scale-95 ${getBorderRadius()}`}
            style={{
              backgroundColor: colors.primary,
              color: "#ffffff",
            }}
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Sections Container */}
      <main className="flex flex-col">
        {data.sections.map((section, idx) => {
          const isSelected = selectedSectionId === section.id;
          const sectionClasses = `relative transition-all duration-200 ${
            isEditable ? "cursor-pointer group hover:ring-2 hover:ring-indigo-500/60" : ""
          } ${isSelected ? "ring-2 ring-indigo-500 shadow-2xl z-10" : ""}`;

          return (
            <div
              key={section.id || `sec-${idx}`}
              onClick={() => isEditable && onSelectSection?.(section.id)}
              className={sectionClasses}
            >
              {/* Editable badge indicator */}
              {isEditable && (
                <div className="absolute top-3 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600/90 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-md backdrop-blur-sm pointer-events-none">
                  {section.type} Section • Click to edit
                </div>
              )}

              {/* Render by Section Type */}
              {section.type === "Hero" && renderHero(section, colors, getBorderRadius(), style, data.websiteType, data.businessName)}
              {section.type === "Features" && renderFeatures(section, colors, getBorderRadius(), style, data.websiteType)}
              {section.type === "About" && renderAbout(section, colors, getBorderRadius())}
              {section.type === "Testimonials" && renderTestimonials(section, colors, getBorderRadius())}
              {section.type === "Pricing" && renderPricing(section, colors, getBorderRadius())}
              {section.type === "FAQ" && renderFAQ(section, colors, getBorderRadius(), faqOpen, toggleFaq)}
              {section.type === "CTA" && renderCTA(section, colors, getBorderRadius())}
              {section.type === "Contact" && renderContact(section, colors, getBorderRadius())}
              {section.type === "Footer" && renderFooter(section, colors, data.businessName)}
            </div>
          );
        })}
      </main>
    </div>
  );
}

/* ================= SAFE IMAGE COMPONENT ================= */

function SafeImage({
  src,
  alt,
  className,
  fallback = "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900&auto=format&fit=crop&q=80",
}: {
  src?: string;
  alt: string;
  className?: string;
  fallback?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [failed, setFailed] = useState(false);

  React.useEffect(() => {
    setImgSrc(src || fallback);
    setFailed(false);
  }, [src, fallback]);

  return (
    <img
      src={failed ? fallback : imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (!failed) {
          setFailed(true);
          setImgSrc(fallback);
        }
      }}
      loading="lazy"
    />
  );
}

/* ================= SECTION RENDERERS ================= */

function renderHero(
  section: SectionContent,
  colors: any,
  radius: string,
  style: WebsiteStyle,
  websiteType?: string,
  businessName?: string
) {
  // 1. MINIMAL & LUXURY & PORTFOLIO: Editorial Asymmetric Hero
  if (style === "Minimal" || style === "Luxury" || websiteType === "Portfolio") {
    return (
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 md:py-36 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {section.badge && (
              <div
                className="inline-flex items-center space-x-2 px-3 py-1 mb-6 text-xs font-semibold tracking-widest uppercase border border-current/20"
                style={{ color: colors.primary }}
              >
                <span>— {section.badge}</span>
              </div>
            )}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.08] break-words">
              {section.title || `Crafting the Future with ${businessName}`}
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-light mb-8 max-w-xl leading-relaxed break-words" style={{ color: colors.muted }}>
              {section.subtitle || "Thoughtful aesthetics, intentional typography, and timeless digital execution."}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              {section.ctaText && (
                <a
                  href={section.ctaLink || "#contact"}
                  className={`inline-flex items-center space-x-2 px-7 py-3.5 text-sm font-semibold tracking-wide transition-all shadow-md active:scale-95 ${radius}`}
                  style={{ backgroundColor: colors.primary, color: "#ffffff" }}
                >
                  <span>{section.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
              {section.secondaryCtaText && (
                <a
                  href={section.secondaryCtaLink || "#work"}
                  className={`inline-flex items-center space-x-2 px-6 py-3.5 text-sm font-medium border transition-all hover:bg-white/5 active:scale-95 ${radius}`}
                  style={{ borderColor: colors.border, color: colors.text }}
                >
                  <span>{section.secondaryCtaText}</span>
                </a>
              )}
            </div>

            {section.items && section.items.length > 0 && (
              <div className="flex flex-wrap gap-8 pt-8 border-t w-full" style={{ borderColor: `${colors.border}80` }}>
                {section.items.map((stat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-2xl sm:text-3xl font-extrabold" style={{ color: colors.primary }}>
                      {stat.title}
                    </span>
                    <span className="text-xs uppercase tracking-wider font-medium mt-0.5" style={{ color: colors.muted }}>
                      {stat.description}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 relative">
            <div
              className={`relative overflow-hidden border shadow-2xl aspect-[4/5] w-full group ${radius}`}
              style={{ borderColor: colors.border, backgroundColor: colors.surface }}
            >
              <SafeImage
                src={section.imageUrl || "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&auto=format&fit=crop&q=80"}
                alt={section.imageAlt || "Featured visual"}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-xs flex items-center justify-between">
                <span className="font-mono text-zinc-300">Selected Works & Systems</span>
                <span className="font-mono text-amber-400 font-bold">2026 Edition</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 2. NEON & DARK & AI TOOL: Cyber Spotlight Hero with Prompt Command Bar
  if (style === "Neon" || style === "Dark" || websiteType === "AI Tool") {
    return (
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 md:py-36 overflow-hidden">
        {/* Neon glowing backlights */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[170px] opacity-35 pointer-events-none"
          style={{ backgroundColor: colors.primary }}
        />

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          {section.badge && (
            <div
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 mb-6 text-xs font-mono font-bold tracking-wider uppercase rounded-full border shadow-[0_0_15px_rgba(99,102,241,0.25)] backdrop-blur-md"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
                backgroundColor: `${colors.surface}90`,
              }}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{section.badge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-[1.1] break-words">
            {section.title || `Empower Your Vision with ${businessName}`}
          </h1>

          <p className="text-base sm:text-lg md:text-xl font-normal mb-8 max-w-2xl leading-relaxed break-words" style={{ color: colors.muted }}>
            {section.subtitle || "The modern generative platform engineered for unmatched speed, flexibility, and creative freedom."}
          </p>

          {/* Interactive Prompt / CLI Simulation Bar */}
          <div
            className={`w-full max-w-2xl p-2 sm:p-2.5 mb-8 border backdrop-blur-xl flex items-center justify-between shadow-2xl ${radius}`}
            style={{
              borderColor: `${colors.primary}60`,
              backgroundColor: `${colors.surface}95`,
            }}
          >
            <div className="flex items-center space-x-3 px-3 overflow-hidden text-left">
              <span className="font-mono text-xs text-indigo-400 font-bold shrink-0">&gt;_</span>
              <span className="font-mono text-xs sm:text-sm truncate" style={{ color: colors.muted }}>
                model.generate("{businessName?.toLowerCase() || "sitecraft"}", mode="ultra-speed")
              </span>
            </div>
            <a
              href={section.ctaLink || "#pricing"}
              className={`shrink-0 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-95 ${radius}`}
              style={{ backgroundColor: colors.primary, color: "#ffffff" }}
            >
              Run Prompt
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 w-full sm:w-auto">
            {section.ctaText && (
              <a
                href={section.ctaLink || "#pricing"}
                className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 text-base font-bold shadow-xl active:scale-95 transition-all ${radius}`}
                style={{ backgroundColor: colors.primary, color: "#ffffff" }}
              >
                <span>{section.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
            {section.secondaryCtaText && (
              <a
                href={section.secondaryCtaLink || "#features"}
                className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 text-base font-semibold border transition-all hover:bg-white/5 active:scale-95 ${radius}`}
                style={{ borderColor: colors.border, color: colors.text }}
              >
                <span>{section.secondaryCtaText}</span>
              </a>
            )}
          </div>

          {/* Stats Badges Row */}
          {section.items && section.items.length > 0 && (
            <div
              className={`grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 border backdrop-blur-md mb-12 max-w-3xl w-full shadow-2xl ${radius}`}
              style={{
                borderColor: `${colors.border}`,
                backgroundColor: `${colors.surface}80`,
              }}
            >
              {section.items.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-2xl md:text-3xl font-black" style={{ color: colors.primary }}>
                    {stat.title}
                  </span>
                  <span className="text-xs md:text-sm font-medium mt-1 text-center" style={{ color: colors.muted }}>
                    {stat.description}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Large Screen Visual with Glowing Neon Border */}
          {section.imageUrl && (
            <div
              className={`w-full max-w-5xl p-2 sm:p-3 border shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden group ${radius}`}
              style={{
                borderColor: `${colors.primary}50`,
                backgroundColor: colors.surface,
              }}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-zinc-950">
                <SafeImage
                  src={section.imageUrl}
                  alt={section.imageAlt || "Showcase visual"}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // 3. RESTAURANT & GYM & ECOMMERCE & AGENCY: Immersive Visual Banner Hero
  if (
    websiteType === "Restaurant" ||
    websiteType === "Gym" ||
    websiteType === "Ecommerce" ||
    websiteType === "Agency"
  ) {
    return (
      <section className="relative min-h-[85vh] sm:min-h-[88vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {/* Full-bleed background image with dark vignette */}
        <div className="absolute inset-0 z-0">
          <SafeImage
            src={section.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80"}
            alt="Hero background"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-zinc-950/60" />
        </div>

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          {section.badge && (
            <div
              className="inline-flex items-center space-x-2 px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest rounded-full border shadow-lg backdrop-blur-md"
              style={{
                borderColor: `${colors.primary}90`,
                backgroundColor: "rgba(0,0,0,0.65)",
                color: colors.primary,
              }}
            >
              <span>{section.badge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl text-white leading-[1.1] drop-shadow-lg break-words">
            {section.title || `Welcome to ${businessName}`}
          </h1>

          <p className="text-base sm:text-lg md:text-xl font-normal mb-10 max-w-2xl text-zinc-300 leading-relaxed drop-shadow break-words">
            {section.subtitle || "An extraordinary standard of excellence, designed for those who settle for nothing less than the best."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 w-full sm:w-auto">
            {section.ctaText && (
              <a
                href={section.ctaLink || "#pricing"}
                className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 text-base font-bold shadow-2xl active:scale-95 transition-all ${radius}`}
                style={{ backgroundColor: colors.primary, color: "#ffffff" }}
              >
                <span>{section.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
            {section.secondaryCtaText && (
              <a
                href={section.secondaryCtaLink || "#features"}
                className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 text-base font-semibold border backdrop-blur-md bg-black/40 hover:bg-black/60 active:scale-95 transition-all ${radius}`}
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "#ffffff" }}
              >
                <span>{section.secondaryCtaText}</span>
              </a>
            )}
          </div>

          {section.items && section.items.length > 0 && (
            <div
              className={`grid grid-cols-2 md:grid-cols-3 gap-6 p-5 sm:p-7 border backdrop-blur-xl bg-black/50 max-w-3xl w-full shadow-2xl ${radius}`}
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
            >
              {section.items.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-extrabold" style={{ color: colors.primary }}>
                    {stat.title}
                  </span>
                  <span className="text-xs sm:text-sm text-zinc-300 font-medium mt-1 text-center">
                    {stat.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // 4. MODERN & GLASSMORPHISM & SAAS & STARTUP: High-Conversion Split Hero with Interactive App Mockup & Floating Glass Badges
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32 overflow-hidden">
      {/* Glow Backdrop */}
      <div
        className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[140px] opacity-25 pointer-events-none"
        style={{ backgroundColor: colors.primary }}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center relative z-10">
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          {section.badge && (
            <div
              className={`inline-flex items-center space-x-2 px-3.5 py-1.5 mb-6 text-xs font-semibold uppercase tracking-wider border shadow-sm ${radius}`}
              style={{
                borderColor: colors.border,
                color: colors.primary,
                backgroundColor: `${colors.surface}90`,
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: colors.primary }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: colors.primary }} />
              </span>
              <span>{section.badge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 leading-[1.12] break-words">
            {section.title || `Scale Seamlessly With ${businessName}`}
          </h1>

          <p className="text-base sm:text-lg mb-8 leading-relaxed break-words" style={{ color: colors.muted }}>
            {section.subtitle || "The modern operational platform built for high-growth teams. Accelerate performance and simplify execution."}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-8 w-full sm:w-auto">
            {section.ctaText && (
              <a
                href={section.ctaLink || "#pricing"}
                className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 text-base font-bold shadow-xl active:scale-95 transition-all ${radius}`}
                style={{ backgroundColor: colors.primary, color: "#ffffff" }}
              >
                <span>{section.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
            {section.secondaryCtaText && (
              <a
                href={section.secondaryCtaLink || "#features"}
                className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 text-base font-semibold border transition-all hover:bg-white/5 active:scale-95 ${radius}`}
                style={{ borderColor: colors.border, color: colors.text }}
              >
                <span>{section.secondaryCtaText}</span>
              </a>
            )}
          </div>

          {/* Social Proof Trust Stack */}
          <div className="flex items-center space-x-3 pt-4 border-t w-full" style={{ borderColor: `${colors.border}70` }}>
            <div className="flex -space-x-2 overflow-hidden">
              <img className="inline-block h-7 w-7 rounded-full ring-2 ring-zinc-950 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80" alt="Customer" />
              <img className="inline-block h-7 w-7 rounded-full ring-2 ring-zinc-950 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80" alt="Customer" />
              <img className="inline-block h-7 w-7 rounded-full ring-2 ring-zinc-950 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80" alt="Customer" />
              <img className="inline-block h-7 w-7 rounded-full ring-2 ring-zinc-950 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80" alt="Customer" />
            </div>
            <span className="text-xs font-medium" style={{ color: colors.muted }}>
              Trusted by <strong className="text-white">12,000+</strong> leaders worldwide
            </span>
          </div>
        </div>

        {/* Right column: Interactive Application Window Mockup with Floating Glass Cards */}
        <div className="lg:col-span-6 relative">
          <div
            className={`p-2.5 sm:p-3 border shadow-2xl relative overflow-hidden group ${radius}`}
            style={{ borderColor: colors.border, backgroundColor: colors.surface }}
          >
            {/* macOS window top bar */}
            <div className="flex items-center space-x-2 px-3 py-2 border-b mb-2" style={{ borderColor: `${colors.border}80` }}>
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <div className="ml-4 flex-1 bg-black/40 rounded px-2.5 py-0.5 text-[10px] font-mono truncate" style={{ color: colors.muted }}>
                https://{businessName ? businessName.toLowerCase().replace(/[^a-z0-9]/g, "") : "preview"}.app
              </div>
            </div>

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-zinc-950">
              <SafeImage
                src={section.imageUrl || "https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&auto=format&fit=crop&q=80"}
                alt={section.imageAlt || "Platform Dashboard Preview"}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Floating Glass Micro-Badge 1 */}
            <div className="absolute top-12 right-6 bg-black/75 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg shadow-xl hidden sm:flex items-center space-x-2">
              <span className="text-emerald-400 font-mono font-bold text-xs">▲ 99.99%</span>
              <span className="text-zinc-300 text-[11px] font-medium">Uptime SLA</span>
            </div>

            {/* Floating Glass Micro-Badge 2 */}
            <div className="absolute bottom-6 left-6 bg-black/75 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg shadow-xl hidden sm:flex items-center space-x-2">
              <span className="text-indigo-400 font-mono font-bold text-xs">⚡ 10x</span>
              <span className="text-zinc-300 text-[11px] font-medium">Faster Output</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function renderFeatures(
  section: SectionContent,
  colors: any,
  radius: string,
  style: WebsiteStyle,
  websiteType?: string
) {
  const items = section.items || [];

  // BENTO GRID LAYOUT for Modern, Glassmorphism, SaaS, and AI Tool
  if (style === "Modern" || style === "Glassmorphism" || websiteType === "SaaS" || websiteType === "AI Tool") {
    return (
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
            {section.badge && (
              <span
                className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block"
                style={{
                  borderColor: colors.border,
                  color: colors.primary,
                  backgroundColor: `${colors.surface}60`,
                }}
              >
                {section.badge}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 break-words">
              {section.title || "Engineered for Unmatched Precision"}
            </h2>
            <p className="text-base md:text-lg break-words" style={{ color: colors.muted }}>
              {section.subtitle || "Every capability built to give you a definitive competitive advantage."}
            </p>
          </div>

          {/* Bento Grid: 1st card is large 2-span */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((feat, idx) => {
              const isFirst = idx === 0;
              return (
                <div
                  key={feat.id || idx}
                  className={`p-6 sm:p-8 border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col justify-between break-words ${
                    isFirst ? "md:col-span-2 lg:col-span-2" : ""
                  } ${radius}`}
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {ICON_MAP[feat.icon || "Sparkles"] || <Sparkles className="w-5 h-5" />}
                      </div>
                      {isFirst && (
                        <span
                          className="text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border"
                          style={{ borderColor: colors.primary, color: colors.primary }}
                        >
                          Featured Flagship
                        </span>
                      )}
                    </div>
                    <h3 className={`font-bold mb-2.5 break-words ${isFirst ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}>
                      {feat.title}
                    </h3>
                    <p className={`leading-relaxed break-words ${isFirst ? "text-sm sm:text-base max-w-xl" : "text-sm"}`} style={{ color: colors.muted }}>
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // NUMBERED EDITORIAL LIST for Minimal & Luxury & Portfolio
  if (style === "Minimal" || style === "Luxury" || websiteType === "Portfolio") {
    return (
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 max-w-2xl">
            {section.badge && (
              <span className="text-xs font-semibold tracking-widest uppercase mb-3 block" style={{ color: colors.primary }}>
                — {section.badge}
              </span>
            )}
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 break-words">
              {section.title || "Disciplines & Core Focus"}
            </h2>
            <p className="text-base break-words" style={{ color: colors.muted }}>
              {section.subtitle || "A rigorous approach to design, engineering, and digital systems."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((feat, idx) => (
              <div
                key={feat.id || idx}
                className="border-t pt-6 flex flex-col justify-between"
                style={{ borderColor: colors.border }}
              >
                <div>
                  <span className="font-mono text-xs font-bold mb-3 block" style={{ color: colors.primary }}>
                    0{idx + 1}
                  </span>
                  <h3 className="text-lg font-bold mb-2 break-words">{feat.title}</h3>
                  <p className="text-sm leading-relaxed break-words" style={{ color: colors.muted }}>
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // STANDARD ICON GRID for other styles
  const gridCols =
    items.length === 2 || items.length === 4
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section id="features" className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t" style={{ borderColor: colors.border }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          {section.badge && (
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block"
              style={{
                borderColor: colors.border,
                color: colors.primary,
                backgroundColor: `${colors.surface}60`,
              }}
            >
              {section.badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 break-words">
            {section.title || "Powerful Capabilities Built for Scale"}
          </h2>
          <p className="text-base md:text-lg break-words" style={{ color: colors.muted }}>
            {section.subtitle || "Designed to provide unparalleled speed, flexibility, and performance."}
          </p>
        </div>

        <div className={`grid ${gridCols} gap-6`}>
          {items.map((feat, idx) => (
            <div
              key={feat.id || idx}
              className={`p-6 sm:p-7 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col justify-between break-words ${radius}`}
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white shadow-md shrink-0"
                  style={{ backgroundColor: colors.primary }}
                >
                  {ICON_MAP[feat.icon || "Sparkles"] || <Sparkles className="w-5 h-5" />}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2.5 break-words">{feat.title}</h3>
                <p className="text-sm leading-relaxed break-words" style={{ color: colors.muted }}>
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderAbout(section: SectionContent, colors: any, radius: string) {
  return (
    <section id="about" className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t" style={{ borderColor: colors.border }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        <div>
          {section.badge && (
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block"
              style={{
                borderColor: colors.border,
                color: colors.primary,
                backgroundColor: `${colors.surface}60`,
              }}
            >
              {section.badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-5 break-words">
            {section.title || "Our Mission & Vision"}
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-8 break-words" style={{ color: colors.muted }}>
            {section.description || "We are dedicated to building modern tools that transform creative work."}
          </p>

          {section.items && section.items.length > 0 && (
            <div className="space-y-4">
              {section.items.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="break-words">
                    <h4 className="font-semibold text-sm sm:text-base">{item.title}</h4>
                    <p className="text-xs sm:text-sm mt-0.5" style={{ color: colors.muted }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {section.imageUrl && (
          <div className="relative w-full">
            <div
              className={`overflow-hidden border shadow-2xl aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full bg-zinc-950 ${radius}`}
              style={{ borderColor: colors.border, backgroundColor: colors.surface }}
            >
              <SafeImage
                src={section.imageUrl}
                alt={section.imageAlt || "About visual"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function renderTestimonials(section: SectionContent, colors: any, radius: string) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t" style={{ borderColor: colors.border }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          {section.badge && (
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block"
              style={{
                borderColor: colors.border,
                color: colors.primary,
                backgroundColor: `${colors.surface}60`,
              }}
            >
              {section.badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 break-words">
            {section.title || "Loved by Forward-Thinking Teams"}
          </h2>
          <p className="text-base md:text-lg break-words" style={{ color: colors.muted }}>
            {section.subtitle || "See what our customers have to say about their experience."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(section.items || []).map((test, idx) => (
            <div
              key={test.id || idx}
              className={`p-6 sm:p-7 border flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1 break-words ${radius}`}
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <div>
                <div className="flex items-center space-x-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm md:text-base leading-relaxed mb-6 italic break-words" style={{ color: colors.text }}>
                  "{test.description}"
                </p>
              </div>

              <div className="flex items-center space-x-3.5 pt-4 border-t" style={{ borderColor: colors.border }}>
                {test.avatar ? (
                  <SafeImage
                    src={test.avatar}
                    alt={test.author || "User"}
                    className="w-10 h-10 rounded-full object-cover border shrink-0"
                    fallback={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(test.author || "user")}`}
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {(test.author || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="break-words">
                  <h4 className="font-bold text-sm">{test.author}</h4>
                  <p className="text-xs" style={{ color: colors.muted }}>
                    {test.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderPricing(section: SectionContent, colors: any, radius: string) {
  const plans = section.items || [];
  const gridClass =
    plans.length === 2
      ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t" style={{ borderColor: colors.border }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          {section.badge && (
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block"
              style={{
                borderColor: colors.border,
                color: colors.primary,
                backgroundColor: `${colors.surface}60`,
              }}
            >
              {section.badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 break-words">
            {section.title || "Transparent, Predictable Plans"}
          </h2>
          <p className="text-base md:text-lg break-words" style={{ color: colors.muted }}>
            {section.subtitle || "No hidden fees. Start free and scale as you grow."}
          </p>
        </div>

        <div className={`grid ${gridClass} gap-8 items-stretch`}>
          {plans.map((plan, idx) => (
            <div
              key={plan.id || idx}
              className={`relative p-6 sm:p-8 border flex flex-col justify-between h-full transition-all duration-300 break-words ${
                plan.popular ? "ring-2 shadow-2xl scale-[1.02] z-10" : "hover:-translate-y-1"
              } ${radius}`}
              style={{
                borderColor: plan.popular ? colors.primary : colors.border,
                backgroundColor: colors.surface,
              }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md"
                  style={{ backgroundColor: colors.primary }}
                >
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold mb-2 break-words">{plan.title}</h3>
                <p className="text-xs mb-6 break-words" style={{ color: colors.muted }}>
                  {plan.description}
                </p>

                <div className="flex items-baseline mb-6 break-words">
                  <span className="text-3xl sm:text-4xl font-black">{plan.price}</span>
                  <span className="text-sm ml-1" style={{ color: colors.muted }}>
                    {plan.period || "/month"}
                  </span>
                </div>

                <div className="flex-1 space-y-3 mb-8">
                  {(plan.features || []).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start space-x-2.5 text-sm">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: colors.primary }} />
                      <span className="break-words">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={plan.link || "#"}
                className={`w-full py-3 px-4 text-center font-bold text-sm transition-all shadow-md active:scale-95 ${radius}`}
                style={{
                  backgroundColor: plan.popular ? colors.primary : "transparent",
                  border: plan.popular ? "none" : `1px solid ${colors.border}`,
                  color: plan.popular ? "#ffffff" : colors.text,
                }}
              >
                {plan.buttonText || "Choose Plan"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderFAQ(
  section: SectionContent,
  colors: any,
  radius: string,
  faqOpen: Record<string, boolean>,
  toggleFaq: (idx: string) => void
) {
  return (
    <section id="faq" className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t" style={{ borderColor: colors.border }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14 md:mb-16">
          {section.badge && (
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block"
              style={{
                borderColor: colors.border,
                color: colors.primary,
                backgroundColor: `${colors.surface}60`,
              }}
            >
              {section.badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 break-words">
            {section.title || "Frequently Asked Questions"}
          </h2>
          <p className="text-base break-words" style={{ color: colors.muted }}>
            {section.subtitle || "Have questions? We have answers."}
          </p>
        </div>

        <div className="space-y-4">
          {(section.items || []).map((faq, idx) => {
            const isOpen = Boolean(faqOpen[idx.toString()]);
            return (
              <div
                key={faq.id || idx}
                className={`border overflow-hidden transition-colors ${radius}`}
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx.toString())}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-5 text-left font-semibold flex items-center justify-between transition-colors hover:bg-white/5 cursor-pointer"
                >
                  <span className="text-sm sm:text-base pr-4 break-words">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    style={{ color: colors.primary }}
                  />
                </button>
                {isOpen && (
                  <div
                    className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm leading-relaxed border-t pt-4 break-words"
                    style={{ borderColor: `${colors.border}80`, color: colors.muted }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function renderCTA(section: SectionContent, colors: any, radius: string) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t relative overflow-hidden" style={{ borderColor: colors.border }}>
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.primary} 0%, transparent 60%)`,
        }}
      />
      <div
        className={`max-w-4xl mx-auto p-8 sm:p-12 md:p-16 text-center border shadow-2xl relative z-10 break-words ${radius}`}
        style={{
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        {section.badge && (
          <span
            className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block"
            style={{
              borderColor: colors.border,
              color: colors.primary,
              backgroundColor: `${colors.bg}80`,
            }}
          >
            {section.badge}
          </span>
        )}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-5 break-words">
          {section.title || "Ready to Transform Your Workflow?"}
        </h2>
        <p className="text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-8 break-words" style={{ color: colors.muted }}>
          {section.subtitle || "Start your 14-day free trial today. No credit card required."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={section.ctaLink || "#pricing"}
            className={`w-full sm:w-auto px-8 py-3.5 text-base font-bold shadow-xl active:scale-95 transition-all text-center ${radius}`}
            style={{
              backgroundColor: colors.primary,
              color: "#ffffff",
            }}
          >
            {section.ctaText || "Get Started Now"}
          </a>
          {section.secondaryCtaText && (
            <a
              href={section.secondaryCtaLink || "#contact"}
              className={`w-full sm:w-auto px-8 py-3.5 text-base font-semibold border hover:bg-white/5 active:scale-95 transition-all text-center ${radius}`}
              style={{
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              {section.secondaryCtaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function renderContact(section: SectionContent, colors: any, radius: string) {
  return (
    <section id="contact" className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t" style={{ borderColor: colors.border }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          {section.badge && (
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block"
              style={{
                borderColor: colors.border,
                color: colors.primary,
                backgroundColor: `${colors.surface}60`,
              }}
            >
              {section.badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 break-words">
            {section.title || "Get in Touch"}
          </h2>
          <p className="text-base break-words" style={{ color: colors.muted }}>
            {section.subtitle || "We would love to hear from you."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(section.items || []).map((item, idx) => (
            <div
              key={idx}
              className={`p-6 border text-center break-words h-full flex flex-col justify-between ${radius}`}
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <h4 className="font-bold text-base mb-2 break-words">{item.title}</h4>
              <p className="text-sm break-words" style={{ color: colors.muted }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderFooter(section: SectionContent, colors: any, fallbackName: string) {
  return (
    <footer className="px-4 sm:px-6 lg:px-8 py-12 border-t" style={{ borderColor: colors.border, backgroundColor: colors.bg }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0"
            style={{ backgroundColor: colors.primary }}
          >
            {(section.title || fallbackName || "A").charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-base break-words">{section.title || fallbackName}</span>
        </div>

        <p className="text-xs text-center sm:text-right break-words" style={{ color: colors.muted }}>
          © {new Date().getFullYear()} {section.title || fallbackName}. Powered by SiteCraft AI.
        </p>
      </div>
    </footer>
  );
}
