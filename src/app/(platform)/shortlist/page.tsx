import Link from "next/link";
import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getProfile } from "@/lib/auth/get-profile";
import { getShortlistedEvents } from "@/features/shortlist/lib/get-shortlisted-events";
import { ShortlistToggleButton } from "@/features/shortlist/components/shortlist-toggle-button";

function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat().format(value ?? 0);
}

export default async function ShortlistPage() {
  await requireOnboardedUser();

  const profile = await getProfile();

  if (profile?.platform_role !== "sponsor") {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">Shortlist</h1>
        <p className="text-slate-600">
          This page is available for sponsor accounts only.
        </p>
      </div>
    );
  }

  const events = await getShortlistedEvents();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Shortlist</h1>
          <p className="mt-2 text-slate-600">
            Save promising events here before deciding which opportunities to pursue.
          </p>
        </div>

        <Link
          href="/marketplace"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to marketplace
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            No saved events yet. Browse the marketplace and save the most relevant ones.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-slate-900">
                      {event.event_name}
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
                  href={`/marketplace/${event.event_id}`}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Open event
                </Link>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {event.short_description || "No event summary yet."}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Attendance</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {formatNumber(event.expected_attendance)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Social reach</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {formatNumber(event.social_impressions)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Email reach</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {formatNumber(event.email_reach)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                  Saved on {new Date(event.created_at).toLocaleDateString()}
                </p>

                <ShortlistToggleButton
                  eventId={event.event_id}
                  initiallySaved={true}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}