export type ConnectProfile = {
  name: string;
  company: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  avatar: string;
  bio: string;
  socialLinks?: string[];
  subId?: string;
};

export const emptyProfile: ConnectProfile = {
  name: "",
  company: "",
  title: "",
  phone: "",
  email: "",
  website: "",
  avatar: "",
  bio: "",
  socialLinks: [],
  subId: undefined,
};

type SearchValue = string | string[] | undefined;

function firstValue(value: SearchValue): string {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

export function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("/")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

export function profileFromSearchParams(
  searchParams: Record<string, SearchValue>,
): ConnectProfile {
  return {
    name: firstValue(searchParams.name).trim(),
    company: firstValue(searchParams.company).trim(),
    title: firstValue(searchParams.title).trim(),
    phone: firstValue(searchParams.phone).trim(),
    email: firstValue(searchParams.email).trim(),
    website: normalizeUrl(firstValue(searchParams.website)),
    avatar: normalizeUrl(firstValue(searchParams.avatar)),
    bio: firstValue(searchParams.bio).trim(),
    socialLinks: firstValue(searchParams.socials).split("|").filter(Boolean).map(normalizeUrl),
    subId: firstValue(searchParams.subId).trim() || undefined,
  };
}

export function displayName(profile: ConnectProfile): string {
  return profile.name || profile.company || "Connect Card";
}

export function displayRole(profile: ConnectProfile): string {
  return [profile.title, profile.company].filter(Boolean).join(" at ");
}

export function initials(profile: ConnectProfile): string {
  const source = profile.name || profile.company || "Connect";
  const parts = source.split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "C";
}

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function buildVCard(profile: ConnectProfile, cardUrl: string): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(displayName(profile))}`,
  ];

  if (profile.company) lines.push(`ORG:${escapeVCard(profile.company)}`);
  if (profile.title) lines.push(`TITLE:${escapeVCard(profile.title)}`);
  if (profile.phone) lines.push(`TEL;TYPE=CELL:${escapeVCard(profile.phone)}`);
  if (profile.email) lines.push(`EMAIL;TYPE=WORK:${escapeVCard(profile.email)}`);
  if (profile.website) lines.push(`URL;TYPE=WORK:${escapeVCard(profile.website)}`);
  if (cardUrl) lines.push(`URL;TYPE=PROFILE:${escapeVCard(cardUrl)}`);
  if (profile.avatar) lines.push(`PHOTO;VALUE=URI:${escapeVCard(profile.avatar)}`);
  if (profile.bio) lines.push(`NOTE:${escapeVCard(profile.bio)}`);
  
  if (profile.socialLinks && profile.socialLinks.length > 0) {
    profile.socialLinks.forEach(link => {
      lines.push(`URL;TYPE=SOCIAL:${escapeVCard(link)}`);
    });
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export function vCardDataUri(profile: ConnectProfile, cardUrl: string): string {
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(buildVCard(profile, cardUrl))}`;
}

export function buildCardUrl(origin: string, profile: ConnectProfile): string {
  const url = new URL("/card", origin);
  Object.entries(profile).forEach(([key, value]) => {
    if (key === "socialLinks") {
      const links = value as string[];
      if (links && links.length > 0) {
        url.searchParams.set("socials", links.join("|"));
      }
    } else {
      const normalized = key === "website" || key === "avatar" ? normalizeUrl(value as string) : (value as string).trim();
      if (normalized) url.searchParams.set(key, normalized);
    }
  });
  return url.toString();
}
