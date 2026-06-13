"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function InstallChooser() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback — select the text
    }
  }

  return (
    <main className="relative min-h-screen text-[#f7f4ed]">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-5">

        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <Link className="flex items-center gap-3" href="/">
            <img src="/thumbnail.png" alt="Connect" className="h-11 w-11 rounded-xl object-cover shadow-[0_0_22px_rgba(24,200,243,0.35)]" />
            <span className="text-lg font-black">Connect</span>
          </Link>
        </header>

        {/* Subscription code banner */}
        {code && (
          <div className="mb-5 rounded-xl border border-[#18c8f3]/35 bg-[#18c8f3]/[0.08] p-5">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#18c8f3]">
              Your Subscription Code
            </p>
            <div className="flex items-center gap-3">
              <code className="flex-1 overflow-x-auto rounded-lg border border-white/10 bg-black/30 px-4 py-3 font-mono text-base font-bold text-[#c9f5ff] tracking-wider">
                {code}
              </code>
              <button
                onClick={copyCode}
                className="shrink-0 rounded-lg border border-[#18c8f3]/40 bg-[#18c8f3]/15 px-4 py-3 text-sm font-black text-[#c9f5ff] transition-colors hover:bg-[#18c8f3]/25"
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <p className="mt-2 text-xs text-[#9da8b8] leading-relaxed">
              You will paste this code into the app after installing it. It activates your public card profile.
            </p>
          </div>
        )}

        {/* Steps */}
        <section className="shell-card p-7 mb-5">
          <h1 className="mb-1 text-2xl font-black tracking-normal text-white">How to set up your Connect card</h1>
          <p className="mb-6 text-sm text-[#9da8b8] leading-6">Follow these steps to get your NFC card broadcasting in minutes.</p>

          <ol className="space-y-5">
            {[
              {
                n: "1",
                title: "Download &amp; install the app",
                body: "Choose the correct APK for your phone below. Tap the file once downloaded and follow the Android install prompts.",
                color: "cyan",
              },
              {
                n: "2",
                title: "Open Connect and fill in your details",
                body: "Enter your name, company, title, phone, email, and any social links. You can set up to 3 separate profiles.",
                color: "cyan",
              },
              {
                n: "3",
                title: "Paste your Subscription Code",
                body: code
                  ? `Copy your code above (${code.slice(0, 8)}...) and paste it into the \"Subscription Code\" field in the app. This activates your public card.`
                  : "Paste the CUS_... code shown above into the \"Subscription Code\" field in the app. This activates your public card.",
                color: "amber",
              },
              {
                n: "4",
                title: "Tap \"Save &amp; Broadcast via NFC\"",
                body: "Your phone will now broadcast your digital business card over NFC whenever someone taps their phone against yours.",
                color: "green",
              },
            ].map((step) => (
              <li key={step.n} className="flex gap-4">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                    step.color === "amber"
                      ? "bg-[#f6b84a]/15 border border-[#f6b84a]/35 text-[#f6b84a]"
                      : step.color === "green"
                      ? "bg-[#22c55e]/15 border border-[#22c55e]/35 text-[#22c55e]"
                      : "bg-[#18c8f3]/15 border border-[#18c8f3]/35 text-[#18c8f3]"
                  }`}
                >
                  {step.n}
                </div>
                <div>
                  <h3
                    className="font-bold text-white text-sm mb-1"
                    dangerouslySetInnerHTML={{ __html: step.title }}
                  />
                  <p className="text-sm text-[#9da8b8] leading-6">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Download buttons */}
        <section className="shell-card p-7">
          <h2 className="mb-1 text-lg font-black text-white">Download</h2>
          <p className="mb-5 text-sm text-[#9da8b8]">Choose the file that matches your phone type.</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              className="group rounded-xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-[#18c8f3]/50 hover:bg-white/[0.08]"
              href="/downloads/connect-android.apk"
            >
              <div className="mb-2 text-2xl">🤖</div>
              <h3 className="text-base font-bold text-white group-hover:text-[#18c8f3]">Android APK</h3>
              <p className="mt-1 text-xs text-[#9da8b8]">
                Samsung, OnePlus, Pixel, and most Android phones.
              </p>
            </a>

            <a
              className="group rounded-xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-[#18c8f3]/50 hover:bg-white/[0.08]"
              href="/downloads/connect-huawei.apk"
            >
              <div className="mb-2 text-2xl">📱</div>
              <h3 className="text-base font-bold text-white group-hover:text-[#18c8f3]">Huawei APK</h3>
              <p className="mt-1 text-xs text-[#9da8b8]">
                Optimized build for Huawei devices (no Google Play).
              </p>
            </a>

            <div className="rounded-xl border border-[#f6b84a]/20 bg-[#f6b84a]/5 p-5">
              <div className="mb-2 text-2xl">🍎</div>
              <h3 className="text-base font-bold text-[#f6b84a]">iPhone / iOS</h3>
              <p className="mt-1 text-xs text-[#9da8b8]">
                Apple restricts background NFC on iPhones. Share your card URL manually or print the QR code.
              </p>
            </div>

            <Link
              className="group rounded-xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-white/30 hover:bg-white/[0.08]"
              href="/card"
            >
              <div className="mb-2 text-2xl">👁️</div>
              <h3 className="text-base font-bold text-white">Preview Card</h3>
              <p className="mt-1 text-xs text-[#9da8b8]">
                See what your public profile looks like when someone taps your card.
              </p>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-[#9da8b8]">
          <p>Need help? <Link href="/" className="text-[#18c8f3] hover:underline">Return to home</Link></p>
        </div>
      </div>
    </main>
  );
}
