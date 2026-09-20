"use client";

import React from "react";
import { SectionContent } from "@/lib/types";
import {
  ExtraProps,
  getSectionPaddingClass,
  getSectionBackgroundStyle,
  renderElement,
} from "../renderUtils";

interface CtaSectionProps {
  section: SectionContent;
  colors: any;
  radius: string;
  extraProps?: ExtraProps;
}

export default function CtaSection({
  section,
  colors,
  radius,
  extraProps,
}: CtaSectionProps) {
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
