"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const benefits = [
  "Three branded profiles",
  "NFC, QR, and vCard sharing",
  "Hosted avatar uploads",
  "Direct Android and Huawei APKs",
];

const signalStats = [
  { value: "0.4s", label: "tap to open" },
  { value: "3", label: "profiles" },
  { value: "R50", label: "monthly" },
];

export default function LandingPage() {
  const [referralCode, setReferralCode] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    const params = new URLSearchParams();
    params.append("email", email.trim());
    if (referralCode.trim()) {
      params.append("referralCode", referralCode.trim());
    }
    window.location.href = `/api/checkout?${params.toString()}`;
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06080d] text-[#f7f4ed]">
      <div className="connect-hero-bg" aria-hidden="true" />
      <div className="connect-orbit-field" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <nav className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link className="group flex items-center gap-3" href="/">
          <img
            src="/logo.jpg"
            alt="Connect"
            className="h-11 w-11 rounded-lg border border-white/10 object-cover shadow-[0_0_28px_rgba(24,200,243,0.26)] transition-transform duration-500 group-hover:scale-105"
          />
          <div>
            <p className="text-lg font-black leading-none tracking-normal text-white">Connect</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8c9f]">tap to share</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            className="hidden rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-[#d8e3ef] transition-colors hover:border-[#18c8f3]/45 hover:text-white sm:inline-flex"
            href="/install"
          >
            Downloads
          </Link>
          <Link
            className="rounded-lg border border-[#18c8f3]/45 bg-[#18c8f3]/10 px-4 py-2 text-sm font-black text-[#c9f5ff] transition-colors hover:bg-[#18c8f3]/18"
            href="/builder"
          >
            Builder
          </Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-7xl items-center gap-10 px-5 pb-10 pt-2 sm:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-3 rounded-lg border border-[#18c8f3]/25 bg-[#18c8f3]/10 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#c9f5ff] shadow-[0_0_34px_rgba(24,200,243,0.12)]">
            <span className="h-2 w-2 rounded-full bg-[#18c8f3] shadow-[0_0_16px_rgba(24,200,243,0.9)]" />
            NFC business cards for every phone
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-normal text-white sm:text-7xl lg:text-8xl">
            Make the first tap impossible to forget.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#aab6c6] sm:text-xl">
            Connect turns a phone tap into a polished profile, instant contact save, QR fallback, and direct install path for Android, Huawei, and iPhone visitors.
          </p>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {signalStats.map((stat) => (
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4 backdrop-blur" key={stat.label}>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#7f8c9f]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="tap-stage" aria-hidden="true">
            <div className="tap-phone tap-phone-left">
              <div className="tap-phone-screen">
                <div className="tap-card-preview">
                  <img src="/thumbnail.png" alt="" />
                  <span>Kyle Saffy</span>
                  <small>Founder at Connect</small>
                </div>
              </div>
            </div>

            <div className="tap-phone tap-phone-right">
              <div className="tap-phone-screen">
                <div className="receiver-profile">
                  <span className="receiver-avatar">C</span>
                  <span className="receiver-line receiver-line-wide" />
                  <span className="receiver-line" />
                  <span className="receiver-button" />
                </div>
              </div>
            </div>

            <div className="tap-hotspot">
              <span className="tap-pulse tap-pulse-one" />
              <span className="tap-pulse tap-pulse-two" />
              <span className="tap-pulse tap-pulse-three" />
              <span className="tap-core" />
            </div>
          </div>

          <form
            className="relative mt-5 rounded-lg border border-white/10 bg-[#101722]/88 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-6"
            onSubmit={handleCheckout}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-normal text-white">Launch subscription</h2>
                <p className="mt-1 text-sm leading-6 text-[#9da8b8]">Start with your email and we will route you into setup.</p>
              </div>
              <div className="rounded-lg border border-[#f6b84a]/35 bg-[#f6b84a]/10 px-3 py-2 text-right">
                <p className="text-2xl font-black leading-none text-[#ffe4a6]">R50</p>
                <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#cda965]">per month</p>
              </div>
            </div>

            <div className="mb-5 grid gap-2">
              {benefits.map((benefit) => (
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-sm font-semibold text-[#d8e3ef]" key={benefit}>
                  <span className="h-2 w-2 rounded-full bg-[#18c8f3] shadow-[0_0_12px_rgba(24,200,243,0.8)]" />
                  {benefit}
                </div>
              ))}
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2 text-left text-xs font-black uppercase tracking-[0.14em] text-[#9da8b8]">
                Email Address *
                <input
                  type="email"
                  required
                  className="rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-base normal-case tracking-normal text-[#f7f4ed] outline-none transition-colors placeholder:text-[#596577] focus:border-[#18c8f3] focus:bg-white/[0.075]"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <label className="grid gap-2 text-left text-xs font-black uppercase tracking-[0.14em] text-[#9da8b8]">
                Referral Code
                <input
                  type="text"
                  className="rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-base normal-case tracking-normal text-[#f7f4ed] outline-none transition-colors placeholder:text-[#596577] focus:border-[#18c8f3] focus:bg-white/[0.075]"
                  placeholder="CREAM2026"
                  value={referralCode}
                  onChange={(event) => setReferralCode(event.target.value.toUpperCase())}
                />
              </label>

              <button
                disabled={isLoading}
                className="connect-primary-button rounded-lg bg-[#18c8f3] px-5 py-4 font-black text-[#031016] shadow-[0_14px_30px_rgba(24,200,243,0.24)] transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
                type="submit"
              >
                {isLoading ? "Processing..." : "Get Started Now"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
