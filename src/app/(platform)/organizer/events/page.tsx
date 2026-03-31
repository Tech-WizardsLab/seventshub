import Link from "next/link";
import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getOrganizationEvents } from "@/features/events/lib/get-organization-events";

export default async function OrganizerEventsPage() {
  await requireOnboardedUser();

  const events = await getOrganizationEvents();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">My Events</h1>
          <p className="mt-2 text-slate-600">
            Manage the events your company will publish into the marketplace.
          </p>
        </div>

        <Link
          href="/organizer/events/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          New event
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {events.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            No events yet. Create your first one next.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-sm text-slate-600">
                  <th className="px-6 py-4 font-medium">Event</th>
                  <th className="px-6 py-4 font-medium">Sport</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Start date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {events.map((event) => (
                  <tr key={event.id} className="text-sm text-slate-700">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <Link
                        href={`/organizer/events/${event.id}/metrics`}
                        className="hover:underline"
                      >
                        {event.name}
                      </Link>
                    </td>

                    <td className="px-6 py-4">{event.sport_type}</td>

                    <td className="px-6 py-4">
                      {[event.city, event.country].filter(Boolean).join(", ") || "—"}
                    </td>

                    <td className="px-6 py-4">
                      {event.starts_at
                        ? new Date(event.starts_at).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-6 py-4">{event.status}</td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/organizer/events/${event.id}/metrics`}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Metrics
                        </Link>

                        <Link
                          href={`/organizer/events/${event.id}/slots`}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Slots
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}