"use client";

import React from "react";
import Link from "next/link";
import { Globe, ExternalLink } from "lucide-react";
import { Project } from "@/lib/types";

interface PublishSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  publicUrl: string | null;
}

export default function PublishSuccessModal({
  isOpen,
  onClose,
  project,
  publicUrl,
}: PublishSuccessModalProps) {
  if (!isOpen) return null;

  const resolvedUrl = publicUrl || `${typeof window !== "undefined" ? window.location.origin : ""}/p/${project.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(resolvedUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <Globe className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Your Website is Live!</h3>
        <p className="text-xs text-zinc-400 mb-6">
          Your landing page is now published globally with instant edge delivery.
        </p>

        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 mb-5 text-left">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                {project.customDomain?.domain ? "Custom Domain (Live)" : "Default Edge URL"}
              </span>
              <span className="text-xs font-mono text-emerald-400 truncate max-w-[240px] block">
                {project.customDomain?.domain ? `https://${project.customDomain.domain}` : resolvedUrl}
              </span>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-800 rounded-lg transition-colors"
            >
              Copy
            </button>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-xs text-zinc-400">Want a custom domain?</span>
            <Link
              href="/dashboard/settings"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline flex items-center space-x-1"
            >
              <span>Domain Settings →</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors"
          >
            Keep Editing
          </button>
          <Link
            href={project.customDomain?.domain ? `https://${project.customDomain.domain}` : `/p/${project.slug}`}
            target="_blank"
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-1"
          >
            <span>Visit Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
