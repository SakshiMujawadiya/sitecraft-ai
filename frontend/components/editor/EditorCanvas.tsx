"use client";

import React from "react";
import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";
import { WebsiteData } from "@/lib/types";

interface EditorCanvasProps {
  canvasContainerRef: React.RefObject<HTMLElement | null>;
  websiteData: WebsiteData;
  viewport: "desktop" | "tablet" | "mobile";
  isPreviewMode: boolean;
  onExitPreview: () => void;
  selectedSectionId: string | null;
  selectedElementId: string | null;
  aiUpdatedSectionId: string | null;
  onSelectSection: (id: string) => void;
  onSelectElement: (secId: string, elemId: string) => void;
  onMoveSection: (secId: string, direction: "up" | "down") => void;
  onDuplicateSection: (secId: string) => void;
  onDeleteSection: (secId: string) => void;
  onToggleVisibility: (secId: string) => void;
}

export default function EditorCanvas({
  canvasContainerRef,
  websiteData,
  viewport,
  isPreviewMode,
  onExitPreview,
  selectedSectionId,
  selectedElementId,
  aiUpdatedSectionId,
  onSelectSection,
  onSelectElement,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
  onToggleVisibility,
}: EditorCanvasProps) {
  return (
    <>
      {/* PREVIEW MODE BANNER */}
      {isPreviewMode && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/90 border border-zinc-700 backdrop-blur-xl px-4 py-2 rounded-full shadow-2xl flex items-center space-x-4 text-xs font-bold text-white">
          <span className="text-zinc-400">Live Visitor Simulation</span>
          <button
            onClick={onExitPreview}
            className="px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            ← Back to Editor
          </button>
        </div>
      )}

      {/* CENTER CANVAS WORKSPACE */}
      <main
        ref={canvasContainerRef}
        className="flex-1 bg-zinc-950/95 overflow-y-auto p-4 md:p-8 flex justify-center items-start min-h-0"
      >
        <div
          className={`transition-all duration-300 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden bg-black ${
            isPreviewMode
              ? "w-full max-w-6xl my-4"
              : viewport === "desktop"
              ? "w-full max-w-6xl"
              : viewport === "tablet"
              ? "w-[768px] max-w-full"
              : "w-[375px] max-w-full"
          }`}
        >
          <WebsiteRenderer
            data={websiteData}
            isEditable={!isPreviewMode}
            selectedSectionId={selectedSectionId}
            selectedElementId={selectedElementId}
            aiUpdatedSectionId={aiUpdatedSectionId}
            onSelectSection={onSelectSection}
            onSelectElement={onSelectElement}
            onMoveSection={onMoveSection}
            onDuplicateSection={onDuplicateSection}
            onDeleteSection={onDeleteSection}
            onToggleVisibility={onToggleVisibility}
          />
        </div>
      </main>
    </>
  );
}
