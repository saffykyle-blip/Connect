import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Suspense } from "react";
import {
  displayName,
  displayRole,
  initials,
  normalizePhone,
  profileFromSearchParams,
  type ConnectProfile,
} from "@/lib/connect-card";
import { CardTabs } from "./CardTabs";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function absoluteCardUrl(host: string, profile: ConnectProfile): string {
  const protocol = host.includes("localhost") || host.startsWith("127.") ? "http" : "https";
  const url = new URL("/card", `${protocol}://${host}`);

  Object.entries(profile).forEach(([key, value]) => {
    if (key === "socialLinks") {
      const links = value as string[];
      if (links && links.length > 0) {
        url.searchParams.set("socials", links.join("|"));
      }
    } else if (value) {
      url.searchParams.set(key, value as string);
    }
  });

  return url.toString();
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const profile = profileFromSearchParams(await searchParams);
  const name = displayName(profile);

  return {
    title: `${name} | Connect`,
    description: profile.bio || displayRole(profile) || "Digital business card shared with Connect.",
    icons: {
      icon: profile.avatar || "/thumbnail.png",
      apple: profile.avatar || "/thumbnail.png",
    },
    openGraph: {
      title: `${name} | Connect`,
      description: profile.bio || displayRole(profile) || "Digital business card shared with Connect.",
      images: [profile.avatar || "/thumbnail.png"],
    },
  };
}

function CardSkeleton() {
  return (
    <section className="animate-pulse overflow-hidden rounded-lg border border-white/10 bg-[#101722]/90 shadow-[0_24px_80px_rgba(0,0,0,0.44)] backdrop-blur-xl">
      <div className="bg-[radial-gradient(circle_at_50%_0%,rgba(24,200,243,0.1),transparent_55%)] px-6 pb-6 pt-7 text-center">
        <div className="mx-auto mb-5 h-28 w-28 rounded-lg bg-white/10"></div>
        <div className="mx-auto h-8 w-48 rounded bg-white/10"></div>
        <div className="mx-auto mt-4 h-4 w-32 rounded bg-white/10"></div>
      </div>
      <div className="p-6">
        <div className="mb-4 h-12 w-full rounded-lg bg-white/10"></div>
        <div className="space-y-4">
          <div className="h-10 w-full rounded-lg bg-white/5"></div>
          <div className="h-10 w-full rounded-lg bg-white/5"></div>
        </div>
      </div>
    </section>
  );
}

function ProfileUnavailable() {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#101722]/90 p-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.44)] backdrop-blur-xl">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="mb-3 text-2xl font-black text-white">Profile Unavailable</h2>
      <p className="text-[#9da8b8] leading-relaxed">
        This Connect digital business card is currently inactive or has been suspended.
      </p>
    </section>
  );
}

async function SubscriptionVerifiedCard({ profile, host }: { profile: ConnectProfile; host: string }) {
  if (!profile.subId) {
    return <ProfileUnavailable />;
  }

  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  if (PAYSTACK_SECRET_KEY) {
    let isInactive = false;

    try {
      const res = await fetch(`https://api.paystack.co/subscription?customer=${profile.subId}&status=active`, {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        next: { revalidate: 60 } // Cache for 60 seconds to speed up immediate re-taps
      });
      const data = await res.json();
      
      if (!data.status || data.meta?.total === 0) {
        isInactive = true;
      }
    } catch (e) {
      console.error("Paystack validation failed", e);
      // Fail open if Paystack is down to not block legitimately paying customers
    }

    if (isInactive) {
      return <ProfileUnavailable />;
    }
  }

  const cardUrl = absoluteCardUrl(host, profile);
  const role = displayRole(profile);
  const phone = normalizePhone(profile.phone);
  const qrUrl = `https://quickchart.io/qr?size=280&margin=2&text=${encodeURIComponent(cardUrl)}`;

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#101722]/90 shadow-[0_24px_80px_rgba(0,0,0,0.44)] backdrop-blur-xl">
      <div className="bg-[radial-gradient(circle_at_50%_0%,rgba(24,200,243,0.18),transparent_55%),linear-gradient(145deg,rgba(246,184,74,0.16),transparent_45%)] px-6 pb-6 pt-7 text-center">
        <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-lg border border-white/15 bg-white/[0.07] text-4xl font-black text-[#18c8f3]">
          {profile.avatar ? (
            <img src={profile.avatar} alt={displayName(profile)} className="h-full w-full object-cover" />
          ) : (
            initials(profile)
          )}
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-normal">{displayName(profile)}</h1>
        {role ? <p className="mt-2 pb-5 text-base font-medium text-[#cbd6e4]">{role}</p> : <div className="pb-5" />}
      </div>

      <CardTabs profile={profile} phone={phone} cardUrl={cardUrl} qrUrl={qrUrl} />
    </section>
  );
}

export default async function CardPage({ searchParams }: PageProps) {
  const profile = profileFromSearchParams(await searchParams);
  const host = (await headers()).get("host") || "web-profiles.vercel.app";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06080d] text-[#f7f4ed]">
      <div className="connect-hero-bg" aria-hidden="true" />
      <div className="connect-orbit-field" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-5">
        <header className="mb-5 flex items-center justify-between gap-4">
          <Link className="flex items-center gap-3" href="/">
            <img
              src="/thumbnail.png"
              alt="Connect"
              className="h-10 w-10 rounded-lg object-cover shadow-[0_0_22px_rgba(24,200,243,0.28)]"
            />
            <span className="text-sm font-semibold text-[#cbd6e4]">Connect</span>
          </Link>
          <Link
            href="/install"
            className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-[#cbd6e4]"
          >
            Install
          </Link>
        </header>

        <Suspense fallback={<CardSkeleton />}>
          <SubscriptionVerifiedCard profile={profile} host={host} />
        </Suspense>
      </div>
    </main>
  );
}
