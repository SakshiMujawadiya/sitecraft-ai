"use client";

import React from "react";
import { WebsiteData } from "@/lib/types";

interface RenderHeaderProps {
  data: WebsiteData;
  isEditable: boolean;
  isSelected: boolean;
  colors: {
    bg: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
    muted: string;
    border: string;
    button: string;
  };
  borderRadiusClass: string;
  onSelectHeader?: () => void;
}

export default function RenderHeader({
  data,
  isEditable,
  isSelected,
  colors,
  borderRadiusClass,
  onSelectHeader,
}: RenderHeaderProps) {
  return (
    <header
      id="canvas-header"
      data-section-id="header"
      onClick={(e) => {
        if (isEditable) {
          e.stopPropagation();
          onSelectHeader?.();
        }
      }}
      className={`sticky top-0 z-30 border-b backdrop-blur-xl transition-all ${
        isEditable ? "cursor-pointer group hover:ring-2 hover:ring-indigo-500/60" : ""
      } ${isSelected ? "ring-2 ring-indigo-500 shadow-2xl z-40" : ""}`}
      style={{
        borderColor: colors.border,
        backgroundColor: `${colors.bg}e6`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 flex items-center justify-center font-bold text-white shadow-lg shrink-0 ${borderRadiusClass}`}
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
          className={`px-4 py-2 text-sm font-bold shadow-lg transition-all active:scale-95 ${borderRadiusClass}`}
          style={{
            backgroundColor: colors.button,
            color: "#ffffff",
          }}
        >
          Get Started
        </a>
      </div>
    </header>
  );
}
