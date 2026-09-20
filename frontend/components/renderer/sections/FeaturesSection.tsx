"use client";

import React from "react";
import { Sparkles, Zap, ArrowRight } from "lucide-react";
import { SectionContent, WebsiteStyle } from "@/lib/types";
import {
  ExtraProps,
  ICON_MAP,
  SafeImage,
  getSectionPaddingClass,
  getSectionBackgroundStyle,
  renderElement,
} from "../renderUtils";

interface FeaturesSectionProps {
  section: SectionContent;
  colors: any;
  radius: string;
  style: WebsiteStyle;
  websiteType?: string;
  extraProps?: ExtraProps;
}

export default function FeaturesSection({
  section,
  colors,
  radius,
  style,
  websiteType,
  extraProps,
}: FeaturesSectionProps) {
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
