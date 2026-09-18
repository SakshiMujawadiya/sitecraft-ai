"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api-client";
import { Project, SectionContent, SectionType, ColorTheme, WebsiteData } from "@/lib/types";
import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";
import MediaLibraryModal from "@/components/media/MediaLibraryModal";
import {
  Sparkles,
  ArrowLeft,
  Eye,
  Globe,
  Share2,
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
} from "lucide-react";

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default function EditorPage({ params }: EditorPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editor Viewport Mode
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"sections" | "content" | "styling" | "ai">("sections");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // Modals & AI State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Publish State
  const [publishing, setPublishing] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await apiRequest<{ success: boolean; project: Project }>(`/api/projects/${projectId}`);
      if (res.success && res.project) {
        setProject(res.project);
        if (res.project.websiteData.sections.length > 0) {
          setSelectedSectionId(res.project.websiteData.sections[0].id);
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
    }
  };

  const handleSave = async (showNotification = true) => {
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
      if (showNotification) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

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

  /* ================= SECTION ACTIONS ================= */

  const getSelectedSection = (): SectionContent | null => {
    if (!project || !selectedSectionId) return null;
    return project.websiteData.sections.find((s) => s.id === selectedSectionId) || null;
  };

  const updateSelectedSection = (updates: Partial<SectionContent>) => {
    if (!project || !selectedSectionId) return;
    const newSections = project.websiteData.sections.map((s) =>
      s.id === selectedSectionId ? { ...s, ...updates } : s
    );
    setProject({
      ...project,
      websiteData: {
        ...project.websiteData,
        sections: newSections,
      },
    });
  };

  const moveSection = (idx: number, direction: "up" | "down") => {
    if (!project) return;
    const sections = [...project.websiteData.sections];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const temp = sections[idx];
    sections[idx] = sections[targetIdx];
    sections[targetIdx] = temp;

    setProject({
      ...project,
      websiteData: { ...project.websiteData, sections },
    });
  };

  const duplicateSection = (sec: SectionContent) => {
    if (!project) return;
    const newSec: SectionContent = {
      ...sec,
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title: sec.title ? `${sec.title} (Copy)` : undefined,
    };
    const idx = project.websiteData.sections.findIndex((s) => s.id === sec.id);
    const newSections = [...project.websiteData.sections];
    newSections.splice(idx + 1, 0, newSec);

    setProject({
      ...project,
      websiteData: { ...project.websiteData, sections: newSections },
    });
    setSelectedSectionId(newSec.id);
  };

  const deleteSection = (secId: string) => {
    if (!project || project.websiteData.sections.length <= 1) return;
    const newSections = project.websiteData.sections.filter((s) => s.id !== secId);
    setProject({
      ...project,
      websiteData: { ...project.websiteData, sections: newSections },
    });
    if (selectedSectionId === secId) {
      setSelectedSectionId(newSections[0]?.id || null);
    }
  };

  const addSection = (type: SectionType) => {
    if (!project) return;
    const newSec: SectionContent = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type,
      title: `${type} Section Title`,
      subtitle: "Customize this subtitle to highlight your value proposition.",
      items: [
        { title: "Feature One", description: "Highlight item benefit and unique differentiation." },
        { title: "Feature Two", description: "Explain key advantage for your target customers." },
        { title: "Feature Three", description: "Deliver exceptional return on investment." },
      ],
    };

    setProject({
      ...project,
      websiteData: {
        ...project.websiteData,
        sections: [...project.websiteData.sections, newSec],
      },
    });
    setSelectedSectionId(newSec.id);
    setIsAddSectionOpen(false);
    setActiveTab("content");
  };

  /* ================= AI ASSISTANT ================= */

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
        setAiMessage(res.message || "Section updated with AI!");
        setTimeout(() => setAiMessage(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || "AI copilot failed");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm text-zinc-400 font-mono">Loading Studio Canvas...</p>
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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
      {/* ================= TOP STUDIO BAR ================= */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-xl px-4 flex items-center justify-between z-30 shrink-0">
        {/* Left: Back & Project Title */}
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
            className="bg-transparent text-sm font-bold text-white hover:bg-zinc-800/60 focus:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-transparent focus:border-indigo-500 outline-none transition-all max-w-[200px] sm:max-w-xs truncate"
          />
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
          <button
            onClick={() => setViewport("desktop")}
            className={`p-2 rounded-lg transition-all ${
              viewport === "desktop" ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
            title="Desktop View (Full)"
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

        {/* Right: Actions */}
        <div className="flex items-center space-x-2.5">
          {project.isPublished && (
            <Link
              href={`/p/${project.slug}`}
              target="_blank"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>
          )}

          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-all active:scale-95"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            ) : saveSuccess ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saveSuccess ? "Saved!" : "Save"}</span>
          </button>

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

      {/* ================= MAIN STUDIO WORKSPACE ================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================= LEFT SIDEBAR: SECTIONS MANAGER ================= */}
        <aside className="w-64 border-r border-zinc-800 bg-zinc-900/70 shrink-0 flex flex-col justify-between hidden md:flex">
          <div>
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Page Sections</span>
              </span>
              <button
                onClick={() => setIsAddSectionOpen(true)}
                className="p-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                title="Add Section"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
              {project.websiteData.sections.map((sec, idx) => {
                const isSelected = selectedSectionId === sec.id;
                return (
                  <div
                    key={sec.id}
                    onClick={() => {
                      setSelectedSectionId(sec.id);
                      setActiveTab("content");
                    }}
                    className={`group px-3 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500/80 text-white"
                        : "border-transparent hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <span className="truncate">{sec.type}: {sec.title || "Untitled"}</span>

                    {/* Order controls */}
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(idx, "up");
                        }}
                        disabled={idx === 0}
                        className="p-0.5 hover:text-white disabled:opacity-20"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(idx, "down");
                        }}
                        disabled={idx === project.websiteData.sections.length - 1}
                        className="p-0.5 hover:text-white disabled:opacity-20"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateSection(sec);
                        }}
                        className="p-0.5 hover:text-white"
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(sec.id);
                        }}
                        className="p-0.5 hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t border-zinc-800">
            <button
              onClick={() => setIsAddSectionOpen(true)}
              className="w-full py-2 px-3 rounded-xl border border-dashed border-zinc-700 hover:border-indigo-500 hover:bg-indigo-950/20 text-xs font-semibold text-zinc-400 hover:text-indigo-300 flex items-center justify-center space-x-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Section</span>
            </button>
          </div>
        </aside>

        {/* ================= CENTER CANVAS: RESPONSIVE PREVIEW ================= */}
        <main className="flex-1 bg-zinc-950/90 overflow-y-auto p-4 md:p-8 flex justify-center items-start">
          <div
            className={`transition-all duration-300 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden bg-black ${
              viewport === "desktop"
                ? "w-full max-w-6xl"
                : viewport === "tablet"
                ? "w-[768px] max-w-full"
                : "w-[375px] max-w-full"
            }`}
          >
            <WebsiteRenderer
              data={project.websiteData}
              isEditable={true}
              selectedSectionId={selectedSectionId}
              onSelectSection={(id) => {
                setSelectedSectionId(id);
                setActiveTab("content");
              }}
            />
          </div>
        </main>

        {/* ================= RIGHT SIDEBAR: INSPECTOR TABS ================= */}
        <aside className="w-80 border-l border-zinc-800 bg-zinc-900/90 shrink-0 flex flex-col z-20">
          {/* Tabs header */}
          <div className="h-12 border-b border-zinc-800 px-2 flex items-center justify-between text-xs font-bold">
            <button
              onClick={() => setActiveTab("content")}
              className={`flex-1 py-2 text-center rounded-lg transition-all ${
                activeTab === "content" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              Content
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
              <span>AI Copilot</span>
            </button>
          </div>

          {/* Tab 1: Content Inspector */}
          {activeTab === "content" && (
            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
              {selectedSection ? (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <span className="font-bold text-white uppercase tracking-wider">{selectedSection.type} Section</span>
                    <span className="text-[10px] text-zinc-500 font-mono">ID: {selectedSection.id}</span>
                  </div>

                  {selectedSection.badge !== undefined && (
                    <div>
                      <label className="font-semibold text-zinc-400 mb-1.5 block">Badge Label</label>
                      <input
                        type="text"
                        value={selectedSection.badge || ""}
                        onChange={(e) => updateSelectedSection({ badge: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}

                  {selectedSection.title !== undefined && (
                    <div>
                      <label className="font-semibold text-zinc-400 mb-1.5 block">Headline / Title</label>
                      <input
                        type="text"
                        value={selectedSection.title || ""}
                        onChange={(e) => updateSelectedSection({ title: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}

                  {selectedSection.subtitle !== undefined && (
                    <div>
                      <label className="font-semibold text-zinc-400 mb-1.5 block">Subtitle / Description</label>
                      <textarea
                        rows={3}
                        value={selectedSection.subtitle || ""}
                        onChange={(e) => updateSelectedSection({ subtitle: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}

                  {selectedSection.ctaText !== undefined && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-zinc-400 mb-1.5 block">Button Text</label>
                        <input
                          type="text"
                          value={selectedSection.ctaText || ""}
                          onChange={(e) => updateSelectedSection({ ctaText: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-zinc-400 mb-1.5 block">Button Link</label>
                        <input
                          type="text"
                          value={selectedSection.ctaLink || ""}
                          onChange={(e) => updateSelectedSection({ ctaLink: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Image Selector via Media Library */}
                  {selectedSection.imageUrl !== undefined && (
                    <div>
                      <label className="font-semibold text-zinc-400 mb-1.5 block">Section Image</label>
                      <div className="flex items-center space-x-2">
                        <img
                          src={selectedSection.imageUrl}
                          alt="preview"
                          className="w-12 h-12 rounded-lg object-cover border border-zinc-800"
                        />
                        <button
                          type="button"
                          onClick={() => setIsMediaModalOpen(true)}
                          className="flex-1 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold flex items-center justify-center space-x-2 transition-colors"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Change Image</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10 text-zinc-500">
                  Select a section on the canvas to edit its properties.
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Theme & Global Styling */}
          {activeTab === "styling" && (
            <div className="p-4 space-y-5 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="font-semibold text-zinc-400 mb-2 block">Color Palette</label>
                <div className="space-y-2">
                  {(
                    [
                      "Electric Indigo",
                      "Emerald Slate",
                      "Sunset Amber",
                      "Rose Quartz",
                      "Cyberpunk Neon",
                      "Ocean Azure",
                      "Royal Purple",
                      "Monochrome Minimal",
                    ] as ColorTheme[]
                  ).map((c) => (
                    <button
                      key={c}
                      onClick={() =>
                        setProject({
                          ...project,
                          websiteData: {
                            ...project.websiteData,
                            theme: { ...project.websiteData.theme, colorTheme: c },
                          },
                        })
                      }
                      className={`w-full p-2.5 rounded-lg border flex items-center justify-between text-left transition-all ${
                        project.websiteData.theme.colorTheme === c
                          ? "bg-indigo-600/20 border-indigo-500 text-white"
                          : "border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      <span className="font-medium">{c}</span>
                      {project.websiteData.theme.colorTheme === c && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-400 mb-2 block">Font Family</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Inter", "Outfit", "Playfair Display", "Plus Jakarta Sans", "Space Grotesk"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() =>
                        setProject({
                          ...project,
                          websiteData: {
                            ...project.websiteData,
                            theme: { ...project.websiteData.theme, fontFamily: f },
                          },
                        })
                      }
                      className={`p-2 rounded-lg border text-center font-medium transition-all ${
                        project.websiteData.theme.fontFamily === f
                          ? "bg-indigo-600/20 border-indigo-500 text-white"
                          : "border-zinc-800 hover:bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-400 mb-2 block">Border Radius</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["none", "sm", "md", "lg"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() =>
                        setProject({
                          ...project,
                          websiteData: {
                            ...project.websiteData,
                            theme: { ...project.websiteData.theme, borderRadius: r },
                          },
                        })
                      }
                      className={`p-2 rounded-lg border text-center font-medium uppercase text-[10px] transition-all ${
                        project.websiteData.theme.borderRadius === r
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

          {/* Tab 3: AI Assistant inside Editor */}
          {activeTab === "ai" && (
            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  AI modifies the currently selected section in real-time. Choose a quick action or write your custom prompt.
                </p>
              </div>

              {aiMessage && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>{aiMessage}</span>
                </div>
              )}

              <div>
                <span className="font-semibold text-zinc-400 mb-2 block">Quick Suggestions</span>
                <div className="space-y-1.5">
                  {[
                    "Improve this heading",
                    "Make this CTA stronger",
                    "Rewrite paragraph for startups",
                    "Make the content shorter and punchier",
                    "Change tone to ultra luxury",
                    "Add an extra testimonial item",
                    "Add an enterprise capability feature",
                  ].map((cmd) => (
                    <button
                      key={cmd}
                      disabled={aiLoading}
                      onClick={() => runAiCopilot(cmd)}
                      className="w-full text-left p-2 rounded-lg border border-zinc-800 hover:border-indigo-500 hover:bg-zinc-800 text-zinc-300 font-medium transition-all disabled:opacity-50"
                    >
                      ✨ {cmd}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="font-semibold text-zinc-400 mb-1.5 block">Custom AI Prompt</label>
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Rewrite this section targeting B2B finance executives with emphasis on compliance..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
                />
                <button
                  disabled={aiLoading || !aiPrompt.trim()}
                  onClick={() => {
                    runAiCopilot(aiPrompt);
                    setAiPrompt("");
                  }}
                  className="w-full mt-2 py-2 px-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-1.5"
                >
                  {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                  <span>{aiLoading ? "Thinking..." : "Apply AI Instructions"}</span>
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ================= ADD SECTION MODAL ================= */}
      {isAddSectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Add Section to Page</h3>
            <p className="text-xs text-zinc-400 mb-6">Select a section component to insert into your landing page.</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {(["Hero", "Features", "About", "Pricing", "Testimonials", "FAQ", "CTA", "Contact"] as SectionType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => addSection(type)}
                    className="p-3.5 rounded-xl border border-zinc-800 hover:border-indigo-500 hover:bg-zinc-800 text-left transition-all group"
                  >
                    <h4 className="font-bold text-sm text-white group-hover:text-indigo-300">{type}</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Insert pre-styled {type.toLowerCase()} block</p>
                  </button>
                )
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsAddSectionOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
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
              Your landing page is now published and accessible globally with instant edge delivery.
            </p>

            {/* Default Slug URL */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between mb-3">
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

            {/* Custom Domain if Configured */}
            {project.customDomain?.domain ? (
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between mb-6">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block">Custom Domain</span>
                  <span className="text-xs font-mono text-indigo-300 font-semibold block">
                    https://{project.customDomain.domain}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://${project.customDomain?.domain}`);
                      alert("Custom domain copied!");
                    }}
                    className="px-2.5 py-1 text-xs font-bold text-indigo-300 hover:text-white bg-indigo-900/60 rounded-lg transition-colors"
                  >
                    Copy
                  </button>
                  <Link
                    href={`/d/${project.customDomain.domain}`}
                    target="_blank"
                    className="p-1.5 text-indigo-300 hover:text-white bg-indigo-900/60 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Want your own domain? (e.g. yourbrand.com)</span>
                <Link
                  href="/dashboard/settings"
                  className="text-indigo-400 hover:text-indigo-300 font-bold ml-2"
                >
                  Connect Domain →
                </Link>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPublishModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors"
              >
                Keep Editing
              </button>
              <Link
                href={project.customDomain?.domain ? `/d/${project.customDomain.domain}` : `/p/${project.slug}`}
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
