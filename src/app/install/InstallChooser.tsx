"use client";

import Link from "next/link";

export function InstallChooser() {
  return (
    <main className="relative min-h-screen text-[#f7f4ed]">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-5">
        <header className="mb-6 flex items-center justify-between gap-4">
          <Link className="flex items-center gap-3" href="/">
            <img src="/logo.jpg" alt="Connect" className="h-11 w-11 rounded-lg object-cover" />
            <span className="text-lg font-black">Connect</span>
          </Link>
        </header>

        <section className="shell-card p-8 text-center">
          <h1 className="text-3xl font-black tracking-normal text-white">Choose your platform</h1>
          <p className="mt-3 mx-auto max-w-lg text-base leading-7 text-[#aab6c6]">
            Please choose the necessary install file according to your phone type to broadcast your hosted Connect card.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 text-left">
            <a className="group rounded-xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-[#18c8f3]/50 hover:bg-white/[0.08]" href="/downloads/connect-android.apk">
              <h3 className="text-lg font-bold text-white group-hover:text-[#18c8f3]">Android APK</h3>
              <p className="mt-1 text-sm text-[#9da8b8]">Install the direct signed APK to broadcast by NFC.</p>
            </a>
            
            <a className="group rounded-xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-[#18c8f3]/50 hover:bg-white/[0.08]" href="/downloads/connect-huawei.apk">
              <h3 className="text-lg font-bold text-white group-hover:text-[#18c8f3]">Huawei APK</h3>
              <p className="mt-1 text-sm text-[#9da8b8]">Optimized build for Huawei devices.</p>
            </a>
            
            <Link className="group rounded-xl border border-[#f6b84a]/20 bg-[#f6b84a]/5 p-5 transition-colors hover:border-[#f6b84a]/50 hover:bg-[#f6b84a]/10" href="/">
              <h3 className="text-lg font-bold text-[#f6b84a]">iPhone / Web</h3>
              <p className="mt-1 text-sm text-[#9da8b8]">Apple restricts background NFC. Use the Web Builder.</p>
            </Link>
            
            <Link className="group rounded-xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-white/30 hover:bg-white/[0.08]" href="/card">
              <h3 className="text-lg font-bold text-white">Sample Card</h3>
              <p className="mt-1 text-sm text-[#9da8b8]">Preview what your public profile looks like.</p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
