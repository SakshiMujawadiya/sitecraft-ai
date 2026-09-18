"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api-client";
import {
  AIReadingResult,
  WebsiteData,
  WebsiteType,
  WebsiteStyle,
  ColorTheme,
  Project,
} from "@/lib/types";
import {
  Sparkles,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  Download,
  CheckCircle2,
  HelpCircle,
  Layers,
  Loader2,
  ArrowRight,
  Clipboard,
  Trash2,
  Globe,
  Edit3,
  ExternalLink,
  Sliders,
  Maximize2,
  FileText,
} from "lucide-react";
import Link from "next/link";

const PRESETS = [
  {
    name: "BioSync Wearables",
    type: "Startup" as WebsiteType,
    style: "Glassmorphism" as WebsiteStyle,
    colorTheme: "Emerald Slate" as ColorTheme,
    prompt:
      "BioSync is a next-generation metabolic health wearable that continuously monitors cellular recovery, glucose, and cortisol 24/7. Turn biometric telemetry into actionable daily protocols.",
  },
  {
    name: "CloudScale AI Platform",
    type: "SaaS" as WebsiteType,
    style: "Modern" as WebsiteStyle,
    colorTheme: "Electric Indigo" as ColorTheme,
    prompt:
      "CloudScale AI orchestrates distributed GPU workloads, serverless model inference, and multi-cloud clusters with zero DevOps configuration for engineering teams.",
  },
  {
    name: "GrowthForge Studio",
    type: "Agency" as WebsiteType,
    style: "Dark" as WebsiteStyle,
    colorTheme: "Sunset Amber" as ColorTheme,
    prompt:
      "GrowthForge is a product-led conversion optimization and growth engineering agency helping high-growth B2B software companies scale customer lifetime value.",
  },
];

const WEBSITE_TYPES: WebsiteType[] = [
  "SaaS",
  "Startup",
  "AI Tool",
  "Agency",
  "Portfolio",
  "Ecommerce",
];

const WEBSITE_STYLES: WebsiteStyle[] = [
  "Modern",
  "Glassmorphism",
  "Dark",
  "Luxury",
  "Minimal",
  "Neon",
];

export default function AIWebsiteGeneratorPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/reading");
    }
  }, [authLoading, user, router]);

  // Form State
  const [businessName, setBusinessName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [websiteType, setWebsiteType] = useState<WebsiteType>("SaaS");
  const [websiteStyle, setWebsiteStyle] = useState<WebsiteStyle>("Modern");
  const [colorTheme, setColorTheme] = useState<ColorTheme>("Electric Indigo");

  // Execution & Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [readingResult, setReadingResult] = useState<AIReadingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "breakdown">("preview");
  const [copied, setCopied] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Analyzing your business positioning...",
    "Synthesizing high-converting copy...",
    "Composing responsive layout sections...",
    "Generating your website...",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGenerating, loadingMessages.length]);

  const handleApplyPreset = (preset: (typeof PRESETS)[0]) => {
    setBusinessName(preset.name);
    setPrompt(preset.prompt);
    setWebsiteType(preset.type);
    setWebsiteStyle(preset.style);
    setColorTheme(preset.colorTheme);
    setError(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setPrompt(text);
        setError(null);
      }
    } catch {
      // Ignore if clipboard access is denied
    }
  };

  const handleClear = () => {
    setBusinessName("");
    setPrompt("");
    setError(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isGenerating) return;

    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setError("Please enter a description or prompt for your website.");
      return;
    }

    if (trimmedPrompt.length > 50000) {
      setError("Content exceeds maximum limit of 50,000 characters. Please provide a concise summary.");
      return;
    }

    setError(null);
    setIsGenerating(true);
    setLoadingStep(0);

    try {
      const res = await apiRequest<{
        success: boolean;
        reading: AIReadingResult;
        websiteData?: WebsiteData;
        remainingCredits: number;
        message: string;
      }>("/api/ai/reading", {
        method: "POST",
        data: {
          content: trimmedPrompt,
          title: businessName.trim() || undefined,
          websiteType,
          style: websiteStyle,
          colorTheme,
        },
      });

      if (res.success) {
        if (res.websiteData) {
          setWebsiteData(res.websiteData);
        }
        if (res.reading) {
          setReadingResult(res.reading);
        }
        await refreshUser();
      } else {
        setError(res.message || "Unable to generate content right now.");
      }
    } catch {
      setError("Unable to generate content. Please check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenInEditor = async () => {
    if (!websiteData) return;
    setSavingProject(true);
    try {
      const res = await apiRequest<{ success: boolean; project: Project }>("/api/projects", {
        method: "POST",
        data: {
          name: websiteData.businessName || businessName || "AI Generated Project",
          websiteData,
        },
      });

      if (res.success && res.project?.id) {
        router.push(`/editor/${res.project.id}`);
      } else {
        router.push("/dashboard");
      }
    } catch {
      router.push("/dashboard");
    } finally {
      setSavingProject(false);
    }
  };

  const handleCopyContent = async () => {
    let textToCopy = "";
    if (websiteData) {
      textToCopy = `
# ${websiteData.businessName} - Landing Page Copy
Tagline: ${websiteData.tagline}
Description: ${websiteData.description}

${websiteData.sections
  .map(
    (s) =>
      `## [${s.type} Section]\nTitle: ${s.title || ""}\nSubtitle: ${s.subtitle || s.description || ""}\nCTA: ${s.ctaText || ""}\n${
        s.items ? s.items.map((it) => `- ${it.title}: ${it.description || ""}`).join("\n") : ""
      }`
  )
  .join("\n\n")}
      `.trim();
    } else if (readingResult) {
      textToCopy = readingResult.executiveSummary;
    }

    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadJSON = () => {
    const dataToExport = websiteData || readingResult;
    if (!dataToExport) return;
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `${(businessName || "website-data").toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <AppShell
      title="AI Website Generator"
      description="Create or improve website content using AI."
      headerAction={
        websiteData ? (
          <button
            onClick={handleOpenInEditor}
            disabled={savingProject}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
          >
            {savingProject ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Edit3 className="w-3.5 h-3.5" />
            )}
            <span>Open in Editor</span>
          </button>
        ) : undefined
      }
    >
      <div className="space-y-8">
        {/* ========================================================
            INPUT CARD (GENERATION AREA)
        ======================================================== */}
        <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-md">
          {/* Header & Preset Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-zinc-800/80">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Describe your website or business</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                SiteCraft AI will craft responsive sections, compelling copy, and styling in seconds.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider shrink-0">
                Examples:
              </span>
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-zinc-300 hover:text-white text-xs font-medium shrink-0 transition-colors cursor-pointer"
                >
                  {p.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Business Details Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Business / Project Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. BioSync Health"
                  className="w-full px-3.5 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Website Type
                </label>
                <select
                  value={websiteType}
                  onChange={(e) => setWebsiteType(e.target.value as WebsiteType)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                >
                  {WEBSITE_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-zinc-900 text-white">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Visual Style
                </label>
                <select
                  value={websiteStyle}
                  onChange={(e) => setWebsiteStyle(e.target.value as WebsiteStyle)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                >
                  {WEBSITE_STYLES.map((s) => (
                    <option key={s} value={s} className="bg-zinc-900 text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Main Prompt Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Website Description & Value Proposition <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-zinc-800/60 transition-colors cursor-pointer"
                  >
                    <Clipboard className="w-3 h-3" />
                    <span>Paste</span>
                  </button>
                  {prompt && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-[11px] text-zinc-400 hover:text-rose-300 flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-zinc-800/60 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>

              <textarea
                ref={textareaRef}
                rows={4}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isGenerating}
                placeholder="Describe your product or service, core features, ideal audience, and key conversion goals..."
                className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all leading-relaxed resize-y disabled:opacity-50"
              />

              <div className="flex items-center justify-between mt-1.5 text-[11px] text-zinc-500">
                <span>Supports natural language business summaries, pitches, or product notes.</span>
                <span className={prompt.length > 45000 ? "text-amber-400 font-bold" : ""}>
                  {prompt.length.toLocaleString()} / 50,000 chars
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="px-3 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-white font-bold text-[11px] transition-colors shrink-0 cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-zinc-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cost: 1 Credit • Instant Generation</span>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating your website...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Website</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* ========================================================
            OUTPUT AREA: EMPTY STATE / LOADING / SUCCESS
        ======================================================== */}
        {isGenerating ? (
          /* LOADING STATE */
          <section className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 sm:p-12 text-center shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Generating your website...</h3>
            <p className="text-xs text-indigo-300 font-mono mb-8 animate-pulse">
              {loadingMessages[loadingStep]}
            </p>

            {/* Skeleton Preview */}
            <div className="max-w-3xl mx-auto space-y-4 text-left opacity-60">
              <div className="h-28 bg-zinc-800/60 rounded-xl animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-24 bg-zinc-800/40 rounded-xl animate-pulse" />
                <div className="h-24 bg-zinc-800/40 rounded-xl animate-pulse" />
                <div className="h-24 bg-zinc-800/40 rounded-xl animate-pulse" />
              </div>
            </div>
          </section>
        ) : !websiteData && !readingResult ? (
          /* EMPTY STATE */
          <section className="border border-dashed border-zinc-800/80 rounded-2xl p-10 sm:p-16 text-center bg-zinc-900/20">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-zinc-500" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">AI Website Generator</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
              Your personalized AI website and content will appear here. Enter your business details
              above and click <strong className="text-zinc-200">Generate Website</strong> to get
              started.
            </p>
            <div className="inline-flex items-center space-x-2 text-[11px] text-zinc-500">
              <span>Supports Hero, Features, About, Testimonials, Pricing, FAQ & CTA sections</span>
            </div>
          </section>
        ) : (
          /* SUCCESS STATE */
          <section className="space-y-6">
            {/* View Mode Toggle Bar & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-md">
              <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeTab === "preview"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Website Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("breakdown")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeTab === "breakdown"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Content Breakdown</span>
                </button>
              </div>

              <div className="flex items-center space-x-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleCopyContent}
                  className="px-3 py-1.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Content"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJSON}
                  className="px-3 py-1.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>JSON</span>
                </button>

                {websiteData && (
                  <button
                    type="button"
                    onClick={handleOpenInEditor}
                    disabled={savingProject}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
                  >
                    {savingProject ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Edit3 className="w-3.5 h-3.5" />
                    )}
                    <span>Open in Editor</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tab 1: Live Website Landing Page Preview */}
            {activeTab === "preview" && websiteData && (
              <div className="border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl bg-zinc-950">
                {/* Browser-like Preview Header */}
                <div className="h-10 px-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="px-3 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400">
                    https://{websiteData.businessName.toLowerCase().replace(/\s+/g, "")}.sitecraft.app
                  </div>
                  <div className="text-[11px] font-semibold text-zinc-500">
                    {websiteData.theme.style} • {websiteData.theme.colorTheme}
                  </div>
                </div>

                {/* Actual Website Renderer Output */}
                <WebsiteRenderer data={websiteData} isEditable={false} />
              </div>
            )}

            {/* Tab 2: Content Breakdown & Reading Insights */}
            {(activeTab === "breakdown" || !websiteData) && readingResult && (
              <div className="space-y-6">
                {/* Executive Summary Card */}
                <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Executive Copy Synthesis</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {readingResult.executiveSummary}
                  </p>
                </div>

                {/* Key Pillars Grid */}
                {readingResult.keyThemes && readingResult.keyThemes.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                      Core Value Pillars
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {readingResult.keyThemes.map((theme, i) => (
                        <div
                          key={i}
                          className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-2 inline-block">
                              {theme.tag}
                            </span>
                            <h4 className="text-xs font-bold text-white mb-1">{theme.title}</h4>
                            <p className="text-[11px] text-zinc-400 leading-relaxed">
                              {theme.summary}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actionable Takeaways */}
                {readingResult.actionableTakeaways && readingResult.actionableTakeaways.length > 0 && (
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                      Strategic Conversion Takeaways
                    </h3>
                    <div className="space-y-2.5">
                      {readingResult.actionableTakeaways.map((takeaway, i) => (
                        <div key={i} className="flex items-start space-x-3 text-xs text-zinc-300">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </AppShell>
  );
}
