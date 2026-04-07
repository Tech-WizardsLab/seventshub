import Image from "next/image";
import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-seventshub.png"
            alt="SEventsHub logo"
            width={220}
            height={56}
            className="h-auto w-[180px] sm:w-[210px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#for-organizers"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            For organizers
          </a>
          <a
            href="#for-sponsors"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            For sponsors
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            How it works
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Create account
          </Link>
        </div>
      </div>
    </header>
  );
}