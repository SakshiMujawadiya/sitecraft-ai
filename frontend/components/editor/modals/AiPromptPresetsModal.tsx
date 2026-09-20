"use client";

import React from "react";
import { Sparkles, X, Wand2, Zap, Rocket, Building, Utensils, Laptop } from "lucide-react";
import { SectionContent } from "@/lib/types";

interface AiPromptPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset: (sections: SectionContent[]) => void;
}

export default function AiPromptPresetsModal({
  isOpen,
  onClose,
  onApplyPreset,
}: AiPromptPresetsModalProps) {
  if (!isOpen) return null;

  const presets = [
    {
      id: "preset-saas",
      title: "SaaS Product Launch",
      category: "SaaS / Tech",
      icon: Rocket,
      gradient: "from-indigo-600 to-purple-600",
      description: "Complete SaaS stack: Glassmorphism Hero, Bento Box Features, Pricing Cards & FAQ.",
      sections: [
        {
          id: `ai-hero-${Date.now()}`,
          type: "Hero",
          variant: "Modern Glass",
          badge: "🚀 AI Infrastructure v3.0 Released",
          title: "Scale Cloud Workloads With Autonomous AI",
          subtitle: "Deploy, monitor, and auto-scale distributed GPU clusters across multi-cloud regions with zero config.",
          ctaText: "Start Building Free",
          ctaLink: "#pricing",
          secondaryCtaText: "View Documentation",
          secondaryCtaLink: "#features",
          imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=80",
          items: [
            { title: "48%", description: "Cloud Spend Savings" },
            { title: "99.99%", description: "Uptime SLA" },
            { title: "< 1ms", description: "Latency Overhead" },
          ],
        },
        {
          id: `ai-feat-${Date.now() + 1}`,
          type: "Features",
          variant: "Bento Box",
          badge: "Built for Production",
          title: "Engineered for Exponential Velocity",
          subtitle: "Everything your platform engineering team needs to run compute at planet scale.",
          items: [
            { id: "af-1", title: "GPU Spot Failover", description: "Zero-downtime hot migration across regions whenever spot compute nodes are recalled.", icon: "Cpu" },
            { id: "af-2", title: "Predictive Scaling", description: "Machine-learning traffic forecasting scales cluster capacity 2 minutes before spikes hit.", icon: "TrendingUp" },
            { id: "af-3", title: "Zero-Trust Mesh", description: "Automated mutual TLS encryption, short-lived tokens, and strict microsegmentation by default.", icon: "Shield" },
          ],
        },
        {
          id: `ai-pricing-${Date.now() + 2}`,
          type: "Pricing",
          variant: "Cards",
          badge: "Predictable Pricing",
          title: "Simple, Transparent Infrastructure Plans",
          items: [
            { id: "ap-1", title: "Starter", price: "$29", period: "/mo", description: "For early stage projects.", features: ["Up to 5 nodes", "Community support"] },
            { id: "ap-2", title: "Pro Growth", price: "$149", period: "/mo", popular: true, description: "For scaling engineering teams.", features: ["Unlimited nodes", "24/7 Slack support", "99.99% SLA"] },
          ],
        },
      ],
    },
    {
      id: "preset-agency",
      title: "Digital Agency Portfolio",
      category: "Agency / Studio",
      icon: Building,
      gradient: "from-pink-600 to-rose-600",
      description: "Editorial branding suite: Centered Hero, Proven Results Grid, and Contact Section.",
      sections: [
        {
          id: `ai-agency-hero-${Date.now()}`,
          type: "Hero",
          variant: "Centered",
          badge: "✨ Over $180M Generated in Client Revenue",
          title: "We Engineer High-Growth Acquisition Engines",
          subtitle: "We partner with visionary brands to scale performance marketing, custom UI design, and viral creative campaigns.",
          ctaText: "Claim Free Growth Audit",
          ctaLink: "#contact",
          imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80",
        },
        {
          id: `ai-agency-about-${Date.now() + 1}`,
          type: "About",
          variant: "Split",
          badge: "Our Philosophy",
          title: "Where Data Meets Cinematic Artistry",
          description: "We don't believe in vanity metrics. We combine algorithmic ad buying with bespoke visual design to drive real bottom-line revenue.",
          imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
        },
      ],
    },
    {
      id: "preset-gourmet",
      title: "Gourmet Bistro & Dining",
      category: "Restaurant",
      icon: Utensils,
      gradient: "from-amber-600 to-orange-600",
      description: "Luxury gastronomy layout: Michelin-styled Hero, Culinary Philosophy, and Reservation CTA.",
      sections: [
        {
          id: `ai-resto-hero-${Date.now()}`,
          type: "Hero",
          variant: "Centered",
          badge: "Michelin Guide Selected 2025",
          title: "An Unforgettable Culinary Sanctuary",
          subtitle: "Innovative French-Mediterranean gastronomy celebrating seasonal farm-fresh harvests and natural wines.",
          ctaText: "Reserve Your Table",
          ctaLink: "#contact",
          imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80",
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>AI Prompt Presets</span>
              <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300 font-bold">1-Click</span>
            </h3>
            <p className="text-xs text-zinc-400">Instantly generate high-converting section layouts for your page.</p>
          </div>
        </div>

        <div className="space-y-3">
          {presets.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                onClick={() => {
                  onApplyPreset(p.sections as SectionContent[]);
                  onClose();
                }}
                className="group p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-indigo-500/80 cursor-pointer transition-all shadow-md hover:shadow-indigo-500/10 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${p.gradient} text-white shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">{p.category}</span>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{p.title}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{p.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 group-hover:bg-indigo-500 text-white text-xs font-bold transition-colors shrink-0 flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Generate</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
