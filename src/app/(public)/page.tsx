import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader />

      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="max-w-4xl space-y-6">
              <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm">
                SEventsHub
              </div>

              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                The sponsorship marketplace connecting sports events and brands.
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                SEventsHub helps organizers present sponsor-ready opportunities with
                real metrics, and helps sponsors discover events that fit their
                audience, goals, and category.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                  Create account
                </Link>

                <Link
                  href="/login"
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Login
                </Link>
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Events
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">Sponsor-ready</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Structured event pages with data, credibility, and inventory.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Sponsors
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">Better fit</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Evaluate opportunities with more clarity and less guesswork.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Metrics
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">Data-led</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Attendance, reach, sponsor proof, and event performance.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Future
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">AI-ready</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Built for smarter matching, rankings, and sponsorship insights.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                For organizers
              </span>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                Present events with the data sponsors actually care about.
              </h2>

              <p className="mt-4 text-base leading-8 text-slate-600">
                Build a stronger commercial profile with company credibility,
                audience reach, event metrics, and clear sponsorship inventory.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Track record</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">Company profile</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Performance</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">Event metrics</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Commercial</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">Sponsor slots</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-sm">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                For sponsors
              </span>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Find events that align with your brand faster.
              </h2>

              <p className="mt-4 text-base leading-8 text-slate-300">
                Discover events through structured information, audience fit,
                organizer credibility, and visible sponsorship opportunities.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-slate-300">Discovery</p>
                  <p className="mt-2 text-xl font-semibold">Browse events</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-slate-300">Evaluation</p>
                  <p className="mt-2 text-xl font-semibold">Compare metrics</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-slate-300">Action</p>
                  <p className="mt-2 text-xl font-semibold">Inquire on slots</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Value proposition
                </span>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  More trust, better discovery, faster sponsorship decisions.
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                  SEventsHub replaces fragmented outreach and static PDFs with a
                  structured marketplace where organizers can showcase value and
                  sponsors can evaluate opportunities with confidence.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Example
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    Endurance event with 4,500 attendees and 820K social reach
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    A sponsor can quickly assess audience fit, sponsor history, and
                    slot value before making contact.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Success signal
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    Clear inventory + clear data = easier commercial conversations
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    The platform is designed to help both sides move from interest to
                    real sponsorship discussions faster.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-[2rem] border border-slate-200 bg-white px-8 py-12 shadow-sm sm:px-12">
            <div className="max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Get started
              </span>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Join the marketplace.
              </h2>

              <p className="mt-4 text-base leading-8 text-slate-600">
                Create your account as an organizer or sponsor and start building
                better sponsorship relationships.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Create account
                </Link>

                <Link
                  href="/login"
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
