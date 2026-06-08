import type { Metadata } from "next";
import { InstallChooser } from "./InstallChooser";

export const metadata: Metadata = {
  title: "Install Connect",
  description: "Download Connect for Android or Huawei, or use the iPhone web and Wallet fallback.",
};

export default function InstallPage() {
  return <InstallChooser />;
}
