"use client";

import { useState } from "react";
import type { ConnectProfile } from "@/lib/connect-card";
import { displayName, vCardDataUri } from "@/lib/connect-card";

type CardTabsProps = {
  profile: ConnectProfile;
  phone: string;
  cardUrl: string;
  qrUrl: string;
};

function detectSocialPlatform(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes('instagram.com')) return 'Instagram';
    if (hostname.includes('linkedin.com')) return 'LinkedIn';
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'X (Twitter)';
    if (hostname.includes('facebook.com')) return 'Facebook';
    if (hostname.includes('tiktok.com')) return 'TikTok';
    if (hostname.includes('youtube.com')) return 'YouTube';
    if (hostname.includes('github.com')) return 'GitHub';
    return 'Social Link';
  } catch {
    return 'Social Link';
  }
}

const cardThemes = {
  mint: { accent: "#4df6a2", shadow: "rgba(77,246,162,0.22)" },
  coral: { accent: "#ff6a5b", shadow: "rgba(255,106,91,0.22)" },
  gold: { accent: "#ffd36e", shadow: "rgba(255,211,110,0.22)" },
  blue: { accent: "#51b7ff", shadow: "rgba(81,183,255,0.22)" },
};

function getCardTheme(theme: string) {
  return cardThemes[theme as keyof typeof cardThemes] ?? cardThemes.mint;
}

export function CardTabs({ profile, phone, cardUrl, qrUrl }: CardTabsProps) {
  const [activeTab, setActiveTab] = useState<"details" | "qr">("details");
  const theme = getCardTheme(profile.theme);

  return (
    <div className="flex w-full flex-col">
      <div className="mx-auto mb-6 flex w-full max-w-xs rounded-lg border border-white/10 bg-white/[0.055] p-1 shadow-inner">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex-1 rounded-md py-2 text-sm font-bold transition-colors ${activeTab === "details" ? "text-[#06110a]" : "text-[#9da8b8] hover:text-white"}`}
          style={activeTab === "details" ? { backgroundColor: theme.accent, boxShadow: `0 10px 24px ${theme.shadow}` } : undefined}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab("qr")}
          className={`flex-1 rounded-md py-2 text-sm font-bold transition-colors ${activeTab === "qr" ? "text-[#06110a]" : "text-[#9da8b8] hover:text-white"}`}
          style={activeTab === "qr" ? { backgroundColor: theme.accent, boxShadow: `0 10px 24px ${theme.shadow}` } : undefined}
        >
          QR Code
        </button>
      </div>

      {activeTab === "details" ? (
        <div className="flex flex-col animate-in fade-in zoom-in-95 duration-200">
          {profile.bio ? <p className="mx-auto mb-6 max-w-sm text-center text-sm leading-6 text-[#aab6c6]">{profile.bio}</p> : null}
          
          <div className="grid gap-3 px-5 pb-5">
            {phone ? (
              <a
                className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-center font-bold text-[#f7f4ed] transition-colors hover:border-[#18c8f3]/35 hover:bg-[#18c8f3]/10"
                href={`tel:${phone}`}
              >
                Call
              </a>
            ) : null}
            {profile.email ? (
              <a
                className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-center font-bold text-[#f7f4ed] transition-colors hover:border-[#18c8f3]/35 hover:bg-[#18c8f3]/10"
                href={`mailto:${profile.email}`}
              >
                Email
              </a>
            ) : null}
            {profile.website ? (
              <a
                className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-center font-bold text-[#f7f4ed] transition-colors hover:border-[#18c8f3]/35 hover:bg-[#18c8f3]/10"
                href={profile.website}
                rel="noreferrer"
                target="_blank"
              >
                Website
              </a>
            ) : null}
            
            {profile.socialLinks && profile.socialLinks.length > 0 && profile.socialLinks.map((link, i) => (
              <a
                key={i}
                className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-center font-bold text-[#f7f4ed] transition-colors hover:border-[#18c8f3]/35 hover:bg-[#18c8f3]/10"
                href={link}
                rel="noreferrer"
                target="_blank"
              >
                {detectSocialPlatform(link)}
              </a>
            ))}

            <a
              className="rounded-lg border px-4 py-3 text-center font-black text-[#06110a]"
              style={{ backgroundColor: theme.accent, borderColor: theme.accent, boxShadow: `0 12px 28px ${theme.shadow}` }}
              download={`${displayName(profile).replace(/\s+/g, "_")}_Connect.vcf`}
              href={vCardDataUri(profile, cardUrl)}
            >
              Save Contact
            </a>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 px-5 pb-5">
          <img src={qrUrl} alt="Connect card QR code" className="h-48 w-48 rounded-lg bg-white p-2" style={{ boxShadow: `0 20px 54px ${theme.shadow}` }} />
          <p className="mt-4 text-center text-sm leading-5 text-[#9da8b8]">
            Same card link, ready for any camera to scan.
          </p>
        </div>
      )}
    </div>
  );
}
