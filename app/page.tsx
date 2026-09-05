"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Key, ArrowRight, ShieldCheck } from "lucide-react";
import { PixelMascot } from "@/components/pixel/PixelMascot";
import { PixelForestBackground } from "@/components/PixelForestBackground";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    // Simulate a brief authentication delay,
    // then route directly to the home page.
    setTimeout(() => {
      router.push("/home");
    }, 1200);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#06080A] p-4 relative overflow-hidden">
      {/* Dynamic Pixel Forest Background with plants2.png */}
      <PixelForestBackground bgImage="/plants2.png" />

      {/* Background Decorative Grid */}
      <div className="absolute inset-0 scanner-grid opacity-30 pointer-events-none z-10" />
      
      <div className="w-full max-w-sm relative z-20 animate-reveal-in">
        <div className="rounded-3xl bg-[#0C1015]/90 border border-[#1E2732] shadow-2xl overflow-hidden relative backdrop-blur-md">
          
          {/* Subtle top glowing accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Header / Identity */}
            <div className="text-center space-y-3">
              <div className="inline-flex p-3 rounded-2xl bg-[#080D11] border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <PixelMascot size={48} expression={isAuthenticating ? "analyzing" : "curious"} />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  WELCOME BACK
                </h1>
                <p className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">
                  Please sign in to continue
                </p>
              </div>
            </div>

            {/* Pixel Divider */}
            <div className="pixel-divider text-[#1E2732] w-full" />

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3 h-3" /> Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={isAuthenticating}
                  className="w-full bg-[#080D11] border border-[#1E2732] rounded-xl pl-3 pr-4 py-3 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3 h-3" /> Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isAuthenticating}
                  className="w-full bg-[#080D11] border border-[#1E2732] rounded-xl pl-3 pr-4 py-3 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all disabled:opacity-50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAuthenticating || !username || !password}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.25)] disabled:opacity-60 disabled:active:scale-100 disabled:shadow-none"
                >
                  {isAuthenticating ? (
                    <>
                      <span className="animate-pulse flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> SIGNING IN...
                      </span>
                    </>
                  ) : (
                    <>
                      SIGN IN <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Bottom Info */}
            <div className="pt-4 text-center">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex justify-center items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/50 animate-pulse-gentle" />
                SECURE CONNECTION
              </span>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}