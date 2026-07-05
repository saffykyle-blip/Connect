"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const setupSteps = [
  {
    n: "1",
    title: "Download and install the app",
    body: "Download Connect APK (Android and Huawei), then tap the file and follow the Android install prompts.",
    color: "mint",
  },
  {
    n: "2",
    title: "Open Connect and set up your cards",
    body: "Enter your name, company, title, phone, email, logo or avatar, website, and social links. You can set up to 3 separate profiles.",
    color: "mint",
  },
  {
    n: "3",
    title: "Paste your Subscription Code",
    body: "Paste the CUS_... code shown on this page into the Subscription Code field in the app. This activates your public card.",
    color: "gold",
  },
  {
    n: "4",
    title: "Choose a profile and share",
    body: "After setup, Connect opens to your Share Hub. Choose a profile, then share it by NFC, QR code, copied link, or contact save.",
    color: "green",
  },
];

const guideSteps = [
  ["Set up once", "Add your name, company, phone, email, avatar or logo, website, social links, and subscription code."],
  ["Choose a profile", "Open Connect and select one of your saved profiles. The selected profile becomes active for NFC."],
  ["Share anywhere", "Use NFC tap, QR code, copied link, Android share sheet, or contact save."],
  ["Every phone can receive it", "Android and Huawei install the APK. iPhone users open the shared web card through NFC link, QR, or browser fallback."],
];

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
      // The code remains visible for manual copy if clipboard access is blocked.
    }
  }

  return (
    <main className="relative min-h-screen text-[#fff7e8]">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-5">
        <header className="mb-6 flex items-center justify-between gap-4">
          <Link className="flex items-center gap-3" href="/">
            <img src="/thumbnail.png" alt="Connect" className="h-11 w-11 rounded-lg object-cover shadow-[0_0_22px_rgba(77,246,162,0.24)]" />
            <span className="text-lg font-black">Connect</span>
          </Link>
        </header>

        {code && (
          <div className="mb-5 rounded-lg border border-[#4df6a2]/35 bg-[#4df6a2]/[0.08] p-5">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#d9ffe8]">
              Your Subscription Code
            </p>
            <div className="flex items-center gap-3">
              <code className="flex-1 overflow-x-auto rounded-lg border border-white/10 bg-black/30 px-4 py-3 font-mono text-base font-bold tracking-wider text-[#d9ffe8]">
                {code}
              </code>
              <button
                onClick={copyCode}
                className="shrink-0 rounded-lg border border-[#4df6a2]/40 bg-[#4df6a2]/15 px-4 py-3 text-sm font-black text-[#d9ffe8] transition-colors hover:bg-[#4df6a2]/25"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[#aaa592]">
              Paste this code into the app once. It links your public profile to your subscription.
            </p>
          </div>
        )}

        <section className="shell-card mb-5 p-7">
          <h1 className="mb-1 text-2xl font-black tracking-normal text-white">How to set up your Connect card</h1>
          <p className="mb-6 text-sm leading-6 text-[#aaa592]">Follow these steps to get your Share Hub ready in minutes.</p>

          <ol className="space-y-5">
            {setupSteps.map((step) => (
              <li key={step.n} className="flex gap-4">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                    step.color === "gold"
                      ? "border border-[#ffd36e]/35 bg-[#ffd36e]/15 text-[#ffd36e]"
                      : step.color === "green"
                      ? "border border-[#4df6a2]/35 bg-[#4df6a2]/15 text-[#4df6a2]"
                      : "border border-[#4df6a2]/35 bg-[#4df6a2]/15 text-[#4df6a2]"
                  }`}
                >
                  {step.n}
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-bold text-white">{step.title}</h3>
                  <p className="text-sm leading-6 text-[#aaa592]">
                    {step.n === "3" && code ? `Copy your code above (${code.slice(0, 8)}...) and paste it into the Subscription Code field in the app. This activates your public card.` : step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="shell-card mb-5 p-7">
          <div className="mb-5 rounded-lg border border-[#4df6a2]/30 bg-[#4df6a2]/[0.08] p-5 text-center">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#d9ffe8]">Watch the 90-second guide</p>
            <p className="mt-2 text-sm leading-6 text-[#aaa592]">
              Video placeholder ready. Until the final guide video is uploaded, use the quick written guide below.
            </p>
          </div>

          <h2 className="mb-1 text-lg font-black text-white">How Connect works</h2>
          <div className="mt-4 grid gap-3">
            {guideSteps.map(([title, body]) => (
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={title}>
                <h3 className="text-sm font-black text-white">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-[#aaa592]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="shell-card p-7">
          <h2 className="mb-1 text-lg font-black text-white">Download</h2>
          <p className="mb-5 text-sm text-[#aaa592]">
            Android and Huawei use the same signed Connect APK.
          </p>

          <div className="grid gap-4">
            <a
              className="group rounded-lg border border-[#4df6a2]/35 bg-[#4df6a2]/[0.08] p-5 transition-colors hover:border-[#4df6a2]/60 hover:bg-[#4df6a2]/[0.12]"
              href="/downloads/connect-android.apk"
            >
              <h3 className="text-base font-black text-[#d9ffe8]">Download Connect APK (Android and Huawei)</h3>
              <p className="mt-2 text-sm leading-6 text-[#aaa592]">
                Works for Samsung, Pixel, OnePlus, Xiaomi, Honor, Huawei, and most Android-based phones with NFC support.
              </p>
            </a>

            <div className="rounded-lg border border-[#ffd36e]/20 bg-[#ffd36e]/5 p-5">
              <h3 className="text-base font-bold text-[#ffd36e]">iPhone / iOS</h3>
              <p className="mt-1 text-sm leading-6 text-[#aaa592]">
                Apple restricts background NFC broadcasting. iPhone users can still receive cards through NFC web links, QR codes, contact save, and normal browser links.
              </p>
            </div>

            <Link
              className="group rounded-lg border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-white/30 hover:bg-white/[0.08]"
              href="/card"
            >
              <h3 className="text-base font-bold text-white">Preview Card</h3>
              <p className="mt-1 text-sm leading-6 text-[#aaa592]">
                See what a public profile looks like when someone taps, scans, or opens your link.
              </p>
            </Link>
          </div>
        </section>

        <div className="mt-6 text-center text-xs text-[#aaa592]">
          <p>Need help? <Link href="/" className="text-[#4df6a2] hover:underline">Return to home</Link></p>
        </div>
      </div>
    </main>
  );
}
