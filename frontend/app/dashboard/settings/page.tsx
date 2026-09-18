"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api-client";
import { Project, CustomDomainConfig } from "@/lib/types";
import {
  Globe,
  ShieldCheck,
  Check,
  Sparkles,
  Loader2,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  Trash2,
  HelpCircle,
  CheckCircle2,
  Clock,
  FlaskConical,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [domainInput, setDomainInput] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoadingProjects(true);
      const res = await apiRequest<{ success: boolean; projects: Project[] }>("/api/projects");
      if (res.success && res.projects.length > 0) {
        setProjects(res.projects);
        const first = res.projects[0];
        setSelectedProjectId(first.id);
        if (first.customDomain?.domain) {
          setDomainInput(first.customDomain.domain);
        }
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  }

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const customDomain = selectedProject?.customDomain;

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    const found = projects.find((p) => p.id === projectId);
    setDomainInput(found?.customDomain?.domain || "");
    setMessage(null);
  };

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Connect or Update Domain
  const handleConnectDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !domainInput.trim()) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await apiRequest<{
        success: boolean;
        project: Project;
        domainConfig: CustomDomainConfig;
        message: string;
      }>(`/api/projects/${selectedProjectId}/domain`, {
        method: "POST",
        data: { domain: domainInput.trim() },
      });

      if (res.success && res.project) {
        setProjects((prev) => prev.map((p) => (p.id === selectedProjectId ? res.project : p)));
        setMessage({ type: "success", text: res.message });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to connect domain" });
    } finally {
      setSaving(false);
    }
  };

  // Live DNS Verification via Node Backend
  const handleVerifyDns = async () => {
    if (!selectedProjectId) return;

    setVerifying(true);
    setMessage(null);

    try {
      const res = await apiRequest<{
        success: boolean;
        project: Project;
        verified: boolean;
        status: string;
        message: string;
      }>(`/api/projects/${selectedProjectId}/domain/verify`, {
        method: "POST",
      });

      if (res.project) {
        setProjects((prev) => prev.map((p) => (p.id === selectedProjectId ? res.project : p)));
      }

      setMessage({
        type: res.verified ? "success" : "info",
        text: res.message || "DNS verification check complete.",
      });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "DNS check failed" });
    } finally {
      setVerifying(false);
    }
  };

  // Instant Dev Simulation (for testing without purchasing live domains)
  const handleSimulateVerification = async () => {
    if (!selectedProjectId) return;

    setSimulating(true);
    setMessage(null);

    try {
      const res = await apiRequest<{ success: boolean; project: Project; message: string }>(
        `/api/projects/${selectedProjectId}/domain/simulate`,
        { method: "POST" }
      );

      if (res.project) {
        setProjects((prev) => prev.map((p) => (p.id === selectedProjectId ? res.project : p)));
        setMessage({ type: "success", text: res.message });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Simulation failed" });
    } finally {
      setSimulating(false);
    }
  };

  // Disconnect Custom Domain
  const handleDisconnectDomain = async () => {
    if (!selectedProjectId) return;
    if (!confirm("Are you sure you want to disconnect this custom domain? The site will revert to its standard slug.")) {
      return;
    }

    setDisconnecting(true);
    setMessage(null);

    try {
      const res = await apiRequest<{ success: boolean; project: Project; message: string }>(
        `/api/projects/${selectedProjectId}/domain`,
        { method: "DELETE" }
      );

      if (res.project) {
        setProjects((prev) => prev.map((p) => (p.id === selectedProjectId ? res.project : p)));
        setDomainInput("");
        setMessage({ type: "info", text: res.message });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to disconnect domain" });
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Custom Domains & Hosting
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Host your websites on any custom domain or subdomain with automated edge SSL and worldwide CDN routing.
          </p>
        </div>

        {/* Notifications */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-start space-x-3 text-xs font-medium animate-in fade-in duration-200 ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : message.type === "error"
                ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            ) : message.type === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            ) : (
              <Clock className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
            )}
            <div className="flex-1 leading-relaxed">{message.text}</div>
          </div>
        )}

        <div className="space-y-8">
          {/* ================= CUSTOM DOMAIN CARD ================= */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-xl">
            <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Domain Manager</h2>
                  <p className="text-xs text-zinc-400">Point your own branded domain to your published landing page</p>
                </div>
              </div>

              {customDomain && (
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                      customDomain.verified
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    }`}
                  >
                    {customDomain.verified ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Active & Secured</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>DNS Pending</span>
                      </>
                    )}
                  </span>

                  {!customDomain.verified && (
                    <button
                      onClick={handleSimulateVerification}
                      disabled={simulating}
                      title="Simulate successful DNS verification for localhost testing without owning the real domain"
                      className="inline-flex items-center space-x-1 px-3 py-1 rounded-full border border-indigo-500/40 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[11px] font-bold shadow-md shadow-indigo-500/10 transition-all cursor-pointer"
                    >
                      <FlaskConical className="w-3 h-3" />
                      <span>{simulating ? "Verifying..." : "⚡ Quick Verify (Dev Mode)"}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Step 1: Select Project & Input Domain */}
            <form onSubmit={handleConnectDomain} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                  Select Target Website
                </label>
                {loadingProjects ? (
                  <div className="h-10 w-full bg-zinc-950 border border-zinc-800 rounded-xl animate-pulse" />
                ) : (
                  <select
                    value={selectedProjectId}
                    onChange={(e) => handleSelectProject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.isPublished ? "Published" : "Draft"}) • /p/{p.slug}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                  Custom Domain or Subdomain
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    placeholder="e.g. landing.yourbrand.com or yourbrand.com"
                    className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={saving || !domainInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 disabled:opacity-40 transition-all flex items-center space-x-1.5"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Connect Domain</span>}
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1.5">
                  Enter your root domain (e.g. <code>mybrand.com</code>) or any subdomain (e.g. <code>get.mybrand.com</code>).
                </p>
              </div>
            </form>

            {/* Step 2: DNS Records Table (Shown when custom domain is set) */}
            {customDomain && (
              <div className="mt-8 pt-6 border-t border-zinc-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Required DNS Records
                    </h3>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Log into your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add this record:
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleVerifyDns}
                      disabled={verifying}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all flex items-center space-x-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${verifying ? "animate-spin text-indigo-400" : ""}`} />
                      <span>{verifying ? "Checking..." : "Verify DNS"}</span>
                    </button>

                    {/* Development Testing Simulator */}
                    <button
                      onClick={handleSimulateVerification}
                      disabled={simulating}
                      title="Simulates successful DNS resolution for testing on localhost without buying a domain"
                      className="px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold transition-all flex items-center space-x-1.5"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>{simulating ? "Simulating..." : "Test DNS Match"}</span>
                    </button>
                  </div>
                </div>

                {/* DNS Table */}
                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/60">
                  <table className="w-full text-left text-xs font-mono text-zinc-300">
                    <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
                      <tr>
                        <th className="p-3">Type</th>
                        <th className="p-3">Host / Name</th>
                        <th className="p-3">Target Value</th>
                        <th className="p-3">TTL</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      <tr>
                        <td className="p-3 font-bold text-indigo-400">{customDomain.recordType}</td>
                        <td className="p-3">
                          {customDomain.recordType === "A"
                            ? "@"
                            : customDomain.domain.split(".").length > 2
                            ? customDomain.domain.split(".")[0]
                            : "@"}
                        </td>
                        <td className="p-3 text-zinc-200 font-semibold">{customDomain.expectedTarget}</td>
                        <td className="p-3 text-zinc-500">Automatic / 3600</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleCopy(customDomain.expectedTarget, "target")}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 transition-colors font-sans"
                          >
                            {copiedField === "target" ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedField === "target" ? "Copied!" : "Copy"}</span>
                          </button>
                        </td>
                      </tr>

                      {/* Optional TXT Verification Record */}
                      <tr>
                        <td className="p-3 font-bold text-violet-400">TXT</td>
                        <td className="p-3">_sitecraft-challenge</td>
                        <td className="p-3 text-zinc-400 truncate max-w-xs">{customDomain.verificationToken}</td>
                        <td className="p-3 text-zinc-500">Automatic</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleCopy(customDomain.verificationToken, "token")}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 transition-colors font-sans"
                          >
                            {copiedField === "token" ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedField === "token" ? "Copied!" : "Copy"}</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Diagnostics message */}
                {customDomain.dnsDiagnostics?.message && (
                  <div className="mt-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-400 font-mono flex items-center justify-between">
                    <span>
                      <strong>Status:</strong> {customDomain.dnsDiagnostics.message}
                    </span>
                    {customDomain.lastCheckedAt && (
                      <span className="text-[10px] text-zinc-500 font-sans">
                        Last checked: {new Date(customDomain.lastCheckedAt).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                )}

                {/* Live Preview & Disconnect Footer */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800/60">
                  <div className="flex items-center space-x-3">
                    {/* Test / View on Custom Domain Route */}
                    <Link
                      href={`/d/${customDomain.domain}`}
                      target="_blank"
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                    >
                      <span>Visit Live Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <span className="text-xs text-zinc-500 font-mono">
                      https://{customDomain.domain}
                    </span>
                  </div>

                  <button
                    onClick={handleDisconnectDomain}
                    disabled={disconnecting}
                    className="inline-flex items-center space-x-1.5 text-xs text-zinc-500 hover:text-rose-400 transition-colors font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{disconnecting ? "Disconnecting..." : "Disconnect Domain"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================= SUBSCRIPTION & USAGE ================= */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Subscription & AI Credits</h2>
                <p className="text-xs text-zinc-400">Manage your active plan and AI generation limits</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/60">
                <span className="text-xs font-bold text-zinc-400 uppercase">Current Tier</span>
                <div className="text-2xl font-black text-white mt-1 capitalize">{user?.subscriptionTier || "Pro"}</div>
                <p className="text-xs text-zinc-400 mt-2">Unlimited projects, custom domains, and edge CDN delivery.</p>
              </div>

              <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/60">
                <span className="text-xs font-bold text-zinc-400 uppercase">Available AI Credits</span>
                <div className="text-2xl font-black text-indigo-400 mt-1">{user?.credits ?? 50}</div>
                <p className="text-xs text-zinc-400 mt-2">5 credits per full generation • 1 credit per AI rewrite.</p>
              </div>

              <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/60 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-400 uppercase">Top Up Credits</span>
                  <div className="text-xs text-zinc-400 mt-1">Add instant generation balance anytime.</div>
                </div>
                <button
                  onClick={() => alert("50 AI Credits added to your balance!")}
                  className="w-full mt-4 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  Top Up +50 Credits
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
