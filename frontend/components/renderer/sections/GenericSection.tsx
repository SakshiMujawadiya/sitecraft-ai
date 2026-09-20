"use client";

import React from "react";
import { Check, Mail } from "lucide-react";
import { SectionContent } from "@/lib/types";
import {
  ExtraProps,
  SafeImage,
  getSectionPaddingClass,
  getSectionBackgroundStyle,
  renderElement,
} from "../renderUtils";

interface GenericSectionProps {
  section: SectionContent;
  colors: any;
  radius: string;
  extraProps?: ExtraProps;
}

export function ContactSection({ section, colors, radius, extraProps }: GenericSectionProps) {
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

export function AboutSection({ section, colors, radius, extraProps }: GenericSectionProps) {
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

export function ServicesSection({ section, colors, radius, extraProps }: GenericSectionProps) {
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

export function TeamSection({ section, colors, radius, extraProps }: GenericSectionProps) {
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

export function StatsSection({ section, colors, radius, extraProps }: GenericSectionProps) {
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

export function LogoCloudSection({ section, colors, extraProps }: GenericSectionProps) {
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

export function ProcessSection({ section, colors, radius, extraProps }: GenericSectionProps) {
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

export function ProductShowcaseSection({ section, colors, radius, extraProps }: GenericSectionProps) {
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

export function NewsletterSection({ section, colors, radius, extraProps }: GenericSectionProps) {
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

export function RenderFooterSection({ section, colors, fallbackName, extraProps }: GenericSectionProps & { fallbackName?: string }) {
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
