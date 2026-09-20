"use client";

import React, { useState, useEffect } from "react";
import { SectionContent } from "@/lib/types";
import {
  Sparkles,
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
  Award,
  HelpCircle,
} from "lucide-react";

export interface ExtraProps {
  isEditable?: boolean;
  selectedSectionId?: string | null;
  selectedElementId?: string | null;
  onSelectElement?: (sectionId: string, elementId: string) => void;
}

export const ICON_MAP: Record<string, React.ReactNode> = {
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

export function SafeImage({
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

  useEffect(() => {
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

export function getSectionPaddingClass(paddingY?: string) {
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

export function getSectionBackgroundStyle(sec: SectionContent) {
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

export function getButtonRadius(styleRadius?: string, defaultRadius = "rounded-xl") {
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

export function getElementStyle(section: SectionContent, elementKey: string): React.CSSProperties {
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

export function getElementText(section: SectionContent, elementKey: string, fallback: string): string {
  return section.elements?.[elementKey]?.text ?? fallback;
}

export interface RenderElementOptions {
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

export function renderElement({
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
