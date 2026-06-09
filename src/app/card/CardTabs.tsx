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

export function CardTabs({ profile, phone, cardUrl, qrUrl }: CardTabsProps) {
  const [activeTab, setActiveTab] = useState<"details" | "qr">("details");

  return (
    <div className="flex w-full flex-col">
      <div className="mx-auto mb-6 flex w-full max-w-xs rounded-lg border border-white/10 bg-[#111720] p-1">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex-1 rounded-md py-2 text-sm font-bold transition-colors ${
            activeTab === "details" ? "bg-white/[0.08] text-white" : "text-[#9da8b8] hover:text-white"
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab("qr")}
          className={`flex-1 rounded-md py-2 text-sm font-bold transition-colors ${
            activeTab === "qr" ? "bg-white/[0.08] text-white" : "text-[#9da8b8] hover:text-white"
          }`}
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
                className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-center font-bold text-[#f7f4ed]"
                href={`tel:${phone}`}
              >
                Call
              </a>
            ) : null}
            {profile.email ? (
              <a
                className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-center font-bold text-[#f7f4ed]"
                href={`mailto:${profile.email}`}
              >
                Email
              </a>
            ) : null}
            {profile.website ? (
              <a
                className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-center font-bold text-[#f7f4ed]"
                href={profile.website}
                rel="noreferrer"
                target="_blank"
              >
                Website
              </a>
            ) : null}
            <a
              className="rounded-lg border border-[#18c8f3]/60 bg-[#18c8f3] px-4 py-3 text-center font-black text-[#031016] shadow-[0_12px_28px_rgba(24,200,243,0.22)]"
              download={`${displayName(profile).replace(/\s+/g, "_")}_Connect.vcf`}
              href={vCardDataUri(profile, cardUrl)}
            >
              Save Contact
            </a>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 px-5 pb-5">
          <img src={qrUrl} alt="Connect card QR code" className="h-48 w-48 rounded-lg bg-white p-2" />
          <p className="mt-4 text-center text-sm leading-5 text-[#9da8b8]">
            Same card link, ready for any camera to scan.
          </p>
        </div>
      )}
    </div>
  );
}
