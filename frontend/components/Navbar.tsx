"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  Layout,
  Plus,
  LogOut,
  Layers,
  BarChart3,
  Settings,
  Menu,
  X,
  LayoutDashboard,
  Wand2,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      label: "AI Generator",
      href: user ? "/reading" : "/auth/login?redirect=/reading",
      icon: Sparkles,
      active: pathname.startsWith("/reading"),
    },
    {
      label: "Templates",
      href: "/templates",
      icon: Layout,
      active: pathname.startsWith("/templates"),
    },
    {
      label: "Wizard",
      href: user ? "/generate" : "/auth/login?redirect=/generate",
      icon: Wand2,
      active: pathname.startsWith("/generate"),
    },
    {
      label: "Projects",
      href: user ? "/dashboard" : "/auth/login?redirect=/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Analytics",
      href: user ? "/dashboard/analytics" : "/auth/login?redirect=/dashboard/analytics",
      icon: BarChart3,
      active: pathname.startsWith("/dashboard/analytics"),
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            SiteCraft<span className="text-indigo-400 font-semibold text-sm ml-1 px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/50">AI</span>
          </span>
        </Link>

        {/* Center Links with Active State Highlights */}
        <nav className="hidden md:flex items-center space-x-2 text-sm font-medium">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all duration-200 ${
                  item.active
                    ? "bg-zinc-800/90 text-white border border-zinc-700/80 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    item.active ? "text-indigo-400" : "text-zinc-500"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-3.5">
          {loading ? (
            <div className="w-20 h-8 rounded-lg bg-zinc-800/60 animate-pulse" />
          ) : user ? (
            <div className="flex items-center space-x-3">
              {/* Credits Pill */}
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-800/50 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>{user.credits} Credits</span>
              </div>

              {/* Create CTA */}
              <Link
                href="/reading"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Generate</span>
              </Link>

              {/* User Dropdown Profile */}
              <div className="flex items-center space-x-2 pl-2 border-l border-zinc-800">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-zinc-700 object-cover"
                />
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2.5">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/login?redirect=/reading"
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/25 active:scale-95 transition-all"
              >
                <span>Get Started</span>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl px-4 py-4 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 ${
                  item.active
                    ? "bg-zinc-800 text-white border border-zinc-700"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${item.active ? "text-indigo-400" : "text-zinc-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
