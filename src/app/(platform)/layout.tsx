import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth/require-user";
import { PlatformHeader } from "@/components/layout/platform-header";
import { PlatformSidebar } from "@/components/layout/platform-sidebar";

export default async function PlatformLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUser();

  return (
    <div className="min-h-screen bg-slate-50">
      <PlatformHeader />
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PlatformSidebar />
        <main className="min-w-0 flex-1 space-y-6">{children}</main>
      </div>
    </div>
  );
}