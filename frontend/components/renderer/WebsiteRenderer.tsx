"use client";

import React, { useState } from "react";
import { WebsiteData, SectionContent, ColorTheme, WebsiteStyle } from "@/lib/types";
import RenderHeader from "./RenderHeader";
import SectionOverlay from "./SectionOverlay";
import HeroSection from "./sections/HeroSection";
import FeaturesSection from "./sections/FeaturesSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import PricingSection from "./sections/PricingSection";
import FaqSection from "./sections/FaqSection";
import CtaSection from "./sections/CtaSection";
import {
  ContactSection,
  AboutSection,
  ServicesSection,
  TeamSection,
  StatsSection,
  LogoCloudSection,
  ProcessSection,
  ProductShowcaseSection,
  NewsletterSection,
  RenderFooterSection,
} from "./sections/GenericSection";
import { ExtraProps } from "./renderUtils";

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
          h1: "2.25rem",
          h2: "1.5rem",
          h3: "1.25rem",
          body: "0.875rem",
        };
      case "large":
        return {
          h1: "3.75rem",
          h2: "2.5rem",
          h3: "1.75rem",
          body: "1.125rem",
        };
      case "xl":
        return {
          h1: "4.5rem",
          h2: "3rem",
          h3: "2rem",
          body: "1.25rem",
        };
      case "medium":
      default:
        return {
          h1: "3rem",
          h2: "2rem",
          h3: "1.5rem",
          body: "1rem",
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

  const renderSectionByType = (section: SectionContent) => {
    const typeKey = (section.type || "").trim().toLowerCase();
    const extraProps: ExtraProps = {
      isEditable,
      selectedSectionId,
      selectedElementId,
      onSelectElement,
    };
    const radius = getBorderRadius();

    if (typeKey.includes("hero")) {
      return (
        <HeroSection
          section={section}
          colors={colors}
          radius={radius}
          style={style}
          websiteType={data.websiteType}
          businessName={data.businessName}
          extraProps={extraProps}
        />
      );
    }
    if (typeKey.includes("feature")) {
      return (
        <FeaturesSection
          section={section}
          colors={colors}
          radius={radius}
          style={style}
          websiteType={data.websiteType}
          extraProps={extraProps}
        />
      );
    }
    if (typeKey.includes("about")) {
      return <AboutSection section={section} colors={colors} radius={radius} extraProps={extraProps} />;
    }
    if (typeKey.includes("service")) {
      return <ServicesSection section={section} colors={colors} radius={radius} extraProps={extraProps} />;
    }
    if (typeKey.includes("team")) {
      return <TeamSection section={section} colors={colors} radius={radius} extraProps={extraProps} />;
    }
    if (typeKey.includes("stat")) {
      return <StatsSection section={section} colors={colors} radius={radius} extraProps={extraProps} />;
    }
    if (typeKey.includes("logo") || typeKey.includes("partner") || typeKey.includes("client")) {
      return <LogoCloudSection section={section} colors={colors} radius={radius} extraProps={extraProps} />;
    }
    if (typeKey.includes("process") || typeKey.includes("step") || typeKey.includes("how it works")) {
      return <ProcessSection section={section} colors={colors} radius={radius} extraProps={extraProps} />;
    }
    if (typeKey.includes("gallery") || typeKey.includes("product") || typeKey.includes("showcase")) {
      return <ProductShowcaseSection section={section} colors={colors} radius={radius} extraProps={extraProps} />;
    }
    if (typeKey.includes("newsletter") || typeKey.includes("subscribe")) {
      return <NewsletterSection section={section} colors={colors} radius={radius} extraProps={extraProps} />;
    }
    if (typeKey.includes("testimonial") || typeKey.includes("review")) {
      return <TestimonialsSection section={section} colors={colors} radius={radius} extraProps={extraProps} />;
    }
    if (typeKey.includes("pricing") || typeKey.includes("plan")) {
      return <PricingSection section={section} colors={colors} radius={radius} extraProps={extraProps} />;
    }
    if (typeKey.includes("faq") || typeKey.includes("question")) {
      return (
        <FaqSection
          section={section}
          colors={colors}
          radius={radius}
          faqOpen={faqOpen}
          toggleFaq={toggleFaq}
          extraProps={extraProps}
        />
      );
    }
    if (typeKey.includes("cta") || typeKey.includes("call to action")) {
      return <CtaSection section={section} colors={colors} radius={radius} extraProps={extraProps} />;
    }
    if (typeKey.includes("contact")) {
      return <ContactSection section={section} colors={colors} radius={radius} extraProps={extraProps} />;
    }
    if (typeKey.includes("footer")) {
      return <RenderFooterSection section={section} colors={colors} radius={radius} fallbackName={data.businessName} extraProps={extraProps} />;
    }

    return (
      <FeaturesSection
        section={section}
        colors={colors}
        radius={radius}
        style={style}
        websiteType={data.websiteType}
        extraProps={extraProps}
      />
    );
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
      <RenderHeader
        data={data}
        isEditable={isEditable}
        isSelected={selectedSectionId === "header"}
        colors={colors}
        borderRadiusClass={getBorderRadius()}
        onSelectHeader={() => onSelectSection?.("header")}
      />

      {/* Sections Container */}
      <main className="flex flex-col">
        {data.sections.map((section, idx) => {
          const isHidden = section.visible === false;
          if (isHidden && !isEditable) {
            return null;
          }

          const isSelected = selectedSectionId === section.id;

          return (
            <SectionOverlay
              key={section.id || `sec-${idx}`}
              section={section}
              idx={idx}
              totalSections={data.sections.length}
              isEditable={isEditable}
              isSelected={isSelected}
              aiUpdatedSectionId={aiUpdatedSectionId}
              onSelectSection={onSelectSection}
              onMoveSection={onMoveSection}
              onDuplicateSection={onDuplicateSection}
              onDeleteSection={onDeleteSection}
              onToggleVisibility={onToggleVisibility}
            >
              {renderSectionByType(section)}
            </SectionOverlay>
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
            <RenderFooterSection
              section={{
                id: "footer",
                type: "Footer",
                title: data.businessName,
                subtitle: `© ${new Date().getFullYear()} ${data.businessName}. Powered by SiteCraft AI.`,
                description: "Building the next generation of web applications.",
              }}
              colors={colors}
              radius={getBorderRadius()}
              fallbackName={data.businessName}
              extraProps={{ isEditable, selectedSectionId, selectedElementId, onSelectElement }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
