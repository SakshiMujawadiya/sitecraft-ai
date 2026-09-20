"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RotateCcw,
  RotateCw,
  Monitor,
  Tablet,
  Smartphone,
  Check,
  Loader2,
  Eye,
  Download,
  FileJson,
  Copy,
  Save,
  Globe,
} from "lucide-react";
import { Project } from "@/lib/types";

interface EditorHeaderProps {
  project: Project;
  onProjectNameChange: (name: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  viewport: "desktop" | "tablet" | "mobile";
  onViewportChange: (viewport: "desktop" | "tablet" | "mobile") => void;
  autosaveStatus: "idle" | "saving" | "saved";
  onTogglePreview: () => void;
  isExportOpen: boolean;
  onToggleExport: () => void;
  onExportConfigJson: () => void;
  onCopyConfigToClipboard: () => void;
  saving: boolean;
  onExplicitSave: () => void;
  publishing: boolean;
  onPublishToggle: () => void;
}

export default function EditorHeader({
  project,
  onProjectNameChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  viewport,
  onViewportChange,
  autosaveStatus,
  onTogglePreview,
  isExportOpen,
  onToggleExport,
  onExportConfigJson,
  onCopyConfigToClipboard,
  saving,
  onExplicitSave,
  publishing,
  onPublishToggle,
}: EditorHeaderProps) {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-xl px-4 flex items-center justify-between z-30 shrink-0">
      {/* Left: Back & Project Title & Undo/Redo */}
      <div className="flex items-center space-x-3">
        <Link
          href="/dashboard"
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="h-6 w-px bg-zinc-800" />
        <input
          type="text"
          value={project.name}
          onChange={(e) => onProjectNameChange(e.target.value)}
          className="bg-transparent text-sm font-bold text-white hover:bg-zinc-800/60 focus:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-transparent focus:border-indigo-500 outline-none transition-all max-w-[180px] sm:max-w-xs truncate"
        />

        {/* Undo / Redo controls */}
        <div className="hidden sm:flex items-center space-x-1 pl-2 border-l border-zinc-800">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-25 transition-all"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-25 transition-all"
            title="Redo (Ctrl+Shift+Z)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center: Device Viewport Switcher */}
      <div className="flex items-center space-x-1 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
        <button
          onClick={() => onViewportChange("desktop")}
          className={`p-2 rounded-lg transition-all ${
            viewport === "desktop" ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
          }`}
          title="Desktop View (100%)"
        >
          <Monitor className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewportChange("tablet")}
          className={`p-2 rounded-lg transition-all ${
            viewport === "tablet" ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
          }`}
          title="Tablet View (768px)"
        >
          <Tablet className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewportChange("mobile")}
          className={`p-2 rounded-lg transition-all ${
            viewport === "mobile" ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
          }`}
          title="Mobile View (375px)"
        >
          <Smartphone className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Autosave Status, Preview, Export, Save, Publish */}
      <div className="flex items-center space-x-2.5">
        {/* Autosave Pill */}
        <span className="hidden md:inline-flex items-center space-x-1 text-[11px] font-mono px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
          {autosaveStatus === "saving" ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
              <span>Saving...</span>
            </>
          ) : autosaveStatus === "saved" ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Saved</span>
            </>
          ) : (
            <span>Unsaved changes</span>
          )}
        </span>

        {/* Live Preview Toggle */}
        <button
          onClick={onTogglePreview}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all"
          title="Full Visitor Preview"
        >
          <Eye className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        {/* Export Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={onToggleExport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all"
            title="Export Website Configuration"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {isExportOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs">
              <button
                onClick={onExportConfigJson}
                className="w-full text-left p-2 rounded-lg hover:bg-zinc-800 text-zinc-200 flex items-center space-x-2"
              >
                <FileJson className="w-4 h-4 text-indigo-400" />
                <span>Download JSON</span>
              </button>
              <button
                onClick={onCopyConfigToClipboard}
                className="w-full text-left p-2 rounded-lg hover:bg-zinc-800 text-zinc-200 flex items-center space-x-2"
              >
                <Copy className="w-4 h-4 text-emerald-400" />
                <span>Copy Config JSON</span>
              </button>
            </div>
          )}
        </div>

        {/* Explicit Save Button */}
        <button
          onClick={onExplicitSave}
          disabled={saving}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-all active:scale-95"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>{saving ? "Saving..." : "Save"}</span>
        </button>

        {/* Publish Button */}
        <button
          onClick={onPublishToggle}
          disabled={publishing}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg active:scale-95 ${
            project.isPublished
              ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700"
              : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/25"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{publishing ? "Updating..." : project.isPublished ? "Unpublish" : "Publish Site"}</span>
        </button>
      </div>
    </header>
  );
}
