"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api-client";
import {
  WebsiteType,
  WebsiteStyle,
  ColorTheme,
  SectionType,
  AnimationPreference,
  WebsiteData,
  Project,
} from "@/lib/types";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  Layout,
  Palette,
  Briefcase,
  Layers,
  Wand2,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const WEBSITE_TYPES: { type: WebsiteType; description: string; icon: string }[] = [
  { type: "SaaS", description: "Software as a service & web apps", icon: "💻" },
  { type: "AI Tool", description: "Generative AI, machine learning tools & APIs", icon: "🧠" },
  { type: "Startup", description: "Next-gen tech ventures & hardware", icon: "🚀" },
  { type: "Agency", description: "Marketing, creative & design studios", icon: "🎨" },
  { type: "Portfolio", description: "Designers, engineers, writers & creators", icon: "👤" },
  { type: "Restaurant", description: "Bistros, cafes, bars & artisanal dining", icon: "🍽️" },
  { type: "Ecommerce", description: "Direct-to-consumer lifestyle brands", icon: "🛍️" },
  { type: "Gym", description: "Fitness studios, coaches & athletics", icon: "⚡" },
];

const WEBSITE_STYLES: { style: WebsiteStyle; description: string; previewClass: string }[] = [
  { style: "Modern", description: "High conversion, clean lines, vibrant accents", previewClass: "from-indigo-900/60 to-purple-900/60" },
  { style: "Glassmorphism", description: "Frosted translucent glass with vibrant glow", previewClass: "from-blue-900/60 to-emerald-900/60" },
  { style: "Dark", description: "High-contrast developer & tech aesthetic", previewClass: "from-zinc-900 to-black" },
  { style: "Luxury", description: "Serif typography, editorial whitespace & elegance", previewClass: "from-amber-950/40 to-stone-900" },
  { style: "Minimal", description: "Typography-forward, zero clutter, timeless", previewClass: "from-zinc-900 to-zinc-950" },
  { style: "Neon", description: "Cyberpunk vivid glows and futuristic tech vibes", previewClass: "from-cyan-950/60 to-fuchsia-950/60" },
  { style: "Corporate", description: "Trustworthy enterprise blues and clean structure", previewClass: "from-slate-900 to-sky-950/60" },
];

const COLOR_THEMES: { name: ColorTheme; colors: string[] }[] = [
  { name: "Electric Indigo", colors: ["#6366f1", "#4f46e5", "#09090b"] },
  { name: "Emerald Slate", colors: ["#10b981", "#059669", "#022c22"] },
  { name: "Sunset Amber", colors: ["#f59e0b", "#d97706", "#0c0a09"] },
  { name: "Rose Quartz", colors: ["#f43f5e", "#e11d48", "#0f0d11"] },
  { name: "Cyberpunk Neon", colors: ["#06b6d4", "#ec4899", "#050814"] },
  { name: "Ocean Azure", colors: ["#0284c7", "#38bdf8", "#081325"] },
  { name: "Royal Purple", colors: ["#9333ea", "#c084fc", "#0b0616"] },
  { name: "Monochrome Minimal", colors: ["#ffffff", "#71717a", "#000000"] },
];

const ALL_SECTIONS: { type: SectionType; description: string }[] = [
  { type: "Hero", description: "Primary headline, call to action & hero visual" },
  { type: "Features", description: "Grid cards showcasing your product's key benefits" },
  { type: "About", description: "Company mission, philosophy & story" },
  { type: "Testimonials", description: "Social proof quotes and verified ratings" },
  { type: "Pricing", description: "Tiers, feature checklists & billing options" },
  { type: "FAQ", description: "Accordion answers to common customer questions" },
  { type: "CTA", description: "High-impact conversion banner to drive signups" },
  { type: "Contact", description: "Inquiry details, office locations & support info" },
  { type: "Footer", description: "Branding, legal links and directory" },
];

export default function AIGeneratorPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/generate");
    }
  }, [authLoading, user, router]);

  const [step, setStep] = useState<number>(1);
  const totalSteps = 8;

  // Form State
  const [websiteType, setWebsiteType] = useState<WebsiteType>("SaaS");
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [websiteStyle, setWebsiteStyle] = useState<WebsiteStyle>("Modern");
  const [colorTheme, setColorTheme] = useState<ColorTheme>("Electric Indigo");
  const [requiredSections, setRequiredSections] = useState<SectionType[]>([
    "Hero",
    "Features",
    "Testimonials",
    "Pricing",
    "FAQ",
    "CTA",
    "Footer",
  ]);
  const [animationPreference, setAnimationPreference] = useState<AnimationPreference>("Modern");

  // Generating State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStepIndex, setGenerationStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const generationProgressSteps = [
    "Analyzing business requirements & market niche...",
    "Engineering persuasive high-converting copy...",
    "Synthesizing visual theme, typography & palettes...",
    "Generating responsive sections & interactive components...",
    "Validating structured JSON schema & compiling project...",
  ];

  const toggleSection = (type: SectionType) => {
    if (requiredSections.includes(type)) {
      if (requiredSections.length <= 2) return; // Keep at least 2
      setRequiredSections(requiredSections.filter((s) => s !== type));
    } else {
      setRequiredSections([...requiredSections, type]);
    }
  };

  const handleNext = () => {
    if (step === 2 && !businessName.trim()) {
      setError("Please provide your business or project name");
      return;
    }
    if (step === 3 && !businessDescription.trim()) {
      setError("Please describe what your product or business does");
      return;
    }
    if (step === 4 && !targetAudience.trim()) {
      setError("Please specify your target audience or customers");
      return;
    }
    setError(null);
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      triggerGeneration();
    }
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) setStep(step - 1);
  };

  const triggerGeneration = async () => {
    setError(null);
    setIsGenerating(true);

    // Progress step animation simulation
    let currentProg = 0;
    const interval = setInterval(() => {
      currentProg += 1;
      if (currentProg < generationProgressSteps.length) {
        setGenerationStepIndex(currentProg);
      }
    }, 900);

    try {
      if (!user) {
        router.push("/auth/login?redirect=/generate");
        return;
      }

      // 1. Call AI generation endpoint
      const genRes = await apiRequest<{
        success: boolean;
        data: WebsiteData;
        message: string;
      }>("/api/ai/generate", {
        method: "POST",
        data: {
          websiteType,
          businessName,
          businessDescription,
          targetAudience,
          websiteStyle,
          colorTheme,
          requiredSections,
          animationPreference,
        },
      });

      if (!genRes.success || !genRes.data) {
        throw new Error(genRes.message || "Generation failed");
      }

      // 2. Create project in user workspace
      const projRes = await apiRequest<{ success: boolean; project: Project }>("/api/projects", {
        method: "POST",
        data: {
          name: `${businessName} Landing Page`,
          websiteData: genRes.data,
        },
      });

      clearInterval(interval);

      if (projRes.success && projRes.project) {
        router.push(`/editor/${projRes.project.id}`);
      } else {
        throw new Error("Failed to save project");
      }
    } catch (err: any) {
      clearInterval(interval);
      setIsGenerating(false);
      setError(err.message || "Failed to generate website with AI");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
        <p className="text-sm text-zinc-400 font-medium">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center shadow-2xl backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/10">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Sign In to Generate</h1>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              Please sign in or create a free account to generate high-converting landing pages with AI and customize them in the visual editor.
            </p>
            <Link
              href="/auth/login?redirect=/generate"
              className="w-full inline-flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-xl shadow-indigo-600/25 transition-all active:scale-95"
            >
              <span>Sign In / Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Step Progress Header */}
        {!isGenerating && (
          <div className="mb-10">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-3">
              <span>Step {step} of {totalSteps}</span>
              <span className="text-indigo-400 font-bold">
                {Math.round((step / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium">
            {error}
          </div>
        )}

        {/* ================= STEP CONTENT ================= */}

        {isGenerating ? (
          /* Generation Loading Screen */
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 p-1 animate-spin duration-3000">
                <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Crafting {businessName || "Your Dream Website"}
            </h2>
            <p className="text-sm font-mono text-indigo-400 min-h-[24px] mb-8">
              {generationProgressSteps[generationStepIndex]}
            </p>

            <div className="max-w-md w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-3 text-left text-xs">
              {generationProgressSteps.map((s, idx) => {
                const isPassed = idx < generationStepIndex;
                const isCurrent = idx === generationStepIndex;
                return (
                  <div key={idx} className="flex items-center space-x-3">
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />
                    )}
                    <span className={isCurrent ? "text-white font-medium" : isPassed ? "text-zinc-400" : "text-zinc-600"}>
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            {/* Step 1: Website Type */}
            {step === 1 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">Step 1</span>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">What type of website are you building?</h2>
                <p className="text-sm text-zinc-400 mb-8">Select the category that best matches your vision.</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {WEBSITE_TYPES.map((item) => {
                    const isSelected = websiteType === item.type;
                    return (
                      <div
                        key={item.type}
                        onClick={() => setWebsiteType(item.type)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/50"
                            : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{item.icon}</span>
                        <h4 className="font-bold text-sm text-white mb-1">{item.type}</h4>
                        <p className="text-xs text-zinc-400 leading-tight">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Business Name */}
            {step === 2 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">Step 2</span>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">What is the name of your business?</h2>
                <p className="text-sm text-zinc-400 mb-8">This will be featured prominently in headlines, branding, and navigation.</p>

                <input
                  type="text"
                  autoFocus
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. NexusAI, Lumina Living, Apex Studio..."
                  className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Step 3: Business Description */}
            {step === 3 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">Step 3</span>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Describe what your business does</h2>
                <p className="text-sm text-zinc-400 mb-8">Provide 1-3 sentences about your product, service, and core value proposition.</p>

                <textarea
                  rows={4}
                  autoFocus
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="e.g. An autonomous AI platform that analyzes cloud spend and automatically optimizes compute clusters to reduce monthly hosting bills by 40%..."
                  className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Step 4: Target Audience */}
            {step === 4 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">Step 4</span>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Who is your ideal customer or target audience?</h2>
                <p className="text-sm text-zinc-400 mb-8">Our AI copywriter will tailor tone and messaging specifically for them.</p>

                <input
                  type="text"
                  autoFocus
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. DevOps architects, Series A founders, marketing directors, remote engineers..."
                  className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 text-base font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Step 5: Website Style */}
            {step === 5 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">Step 5</span>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Select your preferred website style</h2>
                <p className="text-sm text-zinc-400 mb-8">Dictates visual personality, gradients, typography, and card treatments.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {WEBSITE_STYLES.map((item) => {
                    const isSelected = websiteStyle === item.style;
                    return (
                      <div
                        key={item.style}
                        onClick={() => setWebsiteStyle(item.style)}
                        className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 bg-gradient-to-br ${item.previewClass} ${
                          isSelected
                            ? "border-indigo-500 ring-2 ring-indigo-500 shadow-xl"
                            : "border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <h4 className="font-bold text-base text-white mb-1">{item.style}</h4>
                        <p className="text-xs text-zinc-300">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 6: Color Theme */}
            {step === 6 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">Step 6</span>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Choose your primary color palette</h2>
                <p className="text-sm text-zinc-400 mb-8">Carefully curated color schemes optimized for dark mode and accessibility.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {COLOR_THEMES.map((theme) => {
                    const isSelected = colorTheme === theme.name;
                    return (
                      <div
                        key={theme.name}
                        onClick={() => setColorTheme(theme.name)}
                        className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/50"
                            : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <span className="font-semibold text-sm text-white">{theme.name}</span>
                        <div className="flex items-center space-x-1.5">
                          {theme.colors.map((c, idx) => (
                            <div
                              key={idx}
                              className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 7: Required Sections */}
            {step === 7 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">Step 7</span>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Which sections do you want to include?</h2>
                <p className="text-sm text-zinc-400 mb-8">Choose the components you want AI to generate. You can always add or edit sections later.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {ALL_SECTIONS.map((sec) => {
                    const isChecked = requiredSections.includes(sec.type);
                    return (
                      <div
                        key={sec.type}
                        onClick={() => toggleSection(sec.type)}
                        className={`p-4 rounded-xl border cursor-pointer flex items-start space-x-3 transition-all ${
                          isChecked
                            ? "bg-indigo-600/10 border-indigo-500 ring-1 ring-indigo-500"
                            : "bg-zinc-950/60 border-zinc-800 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                            isChecked ? "bg-indigo-600 border-indigo-600 text-white" : "border-zinc-700"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{sec.type}</h4>
                          <p className="text-xs text-zinc-400 mt-0.5 leading-snug">{sec.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 8: Animation Preference */}
            {step === 8 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">Step 8</span>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Choose animation preference</h2>
                <p className="text-sm text-zinc-400 mb-8">Define how interactive transitions and hover dynamics will feel.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(["None", "Subtle", "Modern"] as AnimationPreference[]).map((pref) => {
                    const isSelected = animationPreference === pref;
                    return (
                      <div
                        key={pref}
                        onClick={() => setAnimationPreference(pref)}
                        className={`p-6 rounded-xl border cursor-pointer text-center transition-all ${
                          isSelected
                            ? "bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/50"
                            : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <h4 className="font-bold text-lg text-white mb-2">{pref}</h4>
                        <p className="text-xs text-zinc-400">
                          {pref === "None" && "Fast static render with minimal motion"}
                          {pref === "Subtle" && "Gentle fade-ins and smooth hover elevation"}
                          {pref === "Modern" && "Dynamic scale, spring physics and luminous hover glows"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="mt-10 pt-6 border-t border-zinc-800 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="px-5 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-sm font-semibold text-zinc-300 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>{step === totalSteps ? "Generate Landing Page with AI" : "Continue"}</span>
                {step === totalSteps ? <Wand2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
