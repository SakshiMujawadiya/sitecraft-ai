"use client";

import React from "react";
import { Star, Quote } from "lucide-react";
import { SectionContent } from "@/lib/types";
import {
  ExtraProps,
  getSectionPaddingClass,
  getSectionBackgroundStyle,
  renderElement,
} from "../renderUtils";

interface TestimonialsSectionProps {
  section: SectionContent;
  colors: any;
  radius: string;
  extraProps?: ExtraProps;
}

export default function TestimonialsSection({
  section,
  colors,
  radius,
  extraProps,
}: TestimonialsSectionProps) {
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
