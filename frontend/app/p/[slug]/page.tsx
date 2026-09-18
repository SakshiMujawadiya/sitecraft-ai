"use client";

import React, { useEffect, useState, use } from "react";
import { WebsiteData } from "@/lib/types";
import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";
import { apiRequest } from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface PublicPageProps {
  params: Promise<{ slug: string }>;
}

export default function PublicLandingPage({ params }: PublicPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPublishedSite() {
      try {
        setLoading(true);
        const res = await apiRequest<{
          success: boolean;
          project: { id: string; name: string; slug: string; websiteData: WebsiteData };
        }>(`/api/public/site/${slug}`);

        if (res.success && res.project) {
          setWebsiteData(res.project.websiteData);

          // Track pageview event
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          const isTablet = /iPad|Tablet/i.test(navigator.userAgent);
          const device = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

          apiRequest("/api/analytics/track", {
            method: "POST",
            data: {
              projectId: res.project.id,
              isUnique: !sessionStorage.getItem(`visited_${res.project.id}`),
              device,
              referrer: document.referrer || "Direct",
            },
          }).catch(() => {});

          sessionStorage.setItem(`visited_${res.project.id}`, "true");
        } else {
          setError("Published website not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load website");
      } finally {
        setLoading(false);
      }
    }

    loadPublishedSite();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm font-mono text-zinc-400">Loading website...</p>
      </div>
    );
  }

  if (error || !websiteData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <h1 className="text-3xl font-extrabold mb-2">404 — Site Not Found</h1>
        <p className="text-zinc-400 text-sm mb-6 max-w-md">
          {error || "This website is either unpublished or does not exist."}
        </p>
        <Link href="/" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <WebsiteRenderer data={websiteData} isEditable={false} />
      {/* Subtle bottom badge for public landing pages */}
      <div className="fixed bottom-3 right-3 z-50">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black border border-white/10 text-[11px] font-semibold text-zinc-300 backdrop-blur-md shadow-xl transition-all"
        >
          <span>Made with</span>
          <span className="text-indigo-400 font-bold">SiteCraft AI</span>
        </Link>
      </div>
    </>
  );
}
