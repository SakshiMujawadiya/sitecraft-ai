"use client";

import React, { useEffect, useState, use } from "react";
import { WebsiteData, CustomDomainConfig } from "@/lib/types";
import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";
import { apiRequest } from "@/lib/api-client";
import { Loader2, Globe, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface CustomDomainPageProps {
  params: Promise<{ domain: string }>;
}

export default function CustomDomainLandingPage({ params }: CustomDomainPageProps) {
  const resolvedParams = use(params);
  const domain = decodeURIComponent(resolvedParams.domain);

  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [siteName, setSiteName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSiteByDomain() {
      try {
        setLoading(true);
        setError(null);

        const res = await apiRequest<{
          success: boolean;
          project: {
            id: string;
            name: string;
            slug: string;
            websiteData: WebsiteData;
            customDomain?: CustomDomainConfig;
          };
        }>(`/api/public/domain/${encodeURIComponent(domain)}`);

        if (res.success && res.project) {
          setWebsiteData(res.project.websiteData);
          setSiteName(res.project.name);

          // Dynamic Title & Meta Tags
          if (res.project.websiteData.seo?.title) {
            document.title = res.project.websiteData.seo.title;
          } else {
            document.title = `${res.project.websiteData.businessName} — Official Site`;
          }

          // Record Analytics Pageview
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          const isTablet = /iPad|Tablet/i.test(navigator.userAgent);
          const device = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

          apiRequest("/api/analytics/track", {
            method: "POST",
            data: {
              projectId: res.project.id,
              isUnique: !sessionStorage.getItem(`visited_${res.project.id}`),
              device,
              referrer: document.referrer || "Direct (Custom Domain)",
            },
          }).catch(() => {});

          sessionStorage.setItem(`visited_${res.project.id}`, "true");
        } else {
          setError(`No published website found for custom domain "${domain}"`);
        }
      } catch (err: any) {
        setError(err.message || `Unable to resolve custom domain "${domain}"`);
      } finally {
        setLoading(false);
      }
    }

    loadSiteByDomain();
  }, [domain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
        <p className="text-sm font-medium text-zinc-300">Resolving {domain}...</p>
        <p className="text-xs text-zinc-500 mt-1">Connecting to edge cluster</p>
      </div>
    );
  }

  if (error || !websiteData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5">
          <Globe className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Domain Not Connected</h1>
        <p className="text-zinc-400 text-sm mb-4 max-w-md">
          {error || `The domain ${domain} is not currently pointing to an active published website.`}
        </p>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-left max-w-md w-full mb-6 text-xs text-zinc-400 space-y-2 font-mono">
          <p className="text-zinc-300 font-semibold font-sans">Are you the site owner?</p>
          <p>1. Ensure your project is published in the dashboard.</p>
          <p>2. Verify DNS CNAME or A records are properly pointed.</p>
          <p>3. Wait a few minutes for DNS propagation worldwide.</p>
          <div className="pt-2 border-t border-zinc-800 text-indigo-300 font-sans">
            💡 <strong>Testing on localhost?</strong> Go to <strong>Manage Domains</strong> and click <strong>"Test DNS Match"</strong> to simulate DNS activation without buying a domain.
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Platform Home</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all"
          >
            Manage Domains
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <WebsiteRenderer data={websiteData} isEditable={false} />

      {/* Verified SSL & Custom Domain Edge Badge */}
      <div className="fixed bottom-3 right-3 z-50">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-950/80 hover:bg-black border border-white/10 text-[11px] font-medium text-zinc-300 backdrop-blur-md shadow-xl transition-all">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-zinc-400">{domain}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">SSL Active</span>
        </div>
      </div>
    </>
  );
}
