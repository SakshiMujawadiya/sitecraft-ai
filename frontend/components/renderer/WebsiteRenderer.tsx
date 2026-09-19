"use client";

import React, { useState } from "react";
import { WebsiteData, SectionContent, ColorTheme, WebsiteStyle, SectionType } from "@/lib/types";
import {
  Sparkles,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
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
  Play,
  HelpCircle,
  Phone,
  Award,
  Quote,
  Copy,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

interface WebsiteRendererProps {
  data: WebsiteData;
  isEditable?: boolean;
  selectedSectionId?: string | null;
  selectedElementId?: string | null;
  aiUpdatedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
  onSelectElement?: (sectionId: string, elementId: string) => void;
  onMoveSection?: (sectionId: string, direction: "up" | "down") => void;
  onDuplicateSection?: (sectionId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  onToggleVisibility?: (sectionId: string) => void;
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
  Play: <Play className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  HelpCircle: <HelpCircle className="w-5 h-5" />,
};

export default function WebsiteRenderer({
  data,
  isEditable = false,
  selectedSectionId = null,
  selectedElementId = null,
  aiUpdatedSectionId = null,
  onSelectSection,
  onSelectElement,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
  onToggleVisibility,
}: WebsiteRendererProps) {
  const [faqOpen, setFaqOpen] = useState<Record<string, boolean>>({ "0": true });

  const theme = data.theme || {
    colorTheme: "Electric Indigo",
    fontFamily: "Inter",
    borderRadius: "md",
    animation: "Modern",
    style: "Modern",
  };
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

  const baseColors = getThemeColors(colorTheme);
  const custom = theme.customPalette || {};
  const colors = {
    bg: custom.background || baseColors.bg,
    surface: custom.surface || baseColors.surface,
    surfaceHover: baseColors.surfaceHover,
    primary: custom.primary || baseColors.primary,
    primaryHover: baseColors.primaryHover,
    accent: custom.accent || baseColors.accent,
    text: custom.text || baseColors.text,
    muted: custom.mutedText || baseColors.muted,
    border: custom.border || baseColors.border,
    button: custom.button || custom.primary || baseColors.primary,
  };

  const getBorderRadius = () => {
    switch (theme.borderRadius) {
      case "none":
        return "rounded-none";
      case "sm":
        return "rounded-md";
      case "lg":
        return "rounded-2xl";
      case "full":
        return "rounded-full";
      case "md":
      default:
        return "rounded-xl";
    }
  };

  const getFontSizeStyle = () => {
    switch (theme.fontSize) {
      case "small":
        return {
          h1: "2.25rem", // 36px
          h2: "1.5rem",   // 24px
          h3: "1.25rem",  // 20px
          body: "0.875rem", // 14px
        };
      case "large":
        return {
          h1: "3.75rem", // 60px
          h2: "2.5rem",   // 40px
          h3: "1.75rem",  // 28px
          body: "1.125rem", // 18px
        };
      case "xl":
        return {
          h1: "4.5rem",  // 72px
          h2: "3rem",    // 48px
          h3: "2rem",    // 32px
          body: "1.25rem", // 20px
        };
      case "medium":
      default:
        return {
          h1: "3rem",    // 48px
          h2: "2rem",    // 32px
          h3: "1.5rem",  // 24px
          body: "1rem",   // 16px
        };
    }
  };

  const fs = getFontSizeStyle();
  const fw = theme.fontWeight || 600;

  const getFontFamilyStyle = () => {
    const f = theme.fontFamily || "Inter";
    switch (f) {
      case "Playfair Display":
        return "Georgia, Cambria, serif";
      case "Space Grotesk":
        return "'Space Grotesk', monospace";
      case "Outfit":
        return "'Outfit', sans-serif";
      case "Plus Jakarta Sans":
        return "'Plus Jakarta Sans', sans-serif";
      case "Geist":
        return "'Geist', sans-serif";
      case "Poppins":
        return "'Poppins', sans-serif";
      case "Roboto":
        return "'Roboto', sans-serif";
      case "DM Sans":
        return "'DM Sans', sans-serif";
      case "Inter":
      default:
        return "'Inter', sans-serif";
    }
  };

  const toggleFaq = (id: string) => {
    setFaqOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300 antialiased selection:bg-indigo-500/20 selection:text-indigo-200"
      style={
        {
          backgroundColor: colors.bg,
          color: colors.text,
          fontFamily: getFontFamilyStyle(),
          fontWeight: fw,
          "--site-primary": colors.primary,
          "--site-secondary": colors.accent,
          "--site-accent": colors.accent,
          "--site-bg": colors.bg,
          "--site-surface": colors.surface,
          "--site-text": colors.text,
          "--site-muted": colors.muted,
          "--site-border": colors.border,
          "--site-button": colors.button,
          "--site-h1-size": fs.h1,
          "--site-h2-size": fs.h2,
          "--site-h3-size": fs.h3,
          "--site-body-size": fs.body,
          "--site-weight": `${fw}`,
          "--site-radius":
            theme.borderRadius === "none"
              ? "0px"
              : theme.borderRadius === "sm"
              ? "6px"
              : theme.borderRadius === "lg"
              ? "20px"
              : theme.borderRadius === "full"
              ? "9999px"
              : "12px",
        } as React.CSSProperties
      }
    >
      {/* Sticky Global Navigation Bar */}
      <header
        id="canvas-header"
        onClick={(e) => {
          if (isEditable) {
            e.stopPropagation();
            onSelectSection?.("header");
          }
        }}
        className={`sticky top-0 z-30 border-b backdrop-blur-xl transition-all ${
          isEditable ? "cursor-pointer group hover:ring-2 hover:ring-indigo-500/60" : ""
        } ${selectedSectionId === "header" ? "ring-2 ring-indigo-500 shadow-2xl z-40" : ""}`}
        style={{
          borderColor: colors.border,
          backgroundColor: `${colors.bg}e6`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 flex items-center justify-center font-bold text-white shadow-lg shrink-0 ${getBorderRadius()}`}
              style={{
                backgroundColor: colors.primary,
              }}
            >
              {(data.businessName || "Site").charAt(0).toUpperCase()}
            </div>
            <span className="font-bold text-lg tracking-tight break-words">{data.businessName || "SiteCraft"}</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#features" className="hover:opacity-80 transition-opacity" style={{ color: colors.muted }}>
              Features
            </a>
            <a href="#pricing" className="hover:opacity-80 transition-opacity" style={{ color: colors.muted }}>
              Pricing
            </a>
            <a href="#testimonials" className="hover:opacity-80 transition-opacity" style={{ color: colors.muted }}>
              Testimonials
            </a>
            <a href="#faq" className="hover:opacity-80 transition-opacity" style={{ color: colors.muted }}>
              FAQ
            </a>
          </nav>

          <a
            href="#pricing"
            className={`px-4 py-2 text-sm font-bold shadow-lg transition-all active:scale-95 ${getBorderRadius()}`}
            style={{
              backgroundColor: colors.button,
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
          const isHidden = section.visible === false;
          if (isHidden && !isEditable) {
            return null;
          }

          const isSelected = selectedSectionId === section.id;
          const sectionClasses = `relative transition-all duration-200 ${
            isEditable ? "cursor-pointer group hover:ring-2 hover:ring-indigo-500/60" : ""
          } ${isSelected ? "ring-2 ring-indigo-500 shadow-2xl z-20" : ""} ${
            isHidden ? "opacity-45 grayscale-[30%]" : ""
          }`;

          return (
            <div
              id={`canvas-section-${section.id}`}
              data-section-id={section.id}
              key={section.id || `sec-${idx}`}
              onClick={(e) => {
                e.stopPropagation();
                if (isEditable) onSelectSection?.(section.id);
              }}
              className={sectionClasses}
            >
              {/* AI Upgrade Highlight Notification Banner */}
              {isEditable && aiUpdatedSectionId === section.id && (
                <div className="absolute -top-4 left-6 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs px-3.5 py-1.5 rounded-full font-bold shadow-2xl flex items-center space-x-2 animate-bounce border border-white/20">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>✨ AI Improved Section</span>
                </div>
              )}

              {/* Active Section Selection Ring Badge */}
              {isEditable && isSelected && (
                <div className="absolute top-3 left-4 z-40 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-xl flex items-center space-x-2 border border-indigo-400/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Editing {section.type} Section</span>
                </div>
              )}

              {/* Editable badge indicator on hover */}
              {isEditable && !isSelected && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection?.(section.id);
                  }}
                  className="absolute top-3 left-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-xl backdrop-blur-md cursor-pointer flex items-center space-x-1.5 active:scale-95"
                  title="Click to inspect & edit section properties"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{section.type} Section • Click to edit</span>
                </div>
              )}

              {/* Hidden indicator banner */}
              {isEditable && isHidden && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-zinc-900/95 border border-amber-500/40 text-amber-300 text-xs px-3 py-1 rounded-full flex items-center space-x-2 shadow-lg backdrop-blur-md">
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hidden from live site</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility?.(section.id);
                    }}
                    className="ml-2 font-bold underline hover:text-white"
                  >
                    Unhide
                  </button>
                </div>
              )}

              {/* Floating Section Quick-Action Toolbar on Selection */}
              {isEditable && isSelected && (
                <div className="absolute -top-4 right-6 z-40 bg-zinc-900 border border-indigo-500/80 rounded-lg px-2 py-1 flex items-center space-x-1.5 shadow-2xl backdrop-blur-md text-white text-xs">
                  <span className="font-bold text-[11px] text-indigo-300 px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60 uppercase tracking-wider">
                    {section.type} {section.variant || section.layout ? `• ${section.variant || section.layout}` : ""}
                  </span>
                  <div className="h-3.5 w-px bg-zinc-700 mx-0.5" />
                  <button
                    title="Move Up"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSection?.(section.id, "up");
                    }}
                    className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white disabled:opacity-25"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title="Move Down"
                    disabled={idx === data.sections.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSection?.(section.id, "down");
                    }}
                    className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white disabled:opacity-25"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title="Duplicate"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateSection?.(section.id);
                    }}
                    className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title={section.visible === false ? "Show Section" : "Hide Section"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility?.(section.id);
                    }}
                    className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white"
                  >
                    {section.visible === false ? (
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    title="Delete Section"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSection?.(section.id);
                    }}
                    className="p-1 hover:bg-rose-950/80 rounded text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Render by Section Type */}
              {renderSectionByType(
                section,
                colors,
                getBorderRadius(),
                style,
                data.websiteType,
                data.businessName,
                faqOpen,
                toggleFaq,
                isEditable,
                selectedSectionId,
                selectedElementId,
                onSelectElement
              )}
            </div>
          );
        })}

        {/* Fallback Interactive Footer if not in sections array */}
        {!data.sections.some((s) => s.type === "Footer") && (
          <div
            id="canvas-section-footer"
            onClick={(e) => {
              e.stopPropagation();
              if (isEditable) onSelectSection?.("footer");
            }}
            className={`relative transition-all duration-200 ${
              isEditable ? "cursor-pointer group hover:ring-2 hover:ring-indigo-500/60" : ""
            } ${selectedSectionId === "footer" ? "ring-2 ring-indigo-500 shadow-2xl z-20" : ""}`}
          >
            {renderFooter(
              {
                id: "footer",
                type: "Footer",
                title: data.businessName,
                subtitle: `© ${new Date().getFullYear()} ${data.businessName}. Powered by SiteCraft AI.`,
                description: "Building the next generation of web applications.",
              },
              colors,
              data.businessName,
              { isEditable, selectedSectionId, selectedElementId, onSelectElement }
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/* ================= SECTION DISPATCHER ================= */

interface ExtraProps {
  isEditable?: boolean;
  selectedSectionId?: string | null;
  selectedElementId?: string | null;
  onSelectElement?: (sectionId: string, elementId: string) => void;
}

function renderSectionByType(
  section: SectionContent,
  colors: any,
  radius: string,
  style: WebsiteStyle,
  websiteType?: string,
  businessName?: string,
  faqOpen?: Record<string, boolean>,
  toggleFaq?: (id: string) => void,
  isEditable?: boolean,
  selectedSectionId?: string | null,
  selectedElementId?: string | null,
  onSelectElement?: (sectionId: string, elementId: string) => void
) {
  const typeKey = (section.type || "").trim().toLowerCase();
  const extraProps: ExtraProps = {
    isEditable,
    selectedSectionId,
    selectedElementId,
    onSelectElement,
  };

  if (typeKey.includes("hero")) {
    return renderHero(section, colors, radius, style, websiteType, businessName, extraProps);
  }
  if (typeKey.includes("feature")) {
    return renderFeatures(section, colors, radius, style, websiteType, extraProps);
  }
  if (typeKey.includes("about")) {
    return renderAbout(section, colors, radius, extraProps);
  }
  if (typeKey.includes("service")) {
    return renderServices(section, colors, radius, extraProps);
  }
  if (typeKey.includes("team")) {
    return renderTeam(section, colors, radius, extraProps);
  }
  if (typeKey.includes("stat")) {
    return renderStats(section, colors, radius, extraProps);
  }
  if (typeKey.includes("logo") || typeKey.includes("partner") || typeKey.includes("client")) {
    return renderLogoCloud(section, colors, radius, extraProps);
  }
  if (typeKey.includes("process") || typeKey.includes("step") || typeKey.includes("how it works")) {
    return renderProcess(section, colors, radius, extraProps);
  }
  if (typeKey.includes("gallery") || typeKey.includes("product") || typeKey.includes("showcase")) {
    return renderProductShowcase(section, colors, radius, extraProps);
  }
  if (typeKey.includes("newsletter") || typeKey.includes("subscribe")) {
    return renderNewsletter(section, colors, radius, extraProps);
  }
  if (typeKey.includes("testimonial") || typeKey.includes("review")) {
    return renderTestimonials(section, colors, radius, extraProps);
  }
  if (typeKey.includes("pricing") || typeKey.includes("plan")) {
    return renderPricing(section, colors, radius, extraProps);
  }
  if (typeKey.includes("faq") || typeKey.includes("question")) {
    return renderFAQ(section, colors, radius, faqOpen || {}, toggleFaq || (() => {}), extraProps);
  }
  if (typeKey.includes("cta") || typeKey.includes("call to action")) {
    return renderCTA(section, colors, radius, extraProps);
  }
  if (typeKey.includes("contact")) {
    return renderContact(section, colors, radius, extraProps);
  }
  if (typeKey.includes("footer")) {
    return renderFooter(section, colors, businessName || "", extraProps);
  }

  return renderFeatures(section, colors, radius, style, websiteType, extraProps);
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

/* ================= CUSTOM STYLING HELPERS ================= */

function getSectionPaddingClass(paddingY?: string) {
  switch (paddingY) {
    case "compact":
    case "small":
      return "py-10 sm:py-14";
    case "spacious":
    case "xlarge":
      return "py-24 sm:py-36";
    case "large":
      return "py-20 sm:py-28";
    case "normal":
    case "medium":
    default:
      return "py-16 sm:py-24";
  }
}

function getSectionBackgroundStyle(sec: SectionContent) {
  const styles = sec.customStyles || {};
  if (styles.backgroundType === "solid" && styles.backgroundColor) {
    return { backgroundColor: styles.backgroundColor };
  }
  if (styles.backgroundType === "gradient" && styles.gradientConfig) {
    const { type, color1, color2, angle } = styles.gradientConfig;
    if (type === "radial") {
      return { backgroundImage: `radial-gradient(circle at center, ${color1}, ${color2})` };
    }
    return { backgroundImage: `linear-gradient(${angle || 135}deg, ${color1}, ${color2})` };
  }
  if (styles.backgroundType === "transparent") {
    return { backgroundColor: "transparent" };
  }
  if (styles.backgroundColor) {
    return { backgroundColor: styles.backgroundColor };
  }
  return {};
}

function getButtonRadius(styleRadius?: string, defaultRadius = "rounded-xl") {
  switch (styleRadius) {
    case "none":
      return "rounded-none";
    case "sm":
      return "rounded-sm";
    case "lg":
      return "rounded-2xl";
    case "full":
      return "rounded-full";
    default:
      return defaultRadius;
  }
}

/* ================= ELEMENT RENDER HELPERS ================= */

function getElementStyle(section: SectionContent, elementKey: string): React.CSSProperties {
  const el = section.elements?.[elementKey];
  if (!el?.style) return {};
  const s = el.style;
  const css: React.CSSProperties = {};
  if (s.fontFamily) css.fontFamily = s.fontFamily;
  if (s.fontSize) css.fontSize = s.fontSize;
  if (s.fontWeight) css.fontWeight = s.fontWeight as any;
  if (s.color) css.color = s.color;
  if (s.backgroundColor) css.backgroundColor = s.backgroundColor;
  if (s.lineHeight) css.lineHeight = s.lineHeight;
  if (s.letterSpacing) css.letterSpacing = s.letterSpacing;
  if (s.textAlign) css.textAlign = s.textAlign as any;
  if (s.textTransform) css.textTransform = s.textTransform as any;
  if (s.margin) css.margin = s.margin;
  if (s.padding) css.padding = s.padding;
  if (s.borderRadius) css.borderRadius = s.borderRadius;
  if (s.border) css.border = s.border;
  return css;
}

function getElementText(section: SectionContent, elementKey: string, fallback: string): string {
  return section.elements?.[elementKey]?.text ?? fallback;
}

interface RenderElementOptions {
  section: SectionContent;
  elementKey: string;
  defaultText?: string;
  children?: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  extraProps?: ExtraProps;
  [key: string]: any;
}

function renderElement({
  section,
  elementKey,
  defaultText,
  children,
  as: Component = "div",
  className = "",
  style: baseStyle = {},
  extraProps,
  ...props
}: RenderElementOptions) {
  const isEditable = extraProps?.isEditable ?? false;
  const selectedElementId = extraProps?.selectedElementId ?? null;
  const onSelectElement = extraProps?.onSelectElement;

  const isSelected = isEditable && (
    selectedElementId === `${section.id}:${elementKey}` ||
    selectedElementId === elementKey
  );

  const customStyle = getElementStyle(section, elementKey);
  const combinedStyle = { ...baseStyle, ...customStyle };
  const textContent = getElementText(section, elementKey, defaultText || "");

  const selectionRing = isEditable && isSelected
    ? " ring-2 ring-indigo-500 ring-offset-2 ring-offset-black transition-all rounded-sm z-30 cursor-pointer"
    : isEditable
    ? " hover:outline hover:outline-1 hover:outline-indigo-400/50 hover:outline-dashed transition-all cursor-pointer"
    : "";

  const finalClassName = `${className}${selectionRing}`.trim();

  const handleClick = (e: React.MouseEvent) => {
    if (isEditable && onSelectElement) {
      e.stopPropagation();
      onSelectElement(section.id, elementKey);
    }
  };

  return (
    <Component
      data-section-id={section.id}
      data-element-id={elementKey}
      className={finalClassName}
      style={combinedStyle}
      onClick={isEditable ? handleClick : props.onClick}
      {...props}
    >
      {children !== undefined ? children : textContent}
    </Component>
  );
}

/* ================= SECTION RENDERERS ================= */

/* 1. HERO COMPONENT (Polymorphic Layouts) */
function renderHero(
  section: SectionContent,
  colors: any,
  radius: string,
  style: WebsiteStyle,
  websiteType?: string,
  businessName?: string,
  extraProps?: ExtraProps
) {
  const variant = section.variant || section.layout;
  const v = (section.variant || section.layout || "").trim().toLowerCase();
  const paddingClass = getSectionPaddingClass(section.customStyles?.paddingY);
  const bgStyle = getSectionBackgroundStyle(section);

  // Variant A: Centered Hero
  if (v === "centered" || variant === "Centered") {
    return (
      <section className={`relative px-4 sm:px-6 lg:px-8 ${paddingClass} text-center overflow-hidden`} style={bgStyle}>
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          {section.badge &&
            renderElement({
              section,
              elementKey: "badge",
              defaultText: section.badge,
              className: "inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border shadow-sm",
              style: {
                borderColor: `${colors.primary}50`,
                backgroundColor: `${colors.primary}15`,
                color: colors.primary,
              },
              children: (
                <>
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{getElementText(section, "badge", section.badge)}</span>
                </>
              ),
              extraProps,
            })}

          {renderElement({
            section,
            elementKey: "heading",
            defaultText: section.title || `Elevate Your Experience with ${businessName}`,
            as: "h1",
            className: "text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 break-words max-w-3xl leading-[1.15]",
            extraProps,
          })}

          {renderElement({
            section,
            elementKey: "subtitle",
            defaultText: section.subtitle || "The modern platform designed to empower high-velocity teams and ambitious creators.",
            as: "p",
            className: "text-base sm:text-lg md:text-xl max-w-2xl mb-8 break-words leading-relaxed",
            style: { color: colors.muted },
            extraProps,
          })}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 w-full sm:w-auto">
            {renderElement({
              section,
              elementKey: "cta",
              defaultText: section.ctaText || "Get Started",
              as: "a",
              href: section.ctaLink || "#pricing",
              className: `w-full sm:w-auto px-8 py-3.5 text-base font-bold shadow-xl active:scale-95 transition-all text-center flex items-center justify-center space-x-2 ${radius}`,
              style: {
                backgroundColor: colors.button,
                color: "#ffffff",
              },
              children: (
                <>
                  <span>{getElementText(section, "cta", section.ctaText || "Get Started")}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </>
              ),
              extraProps,
            })}
            {section.secondaryCtaText &&
              renderElement({
                section,
                elementKey: "secondaryCta",
                defaultText: section.secondaryCtaText,
                as: "a",
                href: section.secondaryCtaLink || "#features",
                className: `w-full sm:w-auto px-7 py-3.5 text-base font-semibold border hover:bg-white/5 active:scale-95 transition-all text-center ${radius}`,
                style: {
                  borderColor: colors.border,
                  color: colors.text,
                },
                extraProps,
              })}
          </div>

          {section.imageUrl && (
            <div
              className={`w-full max-w-4xl border p-2 shadow-2xl relative overflow-hidden ${radius}`}
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <SafeImage
                src={section.imageUrl}
                alt={section.imageAlt || "Hero Showcase"}
                className={`w-full h-auto max-h-[460px] object-cover ${radius}`}
              />
            </div>
          )}
        </div>
      </section>
    );
  }

  // Variant B: Asymmetric Hero (Minimal, Luxury, Portfolio)
  if (variant === "Asymmetric" || (!variant && (style === "Minimal" || style === "Luxury" || websiteType === "Portfolio"))) {
    return (
      <section className={`relative px-4 sm:px-6 lg:px-8 ${paddingClass} overflow-hidden`} style={bgStyle}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {section.badge &&
              renderElement({
                section,
                elementKey: "badge",
                defaultText: section.badge,
                className: "inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 border",
                style: {
                  borderColor: colors.border,
                  backgroundColor: `${colors.surface}80`,
                  color: colors.accent,
                },
                extraProps,
              })}

            {renderElement({
              section,
              elementKey: "heading",
              defaultText: section.title || `Bespoke Design for ${businessName}`,
              as: "h1",
              className: "text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 break-words leading-[1.1]",
              extraProps,
            })}

            {renderElement({
              section,
              elementKey: "subtitle",
              defaultText: section.subtitle || "Crafting digital elegance with unparalleled attention to detail.",
              as: "p",
              className: "text-base sm:text-lg mb-8 leading-relaxed max-w-xl break-words",
              style: { color: colors.muted },
              extraProps,
            })}

            <div className="flex flex-wrap items-center gap-4 mb-10">
              {renderElement({
                section,
                elementKey: "cta",
                defaultText: section.ctaText || "Explore Works",
                as: "a",
                href: section.ctaLink || "#pricing",
                className: `px-8 py-3.5 text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center space-x-2 ${radius}`,
                style: {
                  backgroundColor: colors.button,
                  color: "#ffffff",
                },
                children: (
                  <>
                    <span>{getElementText(section, "cta", section.ctaText || "Explore Works")}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </>
                ),
                extraProps,
              })}
              {section.secondaryCtaText &&
                renderElement({
                  section,
                  elementKey: "secondaryCta",
                  defaultText: section.secondaryCtaText,
                  as: "a",
                  href: section.secondaryCtaLink || "#features",
                  className: `px-6 py-3.5 text-sm font-semibold border hover:bg-white/5 transition-all ${radius}`,
                  style: {
                    borderColor: colors.border,
                    color: colors.text,
                  },
                  extraProps,
                })}
            </div>

            {section.items && section.items.length > 0 && (
              <div className="grid grid-cols-3 gap-6 pt-6 border-t w-full" style={{ borderColor: colors.border }}>
                {section.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex flex-col">
                    {renderElement({
                      section,
                      elementKey: `item-title-${i}`,
                      defaultText: item.title,
                      as: "span",
                      className: "text-xl sm:text-2xl font-black tracking-tight",
                      style: { color: colors.primary },
                      extraProps,
                    })}
                    {renderElement({
                      section,
                      elementKey: `item-desc-${i}`,
                      defaultText: item.description,
                      as: "span",
                      className: "text-xs mt-1 break-words",
                      style: { color: colors.muted },
                      extraProps,
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 relative">
            <div
              className={`relative border p-3 shadow-2xl backdrop-blur-md overflow-hidden ${radius}`}
              style={{
                borderColor: colors.border,
                backgroundColor: `${colors.surface}99`,
              }}
            >
              <SafeImage
                src={section.imageUrl || "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80"}
                alt={section.imageAlt || "Portfolio Showcase"}
                className={`w-full h-80 sm:h-96 object-cover ${radius}`}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Variant C: Product Preview / Cyber Spotlight (Neon, Dark, AI Tool)
  if (v === "product preview" || v === "productpreview" || (!v && (style === "Neon" || style === "Dark" || websiteType === "AI Tool"))) {
    return (
      <section className={`relative px-4 sm:px-6 lg:px-8 ${paddingClass} text-center overflow-hidden`} style={bgStyle}>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 pointer-events-none"
          style={{ backgroundColor: colors.primary }}
        />

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          {section.badge &&
            renderElement({
              section,
              elementKey: "badge",
              defaultText: section.badge,
              className: "inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border shadow-inner",
              style: {
                borderColor: `${colors.primary}60`,
                backgroundColor: `${colors.surface}cc`,
                color: colors.primary,
              },
              children: (
                <>
                  <Cpu className="w-3.5 h-3.5 shrink-0" />
                  <span>{getElementText(section, "badge", section.badge)}</span>
                </>
              ),
              extraProps,
            })}

          {renderElement({
            section,
            elementKey: "heading",
            defaultText: section.title || `Next-Gen Intelligence by ${businessName}`,
            as: "h1",
            className: "text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 break-words max-w-3xl leading-[1.15]",
            extraProps,
          })}

          {renderElement({
            section,
            elementKey: "subtitle",
            defaultText: section.subtitle || "Synthesize intelligence, automate workflows, and deploy with confidence.",
            as: "p",
            className: "text-base sm:text-lg md:text-xl max-w-2xl mb-8 break-words",
            style: { color: colors.muted },
            extraProps,
          })}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 w-full sm:w-auto">
            {renderElement({
              section,
              elementKey: "cta",
              defaultText: section.ctaText || "Try Generator Free",
              as: "a",
              href: section.ctaLink || "#pricing",
              className: `w-full sm:w-auto px-8 py-3.5 text-base font-bold shadow-xl active:scale-95 transition-all text-center flex items-center justify-center space-x-2 ${radius}`,
              style: {
                backgroundColor: colors.button,
                color: "#ffffff",
              },
              children: (
                <>
                  <span>{getElementText(section, "cta", section.ctaText || "Try Generator Free")}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </>
              ),
              extraProps,
            })}
            {section.secondaryCtaText &&
              renderElement({
                section,
                elementKey: "secondaryCta",
                defaultText: section.secondaryCtaText,
                as: "a",
                href: section.secondaryCtaLink || "#features",
                className: `w-full sm:w-auto px-7 py-3.5 text-base font-semibold border hover:bg-white/5 active:scale-95 transition-all text-center ${radius}`,
                style: {
                  borderColor: colors.border,
                  color: colors.text,
                },
                extraProps,
              })}
          </div>

          <div
            className={`w-full max-w-3xl border p-4 text-left shadow-2xl relative backdrop-blur-xl ${radius}`}
            style={{
              borderColor: colors.border,
              backgroundColor: `${colors.surface}dd`,
            }}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b" style={{ borderColor: colors.border }}>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono" style={{ color: colors.muted }}>
                engine.run(&apos;prompt&apos;)
              </span>
            </div>
            <p className="font-mono text-sm leading-relaxed" style={{ color: colors.primary }}>
              &gt; sitecraft generate --model transformer-3.0 --industry {websiteType || "Tech"}
            </p>
            <p className="font-mono text-xs mt-1" style={{ color: colors.muted }}>
              ✓ Generated 9 high-converting sections in 1.4s with 99.8% design match
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Variant D: Full Width Banner (Restaurant, Gym, Ecommerce, Agency)
  if (v === "full width" || v === "fullwidth" || (!v && (websiteType === "Restaurant" || websiteType === "Gym" || websiteType === "Ecommerce" || websiteType === "Agency"))) {
    return (
      <section className={`relative min-h-[500px] flex items-center justify-center px-4 sm:px-6 lg:px-8 ${paddingClass} overflow-hidden`} style={bgStyle}>
        {section.imageUrl && (
          <div className="absolute inset-0 z-0">
            <SafeImage
              src={section.imageUrl}
              alt={section.imageAlt || "Hero Background"}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 backdrop-blur-[2px]"
              style={{
                background: `linear-gradient(to top, ${colors.bg} 15%, ${colors.bg}dd 60%, ${colors.bg}aa 100%)`,
              }}
            />
          </div>
        )}

        <div className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center">
          {section.badge &&
            renderElement({
              section,
              elementKey: "badge",
              defaultText: section.badge,
              className: "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border shadow-lg",
              style: {
                borderColor: `${colors.primary}60`,
                backgroundColor: `${colors.bg}cc`,
                color: colors.primary,
              },
              extraProps,
            })}

          {renderElement({
            section,
            elementKey: "heading",
            defaultText: section.title || `Experience ${businessName}`,
            as: "h1",
            className: "text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 break-words max-w-3xl leading-[1.1]",
            extraProps,
          })}

          {renderElement({
            section,
            elementKey: "subtitle",
            defaultText: section.subtitle || "Crafted to deliver extraordinary satisfaction with every interaction.",
            as: "p",
            className: "text-base sm:text-lg md:text-xl max-w-2xl mb-8 break-words text-zinc-300",
            extraProps,
          })}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {renderElement({
              section,
              elementKey: "cta",
              defaultText: section.ctaText || "Book / Reserve Now",
              as: "a",
              href: section.ctaLink || "#pricing",
              className: `w-full sm:w-auto px-8 py-3.5 text-base font-bold shadow-2xl active:scale-95 transition-all text-center ${radius}`,
              style: {
                backgroundColor: colors.button,
                color: "#ffffff",
              },
              extraProps,
            })}
            {section.secondaryCtaText &&
              renderElement({
                section,
                elementKey: "secondaryCta",
                defaultText: section.secondaryCtaText,
                as: "a",
                href: section.secondaryCtaLink || "#features",
                className: `w-full sm:w-auto px-7 py-3.5 text-base font-semibold border hover:bg-white/10 active:scale-95 transition-all text-center backdrop-blur-sm ${radius}`,
                style: {
                  borderColor: "rgba(255,255,255,0.25)",
                  color: "#ffffff",
                },
                extraProps,
              })}
          </div>
        </div>
      </section>
    );
  }

  // Variant E: Image Left or Image Right
  if (v === "image left" || v === "imageleft" || v === "image right" || v === "imageright") {
    const isImageLeft = v.includes("left");
    return (
      <section className={`relative px-4 sm:px-6 lg:px-8 ${paddingClass} overflow-hidden`} style={bgStyle}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className={`lg:col-span-6 ${isImageLeft ? "order-2 lg:order-2" : "order-2 lg:order-1"}`}>
            {section.badge &&
              renderElement({
                section,
                elementKey: "badge",
                defaultText: section.badge,
                className: "inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border",
                style: {
                  borderColor: colors.border,
                  backgroundColor: `${colors.surface}80`,
                  color: colors.primary,
                },
                extraProps,
              })}
            {renderElement({
              section,
              elementKey: "heading",
              defaultText: section.title || `Empower Your Workflow with ${businessName}`,
              as: "h1",
              className: "text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight break-words",
              extraProps,
            })}
            {renderElement({
              section,
              elementKey: "subtitle",
              defaultText: section.subtitle || "The modern software solution crafted to simplify complexity.",
              as: "p",
              className: "text-base sm:text-lg mb-8 leading-relaxed break-words",
              style: { color: colors.muted },
              extraProps,
            })}
            <div className="flex flex-wrap items-center gap-4">
              {renderElement({
                section,
                elementKey: "cta",
                defaultText: section.ctaText || "Get Started",
                as: "a",
                href: section.ctaLink || "#pricing",
                className: `px-8 py-3.5 text-sm font-bold shadow-xl active:scale-95 transition-all ${radius}`,
                style: { backgroundColor: colors.button, color: "#ffffff" },
                extraProps,
              })}
              {section.secondaryCtaText &&
                renderElement({
                  section,
                  elementKey: "secondaryCta",
                  defaultText: section.secondaryCtaText,
                  as: "a",
                  href: section.secondaryCtaLink || "#features",
                  className: `px-6 py-3.5 text-sm font-semibold border hover:bg-white/5 transition-all ${radius}`,
                  style: { borderColor: colors.border, color: colors.text },
                  extraProps,
                })}
            </div>
          </div>
          <div className={`lg:col-span-6 ${isImageLeft ? "order-1 lg:order-1" : "order-1 lg:order-2"}`}>
            <div className={`border p-2 shadow-2xl overflow-hidden ${radius}`} style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
              <SafeImage
                src={section.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80"}
                alt={section.imageAlt || "Hero Display"}
                className={`w-full h-80 sm:h-96 object-cover ${radius}`}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Variant F: Split SaaS / Startup (Default fallback)
  return (
    <section className={`relative px-4 sm:px-6 lg:px-8 ${paddingClass} overflow-hidden`} style={bgStyle}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {section.badge &&
            renderElement({
              section,
              elementKey: "badge",
              defaultText: section.badge,
              className: "inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border shadow-sm",
              style: {
                borderColor: `${colors.primary}50`,
                backgroundColor: `${colors.primary}15`,
                color: colors.primary,
              },
              children: (
                <>
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{getElementText(section, "badge", section.badge)}</span>
                </>
              ),
              extraProps,
            })}

          {renderElement({
            section,
            elementKey: "heading",
            defaultText: section.title || `Scale Higher with ${businessName}`,
            as: "h1",
            className: "text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 break-words leading-[1.15]",
            extraProps,
          })}

          {renderElement({
            section,
            elementKey: "subtitle",
            defaultText: section.subtitle || "Build and launch stunning web experiences in seconds with enterprise resilience.",
            as: "p",
            className: "text-base sm:text-lg mb-8 leading-relaxed max-w-xl break-words",
            style: { color: colors.muted },
            extraProps,
          })}

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto">
            {renderElement({
              section,
              elementKey: "cta",
              defaultText: section.ctaText || "Start 14-Day Free Trial",
              as: "a",
              href: section.ctaLink || "#pricing",
              className: `w-full sm:w-auto px-8 py-3.5 text-base font-bold shadow-xl active:scale-95 transition-all text-center flex items-center justify-center space-x-2 ${radius}`,
              style: {
                backgroundColor: colors.button,
                color: "#ffffff",
              },
              children: (
                <>
                  <span>{getElementText(section, "cta", section.ctaText || "Start 14-Day Free Trial")}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </>
              ),
              extraProps,
            })}
            {section.secondaryCtaText &&
              renderElement({
                section,
                elementKey: "secondaryCta",
                defaultText: section.secondaryCtaText,
                as: "a",
                href: section.secondaryCtaLink || "#features",
                className: `w-full sm:w-auto px-7 py-3.5 text-base font-semibold border hover:bg-white/5 active:scale-95 transition-all text-center ${radius}`,
                style: {
                  borderColor: colors.border,
                  color: colors.text,
                },
                extraProps,
              })}
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div
            className={`relative border p-3 shadow-2xl overflow-hidden ${radius}`}
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <SafeImage
              src={section.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80"}
              alt={section.imageAlt || "SaaS App Dashboard"}
              className={`w-full h-80 sm:h-96 object-cover ${radius}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* 2. FEATURES COMPONENT (Polymorphic Layouts) */
function renderFeatures(
  section: SectionContent,
  colors: any,
  radius: string,
  style: WebsiteStyle,
  websiteType?: string,
  extraProps?: ExtraProps
) {
  const v = (section.variant || section.layout || "").trim().toLowerCase();
  const paddingClass = getSectionPaddingClass(section.customStyles?.paddingY);
  const bgStyle = getSectionBackgroundStyle(section);
  const items = section.items && section.items.length > 0 ? section.items : [
    { title: "Intelligent Synthesis", description: "Harness modern AI to generate tailored copy, layout, and visual hierarchy.", icon: "Sparkles" },
    { title: "Real-time Visual Customizer", description: "Fine-tune every headline, button, and layout variant in seconds.", icon: "Zap" },
    { title: "Instant Edge Deployment", description: "Publish instantly with ultra-fast latency and custom domain routing.", icon: "Globe" },
  ];

  // Variant A: Bento Grid
  if (v === "bento") {
    const flagship = items[0];
    const subItems = items.slice(1);
    return (
      <section id="features" className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t`} style={{ borderColor: colors.border, ...bgStyle }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            {section.badge &&
              renderElement({
                section,
                elementKey: "badge",
                defaultText: section.badge,
                className: "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block",
                style: { borderColor: colors.border, color: colors.primary, backgroundColor: `${colors.surface}60` },
                extraProps,
              })}
            {renderElement({
              section,
              elementKey: "heading",
              defaultText: section.title || "Engineered for Excellence",
              as: "h2",
              className: "text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 break-words",
              extraProps,
            })}
            {renderElement({
              section,
              elementKey: "subtitle",
              defaultText: section.subtitle || "Discover the breakthrough capabilities that empower fast-growing organizations.",
              as: "p",
              className: "text-base sm:text-lg break-words",
              style: { color: colors.muted },
              extraProps,
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {flagship && (
              <div
                className={`md:col-span-2 p-8 sm:p-10 border flex flex-col justify-between shadow-xl ${radius}`}
                style={{ borderColor: colors.border, backgroundColor: colors.surface }}
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white mb-6 shadow-md"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {ICON_MAP[flagship.icon || ""] || <Sparkles className="w-6 h-6" />}
                  </div>
                  {renderElement({
                    section,
                    elementKey: "item-title-0",
                    defaultText: flagship.title,
                    as: "h3",
                    className: "text-xl sm:text-2xl font-bold mb-3 break-words",
                    extraProps,
                  })}
                  {renderElement({
                    section,
                    elementKey: "item-desc-0",
                    defaultText: flagship.description,
                    as: "p",
                    className: "text-base leading-relaxed break-words",
                    style: { color: colors.muted },
                    extraProps,
                  })}
                </div>
                <div className="mt-8 pt-6 border-t flex items-center justify-between" style={{ borderColor: colors.border }}>
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>
                    Flagship Capability
                  </span>
                  <ArrowRight className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
            )}

            {subItems.map((item, idx) => {
              const itemIndex = idx + 1;
              return (
                <div
                  key={idx}
                  className={`p-6 sm:p-8 border flex flex-col justify-between shadow-lg ${radius}`}
                  style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                >
                  <div>
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white mb-5 shadow-sm"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {ICON_MAP[item.icon || ""] || <Zap className="w-5 h-5" />}
                    </div>
                    {renderElement({
                      section,
                      elementKey: `item-title-${itemIndex}`,
                      defaultText: item.title,
                      as: "h4",
                      className: "text-lg font-bold mb-2 break-words",
                      extraProps,
                    })}
                    {renderElement({
                      section,
                      elementKey: `item-desc-${itemIndex}`,
                      defaultText: item.description,
                      as: "p",
                      className: "text-sm leading-relaxed break-words",
                      style: { color: colors.muted },
                      extraProps,
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Variant B: Numbered Editorial List
  if (v === "vertical" || v === "numbered") {
    return (
      <section id="features" className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t`} style={{ borderColor: colors.border, ...bgStyle }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-left mb-16 pb-6 border-b" style={{ borderColor: colors.border }}>
            {section.badge &&
              renderElement({
                section,
                elementKey: "badge",
                defaultText: section.badge,
                className: "text-xs font-bold uppercase tracking-widest mb-3 block",
                style: { color: colors.primary },
                extraProps,
              })}
            {renderElement({
              section,
              elementKey: "heading",
              defaultText: section.title || "Selected Disciplines",
              as: "h2",
              className: "text-3xl sm:text-4xl font-light tracking-tight mb-2 break-words",
              extraProps,
            })}
            {section.subtitle &&
              renderElement({
                section,
                elementKey: "subtitle",
                defaultText: section.subtitle,
                as: "p",
                className: "text-base break-words",
                style: { color: colors.muted },
                extraProps,
              })}
          </div>

          <div className="space-y-6">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`p-6 sm:p-8 border flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 transition-all hover:bg-white/5 ${radius}`}
                style={{ borderColor: colors.border, backgroundColor: `${colors.surface}40` }}
              >
                <div className="flex items-baseline space-x-4">
                  <span className="text-2xl sm:text-3xl font-mono font-bold" style={{ color: colors.primary }}>
                    0{idx + 1}
                  </span>
                  {renderElement({
                    section,
                    elementKey: `item-title-${idx}`,
                    defaultText: item.title,
                    as: "h3",
                    className: "text-xl font-bold tracking-tight break-words",
                    extraProps,
                  })}
                </div>
                {renderElement({
                  section,
                  elementKey: `item-desc-${idx}`,
                  defaultText: item.description,
                  as: "p",
                  className: "text-sm sm:text-base max-w-md break-words",
                  style: { color: colors.muted },
                  extraProps,
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Variant C: Horizontal Alternating Split
  if (v === "horizontal" || v === "split") {
    return (
      <section id="features" className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t`} style={{ borderColor: colors.border, ...bgStyle }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            {section.badge &&
              renderElement({
                section,
                elementKey: "badge",
                defaultText: section.badge,
                className: "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block",
                style: { borderColor: colors.border, color: colors.primary, backgroundColor: `${colors.surface}60` },
                extraProps,
              })}
            {renderElement({
              section,
              elementKey: "heading",
              defaultText: section.title || "Powerful Modular Features",
              as: "h2",
              className: "text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 break-words",
              extraProps,
            })}
            {renderElement({
              section,
              elementKey: "subtitle",
              defaultText: section.subtitle || "Seamlessly integrated components designed to accelerate your project deployment.",
              as: "p",
              className: "text-base sm:text-lg break-words",
              style: { color: colors.muted },
              extraProps,
            })}
          </div>

          <div className="space-y-10">
            {items.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`p-8 border rounded-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${radius}`}
                  style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                >
                  <div className={`lg:col-span-6 ${isEven ? "order-1" : "order-1 lg:order-2"}`}>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white mb-4 shadow-md"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {ICON_MAP[item.icon || ""] || <Zap className="w-5 h-5" />}
                    </div>
                    {renderElement({
                      section,
                      elementKey: `item-title-${idx}`,
                      defaultText: item.title,
                      as: "h3",
                      className: "text-xl sm:text-2xl font-bold mb-3 break-words",
                      extraProps,
                    })}
                    {renderElement({
                      section,
                      elementKey: `item-desc-${idx}`,
                      defaultText: item.description,
                      as: "p",
                      className: "text-sm sm:text-base leading-relaxed break-words",
                      style: { color: colors.muted },
                      extraProps,
                    })}
                  </div>
                  <div className={`lg:col-span-6 ${isEven ? "order-2" : "order-2 lg:order-1"}`}>
                    <div className="p-3 border rounded-xl bg-black/40" style={{ borderColor: colors.border }}>
                      <SafeImage
                        src={section.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"}
                        alt={item.title || "Feature Image"}
                        className="w-full h-48 sm:h-56 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Variant D: Showcase
  if (v === "showcase") {
    return (
      <section id="features" className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t`} style={{ borderColor: colors.border, ...bgStyle }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            {section.badge &&
              renderElement({
                section,
                elementKey: "badge",
                defaultText: section.badge,
                className: "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block",
                style: { borderColor: colors.border, color: colors.primary, backgroundColor: `${colors.surface}60` },
                extraProps,
              })}
            {renderElement({
              section,
              elementKey: "heading",
              defaultText: section.title || "Interactive Capability Showcase",
              as: "h2",
              className: "text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 break-words",
              extraProps,
            })}
            {renderElement({
              section,
              elementKey: "subtitle",
              defaultText: section.subtitle || "Explore our key capabilities through a modern interactive spotlight.",
              as: "p",
              className: "text-base sm:text-lg break-words",
              style: { color: colors.muted },
              extraProps,
            })}
          </div>

          <div className={`p-8 border rounded-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl ${radius}`} style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
            <div className="lg:col-span-5 space-y-4">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border bg-zinc-900/60 transition-all hover:border-indigo-500 cursor-pointer"
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0" style={{ backgroundColor: colors.primary }}>
                      {idx + 1}
                    </div>
                    {renderElement({
                      section,
                      elementKey: `item-title-${idx}`,
                      defaultText: item.title,
                      as: "h4",
                      className: "font-bold text-base text-white truncate",
                      extraProps,
                    })}
                  </div>
                  {renderElement({
                    section,
                    elementKey: `item-desc-${idx}`,
                    defaultText: item.description,
                    as: "p",
                    className: "text-xs leading-relaxed",
                    style: { color: colors.muted },
                    extraProps,
                  })}
                </div>
              ))}
            </div>

            <div className="lg:col-span-7">
              <div className="p-3 border rounded-xl bg-black/60 shadow-inner" style={{ borderColor: colors.border }}>
                <SafeImage
                  src={section.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80"}
                  alt="Feature Showcase Preview"
                  className="w-full h-72 sm:h-80 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Variant E: Standard Grid Cards (Default for "grid", "cards", or fallback)
  return (
    <section id="features" className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t`} style={{ borderColor: colors.border, ...bgStyle }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {section.badge &&
            renderElement({
              section,
              elementKey: "badge",
              defaultText: section.badge,
              className: "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block",
              style: { borderColor: colors.border, color: colors.primary, backgroundColor: `${colors.surface}60` },
              extraProps,
            })}
          {renderElement({
            section,
            elementKey: "heading",
            defaultText: section.title || "Core Capabilities",
            as: "h2",
            className: "text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 break-words",
            extraProps,
          })}
          {renderElement({
            section,
            elementKey: "subtitle",
            defaultText: section.subtitle || "Everything you need to deliver world-class digital results.",
            as: "p",
            className: "text-base sm:text-lg break-words",
            style: { color: colors.muted },
            extraProps,
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`p-7 border flex flex-col justify-between shadow-lg transition-all hover:translate-y-[-2px] ${radius}`}
              style={{ borderColor: colors.border, backgroundColor: colors.surface }}
            >
              <div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white mb-5 shadow-sm"
                  style={{ backgroundColor: colors.primary }}
                >
                  {ICON_MAP[item.icon || ""] || <Sparkles className="w-5 h-5" />}
                </div>
                {renderElement({
                  section,
                  elementKey: `item-title-${idx}`,
                  defaultText: item.title,
                  as: "h3",
                  className: "text-lg font-bold mb-2.5 break-words",
                  extraProps,
                })}
                {renderElement({
                  section,
                  elementKey: `item-desc-${idx}`,
                  defaultText: item.description,
                  as: "p",
                  className: "text-sm leading-relaxed break-words",
                  style: { color: colors.muted },
                  extraProps,
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 3. TESTIMONIALS COMPONENT (Polymorphic Layouts) */
function renderTestimonials(section: SectionContent, colors: any, radius: string, extraProps?: ExtraProps) {
  const variant = section.variant || section.layout;
  const paddingClass = getSectionPaddingClass(section.customStyles?.paddingY);
  const bgStyle = getSectionBackgroundStyle(section);
  const items = section.items && section.items.length > 0 ? section.items : [
    {
      title: "Game Changer",
      description: "SiteCraft AI cut our web development cycle by 80%. The visual customization is extraordinarily intuitive.",
      author: "Sarah Lin",
      role: "VP of Growth, HyperScale",
      rating: 5,
    },
    {
      title: "Incredible Speed",
      description: "Our marketing team can spin up landing pages in minutes instead of waiting two weeks for engineering.",
      author: "David Chen",
      role: "Co-Founder, StackWave",
      rating: 5,
    },
    {
      title: "Unmatched Polish",
      description: "The layout variants look like they were built by a bespoke design agency. Outstanding product.",
      author: "Elena Rostova",
      role: "Head of Product, Apex Studio",
      rating: 5,
    },
  ];

  if (variant === "Featured" || variant === "Quote") {
    const featured = items[0];
    return (
      <section id="testimonials" className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t`} style={{ borderColor: colors.border, ...bgStyle }}>
        <div className="max-w-4xl mx-auto text-center">
          <Quote className="w-12 h-12 mx-auto mb-6 opacity-30" style={{ color: colors.primary }} />
          {renderElement({
            section,
            elementKey: "item-desc-0",
            defaultText: featured.description,
            as: "p",
            className: "text-xl sm:text-3xl font-medium tracking-tight leading-relaxed mb-8 break-words",
            extraProps,
          })}
          <div className="flex flex-col items-center">
            {renderElement({
              section,
              elementKey: "item-title-0",
              defaultText: featured.author,
              as: "span",
              className: "font-bold text-base",
              extraProps,
            })}
            <span className="text-sm" style={{ color: colors.muted }}>{featured.role}</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t`} style={{ borderColor: colors.border, ...bgStyle }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          {section.badge &&
            renderElement({
              section,
              elementKey: "badge",
              defaultText: section.badge,
              className: "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block",
              style: { borderColor: colors.border, color: colors.primary, backgroundColor: `${colors.surface}60` },
              extraProps,
            })}
          {renderElement({
            section,
            elementKey: "heading",
            defaultText: section.title || "Loved by Industry Leaders",
            as: "h2",
            className: "text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 break-words",
            extraProps,
          })}
          {renderElement({
            section,
            elementKey: "subtitle",
            defaultText: section.subtitle || "See what our partners and customers have to say.",
            as: "p",
            className: "text-base break-words",
            style: { color: colors.muted },
            extraProps,
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`p-7 border flex flex-col justify-between shadow-xl ${radius}`}
              style={{ borderColor: colors.border, backgroundColor: colors.surface }}
            >
              <div>
                <div className="flex items-center space-x-1 mb-4 text-amber-400">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {renderElement({
                  section,
                  elementKey: `item-desc-${idx}`,
                  defaultText: item.description,
                  as: "p",
                  className: "text-sm sm:text-base leading-relaxed mb-6 italic break-words",
                  style: { color: colors.text },
                  extraProps,
                })}
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t" style={{ borderColor: colors.border }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0"
                  style={{ backgroundColor: colors.primary }}
                >
                  {(item.author || "U").charAt(0)}
                </div>
                <div>
                  {renderElement({
                    section,
                    elementKey: `item-title-${idx}`,
                    defaultText: item.author,
                    as: "h4",
                    className: "font-bold text-sm break-words",
                    extraProps,
                  })}
                  <p className="text-xs break-words" style={{ color: colors.muted }}>{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 4. PRICING COMPONENT (Polymorphic Layouts) */
function renderPricing(section: SectionContent, colors: any, radius: string, extraProps?: ExtraProps) {
  const variant = section.variant || section.layout;
  const paddingClass = getSectionPaddingClass(section.customStyles?.paddingY);
  const bgStyle = getSectionBackgroundStyle(section);
  const items = section.items && section.items.length > 0 ? section.items : [
    {
      title: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for solo entrepreneurs and test projects.",
      popular: false,
      features: ["Up to 3 active websites", "1,000 AI generations", "Custom domain support", "Standard CDN delivery"],
    },
    {
      title: "Pro Scale",
      price: "$79",
      period: "/month",
      description: "Our most popular plan for scaling organizations.",
      popular: true,
      features: ["Unlimited websites", "15,000 AI generations", "Custom CSS & layout variants", "Real-time analytics", "Priority 24/7 support"],
    },
    {
      title: "Enterprise",
      price: "$199",
      period: "/month",
      description: "Full compliance, dedicated infrastructure and SLA.",
      popular: false,
      features: ["Unlimited AI credits", "Dedicated account engineer", "Custom SSO & audit logs", "99.99% uptime guarantee"],
    },
  ];

  const colGrid =
    variant === "2 Columns"
      ? "grid-cols-1 md:grid-cols-2 max-w-4xl"
      : variant === "4 Columns"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl"
      : "grid-cols-1 md:grid-cols-3 max-w-5xl";

  return (
    <section id="pricing" className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t`} style={{ borderColor: colors.border, ...bgStyle }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          {section.badge &&
            renderElement({
              section,
              elementKey: "badge",
              defaultText: section.badge,
              className: "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block",
              style: { borderColor: colors.border, color: colors.primary, backgroundColor: `${colors.surface}60` },
              extraProps,
            })}
          {renderElement({
            section,
            elementKey: "heading",
            defaultText: section.title || "Transparent, Predictable Pricing",
            as: "h2",
            className: "text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 break-words",
            extraProps,
          })}
          {renderElement({
            section,
            elementKey: "subtitle",
            defaultText: section.subtitle || "No hidden fees. Upgrade or cancel anytime with our 14-day guarantee.",
            as: "p",
            className: "text-base break-words",
            style: { color: colors.muted },
            extraProps,
          })}
        </div>

        <div className={`grid ${colGrid} mx-auto gap-8 items-stretch`}>
          {items.map((plan, idx) => {
            const isPopular = plan.popular || idx === 1;
            return (
              <div
                key={idx}
                className={`p-8 border flex flex-col justify-between relative shadow-xl transition-all ${radius} ${
                  isPopular ? "ring-2 ring-indigo-500 scale-[1.03] z-10" : ""
                }`}
                style={{
                  borderColor: isPopular ? colors.primary : colors.border,
                  backgroundColor: colors.surface,
                }}
              >
                {isPopular && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Most Popular
                  </div>
                )}

                <div>
                  {renderElement({
                    section,
                    elementKey: `item-title-${idx}`,
                    defaultText: plan.title,
                    as: "h3",
                    className: "text-xl font-bold mb-2 break-words",
                    extraProps,
                  })}
                  {renderElement({
                    section,
                    elementKey: `item-desc-${idx}`,
                    defaultText: plan.description,
                    as: "p",
                    className: "text-xs mb-6 break-words",
                    style: { color: colors.muted },
                    extraProps,
                  })}
                  <div className="flex items-baseline mb-6">
                    {renderElement({
                      section,
                      elementKey: `item-price-${idx}`,
                      defaultText: plan.price,
                      as: "span",
                      className: "text-4xl font-extrabold tracking-tight",
                      extraProps,
                    })}
                    <span className="text-sm ml-1.5" style={{ color: colors.muted }}>{plan.period || "/month"}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {(plan.features || []).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start text-xs sm:text-sm">
                        <Check className="w-4 h-4 mr-2.5 shrink-0 mt-0.5" style={{ color: colors.primary }} />
                        <span className="break-words">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {renderElement({
                  section,
                  elementKey: `item-button-${idx}`,
                  defaultText: plan.buttonText || "Choose Plan",
                  as: "a",
                  href: plan.link || "#checkout",
                  className: `w-full py-3 px-4 text-center font-bold text-sm transition-all shadow-md active:scale-95 ${radius}`,
                  style: {
                    backgroundColor: isPopular ? colors.button : "transparent",
                    color: isPopular ? "#ffffff" : colors.text,
                    border: isPopular ? "none" : `1px solid ${colors.border}`,
                  },
                  extraProps,
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* 5. FAQ COMPONENT */
function renderFAQ(
  section: SectionContent,
  colors: any,
  radius: string,
  faqOpen: Record<string, boolean>,
  toggleFaq: (id: string) => void,
  extraProps?: ExtraProps
) {
  const paddingClass = getSectionPaddingClass(section.customStyles?.paddingY);
  const bgStyle = getSectionBackgroundStyle(section);
  const items = section.items && section.items.length > 0 ? section.items : [
    {
      question: "Can I connect my own custom domain?",
      answer: "Yes! All paid and trial tiers include one-click custom domain configuration with automatic free SSL certificate provisioning.",
    },
    {
      question: "Can I export or host the websites myself?",
      answer: "Absolutely. You can publish directly to our ultra-fast global edge network or export structured JSON configuration at any time.",
    },
    {
      question: "Is there a long-term contract or cancellation fee?",
      answer: "None at all. You can cancel your subscription at any time directly from your billing portal with zero penalties.",
    },
  ];

  return (
    <section id="faq" className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t`} style={{ borderColor: colors.border, ...bgStyle }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          {section.badge &&
            renderElement({
              section,
              elementKey: "badge",
              defaultText: section.badge,
              className: "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block",
              style: { borderColor: colors.border, color: colors.primary, backgroundColor: `${colors.surface}60` },
              extraProps,
            })}
          {renderElement({
            section,
            elementKey: "heading",
            defaultText: section.title || "Frequently Asked Questions",
            as: "h2",
            className: "text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 break-words",
            extraProps,
          })}
          {renderElement({
            section,
            elementKey: "subtitle",
            defaultText: section.subtitle || "Have questions? Everything you need to know about our platform.",
            as: "p",
            className: "text-base break-words",
            style: { color: colors.muted },
            extraProps,
          })}
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => {
            const isOpen = !!faqOpen[String(idx)];
            return (
              <div
                key={idx}
                className={`border overflow-hidden transition-all ${radius}`}
                style={{ borderColor: colors.border, backgroundColor: colors.surface }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(String(idx))}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-base"
                >
                  {renderElement({
                    section,
                    elementKey: `item-title-${idx}`,
                    defaultText: item.question,
                    as: "span",
                    className: "break-words pr-4",
                    extraProps,
                  })}
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed border-t pt-3 break-words" style={{ borderColor: colors.border, color: colors.muted }}>
                    {renderElement({
                      section,
                      elementKey: `item-desc-${idx}`,
                      defaultText: item.answer,
                      as: "span",
                      extraProps,
                    })}
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

/* 6. CTA COMPONENT */
function renderCTA(section: SectionContent, colors: any, radius: string, extraProps?: ExtraProps) {
  const paddingClass = getSectionPaddingClass(section.customStyles?.paddingY);
  const bgStyle = getSectionBackgroundStyle(section);

  return (
    <section className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t relative overflow-hidden`} style={{ borderColor: colors.border, ...bgStyle }}>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{ backgroundColor: colors.primary }}
      />
      <div
        className={`max-w-4xl mx-auto p-8 sm:p-12 md:p-16 text-center border shadow-2xl relative z-10 break-words ${radius}`}
        style={{ borderColor: colors.border, backgroundColor: colors.surface }}
      >
        {section.badge &&
          renderElement({
            section,
            elementKey: "badge",
            defaultText: section.badge,
            className: "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block",
            style: { borderColor: colors.border, color: colors.primary, backgroundColor: `${colors.bg}80` },
            extraProps,
          })}
        {renderElement({
          section,
          elementKey: "heading",
          defaultText: section.title || "Ready to Transform Your Workflow?",
          as: "h2",
          className: "text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-5 break-words",
          extraProps,
        })}
        {renderElement({
          section,
          elementKey: "subtitle",
          defaultText: section.subtitle || "Start your 14-day free trial today. No credit card required.",
          as: "p",
          className: "text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-8 break-words",
          style: { color: colors.muted },
          extraProps,
        })}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {renderElement({
            section,
            elementKey: "cta",
            defaultText: section.ctaText || "Get Started Now",
            as: "a",
            href: section.ctaLink || "#pricing",
            className: `w-full sm:w-auto px-8 py-3.5 text-base font-bold shadow-xl active:scale-95 transition-all text-center ${radius}`,
            style: { backgroundColor: colors.button, color: "#ffffff" },
            extraProps,
          })}
          {section.secondaryCtaText &&
            renderElement({
              section,
              elementKey: "secondaryCta",
              defaultText: section.secondaryCtaText,
              as: "a",
              href: section.secondaryCtaLink || "#contact",
              className: `w-full sm:w-auto px-8 py-3.5 text-base font-semibold border hover:bg-white/5 active:scale-95 transition-all text-center ${radius}`,
              style: { borderColor: colors.border, color: colors.text },
              extraProps,
            })}
        </div>
      </div>
    </section>
  );
}

/* 7. CONTACT COMPONENT */
function renderContact(section: SectionContent, colors: any, radius: string, extraProps?: ExtraProps) {
  const paddingClass = getSectionPaddingClass(section.customStyles?.paddingY);
  const bgStyle = getSectionBackgroundStyle(section);

  return (
    <section id="contact" className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t`} style={{ borderColor: colors.border, ...bgStyle }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          {section.badge &&
            renderElement({
              section,
              elementKey: "badge",
              defaultText: section.badge,
              className: "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block",
              style: { borderColor: colors.border, color: colors.primary, backgroundColor: `${colors.surface}60` },
              extraProps,
            })}
          {renderElement({
            section,
            elementKey: "heading",
            defaultText: section.title || "Get in Touch",
            as: "h2",
            className: "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 break-words",
            extraProps,
          })}
          {renderElement({
            section,
            elementKey: "subtitle",
            defaultText: section.subtitle || "We would love to hear from you.",
            as: "p",
            className: "text-base break-words",
            style: { color: colors.muted },
            extraProps,
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(section.items || []).map((item, idx) => (
            <div
              key={idx}
              className={`p-6 border text-center break-words h-full flex flex-col justify-between ${radius}`}
              style={{ borderColor: colors.border, backgroundColor: colors.surface }}
            >
              {renderElement({
                section,
                elementKey: `item-title-${idx}`,
                defaultText: item.title,
                as: "h4",
                className: "font-bold text-base mb-2 break-words",
                extraProps,
              })}
              {renderElement({
                section,
                elementKey: `item-desc-${idx}`,
                defaultText: item.description,
                as: "p",
                className: "text-sm break-words",
                style: { color: colors.muted },
                extraProps,
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 8. ABOUT COMPONENT */
function renderAbout(section: SectionContent, colors: any, radius: string, extraProps?: ExtraProps) {
  const paddingClass = getSectionPaddingClass(section.customStyles?.paddingY);
  const bgStyle = getSectionBackgroundStyle(section);

  return (
    <section id="about" className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t`} style={{ borderColor: colors.border, ...bgStyle }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          {section.badge &&
            renderElement({
              section,
              elementKey: "badge",
              defaultText: section.badge,
              className: "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block",
              style: { borderColor: colors.border, color: colors.primary },
              extraProps,
            })}
          {renderElement({
            section,
            elementKey: "heading",
            defaultText: section.title || "About Our Mission",
            as: "h2",
            className: "text-3xl sm:text-4xl font-extrabold tracking-tight mb-6",
            extraProps,
          })}
          {renderElement({
            section,
            elementKey: "subtitle",
            defaultText: section.subtitle || "We believe great design and lightning-fast execution should be accessible to every creator and business.",
            as: "p",
            className: "text-base leading-relaxed mb-6",
            style: { color: colors.muted },
            extraProps,
          })}
          {renderElement({
            section,
            elementKey: "description",
            defaultText: section.description || "Founded by veteran software builders and product designers, our platform bridges the gap between raw AI ideas and finished, enterprise-grade websites.",
            as: "p",
            className: "text-sm leading-relaxed",
            style: { color: colors.muted },
            extraProps,
          })}
        </div>
        <div>
          <SafeImage
            src={section.imageUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80"}
            alt="About showcase"
            className={`w-full h-80 object-cover shadow-2xl border ${radius}`}
          />
        </div>
      </div>
    </section>
  );
}

/* 9. SERVICES COMPONENT */
function renderServices(section: SectionContent, colors: any, radius: string, extraProps?: ExtraProps) {
  const paddingClass = getSectionPaddingClass(section.customStyles?.paddingY);
  const bgStyle = getSectionBackgroundStyle(section);
  const items = section.items || [
    { title: "Strategy & Positioning", description: "Market research, user interview synthesis, and competitive moats." },
    { title: "Experience Architecture", description: "High-converting interaction models and responsive system tokens." },
    { title: "Edge Performance", description: "Zero-latency worldwide delivery with instant SSL." },
  ];

  return (
    <section id="services" className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t`} style={{ borderColor: colors.border, ...bgStyle }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          {renderElement({
            section,
            elementKey: "heading",
            defaultText: section.title || "Our Services",
            as: "h2",
            className: "text-3xl sm:text-4xl font-bold mb-3",
            extraProps,
          })}
          {renderElement({
            section,
            elementKey: "subtitle",
            defaultText: section.subtitle || "End-to-end capabilities tailored to your growth.",
            as: "p",
            className: "text-sm sm:text-base",
            style: { color: colors.muted },
            extraProps,
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className={`p-6 border shadow-lg ${radius}`} style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white mb-4" style={{ backgroundColor: colors.primary }}>
                <Check className="w-5 h-5" />
              </div>
              {renderElement({
                section,
                elementKey: `item-title-${i}`,
                defaultText: item.title,
                as: "h3",
                className: "font-bold text-lg mb-2",
                extraProps,
              })}
              {renderElement({
                section,
                elementKey: `item-desc-${i}`,
                defaultText: item.description,
                as: "p",
                className: "text-sm leading-relaxed",
                style: { color: colors.muted },
                extraProps,
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 10. TEAM COMPONENT */
function renderTeam(section: SectionContent, colors: any, radius: string, extraProps?: ExtraProps) {
  const paddingClass = getSectionPaddingClass(section.customStyles?.paddingY);
  const bgStyle = getSectionBackgroundStyle(section);
  const items = section.items || [
    { title: "Elena Rostova", description: "Founder & Chief Executive", role: "CEO", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" },
    { title: "Marcus Vance", description: "Head of AI & Architecture", role: "CTO", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" },
    { title: "Alex Rivera", description: "Design Principal & Creative Lead", role: "Design Lead", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80" },
  ];

  return (
    <section id="team" className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t`} style={{ borderColor: colors.border, ...bgStyle }}>
      <div className="max-w-5xl mx-auto text-center">
        {renderElement({
          section,
          elementKey: "heading",
          defaultText: section.title || "Meet the Leaders",
          as: "h2",
          className: "text-3xl sm:text-4xl font-bold mb-4",
          extraProps,
        })}
        {renderElement({
          section,
          elementKey: "subtitle",
          defaultText: section.subtitle || "The passionate minds driving our technology and vision.",
          as: "p",
          className: "text-sm sm:text-base max-w-xl mx-auto mb-12",
          style: { color: colors.muted },
          extraProps,
        })}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {items.map((m, i) => (
            <div key={i} className={`p-6 border text-center shadow-lg ${radius}`} style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
              <SafeImage src={m.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"} alt={m.title || "Member"} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2" />
              {renderElement({
                section,
                elementKey: `item-title-${i}`,
                defaultText: m.title,
                as: "h3",
                className: "font-bold text-base",
                extraProps,
              })}
              {renderElement({
                section,
                elementKey: `item-desc-${i}`,
                defaultText: m.role || m.description,
                as: "p",
                className: "text-xs font-semibold uppercase tracking-wider mb-2",
                style: { color: colors.primary },
                extraProps,
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 11. STATS COMPONENT */
function renderStats(section: SectionContent, colors: any, radius: string, extraProps?: ExtraProps) {
  const paddingClass = getSectionPaddingClass(section.customStyles?.paddingY);
  const bgStyle = getSectionBackgroundStyle(section);
  const items = section.items || [
    { title: "99.99%", description: "Guaranteed Edge Uptime" },
    { title: "< 20ms", description: "Global Latency" },
    { title: "45,000+", description: "Websites Deployed" },
    { title: "4.9 / 5", description: "Verified User Satisfaction" },
  ];

  return (
    <section className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t`} style={{ borderColor: colors.border, ...bgStyle }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {items.map((stat, i) => (
            <div key={i} className={`p-6 border ${radius}`} style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
              {renderElement({
                section,
                elementKey: `item-title-${i}`,
                defaultText: stat.title,
                as: "span",
                className: "text-3xl sm:text-4xl font-black block mb-2",
                style: { color: colors.primary },
                extraProps,
              })}
              {renderElement({
                section,
                elementKey: `item-desc-${i}`,
                defaultText: stat.description,
                as: "span",
                className: "text-xs sm:text-sm font-medium",
                style: { color: colors.muted },
                extraProps,
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 12. LOGO CLOUD COMPONENT */
function renderLogoCloud(section: SectionContent, colors: any, radius: string, extraProps?: ExtraProps) {
  const paddingClass = getSectionPaddingClass(section.customStyles?.paddingY);
  const bgStyle = getSectionBackgroundStyle(section);
  const brands = ["HyperScale", "Stripe", "Vercel", "OpenAI", "Supabase", "Retool"];

  return (
    <section className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t text-center`} style={{ borderColor: colors.border, ...bgStyle }}>
      <div className="max-w-5xl mx-auto">
        {renderElement({
          section,
          elementKey: "heading",
          defaultText: section.title || "Trusted by forward-thinking teams worldwide",
          as: "p",
          className: "text-xs font-bold uppercase tracking-widest mb-8",
          style: { color: colors.muted },
          extraProps,
        })}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75">
          {brands.map((b, i) => (
            <span key={i} className="text-lg sm:text-xl font-bold font-mono tracking-tight" style={{ color: colors.muted }}>
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 13. PROCESS COMPONENT */
function renderProcess(section: SectionContent, colors: any, radius: string, extraProps?: ExtraProps) {
  const paddingClass = getSectionPaddingClass(section.customStyles?.paddingY);
  const bgStyle = getSectionBackgroundStyle(section);
  const steps = section.items || [
    { title: "1. Define Business Intent", description: "Provide basic parameters, style preferences, and key conversion metrics." },
    { title: "2. Generate AI Foundation", description: "Our multimodal engine writes custom copy and builds bespoke layout structures." },
    { title: "3. Visual Refinement & Launch", description: "Modify anything in the visual studio editor and publish with one click." },
  ];

  return (
    <section id="process" className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t`} style={{ borderColor: colors.border, ...bgStyle }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          {renderElement({
            section,
            elementKey: "heading",
            defaultText: section.title || "How It Works",
            as: "h2",
            className: "text-3xl sm:text-4xl font-bold mb-3",
            extraProps,
          })}
          {renderElement({
            section,
            elementKey: "subtitle",
            defaultText: section.subtitle || "A seamless three-step process from concept to live deployment.",
            as: "p",
            className: "text-sm sm:text-base",
            style: { color: colors.muted },
            extraProps,
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((st, i) => (
            <div key={i} className={`p-6 border relative ${radius}`} style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
              <span className="text-3xl font-mono font-bold block mb-3" style={{ color: colors.primary }}>0{i + 1}</span>
              {renderElement({
                section,
                elementKey: `item-title-${i}`,
                defaultText: st.title,
                as: "h3",
                className: "font-bold text-lg mb-2",
                extraProps,
              })}
              {renderElement({
                section,
                elementKey: `item-desc-${i}`,
                defaultText: st.description,
                as: "p",
                className: "text-sm leading-relaxed",
                style: { color: colors.muted },
                extraProps,
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 14. PRODUCT SHOWCASE COMPONENT */
function renderProductShowcase(section: SectionContent, colors: any, radius: string, extraProps?: ExtraProps) {
  const paddingClass = getSectionPaddingClass(section.customStyles?.paddingY);
  const bgStyle = getSectionBackgroundStyle(section);

  return (
    <section id="showcase" className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t text-center`} style={{ borderColor: colors.border, ...bgStyle }}>
      <div className="max-w-5xl mx-auto">
        {renderElement({
          section,
          elementKey: "heading",
          defaultText: section.title || "Visual Showcase",
          as: "h2",
          className: "text-3xl sm:text-4xl font-bold mb-4",
          extraProps,
        })}
        {renderElement({
          section,
          elementKey: "subtitle",
          defaultText: section.subtitle || "Explore real screenshots and product workflows.",
          as: "p",
          className: "text-sm sm:text-base max-w-xl mx-auto mb-10",
          style: { color: colors.muted },
          extraProps,
        })}
        <div className={`border p-3 shadow-2xl overflow-hidden ${radius}`} style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
          <SafeImage
            src={section.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1100&auto=format&fit=crop&q=80"}
            alt="Showcase Preview"
            className={`w-full max-h-[500px] object-cover ${radius}`}
          />
        </div>
      </div>
    </section>
  );
}

/* 15. NEWSLETTER COMPONENT */
function renderNewsletter(section: SectionContent, colors: any, radius: string, extraProps?: ExtraProps) {
  const paddingClass = getSectionPaddingClass(section.customStyles?.paddingY);
  const bgStyle = getSectionBackgroundStyle(section);

  return (
    <section className={`px-4 sm:px-6 lg:px-8 ${paddingClass} border-t`} style={{ borderColor: colors.border, ...bgStyle }}>
      <div className={`max-w-3xl mx-auto p-8 sm:p-12 border text-center shadow-xl ${radius}`} style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
        <Mail className="w-10 h-10 mx-auto mb-4" style={{ color: colors.primary }} />
        {renderElement({
          section,
          elementKey: "heading",
          defaultText: section.title || "Join Our Weekly Dispatch",
          as: "h2",
          className: "text-2xl sm:text-3xl font-bold mb-3",
          extraProps,
        })}
        {renderElement({
          section,
          elementKey: "subtitle",
          defaultText: section.subtitle || "Stay up to date with product updates, design trends, and AI innovations.",
          as: "p",
          className: "text-sm sm:text-base max-w-md mx-auto mb-6",
          style: { color: colors.muted },
          extraProps,
        })}
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your work email..."
            className="flex-1 px-4 py-2.5 rounded-lg border bg-black/40 text-sm outline-none"
            style={{ borderColor: colors.border }}
          />
          {renderElement({
            section,
            elementKey: "cta",
            defaultText: section.ctaText || "Subscribe",
            as: "button",
            type: "button",
            className: `px-6 py-2.5 text-sm font-bold text-white shadow-lg active:scale-95 ${radius}`,
            style: { backgroundColor: colors.button },
            extraProps,
          })}
        </div>
      </div>
    </section>
  );
}

/* 16. FOOTER COMPONENT */
function renderFooter(section: SectionContent, colors: any, fallbackName: string, extraProps?: ExtraProps) {
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
          {renderElement({
            section,
            elementKey: "heading",
            defaultText: section.title || fallbackName,
            as: "span",
            className: "font-bold text-base break-words",
            extraProps,
          })}
        </div>

        {renderElement({
          section,
          elementKey: "subtitle",
          defaultText: `© ${new Date().getFullYear()} ${section.title || fallbackName}. Powered by SiteCraft AI.`,
          as: "p",
          className: "text-xs text-center sm:text-right break-words",
          style: { color: colors.muted },
          extraProps,
        })}
      </div>
    </footer>
  );
}
