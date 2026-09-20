"use client";

import React from "react";
import { Check } from "lucide-react";
import { SectionContent } from "@/lib/types";
import {
  ExtraProps,
  getSectionPaddingClass,
  getSectionBackgroundStyle,
  renderElement,
} from "../renderUtils";

interface PricingSectionProps {
  section: SectionContent;
  colors: any;
  radius: string;
  extraProps?: ExtraProps;
}

export default function PricingSection({
  section,
  colors,
  radius,
  extraProps,
}: PricingSectionProps) {
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
