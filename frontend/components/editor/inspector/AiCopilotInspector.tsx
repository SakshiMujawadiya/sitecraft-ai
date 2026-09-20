"use client";

import React, { useState } from "react";
import { Sparkles, Check, Wand2, Loader2 } from "lucide-react";
import { SectionContent } from "@/lib/types";

interface AiCopilotInspectorProps {
  selectedSection: SectionContent | null;
  aiLoading: boolean;
  aiMessage: string | null;
  onRunAiCopilot: (command: string) => Promise<void>;
}

export default function AiCopilotInspector({
  selectedSection,
  aiLoading,
  aiMessage,
  onRunAiCopilot,
}: AiCopilotInspectorProps) {
  const [aiPrompt, setAiPrompt] = useState("");

  const handleApplyCustomPrompt = () => {
    if (!aiPrompt.trim()) return;
    onRunAiCopilot(aiPrompt);
    setAiPrompt("");
  };

  return (
    <div className="p-4 space-y-5 overflow-y-auto flex-1 text-xs">
      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 flex items-start space-x-2.5">
        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-zinc-300 leading-relaxed text-[11px]">
          AI copilot fine-tunes only the selected section in real-time. Choose a quick preset or command.
        </p>
      </div>

      {aiMessage && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>{aiMessage}</span>
        </div>
      )}

      <div>
        <span className="font-semibold text-zinc-300 mb-2 block">Quick Rewrite Presets</span>
        <div className="space-y-1.5">
          {[
            "Make it more professional",
            "Make it shorter",
            "Make it more persuasive",
            "Make it more premium",
            "Rewrite for Gen Z",
            "Improve CTA",
          ].map((cmd) => (
            <button
              key={cmd}
              disabled={aiLoading || !selectedSection}
              onClick={() => onRunAiCopilot(cmd)}
              className="w-full text-left p-2.5 rounded-lg border border-zinc-800 hover:border-indigo-500 hover:bg-zinc-800 text-zinc-300 font-medium transition-all disabled:opacity-40"
            >
              ✨ {cmd}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <label className="font-semibold text-zinc-300 mb-1.5 block">Custom Instructions</label>
        <textarea
          rows={3}
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="e.g. Highlight enterprise security and SOC2 compliance..."
          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
        />
        <button
          disabled={aiLoading || !aiPrompt.trim() || !selectedSection}
          onClick={handleApplyCustomPrompt}
          className="w-full mt-2.5 py-2.5 px-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold transition-all shadow-md active:scale-95 disabled:opacity-40 flex items-center justify-center space-x-1.5"
        >
          {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
          <span>{aiLoading ? "Thinking..." : "Apply AI Instructions"}</span>
        </button>
      </div>
    </div>
  );
}
