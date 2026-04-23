import Link from "next/link";
import { getProfile } from "@/lib/auth/get-profile";

export async function PlatformSidebar() {
  const profile = await getProfile();
  const isSponsor = profile?.platform_role === "sponsor";
  const isOrganizer = profile?.platform_role === "organizer";
  const isAdmin = profile?.platform_role === "admin";

  return (
    <div className="p-6">
      <p className="text-lg font-semibold text-slate-900">SEventsHub</p>
      <p className="mt-1 text-sm text-slate-500">Sponsor Platform</p>

      <nav className="mt-8 space-y-3 text-sm text-slate-600">
        <Link href="/dashboard" className="block hover:text-slate-900">
          Dashboard
        </Link>

        {isSponsor ? (
          <>
            <Link href="/marketplace" className="block hover:text-slate-900">
              Strategy opportunities
            </Link>
            <Link href="/shortlist" className="block hover:text-slate-900">
              Strategic shortlist
            </Link>
            <Link href="/inquiries" className="block hover:text-slate-900">
              Execution pipeline
            </Link>
          </>
        ) : null}

        {(isOrganizer || isAdmin) ? (
          <>
            <Link href="/organizer/organization" className="block hover:text-slate-900">
              My Organization
            </Link>
            <Link href="/organizer/events" className="block hover:text-slate-900">
              My Events
            </Link>
            <Link href="/organizer/inquiries" className="block hover:text-slate-900">
              Incoming Inquiries
            </Link>
          </>
        ) : null}

        {isAdmin ? (
          <Link href="/admin/review-events" className="block hover:text-slate-900">
            Review Events
          </Link>
        ) : null}

        <Link href="/profile" className="block hover:text-slate-900">
          Profile
        </Link>
      </nav>
    </div>
  );
}