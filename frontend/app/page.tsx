"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Layers,
  Globe,
  Palette,
  Check,
  Star,
  Cpu,
  Monitor,
  ShieldCheck,
  BarChart3,
  Flame,
} from "lucide-react";
import { PREBUILT_TEMPLATES } from "@/lib/templates";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const generateUrl = user ? "/generate" : "/auth/login?redirect=/generate";
  const featuredTemplates = PREBUILT_TEMPLATES.slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* ================= HERO SECTION ================= */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-28 md:pb-36 overflow-hidden">
          {/* Background Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-600/25 via-violet-600/20 to-pink-600/20 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-semibold mb-8 shadow-xl backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent font-bold">
                Next-Gen AI Generation
              </span>
              <span className="text-zinc-500">•</span>
              <span>From Prompt to Published URL in 60s</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
              Create High-Converting{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                Landing Pages with AI
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
              Transform a simple prompt into an ultra-modern, responsive landing page. Customize with our visual editor, refine copy with inline AI, and publish to custom domains with instant SSL.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
              <Link
                href={generateUrl}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-base shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span>Generate with AI Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/templates"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold text-base transition-all"
              >
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Explore 12+ Templates</span>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-zinc-400 pt-4 border-t border-zinc-800/60">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="user"
                    className="w-8 h-8 rounded-full border-2 border-zinc-950 object-cover"
                  />
                ))}
              </div>
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span>Trusted by 4,200+ founders, marketers & creators</span>
            </div>
          </div>
        </section>

        {/* ================= HERO CANVAS PREVIEW MOCKUP ================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-28 relative z-20">
          <div className="p-2 rounded-3xl bg-gradient-to-b from-zinc-800/80 to-zinc-900/40 border border-zinc-800/80 shadow-2xl backdrop-blur-xl">
            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 relative">
              {/* Fake studio header */}
              <div className="h-10 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-[11px] text-zinc-500 ml-2">editor.sitecraft.ai/preview</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-400 border border-indigo-800/50 text-[10px] font-semibold flex items-center space-x-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>AI Copilot Active</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-[10px] font-semibold">
                    Live
                  </span>
                </div>
              </div>

              {/* Preview image */}
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop&q=80"
                alt="Studio Visual Preview"
                className="w-full aspect-[21/9] object-cover object-top opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </section>

        {/* ================= FEATURES VALUE PILLARS ================= */}
        <section className="py-24 border-t border-zinc-800/80 bg-zinc-950/60 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">
                The Complete Platform
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                Everything You Need to Build, Optimize, and Launch
              </h2>
              <p className="text-zinc-400 text-base">
                Eliminate the weeks spent wrestling with complex visual builders and copywriters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500/50 transition-all duration-300 shadow-xl group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">9-Step AI Generation</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Tailored prompts analyze your business type, target audience, preferred style, and desired sections to craft comprehensive, high-conversion layouts in seconds.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-violet-500/50 transition-all duration-300 shadow-xl group">
                <div className="w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-500/30 text-violet-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Visual Section Editor</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Easily reorder, duplicate, add, or delete sections. Change typography, palettes, button CTAs, and images with live responsive preview across Desktop, Tablet, and Mobile.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-pink-500/50 transition-all duration-300 shadow-xl group">
                <div className="w-12 h-12 rounded-2xl bg-pink-600/10 border border-pink-500/30 text-pink-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Custom Domains & SSL</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  One-click global publishing with sub-50ms latency edge caching. Connect your own custom domain with automated DNS verification and free Let&apos;s Encrypt SSL.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURED TEMPLATES ================= */}
        <section className="py-24 border-t border-zinc-800/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">
                  Curated Gallery
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Handcrafted Prebuilt Templates
                </h2>
              </div>
              <Link
                href="/templates"
                className="mt-4 sm:mt-0 inline-flex items-center space-x-1 text-sm font-bold text-indigo-400 hover:text-indigo-300"
              >
                <span>Browse all 12 templates</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredTemplates.map((t) => (
                <div
                  key={t.id}
                  className="group bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                    <img
                      src={t.thumbnailUrl}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-white border border-white/10">
                      {t.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg text-white mb-2">{t.name}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-6">{t.description}</p>
                    <Link
                      href="/templates"
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <span>Explore Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= PRICING TIERS ================= */}
        <section id="pricing" className="py-24 border-t border-zinc-800/80 bg-zinc-950/40 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">
                Predictable Pricing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                Simple Plans for Creators and High-Growth Teams
              </h2>
              <p className="text-zinc-400 text-base">Start for free and scale as your traffic explodes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Free Tier */}
              <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Free Starter</h3>
                  <p className="text-xs text-zinc-400 mb-6">Perfect for side projects and prototypes.</p>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-black">$0</span>
                    <span className="text-xs text-zinc-500 ml-1">/forever</span>
                  </div>
                  <div className="space-y-3 text-xs text-zinc-300 mb-8">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>1 published website</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>50 AI generation credits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>All prebuilt templates</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Community support</span>
                    </div>
                  </div>
                </div>
                <Link
                  href={user ? "/generate" : "/auth/login?redirect=/generate"}
                  className="w-full py-3 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-center text-xs font-bold text-white transition-all"
                >
                  Start for Free
                </Link>
              </div>

              {/* Pro Tier (Popular) */}
              <div className="p-8 rounded-2xl bg-zinc-900 border-2 border-indigo-500 flex flex-col justify-between shadow-2xl relative scale-105 z-10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                  Most Popular
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">Pro Growth</h3>
                  <p className="text-xs text-zinc-400 mb-6">For venture startups, agencies & digital creators.</p>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-black text-white">$29</span>
                    <span className="text-xs text-zinc-400 ml-1">/month</span>
                  </div>
                  <div className="space-y-3 text-xs text-zinc-200 mb-8">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-indigo-400" />
                      <span>Unlimited published websites</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-indigo-400" />
                      <span>Custom domains with free SSL</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-indigo-400" />
                      <span>1,000 AI generation credits/mo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-indigo-400" />
                      <span>Real-time traffic analytics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-indigo-400" />
                      <span>Priority 24/7 support</span>
                    </div>
                  </div>
                </div>
                <Link
                  href={user ? "/generate" : "/auth/login?redirect=/generate"}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-center text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all"
                >
                  Start 14-Day Free Trial
                </Link>
              </div>

              {/* Enterprise */}
              <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Agency Scale</h3>
                  <p className="text-xs text-zinc-400 mb-6">For agencies managing high client portfolios.</p>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-black">$89</span>
                    <span className="text-xs text-zinc-500 ml-1">/month</span>
                  </div>
                  <div className="space-y-3 text-xs text-zinc-300 mb-8">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Unlimited projects & custom domains</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>10,000 AI credits per month</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>White-label client previews</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Dedicated Account Strategist</span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/auth/login"
                  className="w-full py-3 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-center text-xs font-bold text-white transition-all"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="py-24 border-t border-zinc-800/80 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-indigo-950/50 via-zinc-900/80 to-purple-950/50 border border-indigo-900/50 shadow-2xl relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5">
              Launch Your Next Big Idea Today
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto mb-8">
              Join thousands of makers who create high-converting landing pages with AI in seconds.
            </p>
            <Link
              href={generateUrl}
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-base shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate Landing Page Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
