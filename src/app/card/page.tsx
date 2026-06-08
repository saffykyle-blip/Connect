import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import {
  displayName,
  displayRole,
  initials,
  normalizePhone,
  profileFromSearchParams,
  vCardDataUri,
  type ConnectProfile,
} from "@/lib/connect-card";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function absoluteCardUrl(host: string, profile: ConnectProfile): string {
  const protocol = host.includes("localhost") || host.startsWith("127.") ? "http" : "https";
  const url = new URL("/card", `${protocol}://${host}`);

  Object.entries(profile).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
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

export default async function CardPage({ searchParams }: PageProps) {
  const profile = profileFromSearchParams(await searchParams);
  const host = (await headers()).get("host") || "web-profiles.vercel.app";
  const cardUrl = absoluteCardUrl(host, profile);
  const role = displayRole(profile);
  const phone = normalizePhone(profile.phone);
  const qrUrl = `https://quickchart.io/qr?size=280&margin=2&text=${encodeURIComponent(cardUrl)}`;

  return (
    <main className="min-h-screen bg-[#090b0f] text-[#f7f4ed]">
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-5">
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

        <section className="overflow-hidden rounded-lg border border-white/10 bg-[#111720] shadow-2xl">
          <div className="bg-[radial-gradient(circle_at_50%_0%,rgba(24,200,243,0.18),transparent_55%),linear-gradient(145deg,rgba(246,184,74,0.16),transparent_45%)] px-6 pb-6 pt-7 text-center">
            <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-lg border border-white/15 bg-white/[0.07] text-4xl font-black text-[#18c8f3]">
              {profile.avatar ? (
                <img src={profile.avatar} alt={displayName(profile)} className="h-full w-full object-cover" />
              ) : (
                initials(profile)
              )}
            </div>
            <h1 className="text-3xl font-black leading-tight tracking-normal">{displayName(profile)}</h1>
            {role ? <p className="mt-2 text-base font-medium text-[#cbd6e4]">{role}</p> : null}
            {profile.bio ? <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#aab6c6]">{profile.bio}</p> : null}
          </div>

          <div className="grid gap-3 p-5">
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
        </section>

        <section className="mt-5 rounded-lg border border-white/10 bg-[#111720] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black tracking-normal">QR fallback</h2>
              <p className="mt-1 text-sm leading-5 text-[#9da8b8]">Same card link, ready for screens and Apple Wallet flows.</p>
            </div>
            <img src={qrUrl} alt="Connect card QR code" className="h-28 w-28 rounded-lg bg-white p-2" />
          </div>
        </section>
      </div>
    </main>
  );
}
