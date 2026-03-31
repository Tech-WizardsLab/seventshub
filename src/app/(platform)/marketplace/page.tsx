import Link from "next/link";
import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getMarketplaceEvents } from "@/features/marketplace/lib/get-marketplace-events";

export default async function MarketplacePage() {
  await requireOnboardedUser();

  const events = await getMarketplaceEvents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Marketplace</h1>
        <p className="mt-2 text-slate-600">
          Discover sponsor-ready sports events with real audience and commercial metrics.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          No events available yet.
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-slate-900">
                      {event.name}
                    </h2>
                    <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {event.sport_type}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {event.organization_name}
                  </p>
                </div>

                <Link
                  href={`/marketplace/${event.id}`}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  View event
                </Link>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {event.short_description ?? "No event summary yet."}
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {[event.city, event.country].filter(Boolean).join(", ") || "—"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Attendance</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {event.metrics?.expected_attendance ?? 0}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Social reach</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {event.metrics?.social_impressions ?? 0}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Brand proof</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {event.metrics?.participating_brands_count ?? 0}
                  </p>
                </div>
              </div>

              {event.metrics?.past_sponsors?.length ? (
                <div className="mt-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Past sponsors
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {event.metrics.past_sponsors.join(", ")}
                  </p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}