import React from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white text-base">SiteCraft AI</span>
            <p className="text-xs text-zinc-500 mt-0.5">Next-Gen SaaS Landing Page Builder</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-500">
          <Link href="/templates" className="hover:text-zinc-300 transition-colors">
            Templates
          </Link>
          <Link href="/generate" className="hover:text-zinc-300 transition-colors">
            AI Generator
          </Link>
          <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">
            Workspace
          </Link>
          <Link href="/dashboard/settings" className="hover:text-zinc-300 transition-colors">
            Domains & Billing
          </Link>
        </div>

        <div className="text-xs text-zinc-500 flex items-center space-x-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for high-converting founders</span>
        </div>
      </div>
    </footer>
  );
}
