"use client";

import { useState } from "react";

export default function LandingPage() {
  const [referralCode, setReferralCode] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = () => {
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
    <main className="min-h-screen bg-[#090b0f] text-[#f7f4ed] flex flex-col items-center justify-center p-5">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_40px_rgba(24,200,243,0.15)]">
          <img src="/logo.jpg" alt="Connect" className="h-full w-full object-cover" />
        </div>
        
        <h1 className="mb-6 text-5xl font-black tracking-tight text-white sm:text-6xl">
          The ultimate <br/><span className="text-[#18c8f3]">digital business card.</span>
        </h1>
        
        <p className="mb-10 text-lg leading-8 text-[#9da8b8]">
          Create up to 3 beautiful profiles. Beam them instantly via NFC, share your QR code, and let people save your contact details straight to their phone with zero friction.
        </p>

        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#111720] p-8 shadow-2xl">
          <h2 className="mb-2 text-2xl font-black text-white">Lifetime Access</h2>
          <div className="mb-6 flex items-baseline justify-center gap-2">
            <span className="text-4xl font-black text-[#18c8f3]">R50</span>
            <span className="text-[#9da8b8] font-medium">once-off</span>
          </div>
          
          <ul className="mb-8 space-y-3 text-sm text-[#cbd6e4] text-left">
            <li className="flex items-center gap-3">
              <svg className="h-5 w-5 text-[#18c8f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Create up to 3 separate profiles
            </li>
            <li className="flex items-center gap-3">
              <svg className="h-5 w-5 text-[#18c8f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Unlimited dynamic social links
            </li>
            <li className="flex items-center gap-3">
              <svg className="h-5 w-5 text-[#18c8f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Avatar image hosting included
            </li>
            <li className="flex items-center gap-3">
              <svg className="h-5 w-5 text-[#18c8f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Native vCard downloads
            </li>
          </ul>

          <div className="mb-4">
            <label className="block text-left text-xs font-bold uppercase tracking-wider text-[#9da8b8] mb-2">Email Address *</label>
            <input
              type="email"
              required
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-[#f7f4ed] outline-none focus:border-[#18c8f3] transition-colors"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-left text-xs font-bold uppercase tracking-wider text-[#9da8b8] mb-2">Referral Code (Optional)</label>
            <input
              type="text"
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-[#f7f4ed] outline-none focus:border-[#18c8f3] transition-colors"
              placeholder="e.g. CREAM2026"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            />
          </div>

          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full rounded-xl bg-[#18c8f3] py-4 font-black text-[#031016] shadow-[0_12px_28px_rgba(24,200,243,0.22)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? "Processing..." : "Get Started Now"}
          </button>
        </div>
      </div>
    </main>
  );
}
