"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  buildCardUrl,
  displayName,
  displayRole,
  emptyProfile,
  initials,
  normalizeUrl,
  vCardDataUri,
  type ConnectProfile,
} from "@/lib/connect-card";

const storageKey = "connect_profile_builder_v1";

const starterProfile: ConnectProfile = {
  ...emptyProfile,
  name: "Kyle Saffy",
  company: "Connect",
  title: "Founder",
  phone: "+27827675092",
  email: "hello@example.com",
  website: "https://example.com",
  bio: "Tap, connect, and save my details.",
};

type Field = keyof ConnectProfile;

const fields: Array<{ key: Field; label: string; placeholder: string; type?: string }> = [
  { key: "name", label: "Full name", placeholder: "Kyle Saffy" },
  { key: "company", label: "Company", placeholder: "Connect" },
  { key: "title", label: "Title", placeholder: "Founder" },
  { key: "phone", label: "Phone", placeholder: "+27 82 000 0000", type: "tel" },
  { key: "email", label: "Email", placeholder: "hello@example.com", type: "email" },
  { key: "website", label: "Website", placeholder: "https://example.com", type: "url" },
  { key: "avatar", label: "Avatar image URL", placeholder: "https://example.com/avatar.jpg", type: "url" },
];

export function ConnectBuilder() {
  const [origin] = useState(() => {
    return typeof window === "undefined" ? "https://web-profiles.vercel.app" : window.location.origin;
  });
  const [profile, setProfile] = useState<ConnectProfile>(() => {
    if (typeof window === "undefined") return starterProfile;
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return starterProfile;

    try {
      return { ...starterProfile, ...JSON.parse(saved) };
    } catch {
      return starterProfile;
    }
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(profile));
  }, [profile]);

  const cardUrl = useMemo(() => buildCardUrl(origin, {
    ...profile,
    website: normalizeUrl(profile.website),
    avatar: normalizeUrl(profile.avatar),
  }), [origin, profile]);

  const qrUrl = `https://quickchart.io/qr?size=260&margin=2&text=${encodeURIComponent(cardUrl)}`;

  function updateField(key: Field, value: string) {
    setProfile((current) => ({ ...current, [key]: value }));
    setMessage("Saved locally.");
  }

  async function copyCardUrl() {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setMessage("Card link copied.");
    } catch {
      setMessage("Copy is blocked by this browser. Open the card and copy the URL.");
    }
  }

  function resetProfile() {
    setProfile(starterProfile);
    setMessage("Starter profile restored.");
  }

  return (
    <main className="min-h-screen bg-[#090b0f] text-[#f7f4ed]">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl gap-5 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <section className="rounded-lg border border-white/10 bg-[#111720] p-5 shadow-2xl lg:sticky lg:top-5">
          <header className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Connect"
                className="h-12 w-12 rounded-lg object-cover shadow-[0_0_24px_rgba(24,200,243,0.32)]"
              />
              <div>
                <h1 className="text-2xl font-black tracking-normal">Connect</h1>
                <p className="text-sm text-[#9da8b8]">NFC business card builder</p>
              </div>
            </div>
            <Link className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-bold text-[#cbd6e4]" href="/install">
              Install
            </Link>
          </header>

          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <label className="grid gap-2 text-sm font-bold text-[#d6dee9]" key={field.key}>
                {field.label}
                <input
                  className="rounded-lg border border-white/10 bg-white/[0.055] px-3 py-3 text-[#f7f4ed] outline-none focus:border-[#18c8f3]"
                  inputMode={field.type === "tel" ? "tel" : field.type === "email" ? "email" : field.type === "url" ? "url" : undefined}
                  onChange={(event) => updateField(field.key, event.target.value)}
                  placeholder={field.placeholder}
                  type={field.type || "text"}
                  value={profile[field.key]}
                />
              </label>
            ))}
            <label className="grid gap-2 text-sm font-bold text-[#d6dee9] sm:col-span-2">
              Short bio
              <textarea
                className="min-h-24 rounded-lg border border-white/10 bg-white/[0.055] px-3 py-3 text-[#f7f4ed] outline-none focus:border-[#18c8f3]"
                onChange={(event) => updateField("bio", event.target.value)}
                placeholder="What you do, in one sentence."
                value={profile.bio}
              />
            </label>
          </div>

          <div className="mt-5 rounded-lg border border-[#18c8f3]/20 bg-[#18c8f3]/[0.07] p-4 text-sm leading-6 text-[#c9f5ff] break-all">
            {cardUrl}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <a className="rounded-lg bg-[#18c8f3] px-4 py-3 text-center font-black text-[#031016]" href={cardUrl} target="_blank">
              Open
            </a>
            <button className="rounded-lg border border-white/10 bg-white/[0.08] px-4 py-3 font-black text-[#f7f4ed]" onClick={copyCardUrl} type="button">
              Copy
            </button>
            <a
              className="rounded-lg border border-[#f6b84a]/45 bg-[#f6b84a]/10 px-4 py-3 text-center font-black text-[#ffe4a6]"
              download={`${displayName(profile).replace(/\s+/g, "_")}_Connect.vcf`}
              href={vCardDataUri(profile, cardUrl)}
            >
              vCard
            </a>
            <button className="rounded-lg border border-[#f76f6f]/35 bg-[#f76f6f]/10 px-4 py-3 font-black text-[#ffd2d2]" onClick={resetProfile} type="button">
              Reset
            </button>
          </div>

          <p className="mt-3 min-h-5 text-sm text-[#9da8b8]">{message}</p>
        </section>

        <aside className="rounded-lg border border-white/10 bg-[#111720] shadow-2xl">
          <div className="bg-[radial-gradient(circle_at_50%_0%,rgba(24,200,243,0.18),transparent_58%),linear-gradient(145deg,rgba(246,184,74,0.15),transparent_48%)] px-6 pb-6 pt-7 text-center">
            <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-lg border border-white/15 bg-white/[0.07] text-4xl font-black text-[#18c8f3]">
              {profile.avatar ? (
                <img src={normalizeUrl(profile.avatar)} alt={displayName(profile)} className="h-full w-full object-cover" />
              ) : (
                initials(profile)
              )}
            </div>
            <h2 className="text-3xl font-black leading-tight tracking-normal">{displayName(profile)}</h2>
            {displayRole(profile) ? <p className="mt-2 text-base font-medium text-[#cbd6e4]">{displayRole(profile)}</p> : null}
            {profile.bio ? <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#aab6c6]">{profile.bio}</p> : null}
          </div>

          <div className="grid gap-3 p-5">
            <img src={qrUrl} alt="Connect card QR code" className="mx-auto h-48 w-48 rounded-lg bg-white p-2" />
            <p className="text-center text-sm leading-5 text-[#9da8b8]">This QR points to the same card URL your Android/Huawei app broadcasts over NFC.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
