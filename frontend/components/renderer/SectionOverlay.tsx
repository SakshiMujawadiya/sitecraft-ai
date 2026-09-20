"use client";

import React from "react";
import { Sparkles, Eye, EyeOff, ChevronUp, ChevronDown, Copy, Trash2 } from "lucide-react";
import { SectionContent } from "@/lib/types";

interface SectionOverlayProps {
  section: SectionContent;
  idx: number;
  totalSections: number;
  isEditable: boolean;
  isSelected: boolean;
  aiUpdatedSectionId: string | null;
  onSelectSection?: (id: string) => void;
  onMoveSection?: (id: string, direction: "up" | "down") => void;
  onDuplicateSection?: (id: string) => void;
  onDeleteSection?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  children: React.ReactNode;
}

export default function SectionOverlay({
  section,
  idx,
  totalSections,
  isEditable,
  isSelected,
  aiUpdatedSectionId,
  onSelectSection,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
  onToggleVisibility,
  children,
}: SectionOverlayProps) {
  const isHidden = section.visible === false;
  const sectionClasses = `relative transition-all duration-200 ${
    isEditable ? "cursor-pointer group hover:ring-2 hover:ring-indigo-500/60" : ""
  } ${isSelected ? "ring-2 ring-indigo-500 shadow-2xl z-20" : ""} ${
    isHidden ? "opacity-45 grayscale-[30%]" : ""
  }`;

  return (
    <div
      id={`canvas-section-${section.id}`}
      data-section-id={section.id}
      onClick={(e) => {
        e.stopPropagation();
        if (isEditable) onSelectSection?.(section.id);
      }}
      className={sectionClasses}
    >
      {/* AI Upgrade Highlight Notification Banner */}
      {isEditable && aiUpdatedSectionId === section.id && (
        <div className="absolute -top-4 left-6 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs px-3.5 py-1.5 rounded-full font-bold shadow-2xl flex items-center space-x-2 animate-bounce border border-white/20">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>✨ AI Improved Section</span>
        </div>
      )}

      {/* Active Section Selection Ring Badge */}
      {isEditable && isSelected && (
        <div className="absolute top-3 left-4 z-40 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-xl flex items-center space-x-2 border border-indigo-400/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Editing {section.type} Section</span>
        </div>
      )}

      {/* Editable badge indicator on hover */}
      {isEditable && !isSelected && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectSection?.(section.id);
          }}
          className="absolute top-3 left-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-xl backdrop-blur-md cursor-pointer flex items-center space-x-1.5 active:scale-95"
          title="Click to inspect & edit section properties"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{section.type} Section • Click to edit</span>
        </div>
      )}

      {/* Hidden indicator banner */}
      {isEditable && isHidden && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-zinc-900/95 border border-amber-500/40 text-amber-300 text-xs px-3 py-1 rounded-full flex items-center space-x-2 shadow-lg backdrop-blur-md">
          <EyeOff className="w-3.5 h-3.5" />
          <span>Hidden from live site</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility?.(section.id);
            }}
            className="ml-2 font-bold underline hover:text-white"
          >
            Unhide
          </button>
        </div>
      )}

      {/* Floating Section Quick-Action Toolbar on Selection */}
      {isEditable && isSelected && (
        <div className="absolute -top-4 right-6 z-40 bg-zinc-900 border border-indigo-500/80 rounded-lg px-2 py-1 flex items-center space-x-1.5 shadow-2xl backdrop-blur-md text-white text-xs">
          <span className="font-bold text-[11px] text-indigo-300 px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60 uppercase tracking-wider">
            {section.type} {section.variant || section.layout ? `• ${section.variant || section.layout}` : ""}
          </span>
          <div className="h-3.5 w-px bg-zinc-700 mx-0.5" />
          <button
            title="Move Up"
            disabled={idx === 0}
            onClick={(e) => {
              e.stopPropagation();
              onMoveSection?.(section.id, "up");
            }}
            className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white disabled:opacity-25"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            title="Move Down"
            disabled={idx === totalSections - 1}
            onClick={(e) => {
              e.stopPropagation();
              onMoveSection?.(section.id, "down");
            }}
            className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white disabled:opacity-25"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            title="Duplicate"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicateSection?.(section.id);
            }}
            className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            title={section.visible === false ? "Show Section" : "Hide Section"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility?.(section.id);
            }}
            className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white"
          >
            {section.visible === false ? (
              <Eye className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            title="Delete Section"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSection?.(section.id);
            }}
            className="p-1 hover:bg-rose-950/80 rounded text-rose-400 hover:text-rose-300"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {children}
    </div>
  );
}
