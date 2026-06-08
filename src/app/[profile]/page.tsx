import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ profile: string }>;
};

const legacyProfiles: Record<string, Record<string, string>> = {
  cream: {
    name: "Kyle Saffy",
    title: "Founder",
    company: "CREAM",
    phone: "+27827675092",
    email: "kyle@creamtech.co.za",
    website: "https://creamtech.co.za",
    avatar: "/kyle.jpg",
    bio: "Creative Engineering Artistic Mindset",
  },
  tribal: {
    name: "Kyle Saffy",
    title: "Chief",
    company: "Tribal",
    phone: "+27827675092",
    email: "kyle@creamtech.co.za",
    website: "https://tribalforged.com",
    avatar: "/tribal.jpg",
    bio: "Forging Elite Men",
  },
};

export default async function LegacyProfilePage({ params }: PageProps) {
  const { profile } = await params;
  const legacyProfile = legacyProfiles[profile.toLowerCase()];

  if (!legacyProfile) {
    notFound();
  }

  const cardUrl = new URL("/card", "https://web-profiles.vercel.app");
  Object.entries(legacyProfile).forEach(([key, value]) => {
    cardUrl.searchParams.set(key, value);
  });

  redirect(`${cardUrl.pathname}${cardUrl.search}`);
}
