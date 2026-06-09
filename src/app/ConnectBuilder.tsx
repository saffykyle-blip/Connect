"use client";

import { useEffect, useMemo, useState, useRef } from "react";
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

const storageKey = "connect_profiles_v2";

const defaultProfiles: ConnectProfile[] = [
  {
    ...emptyProfile,
    name: "Kyle Saffy",
    company: "CREAM",
    title: "Founder",
    phone: "+27827675092",
    email: "hello@example.com",
    website: "https://example.com",
    bio: "Tap, connect, and save my details.",
  },
  { ...emptyProfile, company: "Tribal", name: "Kyle Saffy" },
  { ...emptyProfile, company: "Nanotech", name: "Kyle Saffy" },
];

type Field = keyof ConnectProfile;

const fields: Array<{ key: Field; label: string; placeholder: string; type?: string }> = [
  { key: "name", label: "Full name", placeholder: "Kyle Saffy" },
  { key: "company", label: "Company", placeholder: "Connect" },
  { key: "title", label: "Title", placeholder: "Founder" },
  { key: "phone", label: "Phone", placeholder: "+27 82 000 0000", type: "tel" },
  { key: "email", label: "Email", placeholder: "hello@example.com", type: "email" },
  { key: "website", label: "Website", placeholder: "https://example.com", type: "url" },
];

declare global {
  interface Window {
    AndroidInterface?: {
      updateNfcUrl: (url: string) => void;
      getCurrentNfcUrl: () => string;
    };
  }
}

export function ConnectBuilder({ customerCode }: { customerCode?: string }) {
  const [origin] = useState(() => {
    return typeof window === "undefined" ? "https://web-profiles.vercel.app" : window.location.origin;
  });

  const [profiles, setProfiles] = useState<ConnectProfile[]>(() => {
    if (typeof window === "undefined") return defaultProfiles;
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return defaultProfiles;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return [
          { ...emptyProfile, ...parsed[0] },
          { ...emptyProfile, ...(parsed[1] || {}) },
          { ...emptyProfile, ...(parsed[2] || {}) },
        ].slice(0, 3);
      }
      return defaultProfiles;
    } catch {
      return defaultProfiles;
    }
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [newSocialLink, setNewSocialLink] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = profiles[activeIndex] || defaultProfiles[0];

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(profiles));
  }, [profiles]);

  const cardUrl = useMemo(() => buildCardUrl(origin, {
    ...profile,
    website: normalizeUrl(profile.website),
    avatar: normalizeUrl(profile.avatar),
    subId: customerCode,
  }), [origin, profile, customerCode]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.AndroidInterface) {
      window.AndroidInterface.updateNfcUrl(cardUrl);
    }
  }, [cardUrl]);

  const qrUrl = `https://quickchart.io/qr?size=260&margin=2&text=${encodeURIComponent(cardUrl)}`;

  function updateField<K extends Field>(key: K, value: ConnectProfile[K]) {
    const updatedProfiles = [...profiles];
    updatedProfiles[activeIndex] = { ...profile, [key]: value };
    setProfiles(updatedProfiles);
    setMessage("Saved locally.");
  }

  function addSocialLink() {
    if (!newSocialLink.trim()) return;
    const currentLinks = profile.socialLinks || [];
    updateField("socialLinks", [...currentLinks, newSocialLink.trim()]);
    setNewSocialLink("");
  }

  function removeSocialLink(index: number) {
    const currentLinks = profile.socialLinks || [];
    updateField("socialLinks", currentLinks.filter((_, i) => i !== index));
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage("Uploading avatar...");

    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });
      const data = await response.json();
      
      if (response.ok && data.url) {
        updateField('avatar', data.url);
        setMessage("Avatar uploaded successfully.");
      } else {
        setMessage("Failed to upload avatar. Ensure Vercel Blob Token is set.");
      }
    } catch {
      setMessage("Error uploading avatar. Are you online?");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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
    const updatedProfiles = [...profiles];
    updatedProfiles[activeIndex] = defaultProfiles[activeIndex];
    setProfiles(updatedProfiles);
    setMessage("Profile restored to default.");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06080d] text-[#f7f4ed]">
      <div className="connect-hero-bg" aria-hidden="true" />
      <div className="connect-orbit-field" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl gap-5 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <section className="rounded-lg border border-white/10 bg-[#101722]/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.44)] backdrop-blur-xl lg:sticky lg:top-5">
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
            <Link className="rounded-lg border border-[#18c8f3]/35 bg-[#18c8f3]/10 px-3 py-2 text-sm font-black text-[#c9f5ff] transition-colors hover:bg-[#18c8f3]/18" href="/install">
              Install
            </Link>
          </header>

          {/* Profile Selector Tiles */}
          <div className="mb-6 grid grid-cols-3 gap-2">
            {profiles.map((p, index) => (
              <button
                key={index}
                onClick={() => { setActiveIndex(index); setMessage(""); }}
                className={`truncate rounded-lg border px-2 py-3 text-sm font-black transition-all ${
                  activeIndex === index
                    ? "border-[#18c8f3] bg-[#18c8f3]/12 text-[#c9f5ff] shadow-[0_0_28px_rgba(24,200,243,0.12)]"
                    : "border-white/10 bg-white/[0.04] text-[#9da8b8] hover:border-white/20 hover:bg-white/[0.08]"
                }`}
              >
                {p.company || `Profile ${index + 1}`}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Avatar Upload */}
            <label className="grid gap-2 text-sm font-bold text-[#d6dee9] sm:col-span-2">
              Avatar Image
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.055]">
                  {profile.avatar ? (
                    <img src={normalizeUrl(profile.avatar)} className="h-full w-full object-cover" alt="Avatar preview" />
                  ) : (
                    <span className="text-xs text-[#9da8b8]">None</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                  className="block w-full text-sm text-[#9da8b8] file:mr-4 file:rounded-lg file:border file:border-white/10 file:bg-white/[0.06] file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#f7f4ed] hover:file:bg-white/[0.1] disabled:opacity-50"
                />
              </div>
            </label>

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

            {/* Social Links */}
            <div className="grid gap-2 sm:col-span-2">
              <label className="text-sm font-bold text-[#d6dee9]">Social Links</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-lg border border-white/10 bg-white/[0.055] px-3 py-3 text-[#f7f4ed] outline-none focus:border-[#18c8f3]"
                  placeholder="https://instagram.com/yourhandle"
                  value={newSocialLink}
                  onChange={(e) => setNewSocialLink(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSocialLink();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="rounded-lg border border-[#18c8f3]/25 bg-[#18c8f3]/10 px-4 font-black text-[#c9f5ff] hover:bg-[#18c8f3]/18"
                >
                  +
                </button>
              </div>
              {profile.socialLinks && profile.socialLinks.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.socialLinks.map((link, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] pl-3 pr-1 py-1 text-xs text-[#9da8b8]">
                      <span className="truncate max-w-[150px]">{link.replace(/^https?:\/\//, '')}</span>
                      <button
                        type="button"
                        onClick={() => removeSocialLink(i)}
                        className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/10 hover:text-white"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

        <aside className="overflow-hidden rounded-lg border border-white/10 bg-[#101722]/90 shadow-[0_24px_80px_rgba(0,0,0,0.44)] backdrop-blur-xl">
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
