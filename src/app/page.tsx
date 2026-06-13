"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LandingPage() {
  const [referralCode, setReferralCode] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  const [restoreEmail, setRestoreEmail] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState("");

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

  const handleRestore = async (event: FormEvent) => {
    event.preventDefault();
    setIsRestoring(true);
    setRestoreMessage("");

    try {
      const res = await fetch("/api/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: restoreEmail }),
      });

      if (res.ok) {
        const data = await res.json();
        const installUrl = data.customerCode
          ? `/install?code=${encodeURIComponent(data.customerCode)}`
          : `/install`;
        window.location.href = installUrl;
      } else {
        const error = await res.json();
        setRestoreMessage(error.error || "Failed to restore purchase.");
      }
    } catch {
      setRestoreMessage("A network error occurred.");
    } finally {
      setIsRestoring(false);
    }
  };


  return (
    <main className="relative min-h-screen text-[#f7f4ed]">
      <div className="mx-auto w-full max-w-[480px] min-h-screen flex flex-col px-5 py-8 sm:py-12">
        <header className="mb-10 flex flex-col items-center text-center">
          <img
            src="/thumbnail.png"
            alt="Connect"
            className="mb-4 h-16 w-16 rounded-xl border border-white/10 object-cover shadow-[0_0_24px_rgba(24,200,243,0.35)]"
          />
          <h1 className="text-4xl font-black text-white">Connect</h1>
          <p className="mt-2 text-[#9da8b8]">Your Ultimate NFC Digital Business Card</p>
        </header>

        <div className="shell-card p-8">
          {showRestore ? (
            <>
              <h2 className="mb-2 text-2xl font-black text-white">Restore Access</h2>
              <p className="mb-6 text-sm text-[#cbd6e4]">Enter your email to restore your subscription.</p>
              
              <form onSubmit={handleRestore} className="grid gap-4 text-left">
                <label className="grid gap-1 text-sm font-bold text-[#d6dee9]">
                  Email Address
                  <input
                    type="email"
                    required
                    value={restoreEmail}
                    onChange={(e) => setRestoreEmail(e.target.value)}
                    placeholder="hello@example.com"
                    className="rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-[#f7f4ed] outline-none focus:border-[#18c8f3] focus:shadow-[0_0_0_3px_rgba(24,200,243,0.14)] transition-all"
                  />
                </label>
                
                <button
                  type="submit"
                  disabled={isRestoring}
                  className="mt-2 rounded-lg bg-gradient-to-br from-[#13bde8] to-[#0d8fb3] border border-[#18c8f3]/65 px-4 py-3 font-black text-[#031016] shadow-[0_10px_22px_rgba(24,200,243,0.24)] transition-opacity disabled:opacity-50"
                >
                  {isRestoring ? "Restoring..." : "Restore Purchase"}
                </button>
                {restoreMessage && <p className="text-center text-sm font-medium text-[#f6b84a]">{restoreMessage}</p>}
              </form>
              
              <div className="mt-6 text-center">
                <button 
                  type="button" 
                  onClick={() => setShowRestore(false)}
                  className="text-sm font-medium text-[#9da8b8] hover:text-white transition-colors"
                >
                  Back to Sign Up
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="mb-2 text-2xl font-black text-white">Monthly Subscription</h2>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#18c8f3]">R50</span>
                <span className="text-[#9da8b8] font-medium">per month</span>
              </div>
              
              <ul className="mb-8 space-y-3 text-sm text-[#cbd6e4] text-left">
                <li className="flex items-center gap-3">
                  <span className="text-[#18c8f3] text-lg leading-none">•</span> Unlimited NFC Scans
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#18c8f3] text-lg leading-none">•</span> 3 Separate Profiles
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#18c8f3] text-lg leading-none">•</span> Dynamic Social Links
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#18c8f3] text-lg leading-none">•</span> Hosted Avatar Uploads
                </li>
              </ul>

              <form onSubmit={handleCheckout} className="grid gap-4 text-left">
                <label className="grid gap-1 text-sm font-bold text-[#d6dee9]">
                  Email Address
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@example.com"
                    className="rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-[#f7f4ed] outline-none focus:border-[#18c8f3] focus:shadow-[0_0_0_3px_rgba(24,200,243,0.14)] transition-all"
                  />
                </label>
                
                <label className="grid gap-1 text-sm font-bold text-[#d6dee9]">
                  Referral Code (Optional)
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="e.g. FRIEND10"
                    className="rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-[#f7f4ed] outline-none focus:border-[#18c8f3] focus:shadow-[0_0_0_3px_rgba(24,200,243,0.14)] transition-all"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 rounded-lg bg-gradient-to-br from-[#13bde8] to-[#0d8fb3] border border-[#18c8f3]/65 px-4 py-3 font-black text-[#031016] shadow-[0_10px_22px_rgba(24,200,243,0.24)] transition-opacity disabled:opacity-50"
                >
                  {isLoading ? "Redirecting..." : "Subscribe with Paystack"}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <button 
                  type="button" 
                  onClick={() => setShowRestore(true)}
                  className="text-sm font-medium text-[#9da8b8] hover:text-white transition-colors"
                >
                  Already subscribed? Restore Access
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
