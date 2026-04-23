import Link from "next/link";
import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth/require-user";
import { SignOutButton } from "@/components/layout/sign-out-button";

export default async function GuidedLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUser();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          SEventsHub
        </Link>

        <SignOutButton />
      </div>

      <main className="mx-auto min-h-[calc(100vh-84px)] w-full max-w-6xl px-6 pb-10">{children}</main>
    </div>
  );
}