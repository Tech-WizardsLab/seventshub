import Link from "next/link";

export function PlatformSidebar() {
  return (
    <div className="p-6">
      <p className="text-lg font-semibold text-slate-900">SEventsHub</p>
      <p className="mt-1 text-sm text-slate-500">Private Platform</p>

      <nav className="mt-8 space-y-3 text-sm text-slate-600">
        <Link href="/dashboard" className="block hover:text-slate-900">
          Dashboard
        </Link>
        <Link href="/marketplace" className="block hover:text-slate-900">
          Marketplace
        </Link>
        <Link href="/organizer/organization" className="block hover:text-slate-900">
          My Organization
        </Link>
        <Link href="/organizer/events" className="block hover:text-slate-900">
          My Events
        </Link>
        <Link href="/organizer/inquiries" className="block hover:text-slate-900">
          Incoming Inquiries
        </Link>
        <Link href="/profile" className="block hover:text-slate-900">
          Profile
        </Link>
        <Link href="/inquiries" className="block hover:text-slate-900">
          My Inquiries
        </Link>
      </nav>
    </div>
  );
}