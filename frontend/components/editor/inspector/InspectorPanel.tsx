"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { WebsiteData, SectionContent, ElementContent } from "@/lib/types";
import ContentInspector from "./ContentInspector";
import TypographyInspector from "./TypographyInspector";
import ThemeInspector from "./ThemeInspector";
import AiCopilotInspector from "./AiCopilotInspector";

interface InspectorPanelProps {
  activeTab: "content" | "typography" | "styling" | "ai";
  onTabChange: (tab: "content" | "typography" | "styling" | "ai") => void;
  inspectorScrollRef: React.RefObject<HTMLDivElement | null>;
  selectedSection: SectionContent | null;
  selectedElementId: string | null;
  selectedElement: ElementContent | null;
  onUpdateSection: (updates: Partial<SectionContent>) => void;
  onUpdateElement: (elementId: string, updates: Partial<ElementContent>) => void;
  onDeselectElement: () => void;
  onRegenerateSectionDesign: () => void;
  onOpenMediaModal: () => void;
  websiteData: WebsiteData;
  onUpdateWebsiteData: (updater: (prev: WebsiteData) => WebsiteData) => void;
  aiLoading: boolean;
  aiMessage: string | null;
  onRunAiCopilot: (command: string) => Promise<void>;
}

export default function InspectorPanel({
  activeTab,
  onTabChange,
  inspectorScrollRef,
  selectedSection,
  selectedElementId,
  selectedElement,
  onUpdateSection,
  onUpdateElement,
  onDeselectElement,
  onRegenerateSectionDesign,
  onOpenMediaModal,
  websiteData,
  onUpdateWebsiteData,
  aiLoading,
  aiMessage,
  onRunAiCopilot,
}: InspectorPanelProps) {
  return (
    <aside className="w-80 border-l border-zinc-800 bg-zinc-900/90 shrink-0 flex flex-col z-20 min-h-0 overflow-hidden">
      {/* Inspector Tabs header */}
      <div className="h-12 border-b border-zinc-800 px-2 flex items-center justify-between text-xs font-bold shrink-0">
        <button
          onClick={() => onTabChange("content")}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === "content" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          Content
        </button>
        <button
          onClick={() => onTabChange("typography")}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === "typography" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          Typography
        </button>
        <button
          onClick={() => onTabChange("styling")}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === "styling" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          Theme
        </button>
        <button
          onClick={() => onTabChange("ai")}
          className={`flex-1 py-2 text-center rounded-lg transition-all flex items-center justify-center space-x-1 ${
            activeTab === "ai" ? "bg-indigo-600 text-white" : "text-indigo-400 hover:text-indigo-300"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI</span>
        </button>
      </div>

      {/* Tab 1: Section Content & Design Inspector */}
      {activeTab === "content" && (
        <div ref={inspectorScrollRef} className="p-4 space-y-5 overflow-y-auto flex-1 text-xs">
          <ContentInspector
            selectedSection={selectedSection}
            selectedElementId={selectedElementId}
            selectedElement={selectedElement}
            onUpdateSection={onUpdateSection}
            onUpdateElement={onUpdateElement}
            onDeselectElement={onDeselectElement}
            onRegenerateSectionDesign={onRegenerateSectionDesign}
            onOpenMediaModal={onOpenMediaModal}
          />
        </div>
      )}

      {/* Tab 2: Typography Inspector */}
      {activeTab === "typography" && (
        <TypographyInspector
          theme={websiteData.theme}
          onUpdateWebsiteData={onUpdateWebsiteData}
        />
      )}

      {/* Tab 3: Theme & Global Design Tokens */}
      {activeTab === "styling" && (
        <ThemeInspector
          theme={websiteData.theme}
          onUpdateWebsiteData={onUpdateWebsiteData}
        />
      )}

      {/* Tab 4: AI Copilot & Section Redesign */}
      {activeTab === "ai" && (
        <AiCopilotInspector
          selectedSection={selectedSection}
          aiLoading={aiLoading}
          aiMessage={aiMessage}
          onRunAiCopilot={onRunAiCopilot}
        />
      )}
    </aside>
  );
}
