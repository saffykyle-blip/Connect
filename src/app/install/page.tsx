import { Suspense } from "react";
import { InstallChooser } from "./InstallChooser";

// InstallChooser uses useSearchParams() which requires a Suspense boundary
export default function InstallPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-[#090b0f]">
        <div className="text-[#9da8b8] text-sm">Loading...</div>
      </main>
    }>
      <InstallChooser />
    </Suspense>
  );
}
