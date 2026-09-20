"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { SectionContent } from "@/lib/types";
import {
  ExtraProps,
  getSectionPaddingClass,
  getSectionBackgroundStyle,
  renderElement,
} from "../renderUtils";

interface FaqSectionProps {
  section: SectionContent;
  colors: any;
  radius: string;
  faqOpen: Record<string, boolean>;
  toggleFaq: (id: string) => void;
  extraProps?: ExtraProps;
}

export default function FaqSection({
  section,
  colors,
  radius,
  faqOpen,
  toggleFaq,
  extraProps,
}: FaqSectionProps) {
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
