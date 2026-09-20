"use client";

import React from "react";
import { WebsiteData } from "@/lib/types";
import { THEME_PRESETS } from "@/lib/editor-constants";

interface ThemeInspectorProps {
  theme: WebsiteData["theme"];
  onUpdateWebsiteData: (updater: (prev: WebsiteData) => WebsiteData) => void;
}

export default function ThemeInspector({
  theme,
  onUpdateWebsiteData,
}: ThemeInspectorProps) {
  const currentPalette = theme.customPalette || {};

  return (
    <div className="p-4 space-y-6 overflow-y-auto flex-1 text-xs">
      {/* Prebuilt Theme Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-semibold text-zinc-300">Theme Presets</label>
          <button
            type="button"
            onClick={() =>
              onUpdateWebsiteData((prev) => ({
                ...prev,
                theme: {
                  ...prev.theme,
                  colorTheme: "Electric Indigo",
                  customPalette: undefined,
                },
              }))
            }
            className="text-[10px] text-zinc-400 hover:text-white underline"
          >
            Reset Theme
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {THEME_PRESETS.map((p) => {
            const isSelected = theme.style === p.style && theme.colorTheme === p.colorTheme;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  onUpdateWebsiteData((prev) => ({
                    ...prev,
                    theme: {
                      ...prev.theme,
                      colorTheme: p.colorTheme,
                      style: p.style,
                      customPalette: {
                        name: p.colorTheme,
                        primary: p.primary,
                        secondary: p.secondary,
                        accent: p.accent,
                        background: p.bg,
                        surface: p.surface,
                        text: p.text,
                        mutedText: p.muted,
                        border: p.border,
                        button: p.primary,
                      },
                    },
                  }));
                }}
                className={`p-2 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md"
                    : "border-zinc-800 hover:bg-zinc-800 text-zinc-400"
                }`}
              >
                <div className="flex space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.primary }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.bg }} />
                </div>
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Pickers / Design Tokens */}
      <div className="space-y-3 pt-3 border-t border-zinc-800">
        <span className="font-bold text-zinc-300 block">Design Tokens / Color Pickers</span>

        {[
          { label: "Primary Accent", key: "primary", defaultVal: "#6366f1" },
          { label: "Secondary Color", key: "secondary", defaultVal: "#4f46e5" },
          { label: "Background", key: "background", defaultVal: "#09090b" },
          { label: "Surface Card", key: "surface", defaultVal: "#18181b" },
          { label: "Text Color", key: "text", defaultVal: "#fafafa" },
          { label: "Border Color", key: "border", defaultVal: "#27272a" },
        ].map(({ label, key, defaultVal }) => {
          const currentColor = (currentPalette as any)[key] || defaultVal;
          return (
            <div key={key} className="flex items-center justify-between">
              <span className="text-zinc-400 text-[11px]">{label}</span>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    onUpdateWebsiteData((prev) => ({
                      ...prev,
                      theme: {
                        ...prev.theme,
                        customPalette: {
                          ...prev.theme.customPalette,
                          name: prev.theme.colorTheme,
                          primary: prev.theme.customPalette?.primary || "#6366f1",
                          secondary: prev.theme.customPalette?.secondary || "#4f46e5",
                          accent: prev.theme.customPalette?.accent || "#a855f7",
                          background: prev.theme.customPalette?.background || "#09090b",
                          surface: prev.theme.customPalette?.surface || "#18181b",
                          text: prev.theme.customPalette?.text || "#fafafa",
                          mutedText: prev.theme.customPalette?.mutedText || "#a1a1aa",
                          border: prev.theme.customPalette?.border || "#27272a",
                          [key]: newColor,
                        },
                      },
                    }));
                  }}
                  className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
                />
                <span className="font-mono text-[11px] text-zinc-300 w-16">{currentColor}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
