"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/lib/types";
import { apiRequest } from "@/lib/api-client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; message: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  sendOtp: (email: string, recaptchaToken?: string) => Promise<{ success: boolean; message: string; previewOtp?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  loginWithDemo: (email?: string, name?: string, redirectUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await apiRequest<{ success: boolean; user: User }>("/api/auth/me");
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("lp_access_token");
        }
      }
    } catch {
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("lp_access_token");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const register = async (email: string, password: string, name?: string) => {
    const res = await apiRequest<{
      success: boolean;
      message: string;
      user: User;
      accessToken: string;
    }>("/api/auth/register", {
      method: "POST",
      data: { email, password, name },
    });

    if (res.success && res.user) {
      if (res.accessToken && typeof window !== "undefined") {
        localStorage.setItem("lp_access_token", res.accessToken);
      }
      setUser(res.user);
    }
    return res;
  };

  const login = async (email: string, password: string) => {
    const res = await apiRequest<{
      success: boolean;
      message: string;
      user: User;
      accessToken: string;
    }>("/api/auth/login", {
      method: "POST",
      data: { email, password },
    });

    if (res.success && res.user) {
      if (res.accessToken && typeof window !== "undefined") {
        localStorage.setItem("lp_access_token", res.accessToken);
      }
      setUser(res.user);
    }
    return res;
  };

  const sendOtp = async (email: string, recaptchaToken?: string) => {
    const res = await apiRequest<{ success: boolean; message: string; previewOtp?: string }>(
      "/api/auth/otp/send",
      {
        method: "POST",
        data: { email, recaptchaToken },
      }
    );
    return res;
  };

  const verifyOtp = async (email: string, otp: string) => {
    const res = await apiRequest<{
      success: boolean;
      message: string;
      user: User;
      accessToken: string;
    }>("/api/auth/otp/verify", {
      method: "POST",
      data: { email, otp },
    });

    if (res.success && res.user) {
      if (res.accessToken && typeof window !== "undefined") {
        localStorage.setItem("lp_access_token", res.accessToken);
      }
      setUser(res.user);
    }
    return res;
  };

  const loginWithDemo = async (email?: string, name?: string, redirectUrl: string = "/dashboard") => {
    try {
      const targetEmail = email || "demo@ailpbuilder.io";
      await sendOtp(targetEmail);
      const res = await verifyOtp(targetEmail, "777888");
      if (res.success) {
        window.location.href = redirectUrl;
        return;
      }
    } catch {
      // Fallback to server route redirect
    }
    const params = new URLSearchParams({
      action: "demo_login",
      ...(email ? { email } : {}),
      ...(name ? { name } : {}),
      ...(redirectUrl ? { redirect: redirectUrl } : {}),
    });
    window.location.href = `/api/auth/google?${params.toString()}`;
  };

  const logout = async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("lp_access_token");
      }
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        sendOtp,
        verifyOtp,
        loginWithDemo,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
