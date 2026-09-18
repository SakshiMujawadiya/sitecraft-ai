"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
  Plus,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  headerAction?: React.ReactNode;
}

export default function AppShell({
  children,
  title,
  description,
  headerAction,
}: AppShellProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Website Generator", href: "/reading", icon: Sparkles, badge: "AI Gen" },
    { name: "Templates", href: "/templates", icon: Layers },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* ========================================================
          DESKTOP SIDEBAR
      ======================================================== */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl shrink-0 sticky top-0 h-screen z-30">
        {/* Brand */}
        <div className="h-16 px-6 flex items-center border-b border-zinc-800/60">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              SiteCraft <span className="text-indigo-400 font-semibold text-xs px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/50">AI</span>
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Workspace
          </div>

          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-zinc-800/90 text-white shadow-sm border border-zinc-700/60"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-indigo-400" : "text-zinc-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Credits Card in Footer */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
            <div className="flex items-center space-x-2.5 min-w-0">
              <img
                src={
                  user?.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || "default"}`
                }
                alt={user?.name || "User"}
                className="w-8 h-8 rounded-full border border-zinc-700 object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {user?.credits ?? 50} Credits
                </p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/80 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================
          MOBILE DRAWER OVERLAY
      ======================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-zinc-950 border-r border-zinc-800 p-5 z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
              <Link
                href="/"
                className="flex items-center space-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-base text-white">SiteCraft AI</span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1.5">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold ${
                      isActive
                        ? "bg-zinc-800 text-white border border-zinc-700"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-zinc-500"}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={
                      user?.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || "default"}`
                    }
                    alt={user?.name || "User"}
                    className="w-8 h-8 rounded-full border border-zinc-700 object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{user?.name}</p>
                    <p className="text-[11px] text-zinc-400">{user?.credits ?? 50} Credits</p>
                  </div>
                </div>
                <button
                  onClick={() => logout()}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN CONTENT AREA
      ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top SaaS Header */}
        <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none">
                {title}
              </h1>
              {description && (
                <p className="hidden sm:block text-xs text-zinc-400 mt-1 truncate">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {headerAction}

            {/* Quick Credits Pill */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{user?.credits ?? 50} Credits</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
