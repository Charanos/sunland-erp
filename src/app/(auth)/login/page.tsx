"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  IconEye,
  IconEyeOff,
  IconMail,
  IconShieldLock,
  IconArrowRight,
  IconLoader2,
} from "@tabler/icons-react";

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved email if rememberMe was previously set
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("sunland_remembered_email");
      const savedRemember = localStorage.getItem("sunland_remember_me");
      if (savedEmail) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEmail(savedEmail);
      }
      if (savedRemember !== null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRememberMe(savedRemember === "true");
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError(null);

    // Persist email locally if rememberMe checkbox is active
    if (typeof window !== "undefined") {
      if (rememberMe) {
        localStorage.setItem("sunland_remembered_email", email);
        localStorage.setItem("sunland_remember_me", "true");
      } else {
        localStorage.removeItem("sunland_remembered_email");
        localStorage.setItem("sunland_remember_me", "false");
      }
    }

    try {
      const res = await fetch("/api/auth/emulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success && data.user?.portal) {
        window.location.href = data.user.portal;
      } else {
        setError(data.error || "Authentication failed. Please verify your corporate credentials.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred during portal routing.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.08fr_0.92fr]">
      {/* ── Left Hero Side (Cinematic Lifestyle with Exact Hero Scrims) ── */}
      <section className="relative hidden min-h-screen overflow-hidden lg:block bg-[#090d1f]">
        <Image
          src="/images/landlords-hero.jpg"
          alt="Sunland Real Estates"
          className="hero-bg-media object-cover object-center opacity-80"
          fill
          priority
          sizes="55vw"
          quality={95}
        />

        {/* ── Layered Atmospheric Scrims Exactly Matching Hero Specification ── */}
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-b from-black/40 via-transparent via-35% to-transparent"
        />
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 via-55% to-transparent"
        />
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-b from-transparent via-[#090d1f]/30 to-[#151936]"
        />

        {/* Top-left Brand Logo (Cinematic Scale) */}
        <div className="absolute left-12 lg:left-16 top-12 lg:top-16 z-10 flex items-center">
          <Link href="/" className="transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none">
            <Image
              src="/logo.png"
              width={260}
              height={130}
              alt="Sunland Real Estates"
              priority
              className="h-16 sm:h-18 lg:h-20 w-auto object-contain drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
            />
          </Link>
        </div>

        {/* Bottom Editorial Copy Anchor */}
        <div className="absolute bottom-12 lg:bottom-16 left-12 lg:left-16 right-12 lg:right-16 z-10 text-white">
          {/* Sleek Hairline Category Indicator */}
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="inline-block h-px w-8 shrink-0 bg-brand-yellow" />
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-200/90 font-medium">
              Enterprise Operations
            </span>
          </div>

          <h2 className="title-serif text-3xl sm:text-4xl lg:text-[48px] font-normal leading-[1.08] tracking-tight text-white mt-5 max-w-lg drop-shadow-sm">
            Where Life Meets Style.
          </h2>

          <p className="mt-4 max-w-md text-slate-200/90 text-[15.5px] leading-relaxed font-normal">
            Proprietary real estate intelligence platform orchestrating prime portfolio acquisitions, tenant relationships, facility operations, and institutional accounting.
          </p>

          <div className="mt-10 flex items-center gap-6 border-t border-white/10 pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300/70 font-normal">
            <span>Nairobi · Mombasa · Diaspora</span>
            <span className="text-white/20">/</span>
            <span>Direct Clearance</span>
          </div>
        </div>
      </section>

      {/* ── Right Form Side (Airy & Sleek Luxury Auth Interface) ── */}
      <section className="relative flex min-h-screen flex-col justify-between bg-surface-0 px-6 py-8 sm:px-12 sm:py-12 lg:flex-row lg:items-center lg:justify-center lg:px-16 xl:px-20">
        {/* Top Header Bar for Mobile Viewports (< lg) */}
        <div className="flex w-full items-center justify-between pb-6 border-b border-line/70 lg:hidden">
          <Link href="/" className="transition-transform active:scale-95">
            <div className="flex items-center gap-2 rounded-xl bg-[#151936] px-3.5 py-2 shadow-2xs">
              <Image
                src="/logo.png"
                width={130}
                height={40}
                alt="Sunland Real Estates"
                className="h-6 w-auto object-contain"
              />
            </div>
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-slate-500 hover:text-[#151936] hover:border-slate-300 transition-all shadow-2xs"
          >
            <IconArrowRight
              className="rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5"
              size={11}
              stroke={1.75}
            />
            <span>Home</span>
          </Link>
        </div>

        {/* Floating Return Link for Desktop Viewports (lg+) */}
        <div className="absolute top-8 right-8 sm:right-12 z-10 hidden lg:block">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400 hover:text-[#151936] transition-colors py-2"
          >
            <IconArrowRight
              className="rotate-180 transition-transform duration-200 group-hover:-translate-x-1"
              size={12}
              stroke={1.5}
            />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Central Form Container */}
        <div className="w-full max-w-[460px] mx-auto my-auto py-8 lg:py-0">
          {/* Editorial Heading Block */}
          <div className="space-y-3">
            <h1 className="title-serif text-[29px] sm:text-4xl lg:text-[42px] font-normal leading-[1.12] tracking-tight text-[#151936]">
              Welcome back to Sunland
            </h1>

            <p className="text-[15px] sm:text-[15.5px] leading-relaxed text-slate-500 font-normal max-w-md">
              Sign in with your corporate credentials to access your designated workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 sm:mt-10 space-y-6 sm:space-y-7">
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-rose-700 text-[13.5px] font-normal">
                <span className="size-1.5 rounded-full bg-rose-500 shrink-0 animate-pulse" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field - Sleek & Airy */}
            <div className="space-y-2">
              <label className="block font-mono text-[10.5px] uppercase tracking-[0.22em] text-slate-400 font-medium">
                Corporate Email
              </label>
              <div className="relative group flex items-center">
                <IconMail
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 text-slate-400/80 transition-colors group-focus-within:text-[#151936]"
                  size={17}
                  stroke={1.5}
                />
                <input
                  className="h-12 w-full rounded-xl border border-line bg-transparent pl-10.5 pr-4 text-[14.5px] text-slate-800 placeholder:text-slate-300 font-normal transition-all duration-200 hover:border-slate-400 focus:border-[#151936] focus:outline-none focus:ring-1 focus:ring-[#151936] disabled:opacity-50"
                  placeholder="name@sunlandre.co.ke"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                  type="email"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field - Sleek & Airy */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-mono text-[10.5px] uppercase tracking-[0.22em] text-slate-400 font-medium">
                  Password
                </label>
                <Link
                  href="/login"
                  className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-slate-400 hover:text-[#151936] transition-colors font-normal"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group flex items-center">
                <IconShieldLock
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 text-slate-400/80 transition-colors group-focus-within:text-[#151936]"
                  size={17}
                  stroke={1.5}
                />
                <input
                  className="h-12 w-full rounded-xl border border-line bg-transparent pl-10.5 pr-10 text-[14.5px] text-slate-800 placeholder:text-slate-300 font-normal transition-all duration-200 hover:border-slate-400 focus:border-[#151936] focus:outline-none focus:ring-1 focus:ring-[#151936] disabled:opacity-50"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 flex size-6 items-center justify-center text-slate-400 hover:text-slate-600 transition-colors focus-visible:outline-none"
                  onClick={() => setShowPassword((p) => !p)}
                  disabled={isSubmitting}
                  type="button"
                >
                  {showPassword ? <IconEyeOff size={16} stroke={1.5} /> : <IconEye size={16} stroke={1.5} />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center pt-0.5">
              <label className="flex items-center gap-2.5 cursor-pointer select-none text-[13.5px] text-slate-500 font-normal">
                <input
                  className="size-3.5 rounded border-slate-300 text-[#151936] accent-[#151936] focus:ring-0 focus:ring-offset-0"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isSubmitting}
                  type="checkbox"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Sleek CTA Button (The Yellow Beat) */}
            <button
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 font-mono text-[11.5px] uppercase tracking-[0.16em] font-medium text-[#151936] shadow-xs hover:bg-brand-yellow-h hover:shadow-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="animate-spin" size={15} stroke={1.75} />
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <span>Login to Portal</span>
                  <IconArrowRight size={13} stroke={2} />
                </>
              )}
            </button>
          </form>

          {/* Minimalist Footnote */}
          <div className="mt-12 sm:mt-14 border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left font-mono text-[11px] text-slate-400 font-normal">
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Identity Subsystem Active</span>
            </span>
            <span>
              IT Helpdesk:{" "}
              <a
                href="mailto:admin@sunlandre.co.ke"
                className="text-slate-500 hover:text-[#151936] underline-offset-4 hover:underline"
              >
                admin@sunlandre.co.ke
              </a>
            </span>
          </div>
        </div>
      </section>

      {/* ── Secure Session Redirection Overlay ── */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#151936]/90 backdrop-blur-sm text-white animate-fade-in">
          <div className="flex flex-col items-center max-w-full px-6 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full border border-[#f3df27]/25 animate-ping" />
              <div className="flex size-14 items-center justify-center rounded-full border border-[#f3df27]/30 bg-[#151936] shadow-xl">
                <IconShieldLock size={28} className="text-[#f3df27] animate-pulse" />
              </div>
            </div>

            <h3 className="title-serif font-normal text-white text-2xl">Delegating Authority</h3>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed max-w-sm font-normal">
              Verifying security clearance and establishing your workspace session.
            </p>

            <div className="mt-7 flex items-center gap-2 text-[#151936] bg-white rounded-full border border-white/10 px-4 py-1.5 font-mono text-xs font-medium">
              <IconLoader2 className="animate-spin" size={14} />
              <span>Routing Secure Session...</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
