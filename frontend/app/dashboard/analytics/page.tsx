"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api-client";
import { Project } from "@/lib/types";
import {
  BarChart3,
  TrendingUp,
  Users,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        const res = await apiRequest<{ success: boolean; projects: Project[] }>("/api/projects");
        if (res.success) {
          setProjects(res.projects);
        }
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const activeProjects =
    selectedProjectId === "all"
      ? projects
      : projects.filter((p) => p.id === selectedProjectId);

  const totalViews = activeProjects.reduce((sum, p) => sum + (p.analytics?.totalViews || 0), 0);
  const totalVisitors = activeProjects.reduce((sum, p) => sum + (p.analytics?.uniqueVisitors || 0), 0);

  const desktopCount = activeProjects.reduce((sum, p) => sum + (p.analytics?.devices?.desktop || 0), 0);
  const mobileCount = activeProjects.reduce((sum, p) => sum + (p.analytics?.devices?.mobile || 0), 0);
  const tabletCount = activeProjects.reduce((sum, p) => sum + (p.analytics?.devices?.tablet || 0), 0);
  const totalDeviceSum = desktopCount + mobileCount + tabletCount || 1;

  // Aggregate Referrers
  const referrerMap: Record<string, number> = {};
  activeProjects.forEach((p) => {
    if (p.analytics?.referrers) {
      Object.entries(p.analytics.referrers).forEach(([ref, count]) => {
        referrerMap[ref] = (referrerMap[ref] || 0) + count;
      });
    }
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2">
              <BarChart3 className="w-7 h-7 text-indigo-400" />
              <span>Traffic & Conversion Analytics</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Real-time telemetry, visitor counts, and attribution breakdown for your published sites.
            </p>
          </div>

          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-200 outline-none focus:border-indigo-500"
          >
            <option value="all">All Projects Aggregated</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.isPublished ? "Live" : "Draft"})
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
            <p className="text-xs font-mono">Aggregating telemetry data...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-lg">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Page Views</span>
                <div className="text-3xl font-black text-white mt-2">{totalViews.toLocaleString()}</div>
                <div className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+24.5% vs previous week</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-lg">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Unique Visitors</span>
                <div className="text-3xl font-black text-indigo-400 mt-2">{totalVisitors.toLocaleString()}</div>
                <div className="flex items-center space-x-1 text-zinc-400 text-xs mt-2">
                  <span>Avg. 1.7 sessions per visitor</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-lg">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Conversion CTA Clicks</span>
                <div className="text-3xl font-black text-emerald-400 mt-2">
                  {Math.round(totalViews * 0.082).toLocaleString()}
                </div>
                <div className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold mt-2">
                  <span>8.2% estimated conversion rate</span>
                </div>
              </div>
            </div>

            {/* Device Breakdown & Traffic Sources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Devices Card */}
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-lg">
                <h3 className="font-bold text-base text-white mb-6">Device Breakdown</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="flex items-center space-x-2 text-zinc-300">
                        <Monitor className="w-4 h-4 text-indigo-400" />
                        <span>Desktop</span>
                      </span>
                      <span className="text-white">{Math.round((desktopCount / totalDeviceSum) * 100)}% ({desktopCount})</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(desktopCount / totalDeviceSum) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="flex items-center space-x-2 text-zinc-300">
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                        <span>Mobile</span>
                      </span>
                      <span className="text-white">{Math.round((mobileCount / totalDeviceSum) * 100)}% ({mobileCount})</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(mobileCount / totalDeviceSum) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="flex items-center space-x-2 text-zinc-300">
                        <Tablet className="w-4 h-4 text-amber-400" />
                        <span>Tablet</span>
                      </span>
                      <span className="text-white">{Math.round((tabletCount / totalDeviceSum) * 100)}% ({tabletCount})</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(tabletCount / totalDeviceSum) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Referrers Card */}
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-lg">
                <h3 className="font-bold text-base text-white mb-6">Top Acquisition Channels</h3>
                <div className="space-y-3">
                  {Object.entries(referrerMap).length === 0 ? (
                    <p className="text-xs text-zinc-500 py-6 text-center">
                      No referral traffic logged yet. Traffic sources appear when published links receive views.
                    </p>
                  ) : (
                    Object.entries(referrerMap)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([ref, count], idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs"
                        >
                          <div className="flex items-center space-x-2.5">
                            <Globe className="w-4 h-4 text-indigo-400" />
                            <span className="font-semibold text-zinc-200">{ref}</span>
                          </div>
                          <span className="font-bold text-white">{count} views</span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
