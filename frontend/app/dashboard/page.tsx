"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api-client";
import { Project } from "@/lib/types";
import {
  Sparkles,
  Plus,
  Search,
  Globe,
  Edit3,
  Copy,
  Trash2,
  Archive,
  ExternalLink,
  Eye,
  BarChart3,
  Clock,
  MoreVertical,
  Layers,
  Loader2,
  CheckCircle2,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published" | "archived">("all");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Rename modal state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    } else if (user) {
      fetchProjects();
    }
  }, [user, authLoading, router, statusFilter, search]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (statusFilter !== "all") query.append("status", statusFilter);

      const res = await apiRequest<{ success: boolean; projects: Project[] }>(
        `/api/projects?${query.toString()}`
      );
      if (res.success) {
        setProjects(res.projects);
      }
    } catch (err: any) {
      console.warn("Failed to load projects:", err?.message || err);
      if (
        err?.message?.includes("401") ||
        err?.message?.includes("expired") ||
        err?.message?.includes("Unauthorized")
      ) {
        router.push("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await apiRequest<{ success: boolean; project: Project }>(`/api/projects/${id}/duplicate`, {
        method: "POST",
      });
      if (res.success && res.project) {
        setProjects((prev) => [res.project, ...prev]);
        setActiveMenuId(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to duplicate project");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this project?")) return;
    try {
      await apiRequest(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setActiveMenuId(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    }
  };

  const handleArchiveToggle = async (p: Project) => {
    try {
      const newStatus = p.status === "archived" ? "draft" : "archived";
      const res = await apiRequest<{ success: boolean; project: Project }>(`/api/projects/${p.id}`, {
        method: "PUT",
        data: { status: newStatus },
      });
      if (res.success && res.project) {
        setProjects((prev) => prev.map((item) => (item.id === p.id ? res.project : item)));
        setActiveMenuId(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to update project status");
    }
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !renameValue.trim()) return;

    try {
      const res = await apiRequest<{ success: boolean; project: Project }>(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        data: { name: renameValue.trim() },
      });
      if (res.success && res.project) {
        setProjects((prev) => prev.map((item) => (item.id === editingProject.id ? res.project : item)));
        setEditingProject(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to rename project");
    }
  };

  const totalViews = projects.reduce((acc, p) => acc + (p.analytics?.totalViews || 0), 0);
  const publishedCount = projects.filter((p) => p.isPublished).length;

  return (
    <AppShell
      title="Dashboard"
      description="Manage your projects, live sites, and AI reading workspace."
      headerAction={
        <div className="flex items-center space-x-2">
          <Link
            href="/reading"
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>AI Reading</span>
          </Link>
          <Link
            href="/generate"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Site</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Workspace Overview Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Projects & Websites
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Manage, edit, and publish high-performance AI landing pages.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/templates"
              className="px-3.5 py-1.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Templates</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-xs text-zinc-400 font-medium">Total Projects</span>
            <div className="text-2xl font-bold text-white mt-1">{projects.length}</div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-xs text-zinc-400 font-medium">Live Sites</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{publishedCount}</div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-xs text-zinc-400 font-medium">Total Pageviews</span>
            <div className="text-2xl font-bold text-indigo-400 mt-1">{totalViews}</div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-xs text-zinc-400 font-medium">AI Credits Balance</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">{user?.credits ?? 50}</div>
          </div>
        </div>

        {/* Featured AI Reading Quick Access Card */}
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-zinc-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/15 px-2 py-0.5 rounded-full border border-indigo-500/25">Core MVP</span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs text-zinc-400">Cognitive Synthesis</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">AI Reading Assistant</h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 max-w-xl">
                Paste articles, strategy memos, or documents to instantly generate executive summaries, key conceptual pillars, and actionable takeaways.
              </p>
            </div>
          </div>
          <Link
            href="/reading"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-2 shrink-0 self-start sm:self-auto shadow-lg shadow-indigo-600/25 transition-all active:scale-95 cursor-pointer"
          >
            <span>Open AI Reading Page</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-zinc-900/80 border border-zinc-800 w-full sm:w-auto overflow-x-auto">
            {(["all", "draft", "published", "archived"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === st
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or slug..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Projects Cards Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
            <p className="text-xs font-mono">Retrieving workspace projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-zinc-800 rounded-2xl p-8 bg-zinc-900/20">
            <Sparkles className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No projects found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">
              Create your first high-converting landing page using our AI prompt generator or browse prebuilt templates.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <Link
                href="/generate"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20"
              >
                Generate with AI
              </Link>
              <Link
                href="/templates"
                className="px-4 py-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold"
              >
                Choose Template
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => {
              const heroSection = p.websiteData.sections.find((s) => s.type === "Hero");
              const heroImage = heroSection?.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80";

              return (
                <div
                  key={p.id}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between shadow-lg group relative"
                >
                  {/* Thumbnail & Status Badge */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-zinc-950 border-b border-zinc-800">
                    <img
                      src={heroImage}
                      alt={p.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md border ${
                          p.isPublished
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : p.status === "archived"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            : "bg-zinc-800/80 text-zinc-300 border-zinc-700"
                        }`}
                      >
                        {p.isPublished ? "Published" : p.status}
                      </span>
                    </div>

                    {/* Quick overlay actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 p-4">
                      <Link
                        href={`/editor/${p.id}`}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Open Editor</span>
                      </Link>
                      {p.isPublished && (
                        <Link
                          href={`/p/${p.slug}`}
                          target="_blank"
                          className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center space-x-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Live</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">/p/{p.slug}</p>
                      </div>

                      {/* Dropdown 3-dots */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === p.id && (
                          <div className="absolute right-0 top-8 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 z-30 text-xs">
                            <button
                              onClick={() => {
                                setEditingProject(p);
                                setRenameValue(p.name);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-zinc-800 text-zinc-300 flex items-center space-x-2"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Rename</span>
                            </button>
                            <button
                              onClick={() => handleDuplicate(p.id)}
                              className="w-full px-3 py-2 text-left hover:bg-zinc-800 text-zinc-300 flex items-center space-x-2"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Duplicate</span>
                            </button>
                            <button
                              onClick={() => handleArchiveToggle(p)}
                              className="w-full px-3 py-2 text-left hover:bg-zinc-800 text-zinc-300 flex items-center space-x-2"
                            >
                              <Archive className="w-3.5 h-3.5" />
                              <span>{p.status === "archived" ? "Unarchive" : "Archive"}</span>
                            </button>
                            <div className="h-px bg-zinc-800 my-1" />
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="w-full px-3 py-2 text-left hover:bg-rose-950/30 text-rose-400 flex items-center space-x-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Project</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Analytics Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs text-zinc-400">
                      <div className="flex items-center space-x-1.5">
                        <Eye className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{p.analytics?.totalViews || 0} views</span>
                      </div>
                      <span className="text-[11px] text-zinc-500">
                        Edited {new Date(p.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= RENAME MODAL ================= */}
        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="font-bold text-white text-base mb-2">Rename Project</h3>
              <form onSubmit={handleRenameSubmit} className="space-y-4">
                <input
                  type="text"
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm outline-none focus:border-indigo-500"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
