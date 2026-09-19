"use client";

import React, { useState, useEffect, use, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api-client";
import {
  Project,
  SectionContent,
  SectionType,
  ColorTheme,
  WebsiteStyle,
  WebsiteData,
} from "@/lib/types";
import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";
import MediaLibraryModal from "@/components/media/MediaLibraryModal";
import {
  Sparkles,
  ArrowLeft,
  Eye,
  EyeOff,
  Globe,
  Save,
  Monitor,
  Tablet,
  Smartphone,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Wand2,
  Layers,
  Palette,
  Type,
  ExternalLink,
  Check,
  Loader2,
  Image as ImageIcon,
  RotateCcw,
  RotateCw,
  Download,
  Share2,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Minimize2,
  X,
  FileJson,
  Edit2,
} from "lucide-react";

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

// Prebuilt theme presets according to specification
const THEME_PRESETS: Array<{
  name: string;
  colorTheme: ColorTheme;
  style: WebsiteStyle;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
}> = [
  {
    name: "Modern",
    colorTheme: "Electric Indigo",
    style: "Modern",
    primary: "#6366f1",
    secondary: "#4f46e5",
    accent: "#a855f7",
    bg: "#09090b",
    surface: "#18181b",
    text: "#fafafa",
    muted: "#a1a1aa",
    border: "#27272a",
  },
  {
    name: "Minimal",
    colorTheme: "Monochrome Minimal",
    style: "Minimal",
    primary: "#ffffff",
    secondary: "#e2e8f0",
    accent: "#71717a",
    bg: "#000000",
    surface: "#111111",
    text: "#ffffff",
    muted: "#a1a1aa",
    border: "#27272a",
  },
  {
    name: "Premium",
    colorTheme: "Sunset Amber",
    style: "Luxury",
    primary: "#f59e0b",
    secondary: "#d97706",
    accent: "#ef4444",
    bg: "#0c0a09",
    surface: "#1c1917",
    text: "#fafaf9",
    muted: "#a8a29e",
    border: "#292524",
  },
  {
    name: "Dark",
    colorTheme: "Cyberpunk Neon",
    style: "Dark",
    primary: "#06b6d4",
    secondary: "#0891b2",
    accent: "#ec4899",
    bg: "#050814",
    surface: "#0e1529",
    text: "#f0fdf4",
    muted: "#94a3b8",
    border: "#1e293b",
  },
  {
    name: "Startup",
    colorTheme: "Electric Indigo",
    style: "Modern",
    primary: "#3b82f6",
    secondary: "#2563eb",
    accent: "#10b981",
    bg: "#090d16",
    surface: "#111827",
    text: "#f9fafb",
    muted: "#9ca3af",
    border: "#1f2937",
  },
  {
    name: "Corporate",
    colorTheme: "Ocean Azure",
    style: "Corporate",
    primary: "#0284c7",
    secondary: "#0369a1",
    accent: "#38bdf8",
    bg: "#081325",
    surface: "#0f1f38",
    text: "#f0f9ff",
    muted: "#7dd3fc",
    border: "#1e3a5f",
  },
  {
    name: "Creative",
    colorTheme: "Rose Quartz",
    style: "Glassmorphism",
    primary: "#f43f5e",
    secondary: "#e11d48",
    accent: "#fb7185",
    bg: "#0f0d11",
    surface: "#1f1b24",
    text: "#fff1f2",
    muted: "#fda4af",
    border: "#362e3d",
  },
  {
    name: "Elegant",
    colorTheme: "Royal Purple",
    style: "Luxury",
    primary: "#9333ea",
    secondary: "#7e22ce",
    accent: "#c084fc",
    bg: "#0b0616",
    surface: "#170e2c",
    text: "#faf5ff",
    muted: "#d8b4fe",
    border: "#2c1d4d",
  },
  {
    name: "Futuristic",
    colorTheme: "Emerald Slate",
    style: "Neon",
    primary: "#10b981",
    secondary: "#059669",
    accent: "#06b6d4",
    bg: "#022c22",
    surface: "#064e3b",
    text: "#ecfdf5",
    muted: "#a7f3d0",
    border: "#047857",
  },
];

// Layout variants per section type
const LAYOUT_VARIANTS: Record<string, string[]> = {
  Hero: ["Centered", "Split", "Image Left", "Image Right", "Full Width", "Asymmetric", "Product Preview"],
  Features: ["Grid", "Bento", "Horizontal", "Vertical", "Numbered", "Showcase"],
  Testimonials: ["Cards", "Featured", "Quote", "Grid"],
  Pricing: ["3 Columns", "2 Columns", "4 Columns", "Featured Plan", "Horizontal"],
  FAQ: ["Accordion", "Grid", "Columns"],
  CTA: ["Centered", "Split", "Card", "Minimal"],
};

export default function EditorPage({ params }: EditorPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved">("saved");
  const [error, setError] = useState<string | null>(null);

  // Undo / Redo History Stack (up to 50 steps)
  const [history, setHistory] = useState<WebsiteData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Editor Viewport Mode & Fullscreen Preview
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Inspector Tabs
  const [activeTab, setActiveTab] = useState<"content" | "typography" | "styling" | "ai">("content");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // Modals & Export State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);

  // Ref for the selected sidebar item — used to scroll it into view
  const selectedSidebarRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll the sidebar layer row to keep it visible when selection changes
  useEffect(() => {
    if (selectedSidebarRef.current) {
      selectedSidebarRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedSectionId]);

  const scrollToCanvasSection = useCallback((secId: string | null) => {
    if (!secId) return;
    setTimeout(() => {
      const elem = document.getElementById(`canvas-section-${secId}`);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 60);
  }, []);

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiUpdatedSectionId, setAiUpdatedSectionId] = useState<string | null>(null);

  // Publish State
  const [publishing, setPublishing] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  // Autosave timer ref
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  /* ================= FETCH & INITIALIZE ================= */

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await apiRequest<{ success: boolean; project: Project }>(`/api/projects/${projectId}`);
      if (res.success && res.project) {
        let initialData = res.project.websiteData;

        // Check local storage backup for unsaved offline changes
        if (typeof window !== "undefined") {
          const localBackup = localStorage.getItem(`sitecraft_backup_${projectId}`);
          if (localBackup) {
            try {
              const parsed = JSON.parse(localBackup);
              if (parsed && parsed.sections) {
                initialData = parsed;
              }
            } catch (e) {}
          }
        }

        const initializedProject = { ...res.project, websiteData: initialData };
        setProject(initializedProject);
        setHistory([initialData]);
        setHistoryIndex(0);

        if (initialData.sections.length > 0) {
          setSelectedSectionId(initialData.sections[0].id);
        }
      } else {
        setError("Project not found");
      }
    } catch (err: any) {
      if (
        err?.message?.includes("401") ||
        err?.message?.includes("Unauthorized") ||
        err?.message?.includes("expired")
      ) {
        router.push("/auth/login");
        return;
      }
      setError(err.message || "Failed to load project");
    } finally {
      setLoading(false);
      isInitialLoadRef.current = false;
    }
  };

  /* ================= HISTORY / UNDO / REDO ================= */

  const pushToHistory = (newData: WebsiteData) => {
    setHistory((prev) => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      const updated = [...upToCurrent, newData];
      if (updated.length > 50) updated.shift();
      return updated;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  };

  const handleUndo = () => {
    if (historyIndex > 0 && project) {
      const targetIndex = historyIndex - 1;
      const targetData = history[targetIndex];
      setHistoryIndex(targetIndex);
      setProject({ ...project, websiteData: targetData });
      triggerAutosave(targetData);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && project) {
      const targetIndex = historyIndex + 1;
      const targetData = history[targetIndex];
      setHistoryIndex(targetIndex);
      setProject({ ...project, websiteData: targetData });
      triggerAutosave(targetData);
    }
  };

  /* ================= STATE UPDATE WITH AUTOSAVE ================= */

  const updateWebsiteData = (updater: (prev: WebsiteData) => WebsiteData) => {
    if (!project) return;
    const nextData = updater(project.websiteData);
    setProject({ ...project, websiteData: nextData });
    pushToHistory(nextData);

    // Save to local storage immediately
    if (typeof window !== "undefined") {
      localStorage.setItem(`sitecraft_backup_${projectId}`, JSON.stringify(nextData));
    }

    triggerAutosave(nextData);
  };

  const triggerAutosave = (dataToSave: WebsiteData) => {
    if (isInitialLoadRef.current) return;
    setAutosaveStatus("saving");
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        await apiRequest(`/api/projects/${projectId}`, {
          method: "PUT",
          data: {
            name: project?.name,
            websiteData: dataToSave,
          },
        });
        setAutosaveStatus("saved");
      } catch (err) {
        setAutosaveStatus("idle");
      }
    }, 1500);
  };

  const handleExplicitSave = async () => {
    if (!project) return;
    try {
      setSaving(true);
      await apiRequest(`/api/projects/${projectId}`, {
        method: "PUT",
        data: {
          name: project.name,
          websiteData: project.websiteData,
        },
      });
      setAutosaveStatus("saved");
    } catch (err: any) {
      setError(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  /* ================= KEYBOARD SHORTCUTS ================= */

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Ctrl/Cmd + Z
      if (ctrlKey && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if ((ctrlKey && e.shiftKey && e.key.toLowerCase() === "z") || (ctrlKey && e.key.toLowerCase() === "y")) {
        e.preventDefault();
        handleRedo();
      }

      // Save: Ctrl/Cmd + S
      if (ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleExplicitSave();
      }

      // Deselect: Escape
      if (e.key === "Escape") {
        setSelectedSectionId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history, project]);

  /* ================= SECTION MANIPULATION ================= */

  const getSelectedSection = (): SectionContent | null => {
    if (!project || !selectedSectionId) return null;
    if (selectedSectionId === "header") {
      return {
        id: "header",
        type: "Header" as any,
        title: project.websiteData.businessName || "SiteCraft AI",
        subtitle: "Global navigation header bar displayed at the top of all pages.",
        ctaText: "Get Started",
        ctaLink: "#pricing",
      };
    }
    if (selectedSectionId === "footer") {
      const existingFooter = project.websiteData.sections.find((s) => s.type === "Footer" || s.id === "footer");
      if (existingFooter) return existingFooter;
      return {
        id: "footer",
        type: "Footer",
        title: project.websiteData.businessName || "SiteCraft AI",
        subtitle: `© ${new Date().getFullYear()} ${project.websiteData.businessName || "SiteCraft AI"}. Powered by SiteCraft AI.`,
        description: "Building the next generation of web applications.",
      };
    }
    return project.websiteData.sections.find((s) => s.id === selectedSectionId) || null;
  };

  const updateSelectedSection = (updates: Partial<SectionContent>) => {
    if (selectedSectionId === "header") {
      updateWebsiteData((prev) => ({
        ...prev,
        businessName: updates.title !== undefined ? updates.title : prev.businessName,
      }));
      return;
    }
    if (selectedSectionId === "footer") {
      const existingFooterIdx = project?.websiteData.sections.findIndex((s) => s.type === "Footer" || s.id === "footer");
      if (existingFooterIdx !== undefined && existingFooterIdx !== -1) {
        updateWebsiteData((prev) => ({
          ...prev,
          sections: prev.sections.map((sec, idx) =>
            idx === existingFooterIdx ? { ...sec, ...updates } : sec
          ),
        }));
      } else {
        const newFooter: SectionContent = {
          id: "footer",
          type: "Footer",
          title: updates.title || project?.websiteData.businessName || "SiteCraft AI",
          subtitle: updates.subtitle || `© ${new Date().getFullYear()} ${project?.websiteData.businessName || "SiteCraft AI"}. Powered by SiteCraft AI.`,
          description: updates.description || "Building the next generation of web applications.",
          ...updates,
        };
        updateWebsiteData((prev) => ({
          ...prev,
          sections: [...prev.sections, newFooter],
        }));
      }
      return;
    }
    updateWebsiteData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === selectedSectionId ? { ...sec, ...updates } : sec
      ),
    }));
  };

  const moveSection = (secId: string, direction: "up" | "down") => {
    if (!project) return;
    const sections = [...project.websiteData.sections];
    const idx = sections.findIndex((s) => s.id === secId);
    if (idx === -1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const temp = sections[idx];
    sections[idx] = sections[targetIdx];
    sections[targetIdx] = temp;

    updateWebsiteData((prev) => ({ ...prev, sections }));
  };

  const toggleSectionVisibility = (secId: string) => {
    updateWebsiteData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === secId ? { ...s, visible: s.visible === false ? true : false } : s
      ),
    }));
  };

  const duplicateSection = (secId: string) => {
    if (!project) return;
    const idx = project.websiteData.sections.findIndex((s) => s.id === secId);
    if (idx === -1) return;
    const sec = project.websiteData.sections[idx];

    const newSec: SectionContent = {
      ...sec,
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title: sec.title ? `${sec.title} (Copy)` : undefined,
    };

    const newSections = [...project.websiteData.sections];
    newSections.splice(idx + 1, 0, newSec);

    updateWebsiteData((prev) => ({ ...prev, sections: newSections }));
    setSelectedSectionId(newSec.id);
  };

  const deleteSection = (secId: string) => {
    if (!project || project.websiteData.sections.length <= 1) return;
    const newSections = project.websiteData.sections.filter((s) => s.id !== secId);
    updateWebsiteData((prev) => ({ ...prev, sections: newSections }));
    if (selectedSectionId === secId) {
      setSelectedSectionId(newSections[0]?.id || null);
    }
  };

  const addSectionFromLibrary = (type: SectionType) => {
    if (!project) return;
    const newSec: SectionContent = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type,
      title: `${type} Section Headline`,
      subtitle: "Customize this section subtitle to highlight your brand message.",
      items: [
        { title: "Core Benefit One", description: "Highlight your key competitive edge and user value." },
        { title: "Core Benefit Two", description: "Explain how this solves key customer pain points." },
        { title: "Core Benefit Three", description: "Deliver exceptional reliability, performance, and satisfaction." },
      ],
    };

    updateWebsiteData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSec],
    }));

    setSelectedSectionId(newSec.id);
    setIsAddSectionOpen(false);
    setActiveTab("content");
  };

  /* ================= PUBLISH & EXPORT ================= */

  const handlePublishToggle = async () => {
    if (!project) return;
    try {
      setPublishing(true);
      const res = await apiRequest<{ success: boolean; project: Project; publicUrl: string }>(
        `/api/projects/${projectId}/publish`,
        {
          method: "POST",
          data: { publish: !project.isPublished },
        }
      );
      if (res.success && res.project) {
        setProject(res.project);
        setPublicUrl(res.publicUrl);
        setPublishModalOpen(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update publish state");
    } finally {
      setPublishing(false);
    }
  };

  const exportConfigJson = () => {
    if (!project) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project.websiteData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${project.name.toLowerCase().replace(/\\s+/g, "-")}-config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setIsExportOpen(false);
  };

  const copyConfigToClipboard = () => {
    if (!project) return;
    navigator.clipboard.writeText(JSON.stringify(project.websiteData, null, 2));
    alert("Website configuration JSON copied to clipboard!");
    setIsExportOpen(false);
  };

  /* ================= AI REGENERATION INSIDE EDITOR ================= */

  const runAiCopilot = async (command: string) => {
    const activeSec = getSelectedSection();
    if (!activeSec) return;

    setAiLoading(true);
    setAiMessage(null);

    try {
      const res = await apiRequest<{ success: boolean; section: SectionContent; message: string }>(
        "/api/ai/improve",
        {
          method: "POST",
          data: {
            section: activeSec,
            command,
            businessContext: {
              name: project?.websiteData.businessName,
              type: project?.websiteData.websiteType,
            },
          },
        }
      );

      if (res.success && res.section) {
        updateSelectedSection(res.section);
        setAiMessage(res.message || "Section upgraded with AI!");
        setAiUpdatedSectionId(activeSec.id);
        scrollToCanvasSection(activeSec.id);
        setTimeout(() => setAiMessage(null), 4000);
        setTimeout(() => setAiUpdatedSectionId(null), 5000);
      }
    } catch (err: any) {
      setError(err.message || "AI copilot failed");
    } finally {
      setAiLoading(false);
    }
  };

  const regenerateSectionDesign = () => {
    const activeSec = getSelectedSection();
    if (!activeSec) return;
    const variants = LAYOUT_VARIANTS[activeSec.type] || ["Grid", "Bento", "Horizontal"];
    const currentVariant = activeSec.variant || activeSec.layout || variants[0];
    const currentIndex = variants.indexOf(currentVariant);
    const nextVariant = variants[(currentIndex + 1) % variants.length];

    updateSelectedSection({
      variant: nextVariant,
      layout: nextVariant,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm text-zinc-400 font-mono">Loading Studio Canvas & Visual Builder...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6">
        <p className="text-lg font-bold mb-4">{error || "Project not found"}</p>
        <Link href="/dashboard" className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-semibold">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const selectedSection = getSelectedSection();
  const theme = project.websiteData.theme;
  const currentPalette = theme.customPalette || {};

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
      {/* ================= TOP STUDIO CONTROL BAR ================= */}
      {!isPreviewMode && (
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
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              className="bg-transparent text-sm font-bold text-white hover:bg-zinc-800/60 focus:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-transparent focus:border-indigo-500 outline-none transition-all max-w-[180px] sm:max-w-xs truncate"
            />

            {/* Undo / Redo controls */}
            <div className="hidden sm:flex items-center space-x-1 pl-2 border-l border-zinc-800">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-25 transition-all"
                title="Undo (Ctrl+Z)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
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
              onClick={() => setViewport("desktop")}
              className={`p-2 rounded-lg transition-all ${
                viewport === "desktop" ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport("tablet")}
              className={`p-2 rounded-lg transition-all ${
                viewport === "tablet" ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport("mobile")}
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
              onClick={() => setIsPreviewMode(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all"
              title="Full Visitor Preview"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            {/* Export Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all"
                title="Export Website Configuration"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {isExportOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs">
                  <button
                    onClick={exportConfigJson}
                    className="w-full text-left p-2 rounded-lg hover:bg-zinc-800 text-zinc-200 flex items-center space-x-2"
                  >
                    <FileJson className="w-4 h-4 text-indigo-400" />
                    <span>Download JSON</span>
                  </button>
                  <button
                    onClick={copyConfigToClipboard}
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
              onClick={handleExplicitSave}
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
              onClick={handlePublishToggle}
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
      )}

      {/* ================= PREVIEW MODE BANNER ================= */}
      {isPreviewMode && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/90 border border-zinc-700 backdrop-blur-xl px-4 py-2 rounded-full shadow-2xl flex items-center space-x-4 text-xs font-bold text-white">
          <span className="text-zinc-400">Live Visitor Simulation</span>
          <button
            onClick={() => setIsPreviewMode(false)}
            className="px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            ← Back to Editor
          </button>
        </div>
      )}

      {/* ================= MAIN STUDIO WORKSPACE ================= */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* ================= LEFT SIDEBAR: SECTIONS / LAYERS ================= */}
        {!isPreviewMode && (
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
                  onClick={() => setIsAddSectionOpen(true)}
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
                  onClick={() => {
                    setSelectedSectionId("header");
                    setActiveTab("content");
                    scrollToCanvasSection("header");
                  }}
                  className={`group px-3 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer flex items-center justify-between transition-all ${
                    selectedSectionId === "header"
                      ? "bg-indigo-600/20 border-indigo-500/80 text-white shadow-sm"
                      : "border-transparent hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-indigo-400 font-bold">⚡</span>
                    <span className="truncate select-none font-bold">
                      Header: {project.websiteData.businessName || "Site"}
                    </span>
                  </div>
                  <span className="text-[10px] text-indigo-300 bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-800/60">
                    Sticky
                  </span>
                </div>

                {project.websiteData.sections.map((sec, idx) => {
                  const isSelected = selectedSectionId === sec.id;
                  const isHidden = sec.visible === false;
                  return (
                    <div
                      key={sec.id}
                      ref={isSelected ? selectedSidebarRef : null}
                      onClick={() => {
                        setSelectedSectionId(sec.id);
                        setActiveTab("content");
                        scrollToCanvasSection(sec.id);
                      }}
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
                            onBlur={() => setEditingTitleId(null)}
                            onChange={(e) => updateSelectedSection({ title: e.target.value })}
                            className="bg-zinc-950 px-1 py-0.5 rounded text-white text-xs border border-indigo-500 outline-none w-28"
                          />
                        ) : (
                          <span
                            onDoubleClick={() => setEditingTitleId(sec.id)}
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
                            toggleSectionVisibility(sec.id);
                          }}
                          className="p-0.5 hover:text-white"
                          title={isHidden ? "Show Section" : "Hide Section"}
                        >
                          {isHidden ? <EyeOff className="w-3 h-3 text-amber-400" /> : <Eye className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSection(sec.id, "up");
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
                            moveSection(sec.id, "down");
                          }}
                          disabled={idx === project.websiteData.sections.length - 1}
                          className="p-0.5 hover:text-white disabled:opacity-20"
                          title="Move Down"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateSection(sec.id);
                          }}
                          className="p-0.5 hover:text-white"
                          title="Duplicate Section"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSection(sec.id);
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
                  onClick={() => {
                    setSelectedSectionId("footer");
                    setActiveTab("content");
                    scrollToCanvasSection("footer");
                  }}
                  className={`group px-3 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer flex items-center justify-between transition-all ${
                    selectedSectionId === "footer"
                      ? "bg-indigo-600/20 border-indigo-500/80 text-white shadow-sm"
                      : "border-transparent hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-emerald-400 font-bold">⚓</span>
                    <span className="truncate select-none font-bold">
                      Footer: {project.websiteData.businessName || "Site"}
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
                onClick={() => setIsAddSectionOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-zinc-700 hover:border-indigo-500 hover:bg-indigo-950/20 text-xs font-semibold text-zinc-400 hover:text-indigo-300 flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Section</span>
              </button>
            </div>
          </aside>
        )}

        {/* ================= CENTER CANVAS: RESPONSIVE PREVIEW ================= */}
        <main className="flex-1 bg-zinc-950/95 overflow-y-auto p-4 md:p-8 flex justify-center items-start min-h-0">
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
              data={project.websiteData}
              isEditable={!isPreviewMode}
              selectedSectionId={selectedSectionId}
              aiUpdatedSectionId={aiUpdatedSectionId}
              onSelectSection={(id) => {
                setSelectedSectionId(id);
                setActiveTab("content");
                scrollToCanvasSection(id);
              }}
              onMoveSection={moveSection}
              onDuplicateSection={duplicateSection}
              onDeleteSection={deleteSection}
              onToggleVisibility={toggleSectionVisibility}
            />
          </div>
        </main>

        {/* ================= RIGHT SIDEBAR: PROPERTIES INSPECTOR ================= */}
        {!isPreviewMode && (
          <aside className="w-80 border-l border-zinc-800 bg-zinc-900/90 shrink-0 flex flex-col z-20 min-h-0 overflow-hidden">
            {/* Inspector Tabs header */}
            <div className="h-12 border-b border-zinc-800 px-2 flex items-center justify-between text-xs font-bold shrink-0">
              <button
                onClick={() => setActiveTab("content")}
                className={`flex-1 py-2 text-center rounded-lg transition-all ${
                  activeTab === "content" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setActiveTab("typography")}
                className={`flex-1 py-2 text-center rounded-lg transition-all ${
                  activeTab === "typography" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Typography
              </button>
              <button
                onClick={() => setActiveTab("styling")}
                className={`flex-1 py-2 text-center rounded-lg transition-all ${
                  activeTab === "styling" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Theme
              </button>
              <button
                onClick={() => setActiveTab("ai")}
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
              <div className="p-4 space-y-5 overflow-y-auto flex-1 text-xs">
                {selectedSection ? (
                  <>
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <div>
                        <span className="font-bold text-white text-sm uppercase tracking-wider block">
                          {selectedSection.type} Section
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">ID: {selectedSection.id}</span>
                      </div>
                      <button
                        onClick={regenerateSectionDesign}
                        className="px-2.5 py-1 rounded bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 font-semibold hover:bg-indigo-900 transition-colors flex items-center space-x-1 text-[11px]"
                        title="Cycle to next layout variant"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Swap Layout</span>
                      </button>
                    </div>

                    {/* Section Layout Variant Selector */}
                    {LAYOUT_VARIANTS[selectedSection.type] && (
                      <div>
                        <label className="font-semibold text-zinc-300 mb-1.5 block">Layout Variant</label>
                        <select
                          value={selectedSection.variant || selectedSection.layout || LAYOUT_VARIANTS[selectedSection.type][0]}
                          onChange={(e) =>
                            updateSelectedSection({
                              variant: e.target.value,
                              layout: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500 font-semibold"
                        >
                          {LAYOUT_VARIANTS[selectedSection.type].map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Badge Label */}
                    <div>
                      <label className="font-semibold text-zinc-400 mb-1 block">Badge Text</label>
                      <input
                        type="text"
                        value={selectedSection.badge || ""}
                        onChange={(e) => updateSelectedSection({ badge: e.target.value })}
                        placeholder="e.g. Next-Gen Intelligence"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Headline / Title */}
                    <div>
                      <label className="font-semibold text-zinc-400 mb-1 block">Headline / Title</label>
                      <input
                        type="text"
                        value={selectedSection.title || ""}
                        onChange={(e) => updateSelectedSection({ title: e.target.value })}
                        placeholder="Section title"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Subtitle / Description */}
                    <div>
                      <label className="font-semibold text-zinc-400 mb-1 block">Subtitle / Description</label>
                      <textarea
                        rows={3}
                        value={selectedSection.subtitle || ""}
                        onChange={(e) => updateSelectedSection({ subtitle: e.target.value })}
                        placeholder="Supporting description..."
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Button Controls */}
                    <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                      <span className="font-bold text-zinc-300 block text-[11px]">Primary Button</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-zinc-400 mb-1 block">Button Text</label>
                          <input
                            type="text"
                            value={selectedSection.ctaText || ""}
                            onChange={(e) => updateSelectedSection({ ctaText: e.target.value })}
                            placeholder="Get Started"
                            className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-400 mb-1 block">Button Link</label>
                          <input
                            type="text"
                            value={selectedSection.ctaLink || ""}
                            onChange={(e) => updateSelectedSection({ ctaLink: e.target.value })}
                            placeholder="#pricing"
                            className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image Editor */}
                    <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                      <span className="font-bold text-zinc-300 block text-[11px]">Image Editor</span>
                      <div className="flex items-center space-x-2">
                        <img
                          src={selectedSection.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format&fit=crop&q=80"}
                          alt="preview"
                          className="w-12 h-12 rounded-lg object-cover border border-zinc-800 shrink-0"
                        />
                        <button
                          type="button"
                          onClick={() => setIsMediaModalOpen(true)}
                          className="flex-1 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Choose Unsplash Image</span>
                        </button>
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 mb-1 block">Or Paste Direct Image URL</label>
                        <input
                          type="text"
                          value={selectedSection.imageUrl || ""}
                          onChange={(e) => updateSelectedSection({ imageUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs outline-none"
                        />
                      </div>
                    </div>

                    {/* Section Spacing Controls */}
                    <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2.5">
                      <span className="font-bold text-zinc-300 block text-[11px]">Section Spacing (Padding)</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(["compact", "normal", "spacious"] as const).map((p) => {
                          const currentPadding = selectedSection.customStyles?.paddingY || "normal";
                          const isActive = currentPadding === p;
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() =>
                                updateSelectedSection({
                                  customStyles: {
                                    ...selectedSection.customStyles,
                                    paddingY: p,
                                  },
                                })
                              }
                              className={`py-1.5 text-center rounded capitalize font-medium text-[11px] transition-all border ${
                                isActive
                                  ? "bg-indigo-600/30 border-indigo-500 text-white"
                                  : "border-zinc-800 hover:bg-zinc-800 text-zinc-400"
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section Items (Features / Testimonials / Pricing / FAQ) */}
                    {selectedSection.items && selectedSection.items.length > 0 && (
                      <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-300 text-[11px]">Structured Items ({selectedSection.items.length})</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [
                                ...selectedSection.items!,
                                {
                                  title: `New ${selectedSection.type} Item`,
                                  description: "Add a crisp description for this capability.",
                                },
                              ];
                              updateSelectedSection({ items: newItems });
                            }}
                            className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Item</span>
                          </button>
                        </div>

                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {selectedSection.items.map((item, iIdx) => (
                            <div key={iIdx} className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <input
                                  type="text"
                                  value={item.title || item.question || ""}
                                  onChange={(e) => {
                                    const nextItems = [...selectedSection.items!];
                                    nextItems[iIdx] = { ...item, title: e.target.value, question: e.target.value };
                                    updateSelectedSection({ items: nextItems });
                                  }}
                                  placeholder="Item Title"
                                  className="w-full bg-transparent font-semibold text-white text-xs outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextItems = selectedSection.items!.filter((_, idx) => idx !== iIdx);
                                    updateSelectedSection({ items: nextItems });
                                  }}
                                  className="text-zinc-500 hover:text-rose-400 p-0.5"
                                  title="Delete Item"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <textarea
                                rows={2}
                                value={item.description || item.answer || ""}
                                onChange={(e) => {
                                  const nextItems = [...selectedSection.items!];
                                  nextItems[iIdx] = { ...item, description: e.target.value, answer: e.target.value };
                                  updateSelectedSection({ items: nextItems });
                                }}
                                placeholder="Item description / answer..."
                                className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-800 text-[11px] text-zinc-300 outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-zinc-500">
                    Click any section on the canvas to inspect its layout and properties.
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Typography Inspector */}
            {activeTab === "typography" && (
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
                          updateWebsiteData((prev) => ({
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
                          updateWebsiteData((prev) => ({
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
                          updateWebsiteData((prev) => ({
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
                          updateWebsiteData((prev) => ({
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
            )}

            {/* Tab 3: Theme & Global Design Tokens */}
            {activeTab === "styling" && (
              <div className="p-4 space-y-6 overflow-y-auto flex-1 text-xs">
                {/* Prebuilt Theme Presets */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-semibold text-zinc-300">Theme Presets</label>
                    <button
                      type="button"
                      onClick={() =>
                        updateWebsiteData((prev) => ({
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
                            updateWebsiteData((prev) => ({
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
                    const currentColor =
                      (currentPalette as any)[key] || defaultVal;
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-zinc-400 text-[11px]">{label}</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={currentColor}
                            onChange={(e) => {
                              const newColor = e.target.value;
                              updateWebsiteData((prev) => ({
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
            )}

            {/* Tab 4: AI Copilot & Section Redesign */}
            {activeTab === "ai" && (
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
                        onClick={() => runAiCopilot(cmd)}
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
                    onClick={() => {
                      runAiCopilot(aiPrompt);
                      setAiPrompt("");
                    }}
                    className="w-full mt-2.5 py-2.5 px-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold transition-all shadow-md active:scale-95 disabled:opacity-40 flex items-center justify-center space-x-1.5"
                  >
                    {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                    <span>{aiLoading ? "Thinking..." : "Apply AI Instructions"}</span>
                  </button>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* ================= CATEGORIZED ADD SECTION MODAL ================= */}
      {isAddSectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-lg font-bold text-white">Add Section to Page</h3>
                <p className="text-xs text-zinc-400">Choose a component block from our categorized library.</p>
              </div>
              <button
                onClick={() => setIsAddSectionOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Category 1: Content */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2.5">Content</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(["Hero", "Features", "About", "Services", "Team", "Testimonials", "FAQ"] as SectionType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => addSectionFromLibrary(type)}
                      className="p-3 rounded-xl border border-zinc-800 hover:border-indigo-500 hover:bg-zinc-800 text-left transition-all group"
                    >
                      <span className="font-bold text-sm text-white group-hover:text-indigo-300 block">{type}</span>
                      <span className="text-[10px] text-zinc-500">Insert {type.toLowerCase()} block</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category 2: Business */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2.5">Business</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(["Pricing", "Stats", "Logo Cloud", "Process"] as SectionType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => addSectionFromLibrary(type)}
                      className="p-3 rounded-xl border border-zinc-800 hover:border-emerald-500 hover:bg-zinc-800 text-left transition-all group"
                    >
                      <span className="font-bold text-sm text-white group-hover:text-emerald-300 block">{type}</span>
                      <span className="text-[10px] text-zinc-500">Insert {type.toLowerCase()} block</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category 3: Media & Conversion */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">Media &amp; Conversion</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(["Product Showcase", "CTA", "Newsletter", "Contact"] as SectionType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => addSectionFromLibrary(type)}
                      className="p-3 rounded-xl border border-zinc-800 hover:border-amber-500 hover:bg-zinc-800 text-left transition-all group"
                    >
                      <span className="font-bold text-sm text-white group-hover:text-amber-300 block">{type}</span>
                      <span className="text-[10px] text-zinc-500">Insert {type.toLowerCase()} block</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PUBLISH SUCCESS MODAL ================= */}
      {publishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Your Website is Live!</h3>
            <p className="text-xs text-zinc-400 mb-6">
              Your landing page is now published globally with instant edge delivery.
            </p>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between mb-4">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Default Edge URL</span>
                <span className="text-xs font-mono text-emerald-400 truncate max-w-[240px] block">
                  {publicUrl || `${typeof window !== "undefined" ? window.location.origin : ""}/p/${project.slug}`}
                </span>
              </div>
              <button
                onClick={() => {
                  const url = publicUrl || `${window.location.origin}/p/${project.slug}`;
                  navigator.clipboard.writeText(url);
                  alert("Link copied to clipboard!");
                }}
                className="px-2.5 py-1 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-800 rounded-lg transition-colors"
              >
                Copy
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPublishModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors"
              >
                Keep Editing
              </button>
              <Link
                href={`/p/${project.slug}`}
                target="_blank"
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-1"
              >
                <span>Visit Site</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ================= MEDIA LIBRARY MODAL ================= */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelectImage={(url) => updateSelectedSection({ imageUrl: url })}
      />
    </div>
  );
}
