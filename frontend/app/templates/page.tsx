"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PREBUILT_TEMPLATES } from "@/lib/templates";
import { Template } from "@/lib/types";
import { apiRequest } from "@/lib/api-client";
import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";
import {
  Sparkles,
  Layout,
  Eye,
  ArrowRight,
  Search,
  Monitor,
  Smartphone,
  X,
  Loader2,
} from "lucide-react";

const CATEGORIES = ["All", "SaaS", "Portfolio", "Agency", "Restaurant", "Startup", "AI Tool"];

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [cloningId, setCloningId] = useState<string | null>(null);

  const filteredTemplates = PREBUILT_TEMPLATES.filter((t) => {
    const matchesCat = selectedCategory === "All" || t.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleUseTemplate = async (template: Template) => {
    try {
      setCloningId(template.id);
      const res = await apiRequest<{ success: boolean; project: { id: string } }>("/api/projects", {
        method: "POST",
        data: {
          name: `${template.name} Website`,
          websiteData: template.websiteData,
          templateId: template.id,
        },
      });

      if (res.success && res.project) {
        router.push(`/editor/${res.project.id}`);
      }
    } catch {
      // If unauthorized, redirect to login with return path
      router.push("/auth/login");
    } finally {
      setCloningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>12+ Production-Ready Templates</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Start With a Beautiful Prebuilt Template
          </h1>
          <p className="text-base sm:text-lg text-zinc-400">
            Handcrafted for high conversion across SaaS, creator portfolios, luxury agencies, and restaurants. Fully customizable in our visual editor.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-800">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                <img
                  src={template.thumbnailUrl}
                  alt={template.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/10">
                  {template.category}
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 p-4">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="px-4 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center space-x-1.5 backdrop-blur-sm transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>
                  <button
                    onClick={() => handleUseTemplate(template)}
                    disabled={cloningId === template.id}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    {cloningId === template.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Use Template</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
                    {template.name}
                  </h3>
                  <span className="text-xs text-zinc-500 font-mono">{template.style}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-6">
                  {template.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center space-x-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => handleUseTemplate(template)}
                    disabled={cloningId === template.id}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 transition-colors"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ================= PREVIEW MODAL ================= */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950/95 backdrop-blur-md">
          {/* Header */}
          <div className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between bg-zinc-900 shrink-0">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-white text-sm">{previewTemplate.name}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                {previewTemplate.category}
              </span>
            </div>

            {/* Viewport switch */}
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                  previewMode === "desktop" ? "bg-indigo-600 text-white" : "text-zinc-400"
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                  previewMode === "mobile" ? "bg-indigo-600 text-white" : "text-zinc-400"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleUseTemplate(previewTemplate)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center space-x-1.5"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Canvas container */}
          <div className="flex-1 overflow-y-auto p-4 flex justify-center items-start bg-zinc-950">
            <div
              className={`border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden bg-black transition-all ${
                previewMode === "desktop" ? "w-full max-w-6xl" : "w-[375px]"
              }`}
            >
              <WebsiteRenderer data={previewTemplate.websiteData} isEditable={false} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
