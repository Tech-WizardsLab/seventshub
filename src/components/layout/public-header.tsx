import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          SEventsHub
        </Link>

        <nav className="flex items-center gap-6 text-sm text-slate-600">
          <Link href="/for-organizers" className="hover:text-slate-900">
            For organizers
          </Link>

          <Link href="/for-sponsors" className="hover:text-slate-900">
            For sponsors
          </Link>

          <Link href="/how-it-works" className="hover:text-slate-900">
            How it works
          </Link>

          <Link href="/login" className="hover:text-slate-900">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}