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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-white lg:block">
          <PlatformSidebar />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white">
            <PlatformHeader />
          </header>

          <main className="flex-1 px-6 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}