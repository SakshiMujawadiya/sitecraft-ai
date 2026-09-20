"use client";

import React from "react";
import { Sparkles, ArrowRight, Cpu } from "lucide-react";
import { SectionContent, WebsiteStyle } from "@/lib/types";
import {
  ExtraProps,
  SafeImage,
  getSectionPaddingClass,
  getSectionBackgroundStyle,
  getElementText,
  renderElement,
} from "../renderUtils";

interface HeroSectionProps {
  section: SectionContent;
  colors: any;
  radius: string;
  style: WebsiteStyle;
  websiteType?: string;
  businessName?: string;
  extraProps?: ExtraProps;
}

export default function HeroSection({
  section,
  colors,
  radius,
  style,
  websiteType,
  businessName,
  extraProps,
}: HeroSectionProps) {
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
            className={`relative border p-3 shadow-2xl backdrop-blur-md overflow-hidden ${radius}`}
            style={{
              borderColor: colors.border,
              backgroundColor: `${colors.surface}99`,
            }}
          >
            <SafeImage
              src={section.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"}
              alt={section.imageAlt || "SaaS Platform Dashboard"}
              className={`w-full h-80 sm:h-96 object-cover ${radius}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
