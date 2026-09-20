"use client";

import React from "react";
import {
  Layers,
  Plus,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
} from "lucide-react";
import { WebsiteData, SectionContent } from "@/lib/types";

interface LayersSidebarProps {
  websiteData: WebsiteData;
  selectedSectionId: string | null;
  selectedSidebarRef: React.RefObject<HTMLDivElement | null>;
  editingTitleId: string | null;
  onSelectSection: (secId: string) => void;
  onStartEditingTitle: (secId: string) => void;
  onStopEditingTitle: () => void;
  onUpdateSectionTitle: (title: string) => void;
  onToggleVisibility: (secId: string) => void;
  onMoveSection: (secId: string, direction: "up" | "down") => void;
  onDuplicateSection: (secId: string) => void;
  onDeleteSection: (secId: string) => void;
  onOpenAddSectionModal: () => void;
}

export default function LayersSidebar({
  websiteData,
  selectedSectionId,
  selectedSidebarRef,
  editingTitleId,
  onSelectSection,
  onStartEditingTitle,
  onStopEditingTitle,
  onUpdateSectionTitle,
  onToggleVisibility,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
  onOpenAddSectionModal,
}: LayersSidebarProps) {
  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-900/80 shrink-0 flex flex-col justify-between hidden md:flex min-h-0 overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Pages Selector */}
        <div className="p-3 border-b border-zinc-800 bg-zinc-950/40 flex items-center justify-between text-xs shrink-0">
          <span className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">Pages</span>
          <span className="px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 font-semibold">
            Home (/)
          </span>
        </div>

        {/* Sections Header */}
        <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Sections &amp; Layers</span>
          </span>
          <button
            onClick={onOpenAddSectionModal}
            className="p-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            title="Add Section"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Layers List */}
        <div className="p-2 space-y-1 overflow-y-auto flex-1 min-h-0">
          {/* Header Layer Item */}
          <div
            ref={selectedSectionId === "header" ? selectedSidebarRef : null}
            onClick={() => onSelectSection("header")}
            className={`group px-3 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer flex items-center justify-between transition-all ${
              selectedSectionId === "header"
                ? "bg-indigo-600/20 border-indigo-500/80 text-white shadow-sm"
                : "border-transparent hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <div className="flex items-center space-x-2 truncate">
              <span className="text-indigo-400 font-bold">⚡</span>
              <span className="truncate select-none font-bold">
                Header: {websiteData.businessName || "Site"}
              </span>
            </div>
            <span className="text-[10px] text-indigo-300 bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-800/60">
              Sticky
            </span>
          </div>

          {websiteData.sections.map((sec, idx) => {
            const isSelected = selectedSectionId === sec.id;
            const isHidden = sec.visible === false;
            return (
              <div
                key={sec.id}
                ref={isSelected ? selectedSidebarRef : null}
                onClick={() => onSelectSection(sec.id)}
                className={`group px-3 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer flex items-center justify-between transition-all ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500/80 text-white shadow-sm"
                    : "border-transparent hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
                } ${isHidden ? "opacity-40" : ""}`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-zinc-500 text-[10px] font-mono">☰</span>
                  {editingTitleId === sec.id ? (
                    <input
                      type="text"
                      value={sec.title || ""}
                      autoFocus
                      onBlur={onStopEditingTitle}
                      onChange={(e) => onUpdateSectionTitle(e.target.value)}
                      className="bg-zinc-950 px-1 py-0.5 rounded text-white text-xs border border-indigo-500 outline-none w-28"
                    />
                  ) : (
                    <span
                      onDoubleClick={() => onStartEditingTitle(sec.id)}
                      className="truncate select-none"
                      title="Double-click to rename"
                    >
                      {sec.type}: {sec.title || "Untitled"}
                    </span>
                  )}
                </div>

                {/* Section Quick Action buttons */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(sec.id);
                    }}
                    className="p-0.5 hover:text-white"
                    title={isHidden ? "Show Section" : "Hide Section"}
                  >
                    {isHidden ? <EyeOff className="w-3 h-3 text-amber-400" /> : <Eye className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSection(sec.id, "up");
                    }}
                    disabled={idx === 0}
                    className="p-0.5 hover:text-white disabled:opacity-20"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSection(sec.id, "down");
                    }}
                    disabled={idx === websiteData.sections.length - 1}
                    className="p-0.5 hover:text-white disabled:opacity-20"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateSection(sec.id);
                    }}
                    className="p-0.5 hover:text-white"
                    title="Duplicate Section"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSection(sec.id);
                    }}
                    className="p-0.5 hover:text-rose-400"
                    title="Delete Section"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Footer Layer Item */}
          <div
            ref={selectedSectionId === "footer" ? selectedSidebarRef : null}
            onClick={() => onSelectSection("footer")}
            className={`group px-3 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer flex items-center justify-between transition-all ${
              selectedSectionId === "footer"
                ? "bg-indigo-600/20 border-indigo-500/80 text-white shadow-sm"
                : "border-transparent hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <div className="flex items-center space-x-2 truncate">
              <span className="text-emerald-400 font-bold">⚓</span>
              <span className="truncate select-none font-bold">
                Footer: {websiteData.businessName || "Site"}
              </span>
            </div>
            <span className="text-[10px] text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800/60">
              Footer
            </span>
          </div>
        </div>
      </div>

      {/* Add Section Bottom Button */}
      <div className="p-3.5 border-t border-zinc-800 bg-zinc-950/40 shrink-0">
        <button
          onClick={onOpenAddSectionModal}
          className="w-full py-2.5 px-3 rounded-xl border border-dashed border-zinc-700 hover:border-indigo-500 hover:bg-indigo-950/20 text-xs font-semibold text-zinc-400 hover:text-indigo-300 flex items-center justify-center space-x-2 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Section</span>
        </button>
      </div>
    </aside>
  );
}
