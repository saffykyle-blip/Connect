import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#4df6a2",
};

export const metadata: Metadata = {
  title: "Connect",
  description: "Create and share a mobile business card with NFC, QR, and vCard fallbacks.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Connect",
  },
  icons: {
    icon: "/thumbnail.png",
    apple: "/thumbnail.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>{children}</body>
    </html>
  );
}
