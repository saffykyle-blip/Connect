"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const benefits = [
  "Three branded profiles",
  "NFC, QR, and vCard sharing",
  "Hosted avatar uploads",
  "Secure subscriber setup",
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
    <main className="relative min-h-screen overflow-hidden bg-[#070806] text-[#fff7e8]">
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
            className="h-11 w-11 rounded-lg border border-white/10 object-cover shadow-[0_0_28px_rgba(77,246,162,0.22)] transition-transform duration-500 group-hover:scale-105"
          />
          <div>
            <p className="text-lg font-black leading-none tracking-normal text-white">Connect</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#a7a08f]">tap to share</p>
          </div>
        </Link>
      </nav>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-7xl items-center gap-10 px-5 pb-10 pt-2 sm:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-3 rounded-lg border border-[#4df6a2]/25 bg-[#4df6a2]/10 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#d9ffe8] shadow-[0_0_34px_rgba(77,246,162,0.12)]">
            <span className="h-2 w-2 rounded-full bg-[#4df6a2] shadow-[0_0_16px_rgba(77,246,162,0.9)]" />
            NFC business cards for every phone
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-normal text-white sm:text-7xl lg:text-8xl">
            Make the first tap impossible to forget.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#c3bfb0] sm:text-xl">
            Connect turns a phone tap into a polished profile, instant contact save, QR fallback, and a phone-aware setup flow for subscribers.
          </p>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {signalStats.map((stat) => (
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4 backdrop-blur" key={stat.label}>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#a7a08f]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="finger-stage" aria-hidden="true">
            <img className="finger-touch-image" src="/logo.jpg" alt="" />
            <div className="finger-stage-vignette" />
            <div className="finger-contact-beam" />
            <div className="finger-hotspot">
              <span className="tap-pulse tap-pulse-one" />
              <span className="tap-pulse tap-pulse-two" />
              <span className="tap-pulse tap-pulse-three" />
              <span className="tap-core" />
            </div>
          </div>

          <form
            className="relative mt-5 rounded-lg border border-white/10 bg-[#11130c]/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-6"
            onSubmit={handleCheckout}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-normal text-white">Launch subscription</h2>
                <p className="mt-1 text-sm leading-6 text-[#aaa592]">Start with your email and we will route you into setup.</p>
              </div>
              <div className="rounded-lg border border-[#ff6a5b]/35 bg-[#ff6a5b]/10 px-3 py-2 text-right">
                <p className="text-2xl font-black leading-none text-[#ffd1ba]">R50</p>
                <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#d59682]">per month</p>
              </div>
            </div>

            <div className="mb-5 grid gap-2">
              {benefits.map((benefit) => (
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-sm font-semibold text-[#eee8d8]" key={benefit}>
                  <span className="h-2 w-2 rounded-full bg-[#4df6a2] shadow-[0_0_12px_rgba(77,246,162,0.8)]" />
                  {benefit}
                </div>
              ))}
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2 text-left text-xs font-black uppercase tracking-[0.14em] text-[#aaa592]">
                Email Address *
                <input
                  type="email"
                  required
                  className="rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-base normal-case tracking-normal text-[#fff7e8] outline-none transition-colors placeholder:text-[#776f62] focus:border-[#4df6a2] focus:bg-white/[0.075]"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <label className="grid gap-2 text-left text-xs font-black uppercase tracking-[0.14em] text-[#aaa592]">
                Referral Code
                <input
                  type="text"
                  className="rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-base normal-case tracking-normal text-[#fff7e8] outline-none transition-colors placeholder:text-[#776f62] focus:border-[#4df6a2] focus:bg-white/[0.075]"
                  placeholder="CREAM2026"
                  value={referralCode}
                  onChange={(event) => setReferralCode(event.target.value.toUpperCase())}
                />
              </label>

              <button
                disabled={isLoading}
                className="connect-primary-button rounded-lg bg-[#4df6a2] px-5 py-4 font-black text-[#06110a] shadow-[0_14px_30px_rgba(77,246,162,0.24)] transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
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
