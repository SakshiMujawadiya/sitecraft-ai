"use client";

import React from "react";
import { WebsiteData } from "@/lib/types";

interface TypographyInspectorProps {
  theme: WebsiteData["theme"];
  onUpdateWebsiteData: (updater: (prev: WebsiteData) => WebsiteData) => void;
}

export default function TypographyInspector({
  theme,
  onUpdateWebsiteData,
}: TypographyInspectorProps) {
  return (
    <div className="p-4 space-y-5 overflow-y-auto flex-1 text-xs">
      <div>
        <label className="font-semibold text-zinc-300 mb-2 block">Font Family</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Inter",
            "Geist",
            "Poppins",
            "Roboto",
            "Playfair Display",
            "DM Sans",
            "Plus Jakarta Sans",
            "Space Grotesk",
          ].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() =>
                onUpdateWebsiteData((prev) => ({
                  ...prev,
                  theme: { ...prev.theme, fontFamily: f },
                }))
              }
              className={`p-2.5 rounded-lg border text-center font-medium transition-all ${
                theme.fontFamily === f
                  ? "bg-indigo-600/20 border-indigo-500 text-white shadow-sm"
                  : "border-zinc-800 hover:bg-zinc-800 text-zinc-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="font-semibold text-zinc-300 mb-2 block">Heading Font Size</label>
        <div className="grid grid-cols-3 gap-2">
          {(["small", "medium", "large"] as const).map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() =>
                onUpdateWebsiteData((prev) => ({
                  ...prev,
                  theme: { ...prev.theme, fontSize: sz },
                }))
              }
              className={`p-2 rounded-lg border text-center capitalize font-medium transition-all ${
                theme.fontSize === sz
                  ? "bg-indigo-600/20 border-indigo-500 text-white"
                  : "border-zinc-800 hover:bg-zinc-800 text-zinc-400"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="font-semibold text-zinc-300 mb-2 block">Font Weight</label>
        <div className="grid grid-cols-4 gap-1.5">
          {([400, 500, 600, 700] as const).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() =>
                onUpdateWebsiteData((prev) => ({
                  ...prev,
                  theme: { ...prev.theme, fontWeight: w },
                }))
              }
              className={`p-2 rounded-lg border text-center font-mono text-xs transition-all ${
                theme.fontWeight === w
                  ? "bg-indigo-600/20 border-indigo-500 text-white"
                  : "border-zinc-800 hover:bg-zinc-800 text-zinc-400"
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="font-semibold text-zinc-300 mb-2 block">Border Radius</label>
        <div className="grid grid-cols-4 gap-2">
          {(["none", "sm", "md", "lg"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() =>
                onUpdateWebsiteData((prev) => ({
                  ...prev,
                  theme: { ...prev.theme, borderRadius: r },
                }))
              }
              className={`p-2 rounded-lg border text-center font-medium uppercase text-[10px] transition-all ${
                theme.borderRadius === r
                  ? "bg-indigo-600/20 border-indigo-500 text-white"
                  : "border-zinc-800 hover:bg-zinc-800 text-zinc-400"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
