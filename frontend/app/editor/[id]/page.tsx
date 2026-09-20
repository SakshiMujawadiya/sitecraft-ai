"use client";

import React, { useState, useEffect, use, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api-client";
import {
  Project,
  SectionContent,
  ElementContent,
  SectionType,
  WebsiteData,
} from "@/lib/types";
import MediaLibraryModal from "@/components/media/MediaLibraryModal";
import EditorHeader from "@/components/editor/EditorHeader";
import LayersSidebar from "@/components/editor/LayersSidebar";
import EditorCanvas from "@/components/editor/EditorCanvas";
import InspectorPanel from "@/components/editor/inspector/InspectorPanel";
import AddSectionModal from "@/components/editor/modals/AddSectionModal";
import PublishSuccessModal from "@/components/editor/modals/PublishSuccessModal";
import { LAYOUT_VARIANTS } from "@/lib/editor-constants";
import { Loader2 } from "lucide-react";

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
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved">("saved");
  const [error, setError] = useState<string | null>(null);

  // Undo / Redo History Stack (up to 50 steps)
  const [history, setHistory] = useState<WebsiteData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Editor Viewport Mode & Fullscreen Preview
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Inspector Tabs & Selections
  const [activeTab, setActiveTab] = useState<"content" | "typography" | "styling" | "ai">("content");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Modals & Export State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);

  // Refs for scrolling synchronization
  const selectedSidebarRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLElement | null>(null);
  const inspectorScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollToCanvasSection = useCallback((secId: string | null, elemId?: string | null) => {
    if (!secId) return;

    if (inspectorScrollRef.current && !elemId) {
      inspectorScrollRef.current.scrollTop = 0;
    }

    setTimeout(() => {
      const container = canvasContainerRef.current;

      if (secId === "header") {
        container?.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (secId === "footer") {
        const footerElem = document.getElementById("canvas-section-footer");
        if (footerElem && container) {
          const containerRect = container.getBoundingClientRect();
          const elemRect = footerElem.getBoundingClientRect();
          const targetScrollTop = container.scrollTop + (elemRect.top - containerRect.top) - 16;
          container.scrollTo({ top: Math.max(0, targetScrollTop), behavior: "smooth" });
        } else if (container) {
          container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
        }
        return;
      }

      if (elemId) {
        const targetedElem = document.querySelector(`[data-section-id="${secId}"][data-element-id="${elemId}"]`);
        if (targetedElem && container) {
          const containerRect = container.getBoundingClientRect();
          const elemRect = targetedElem.getBoundingClientRect();
          const targetScrollTop = container.scrollTop + (elemRect.top - containerRect.top) - 24;
          container.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: "smooth",
          });
          return;
        }
      }

      const targetId = `canvas-section-${secId}`;
      const elem = document.getElementById(targetId);

      if (elem && container) {
        const containerRect = container.getBoundingClientRect();
        const elemRect = elem.getBoundingClientRect();
        const targetScrollTop = container.scrollTop + (elemRect.top - containerRect.top) - 12;

        container.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: "smooth",
        });
      } else if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 40);
  }, []);

  // Auto-scroll the sidebar layer row & center canvas section when selection changes
  useEffect(() => {
    if (selectedSidebarRef.current) {
      selectedSidebarRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    if (selectedSectionId) {
      scrollToCanvasSection(selectedSectionId, selectedElementId);
    }
  }, [selectedSectionId, selectedElementId, scrollToCanvasSection]);

  // AI Assistant State
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
    setProject((prevProject) => {
      if (!prevProject) return null;
      const nextData = updater(prevProject.websiteData);

      if (typeof window !== "undefined") {
        localStorage.setItem(`sitecraft_backup_${projectId}`, JSON.stringify(nextData));
      }

      pushToHistory(nextData);
      triggerAutosave(nextData);

      return { ...prevProject, websiteData: nextData };
    });
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

      if (ctrlKey && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      if ((ctrlKey && e.shiftKey && e.key.toLowerCase() === "z") || (ctrlKey && e.key.toLowerCase() === "y")) {
        e.preventDefault();
        handleRedo();
      }

      if (ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleExplicitSave();
      }

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
            idx === existingFooterIdx
              ? {
                  ...sec,
                  ...updates,
                  customStyles: {
                    ...sec.customStyles,
                    ...updates.customStyles,
                  },
                }
              : sec
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
          customStyles: {
            ...updates.customStyles,
          },
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
        sec.id === selectedSectionId
          ? {
              ...sec,
              ...updates,
              customStyles: {
                ...sec.customStyles,
                ...updates.customStyles,
              },
            }
          : sec
      ),
    }));
  };

  const getSelectedElement = (): ElementContent | null => {
    const sec = getSelectedSection();
    if (!sec || !selectedElementId) return null;

    const elem = sec.elements?.[selectedElementId];
    if (elem) return elem;

    let text = "";
    let link = "";
    if (selectedElementId === "heading") text = sec.title || "";
    else if (selectedElementId === "subtitle") text = sec.subtitle || "";
    else if (selectedElementId === "description") text = sec.description || sec.subtitle || "";
    else if (selectedElementId === "badge") text = sec.badge || "";
    else if (selectedElementId === "cta") {
      text = sec.ctaText || "";
      link = sec.ctaLink || "";
    } else if (selectedElementId === "secondaryCta") {
      text = sec.secondaryCtaText || "";
      link = sec.secondaryCtaLink || "";
    } else if (selectedElementId.startsWith("item-title-")) {
      const idx = parseInt(selectedElementId.replace("item-title-", ""), 10);
      text = sec.items?.[idx]?.title || sec.items?.[idx]?.question || "";
    } else if (selectedElementId.startsWith("item-desc-")) {
      const idx = parseInt(selectedElementId.replace("item-desc-", ""), 10);
      text = sec.items?.[idx]?.description || sec.items?.[idx]?.answer || "";
    } else if (selectedElementId.startsWith("item-price-")) {
      const idx = parseInt(selectedElementId.replace("item-price-", ""), 10);
      text = sec.items?.[idx]?.price || "";
    } else if (selectedElementId.startsWith("item-button-")) {
      const idx = parseInt(selectedElementId.replace("item-button-", ""), 10);
      text = sec.items?.[idx]?.buttonText || "";
      link = sec.items?.[idx]?.link || "";
    }

    return {
      text,
      link,
      style: {},
    };
  };

  const updateSelectedElement = (elementId: string, updates: Partial<ElementContent>) => {
    if (!selectedSectionId) return;

    updateWebsiteData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== selectedSectionId) return sec;

        const existingElements = sec.elements || {};
        const existingElement = existingElements[elementId] || {};

        const updatedElement: ElementContent = {
          ...existingElement,
          ...updates,
          style: {
            ...existingElement.style,
            ...updates.style,
          },
        };

        return {
          ...sec,
          elements: {
            ...existingElements,
            [elementId]: updatedElement,
          },
        };
      }),
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
    downloadAnchor.setAttribute("download", `${project.name.toLowerCase().replace(/\s+/g, "-")}-config.json`);
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
  const selectedElement = getSelectedElement();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
      {/* TOP STUDIO CONTROL BAR */}
      {!isPreviewMode && (
        <EditorHeader
          project={project}
          onProjectNameChange={(name) => setProject({ ...project, name })}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          viewport={viewport}
          onViewportChange={setViewport}
          autosaveStatus={autosaveStatus}
          onTogglePreview={() => setIsPreviewMode(true)}
          isExportOpen={isExportOpen}
          onToggleExport={() => setIsExportOpen(!isExportOpen)}
          onExportConfigJson={exportConfigJson}
          onCopyConfigToClipboard={copyConfigToClipboard}
          saving={saving}
          onExplicitSave={handleExplicitSave}
          publishing={publishing}
          onPublishToggle={handlePublishToggle}
        />
      )}

      {/* MAIN STUDIO WORKSPACE */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT SIDEBAR: SECTIONS / LAYERS */}
        {!isPreviewMode && (
          <LayersSidebar
            websiteData={project.websiteData}
            selectedSectionId={selectedSectionId}
            selectedSidebarRef={selectedSidebarRef}
            editingTitleId={editingTitleId}
            onSelectSection={(secId) => {
              setSelectedSectionId(secId);
              setActiveTab("content");
              scrollToCanvasSection(secId);
            }}
            onStartEditingTitle={setEditingTitleId}
            onStopEditingTitle={() => setEditingTitleId(null)}
            onUpdateSectionTitle={(title) => updateSelectedSection({ title })}
            onToggleVisibility={toggleSectionVisibility}
            onMoveSection={moveSection}
            onDuplicateSection={duplicateSection}
            onDeleteSection={deleteSection}
            onOpenAddSectionModal={() => setIsAddSectionOpen(true)}
          />
        )}

        {/* CENTER CANVAS: RESPONSIVE PREVIEW */}
        <EditorCanvas
          canvasContainerRef={canvasContainerRef}
          websiteData={project.websiteData}
          viewport={viewport}
          isPreviewMode={isPreviewMode}
          onExitPreview={() => setIsPreviewMode(false)}
          selectedSectionId={selectedSectionId}
          selectedElementId={selectedElementId}
          aiUpdatedSectionId={aiUpdatedSectionId}
          onSelectSection={(id) => {
            setSelectedSectionId(id);
            setSelectedElementId(null);
            setActiveTab("content");
            scrollToCanvasSection(id);
          }}
          onSelectElement={(secId, elemId) => {
            setSelectedSectionId(secId);
            setSelectedElementId(elemId);
            setActiveTab("content");
            scrollToCanvasSection(secId);
          }}
          onMoveSection={moveSection}
          onDuplicateSection={duplicateSection}
          onDeleteSection={deleteSection}
          onToggleVisibility={toggleSectionVisibility}
        />

        {/* RIGHT SIDEBAR: PROPERTIES INSPECTOR */}
        {!isPreviewMode && (
          <InspectorPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            inspectorScrollRef={inspectorScrollRef}
            selectedSection={selectedSection}
            selectedElementId={selectedElementId}
            selectedElement={selectedElement}
            onUpdateSection={updateSelectedSection}
            onUpdateElement={updateSelectedElement}
            onDeselectElement={() => setSelectedElementId(null)}
            onRegenerateSectionDesign={regenerateSectionDesign}
            onOpenMediaModal={() => setIsMediaModalOpen(true)}
            websiteData={project.websiteData}
            onUpdateWebsiteData={updateWebsiteData}
            aiLoading={aiLoading}
            aiMessage={aiMessage}
            onRunAiCopilot={runAiCopilot}
          />
        )}
      </div>

      {/* MODALS */}
      <AddSectionModal
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        onAddSection={addSectionFromLibrary}
      />

      <PublishSuccessModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        project={project}
        publicUrl={publicUrl}
      />

      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelectImage={(url) => updateSelectedSection({ imageUrl: url })}
      />
    </div>
  );
}
