"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Platform = "ios" | "huawei" | "android" | "desktop";

function detectPlatform(): Platform {
  const userAgent = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const isIos = /iPhone|iPad|iPod/i.test(userAgent) || (platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isHuawei = /HUAWEI|HONOR|HarmonyOS/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);

  if (isIos) return "ios";
  if (isHuawei) return "huawei";
  if (isAndroid) return "android";
  return "desktop";
}

const primaryCopy = {
  ios: {
    title: "Connect for iPhone",
    body: "Use the hosted card, QR, vCard, and Apple Wallet fallback. Native iPhone NFC broadcasting is restricted by Apple.",
    cta: "Open Web Card Builder",
    href: "/",
  },
  huawei: {
    title: "Connect for Huawei",
    body: "Install the direct signed APK. The Huawei build uses the same NFC broadcaster as Android.",
    cta: "Download Huawei APK",
    href: "/downloads/connect-huawei.apk",
  },
  android: {
    title: "Connect for Android",
    body: "Install the direct signed APK and broadcast your hosted Connect card by NFC.",
    cta: "Download Android APK",
    href: "/downloads/connect-android.apk",
  },
  desktop: {
    title: "Connect Downloads",
    body: "Choose the package you want to host, test, or share with subscribers.",
    cta: "Open Web Card Builder",
    href: "/",
  },
};

export function InstallChooser() {
  const [platform] = useState<Platform>(() => {
    return typeof navigator === "undefined" ? "desktop" : detectPlatform();
  });

  const copy = useMemo(() => primaryCopy[platform], [platform]);
  const primaryClassName = "mt-6 flex min-h-12 items-center justify-center rounded-lg bg-[#18c8f3] px-5 text-center font-black text-[#031016] shadow-[0_12px_28px_rgba(24,200,243,0.22)]";

  return (
    <main className="relative min-h-screen text-[#f7f4ed]">

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-5">
        <header className="mb-6 flex items-center justify-between gap-4">
          <Link className="flex items-center gap-3" href="/">
            <img src="/logo.jpg" alt="Connect" className="h-11 w-11 rounded-lg object-cover" />
            <span className="text-lg font-black">Connect</span>
          </Link>
          <span className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-bold text-[#cbd6e4]">
            {platform.toUpperCase()}
          </span>
        </header>

        <section className="rounded-lg border border-white/10 bg-[#101722]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.44)] backdrop-blur-xl">
          <h1 className="text-3xl font-black tracking-normal">{copy.title}</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-[#aab6c6]">{copy.body}</p>

          {copy.href.startsWith("/downloads") ? (
            <a className={primaryClassName} href={copy.href}>
              {copy.cta}
            </a>
          ) : (
            <Link className={primaryClassName} href={copy.href}>
              {copy.cta}
            </Link>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-center font-bold" href="/downloads/connect-android.apk">
              Android APK
            </a>
            <a className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-center font-bold" href="/downloads/connect-huawei.apk">
              Huawei APK
            </a>
            <Link className="rounded-lg border border-[#f6b84a]/45 bg-[#f6b84a]/10 px-4 py-3 text-center font-bold text-[#ffe4a6]" href="/">
              Web Builder
            </Link>
            <Link className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-center font-bold" href="/card">
              Sample Card
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
