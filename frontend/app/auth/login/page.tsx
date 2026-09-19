"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, KeyRound, AlertCircle, CheckCircle2, Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, logout, login, sendOtp, verifyOtp, loginWithDemo } = useAuth();

  const redirectParam = searchParams.get("redirect");
  const redirectUrl =
    redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/dashboard";

  // Mode: "password" (standard) or "otp" (email verification code)
  const [authMode, setAuthMode] = useState<"password" | "otp">("password");

  // Password Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP Login State
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds

  // Common UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError("Please enter both your email address and password.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success) {
        setSuccessMsg("Signed in successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 300);
      } else {
        setError(res.message || "Invalid email or password.");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please provide a valid email address");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await sendOtp(email, "demo-recaptcha-token");
      if (res.success) {
        setStep("otp");
        setSuccessMsg(res.message);
        if (res.previewOtp) {
          setPreviewCode(res.previewOtp);
        }
        setCountdown(600);
      } else {
        setError(res.message || "Failed to send verification code");
      }
    } catch (err: any) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otp.length < 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await verifyOtp(email, otp);
      if (res.success) {
        setSuccessMsg("Signed in successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 300);
      } else {
        setError(res.message || "Verification failed");
      }
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-xs">Checking session...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl z-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Already Signed In</h2>
          <p className="text-xs text-zinc-400 mb-6">
            You are currently signed in as <span className="text-indigo-300 font-semibold">{user.email}</span>
          </p>

          <div className="space-y-3">
            <button
              onClick={() => { window.location.href = redirectUrl; }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={async () => {
                await logout();
              }}
              className="w-full py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Sign Out to Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-zinc-100">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center space-x-2.5 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 p-0.5 shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            AI Platform
          </span>
        </Link>

        <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-zinc-400">
          Access your AI Reading Assistant and personalized dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-zinc-900/90 border border-zinc-800/90 backdrop-blur-xl py-7 px-6 sm:px-8 rounded-3xl shadow-2xl">
          {/* Contextual Notice */}
          {redirectParam && (
            <div className="mb-5 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center space-x-2.5 text-indigo-200 text-xs font-medium">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
              <span>Please sign in to access the protected workspace.</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start space-x-2.5 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start space-x-2.5 text-emerald-400 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Auth Method Selector Tabs */}
          <div className="grid grid-cols-2 p-1 mb-6 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode("password");
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                authMode === "password"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("otp");
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                authMode === "otp"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Email OTP & Demo
            </button>
          </div>

          {authMode === "password" ? (
            /* Standard Password Sign-in Form */
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              {/* Instant 1-Click Demo Evaluation Sign In */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => loginWithDemo("demo@ailpbuilder.io", "Alex Designer", redirectUrl)}
                  className="w-full py-2.5 px-3 rounded-xl border border-indigo-900/60 bg-indigo-950/30 hover:bg-indigo-900/50 text-indigo-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Instant 1-Click Demo Sign In</span>
                </button>
              </div>
            </form>
          ) : (
            /* OTP & Google Demo Sign-in */
            <div>
              {previewCode && step === "otp" && (
                <div className="mb-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <KeyRound className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs text-zinc-300">
                      Testing OTP: <strong className="text-white text-sm tracking-wider font-mono">{previewCode}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtp(previewCode)}
                    className="px-2.5 py-1 text-xs font-bold text-indigo-300 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/50 rounded-lg transition-colors cursor-pointer"
                  >
                    Auto-fill
                  </button>
                </div>
              )}

              {step === "email" ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Email Address for OTP
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="founder@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/25 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Send 6-Digit OTP Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-zinc-900 px-3 text-zinc-500">Or continue with</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => loginWithDemo("alex.google@example.com", "Alex Rivera", redirectUrl)}
                    className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-4 border border-zinc-700/80 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                    </svg>
                    <span>Google Account</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="otp" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        6-Digit Security Code
                      </label>
                      <span className="text-xs font-mono text-indigo-400">
                        Expires in {formatTime(countdown)}
                      </span>
                    </div>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-[0.6em] text-2xl font-black py-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/25 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify & Access Workspace</span>}
                  </button>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("email");
                        setOtp("");
                        setError(null);
                      }}
                      className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      ← Change Email
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      disabled={loading}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
                    >
                      Resend Code
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Switch to Register link */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 text-center">
            <p className="text-xs text-zinc-400">
              Don&apos;t have an account?{" "}
              <Link
                href={`/auth/register${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 transition-colors"
              >
                Create one for free
              </Link>
            </p>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-[11px] text-zinc-500 flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Secure session with HTTP-only cookies and protected routes.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
